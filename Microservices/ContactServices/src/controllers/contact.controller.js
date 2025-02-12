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
}



module.exports = new ContactController();