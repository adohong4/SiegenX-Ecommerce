'use strict'

const ContactService = require("../services/contact.service")
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class ContactController {
    addContact = async (req, res, next) => {
        try {
            const result = await ContactService.addContact(req.body);
            new CREATED({
                message: 'Contact OK',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getListContact = async (req, res, next) => {
        try {
            const result = await ContactService.getListContact();
            new OK({
                message: 'Contact OK',
                metadata: result.contacts
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getDetailContact = async (req, res, next) => {
        try {
            const result = await ContactService.GetDetailContact(req.params.id);
            new OK({
                message: 'Contact OK',
                metadata: result.contacts
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    updateContactIsCheck = async (req, res, next) => {
        try {
            const { id } = req.params; // ID của liên hệ từ URL
            const { isCheck } = req.body; // Giá trị mới cho isCheck từ body

            const updatedContact = await ContactService.updateIsCheck(id, isCheck);

            res.status(200).json({
                message: "Cập nhật trạng thái isCheck thành công",
                metadata: updatedContact
            });
        } catch (error) {
            next(error);
        }
    }


}



module.exports = new ContactController();