'use strict';

const campaignModel = require('../models/campaign.model')
const { BadRequestError, ConflictRequestError } = require('../core/error.response');

class CampaignService {
    static createCampaign = async (
        userId,
        name, description, value, code, startDate, endDate,
        status, maxValue, appliesTo, productIds, type
    ) => {
        try {
            //check conditions of type
            if (type === 'percentage') {
                if (value <= 0 || value > 100) {
                    throw new BadRequestError('Value must be greater than 0 and less than or equal to 100 for percentage type');
                }
            } else if (type === 'fixed_amount') {
                if (value <= 0) {
                    throw new BadRequestError('Value must be greater than 0 for fixed amount type');
                }
            } else {
                throw new BadRequestError('Invalid type specified');
            }

            //check time
            if (new Date() > new Date(endDate))
                throw new BadRequestError('Discount codes has expried')
            if (new Date(startDate) >= new Date(endDate))
                throw new BadRequestError('Start_Date must be before End_date')

            //check CODE
            const foundCampaign = await campaignModel.findOne({ code })
            if (foundCampaign && foundCampaign.active)
                throw new BadRequestError('Discount exist!')

            //set the campaign status
            if (new Date(startDate) > new Date()) status = "pending";
            if (new Date(startDate) < new Date()) status = "active";

            const newCampaign = await campaignModel.create({
                name, description, value, status, maxValue, appliesTo, productIds,
                startDate, endDate, code, type,
                creator: {
                    createdBy: userId,
                    description: "Created new campaign"
                }
            })

            return {
                metadata: newCampaign
            }
        } catch (error) {
            throw (error);
        }
    }

    static getAllCampaign = async () => {
        const campaign = await campaignModel.find()
            .select('name description value code startDate endDate status maxValue appliesTo productIds active')
            .sort({ createdAt: -1 })
            .exec();
        return { metadata: campaign }
    }

    static getCampaignById = async (id) => {
        const campaign = await campaignModel.findById(id)
        return { metadata: campaign }
    }

    static updateCampaignById = async (userId, id,
        name, description, value, code, startDate, endDate,
        status, maxValue, appliesTo, productIds, type
    ) => {
        try {
            const updates = { userId, name, description, value, code, startDate, endDate, status, maxValue, appliesTo, productIds, type };

            // Kiểm tra điều kiện của type
            if (type === 'percentage' && (value <= 0 || value > 100)) {
                throw new BadRequestError('Value must be greater than 0 and less than or equal to 100 for percentage type');
            }
            if (type === 'fixed_amount' && value <= 0) {
                throw new BadRequestError('Value must be greater than 0 for fixed amount type');
            }

            // Kiểm tra thời gian
            const now = new Date();
            if (now > new Date(endDate)) throw new BadRequestError('Discount codes has expired');
            if (new Date(startDate) >= new Date(endDate)) throw new BadRequestError('Start_Date must be before End_date');

            // Kiểm tra CODE
            const foundCampaign = await campaignModel.findOne({ code });
            if (foundCampaign && foundCampaign.active) throw new BadRequestError('CODE exist!');

            // Cập nhật appliesTo && productIds
            if (appliesTo !== 'items') {
                productIds = [];
            }

            // Xóa các trường không có giá trị
            Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

            // Cập nhật thông tin chiến dịch trong database
            const updatedCampaign = await campaignModel.findByIdAndUpdate(id, updates, { new: true });

            // Kiểm tra xem updatedCampaign có tồn tại không
            if (!updatedCampaign) {
                throw new BadRequestError('Campaign not found');
            }

            // Cập nhật thông tin người dùng
            updatedCampaign.creator.push({
                createdBy: userId,
                description: "Updated campaign"
            });
            await updatedCampaign.save();

            return { metadata: updatedCampaign };
        } catch (error) {
            throw error;
        }
    }

    static activeCampaign = async (userId, id) => {
        try {
            const campaign = await campaignModel.findById(id)
            const newActiveStatus = !campaign.active;
            const actionDescription = newActiveStatus ? "Restored supplier" : "Deleted supplier";

            campaign.active = newActiveStatus;
            campaign.creator.push({
                createdBy: userId,
                description: actionDescription
            })
            await campaign.save();
            return { metadata: campaign }
        } catch (error) {
            throw error;
        }
    }


}

module.exports = CampaignService;