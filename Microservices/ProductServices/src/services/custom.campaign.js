'use strict'

const campaignModel = require('../models/campaign.model')
const productModel = require('../models/product.model')
const { BadRequestError, ConflictRequestError } = require('../core/error.response');

class CampaignService {
    static paginateCampaign = async (page = 1, pageSize = 7) => {
        try {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;

            const campaign = await campaignModel.find()
                .select('name description value code startDate endDate status maxValue appliesTo productIds active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalCampaign = await campaignModel.countDocuments();
            const totalPages = Math.ceil(totalCampaign / pageSize);
            return {
                metadata: {
                    campaign,
                    currentPage: page,
                    totalPages,
                    totalCampaign
                }
            }
        } catch (error) {
            throw error
        }
    }

    static searchCampaignByCode = async (code) => {
        try {
            const campaign = await campaignModel.find({ code: { $regex: code, $options: 'i' } })
                .select('name description value code startDate endDate status maxValue appliesTo productIds active')
                .exec();
            return {
                metadata: campaign
            }
        } catch (error) {
            throw error;
        }
    }

    static addToCampaign = async (id, itemId) => {
        let campaign = await campaignModel.findById(id)
        if (campaign.appliesTo != 'items') throw new BadRequestError('Lựa chọn áp dụng sai')

        if (!campaign.productIds.includes(itemId)) {
            campaign.productIds.push(itemId);
        } else {
            throw new BadRequestError("Sản phẩm đã được thêm vào danh sách");
        }
        const updateCampaign = await campaignModel.findByIdAndUpdate(id, { productIds: campaign.productIds }, { new: true });
        return { metadata: updateCampaign.productIds }
    }

    static removeFromCampaign = async (id, itemId) => {
        let campaign = await campaignModel.findById(id)
        if (campaign.appliesTo != 'items') throw new BadRequestError('Lựa chọn áp dụng sai')

        const index = campaign.productIds.indexOf(itemId);
        if (index > -1) {
            campaign.productIds.splice(index, 1);
        } else {
            throw new BadRequestError("Sản phẩm không có trong danh sách");
        }
        const updateCampaign = await campaignModel.findByIdAndUpdate(id, { productIds: campaign.productIds }, { new: true });
        return { metadata: updateCampaign.productIds }
    }


    static updateProductPricesForCampaign = async (page = 1, pageSize = 7) => {
        try {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;

            const campaign = await campaignModel.find({ status: 'active' });
            if (!campaign || campaign.length == 0) {
                throw new BadRequestError('Chiến dịch không tồn tại');
            }

            //Sắp xếp mức độ ưu tiên của chiến dịch theo appliesTo && startDate
            const sortedCampaigns = campaign.sort((a, b) => {
                if (a.appliesTo === b.appliesTo) {
                    return new Date(a.startDate) - new Date(b.startDate)
                }

                return a.appliesTo === 'all' ? -1 : 1;
            })

            const activeCampaign = sortedCampaigns[0];

            if (activeCampaign.appliesTo === 'all') {
                const products = await productModel.find()
                    .select('title nameProduct product_slug price images category quantity')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
                const updatedProducts = [];

                for (let product of products) {
                    let oldPrice = product.price;
                    console.log("activeCampaign.type: ", activeCampaign.type)
                    if (activeCampaign.type === 'percentage') {
                        if ((product.price * activeCampaign.value / 100) > activeCampaign.maxValue) {
                            product.price = product.price - activeCampaign.maxValue;
                        } else {
                            product.price = product.price * (100 - activeCampaign.value) / 100;
                        }
                    }

                    if (activeCampaign.type === 'fixed_amount') {
                        product.price = product.price - activeCampaign.value;
                    }

                    await product.save();
                    updatedProducts.push({ ...product.toObject(), oldPrice });
                }
                const totalProduct = await productModel.countDocuments();
                const totalPages = Math.ceil(totalProduct / pageSize);

                return {
                    metadata: {
                        updatedProducts,
                        currentPage: page,
                        totalPages,
                        totalProduct
                    }
                };
            }

            if (activeCampaign.appliesTo === 'items') {
                const updatedProducts = [];

                const allProducts = await productModel.find()
                    .select('title nameProduct product_slug price images category quantity')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();

                const productIdsSet = new Set(activeCampaign.productIds);

                for (let product of allProducts) {
                    if (productIdsSet.has(product._id.toString())) {
                        let oldPrice = product.price;
                        if (activeCampaign.type === 'percentage') {
                            if ((product.price * activeCampaign.value / 100) > activeCampaign.maxValue) {
                                product.price = product.price - activeCampaign.maxValue;
                            } else {
                                product.price = product.price * (100 - activeCampaign.value) / 100;
                            }
                        }

                        if (activeCampaign.type === 'fixed_amount') {
                            product.price = product.price - activeCampaign.value;
                        }

                        await product.save();
                        updatedProducts.push({ ...product.toObject(), oldPrice });
                    } else {
                        updatedProducts.push({ ...product.toObject(), oldPrice: null });
                    }
                }

                const totalProduct = await productModel.countDocuments();
                const totalPages = Math.ceil(totalProduct / pageSize);

                return {
                    metadata: {
                        updatedProducts,
                        currentPage: page,
                        totalPages,
                        totalProduct
                    }
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CampaignService;