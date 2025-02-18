'use strict'

'use strict';

const campaignModel = require('../models/campaign.model')
const { BadRequestError, ConflictRequestError } = require('../core/error.response');

class CampaignService {
    static paginateCampaign = async (page = 1, pageSize = 7) => {
        try {
            const skip = (page - 1) * pageSize;
            const limit = pageSize;

            const campaign = await campaignModel.find()
                .select('name description value code startDate endDate status maxValue appliesTo productIds active')
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

    static activeCampaignById = async () => {

    }


}

module.exports = CampaignService;