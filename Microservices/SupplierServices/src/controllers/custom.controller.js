'use strict';

const CustomService = require('../services/custom.service');
const { OK, CREATED } = require('../core/success.response');

class CustomController {

    paginate = async (req, res, next) => {
        try {
            const result = await CustomService.paginate(req, res);
            new OK({
                message: "Get supplier successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    paginateTrash = async (req, res, next) => {
        try {
            const result = await CustomService.paginateTrash(req, res);
            new OK({
                message: "Get supplier successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    searchByName = async (req, res, next) => {
        try {
            const { name } = req.params;
            const result = await CustomService.searchByName(name);
            new OK({
                message: "Get supplier successfully",
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CustomController();