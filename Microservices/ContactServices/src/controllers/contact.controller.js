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
            const updatedContact = await ContactService.updateIsCheck(req, res);
            new OK({
                message: "Cập nhật trạng thái isCheck thành công",
                metadata: updatedContact
            }).send(res);
        } catch (error) {
            next(error);
        }
    };


    getContactsByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            const result = await ContactService.findByEmail(email);
            new OK({ message: 'Get contacts By email OK', metadata: result.contacts }).send(res);
        } catch (error) {
            next(error);
        }
    };

    countContact = async (req, res, next) => {
        try {
            const result = await ContactService.countDocuments();
            new OK({
                message: 'Đếm thành công',
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getContactWithPagination = async (req, res, next) => {
        try {
            const result = await ContactService.paginateContact(req, res);
            new OK({
                message: 'Get contact with pagination OK',
                metadata: result.metadata
            }).send(res);
        } catch (error) {
            next(error);
        }
    };


    deleteContact = async (req, res, next) => {
        try {
            const result = await ContactService.deleteContact(req.params.id);
            new OK({
                message: 'Deleted Successfully!',
                metadata: result
            }).send(res);

        } catch (error) {
            next(error);
        }
    }

    toggleContactStatus = async (req, res, next) => {
        try {
            const result = await ContactService.toggleContactStatus(req, res);
            new OK({
                message: `Trạng thái liên hệ đã được ${result.StatusActive ? 'hoạt động' : 'xóa'}.`,
                metadata: result
            }).send(res);
        } catch (error) {
            next(error);
        }
    };

}



module.exports = new ContactController();