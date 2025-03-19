'use strict'

const campaignModel = require('../models/campaign.model')
const productModel = require('../models/product.model')
const { BadRequestError, ConflictRequestError } = require('../core/error.response');
const RedisService = require('./ProductRedis.service')

class CampaignService {
    static paginateCampaign = async (req, res) => {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const skip = (page - 1) * limit;

            const campaign = await campaignModel.find({ active: true })
                .select('name description type value code startDate endDate status maxValue appliesTo productIds active creator')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalCampaign = await campaignModel.countDocuments({ active: true });
            const totalPages = Math.ceil(totalCampaign / limit);
            return {
                metadata: {
                    campaign,
                    currentPage: page,
                    totalPages,
                    totalCampaign,
                    limit
                }
            }
        } catch (error) {
            throw error
        }
    }

    static paginateCampaignTrash = async (req, res) => {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const skip = (page - 1) * limit;

            const campaign = await campaignModel.find({ active: false })
                .select('name description type value code startDate endDate status maxValue appliesTo productIds active')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalCampaign = await campaignModel.countDocuments({ active: false });
            const totalPages = Math.ceil(totalCampaign / limit);
            return {
                metadata: {
                    campaign,
                    currentPage: page,
                    totalPages,
                    totalCampaign,
                    limit
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


    static updateProductPricesForCampaign = async () => {
        const CACHE_KEY = 'campaign:products:global';
        try {
            // 1. Kiểm tra dữ liệu trong Redis trước
            const cachedData = await RedisService.getCache(CACHE_KEY);
            if (cachedData) {
                console.log('Cache hit: Returning product list from Redis');
                return {
                    metadata: cachedData
                };
            }

            console.log('Cache miss: Fetching product list from MongoDB');

            // 2. Nếu không có trong cache, truy vấn từ MongoDB
            const campaigns = await campaignModel.find({ status: 'active' });
            let activeCampaign = null;

            if (campaigns && campaigns.length > 0) {
                const sortedCampaigns = campaigns.sort((a, b) => {
                    if (a.appliesTo === b.appliesTo) {
                        return new Date(a.startDate) - new Date(b.startDate);
                    }
                    return a.appliesTo === 'all' ? -1 : 1;
                });
                activeCampaign = sortedCampaigns[0];
            }

            const updatedProducts = [];
            let allProducts;

            allProducts = await productModel.find()
                .select('title nameProduct product_slug price images category quantity')
                .sort({ createdAt: -1 })
                .limit(1000)
                .exec();


            if (!activeCampaign) {
                for (let product of allProducts) {
                    updatedProducts.push({ ...product.toObject(), newPrice: null });
                }

                const result = {
                    updatedProducts,
                    campaignType: null,
                    campaignValue: null,
                    totalProduct: allProducts.length
                };

                // 3. save data to Redis
                await RedisService.setCache(CACHE_KEY, result);
                return { metadata: result };
            }

            // Có chiến dịch, xử lý theo appliesTo
            if (activeCampaign.appliesTo === 'all') {
                for (let product of allProducts) {
                    let newPrice = 0;
                    if (activeCampaign.type === 'percentage') {
                        if ((product.price * activeCampaign.value / 100) > activeCampaign.maxValue) {
                            newPrice = product.price - activeCampaign.maxValue;
                        } else {
                            newPrice = product.price * (100 - activeCampaign.value) / 100;
                        }
                    } else if (activeCampaign.type === 'fixed_amount') {
                        newPrice = product.price - activeCampaign.value;
                    }
                    updatedProducts.push({ ...product.toObject(), newPrice });
                }
            } else if (activeCampaign.appliesTo === 'items') {
                const productIdsSet = new Set(activeCampaign.productIds.map(id => id.toString()));

                for (let product of allProducts) {
                    let newPrice = null;
                    if (productIdsSet.has(product._id.toString())) {
                        if (activeCampaign.type === 'percentage') {
                            if ((product.price * activeCampaign.value / 100) > activeCampaign.maxValue) {
                                newPrice = product.price - activeCampaign.maxValue;
                            } else {
                                newPrice = product.price * (100 - activeCampaign.value) / 100;
                            }
                        } else if (activeCampaign.type === 'fixed_amount') {
                            newPrice = product.price - activeCampaign.value;
                        }
                    }
                    updatedProducts.push({ ...product.toObject(), newPrice });
                }
            } else {
                throw new BadRequestError("Giá trị 'appliesTo' không hợp lệ.");
            }

            const result = {
                updatedProducts,
                campaignType: activeCampaign.type,
                campaignValue: activeCampaign.value,
                totalProduct: allProducts.length
            };

            // 4. Lưu dữ liệu vào Redis sau khi tính toán
            await RedisService.setCache(CACHE_KEY, result);
            return { metadata: result };

        } catch (error) {
            throw error;
        }
    };

    static updateProductPricesForCampaignBySlug = async (req, res) => {
        const { productSlug } = req.params;
        const CACHE_KEY = `product:${productSlug}`;
        try {
            // 1. Kiểm tra dữ liệu trong Redis trước
            const cachedData = await RedisService.getCache(CACHE_KEY);
            if (cachedData) {
                console.log(`Cache hit: Returning product_slug from Redis`);
                return {
                    metadata: cachedData
                };
            }

            console.log(`Cache miss: Fetching product_slug from MongoDB`);

            const product = await productModel.findOne({ product_slug: productSlug })
                .select('-creator')
                .exec();

            if (!product) {
                throw new NotFoundError("Không tìm thấy sản phẩm với slug này.");
            }

            const campaigns = await campaignModel.find({ status: 'active' });
            let activeCampaign = null;

            if (campaigns && campaigns.length > 0) {
                const sortedCampaigns = campaigns.sort((a, b) => {
                    if (a.appliesTo === b.appliesTo) {
                        return new Date(a.startDate) - new Date(b.startDate);
                    }
                    return a.appliesTo === 'all' ? -1 : 1;
                });
                activeCampaign = sortedCampaigns[0];
            }

            let newPrice = null;
            let campaignType = null;
            let campaignValue = null;

            if (activeCampaign) {
                campaignType = activeCampaign.type;
                campaignValue = activeCampaign.value;

                if (activeCampaign.appliesTo === 'all' ||
                    (activeCampaign.appliesTo === 'items' && activeCampaign.productIds.map(id => id.toString()).includes(product._id.toString()))) {

                    if (activeCampaign.type === 'percentage') {
                        const discountAmount = product.price * activeCampaign.value / 100;
                        if (discountAmount > activeCampaign.maxValue) {
                            newPrice = product.price - activeCampaign.maxValue;
                        } else {
                            newPrice = product.price - discountAmount;
                        }
                    } else if (activeCampaign.type === 'fixed_amount') {
                        newPrice = product.price - activeCampaign.value;
                    }

                    if (newPrice !== null && newPrice < 0) {
                        newPrice = 0;
                    }
                }
            }

            const result = {
                updatedProduct: { ...product.toObject(), newPrice },
                campaignType,
                campaignValue,
            };

            // 3. Lưu dữ liệu vào Redis sau khi tính toán
            await RedisService.setCache(CACHE_KEY, result);
            return { metadata: result };

        } catch (error) {
            throw error;
        }
    };

}

module.exports = CampaignService;