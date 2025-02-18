'use strict';

const campaignModel = require('../models/campaign.model')
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

            const foundCampaign = await campaignModel.findOne({ code })

            if (foundCampaign && foundCampaign.active)
                throw new BadRequestError('Discount exist!')

            const newCampaign = await campaignModel.create({
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

    static updateCampaign = async () => {

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