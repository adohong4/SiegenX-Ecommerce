'use strict';

const campaigModel = require('../models/campaign.model')
const { BadRequestError, ConflictRequestError } = require('../core/error.response');

class CampaignService {
    static createCampaign = async (
        userId,
        name, description, value, code, startDate, endDate,
        status, maxValue, appliesTo, productIds
    ) => {
        try {
            //check
            if (new Date() < new Date(startDate) || new Date() > new Date(endDate))
                throw new BadRequestError('Discount codes has expried')

            if (new Date(startDate) >= new Date(endDate))
                throw new BadRequestError('Start_Date must be before End_date')

            const foundCampaign = await campaigModel.findOne({ code })

            if (foundCampaign && foundCampaign.active)
                throw new BadRequestError('Discount exist!')

            const newCampaign = await campaigModel.create({
                name, description, value, status, maxValue, appliesTo, productIds,
                startDate, endDate, code,
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
        const campaign = await campaigModel.find()
            .select('name description value code startDate endDate status maxValue appliesTo productIds active')
            .sort({ createdAt: -1 })
            .exec();
        return { metadata: campaign }
    }

    static getCampaignById = async (id) => {
        const campaign = await campaigModel.findById(id)
        return { metadata: campaign }
    }

    static updateCampaign = async () => {

    }

    static activeCampaign = async () => {

    }


}

module.exports = CampaignService;