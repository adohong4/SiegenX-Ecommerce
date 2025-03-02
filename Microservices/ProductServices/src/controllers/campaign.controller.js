'use strict'

const CampaignService = require('../services/campaign.service')
const CustomCampaignService = require('../services/custom.campaign')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class CampaignController {

    createCampaign = async (req, res, next) => {
        try {
            const userId = req.user
            const staffName = req.staffName;
            const {
                name, description, value, code,
                startDate, endDate, status,
                maxValue, appliesTo, productIds, type
            } = req.body
            const result = await CampaignService.createCampaign(
                userId, staffName,
                name, description, value, code, startDate, endDate,
                status, maxValue, appliesTo, productIds, type
            )
            new CREATED({
                message: 'Tạo chiến dịch thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

    getAllCampaign = async (req, res, next) => {
        const result = await CampaignService.getAllCampaign()
        new OK({
            message: 'Lấy danh sách thành công',
            metadata: result.metadata
        }).send(res)
    }

    getCampaignById = async (req, res, next) => {
        const { id } = req.params;
        const result = await CampaignService.getCampaignById(id)
        new OK({
            message: 'Lấy danh sách thành công',
            metadata: result.metadata
        }).send(res)
    }

    updateCampaignById = async (req, res, next) => {
        const userId = req.user;
        const staffName = req.staffName;
        const { id } = req.params;
        const { name, description, value, code, startDate, endDate, status, maxValue, appliesTo, productIds, type } = req.body
        const result = await CampaignService.updateCampaignById(
            userId, staffName, id, name, description, value, code,
            startDate, endDate, status, maxValue, appliesTo, productIds, type
        );
        new CREATED({
            message: 'cập nhật thành công',
            metadata: result.metadata
        }).send(res)
    }

    activeCampaign = async (req, res, next) => {
        const userId = req.user;
        const staffName = req.staffName;
        const { id } = req.params;
        const result = await CampaignService.activeCampaign(userId, staffName, id)
        new CREATED({
            message: 'chuyển đổi thành công',
            metadata: result.metadata
        }).send(res)
    }

    deleteCampaign = async (req, res, next) => {
        const staffRole = req.role;
        const { id } = req.params;
        await CampaignService.deleteCampaign(staffRole, id)
        new OK({
            message: 'Xóa thành công',
        }).send(res)
    }

    paginateCampaign = async (req, res, next) => {
        try {
            const result = await CustomCampaignService.paginateCampaign(req, res)
            new CREATED({
                message: 'phân trang thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

    paginateCampaignTrash = async (req, res, next) => {
        try {
            const result = await CustomCampaignService.paginateCampaignTrash(req, res)
            new CREATED({
                message: 'phân trang thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

    searchCampaignByCode = async (req, res, next) => {
        try {
            const { code } = req.params;
            const result = await CustomCampaignService.searchCampaignByCode(code)
            new CREATED({
                message: 'lấy thông tin thành công',
                metadata: result.metadata
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

    addToCampaign = async (req, res, next) => {
        const { id } = req.params;
        const { itemId } = req.body;
        const result = await CustomCampaignService.addToCampaign(id, itemId)
        new CREATED({
            message: 'Thêm id sản phẩm vào phiếu giảm giá thành công',
            metadata: result.metadata
        }).send(res)
    }

    removeFromCampaign = async (req, res, next) => {
        const { id } = req.params;
        const { itemId } = req.body;
        const result = await CustomCampaignService.removeFromCampaign(id, itemId)
        new CREATED({
            message: 'Xóa id sản phẩm vào phiếu giảm giá thành công',
            metadata: result.metadata
        }).send(res)
    }

    updateProductPricesForCampaign = async (req, res, next) => {
        const result = await CustomCampaignService.updateProductPricesForCampaign()
        new CREATED({
            message: 'Thông tin sản phẩm sau update',
            metadata: result.metadata
        }).send(res)
    }
}

module.exports = new CampaignController();