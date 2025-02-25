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
            const { id } = req.params; // Lấy ID từ URL
    
            // Gọi Service để cập nhật trạng thái isCheck
            const updatedContact = await ContactService.updateIsCheck(id);
    
            res.status(200).json({
                message: "Cập nhật trạng thái isCheck thành công",
                metadata: updatedContact
            });
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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            const totalContacts = await ContactService.countDocuments();
            const contacts = await ContactService.find(limit, skip);

            res.status(200).json({
                message: 'Contacts fetched successfully',
                data: contacts,
                pagination: {
                    total: totalContacts,
                    currentPage: page,
                    totalContacts: Math.ceil(totalContacts / limit),
                    limit,
                },
            });

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
            const userId = req.user;  
         
            const { id } = req.params; // Lấy ID liên hệ từ URL
            
            const result = await ContactService.toggleContactStatus(id, userId);
    
            new OK({
                message: `Trạng thái liên hệ đã được cập nhật thành ${result.StatusActive ? 'hoạt động' : 'đã xóa'}.`,
                metadata: result
            }).send(res);
        } catch (error) {  
            next(error);
        }
    };
    

}



module.exports = new ContactController();