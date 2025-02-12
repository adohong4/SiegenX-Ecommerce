'use strict'

const contactModel = require('../models/contact.model') // khai báo DB
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response") // khai báo lỗi theo chuẩn rest

class ContactService {
    static addContact = async ({ username, email, phone, content }) => {
        try {

            const newContact = new contactModel({
                username,
                email,
                phone,
                content
            });
            const savedContact = await newContact.save();

            return {
                metadata: {
                    savedContact
                }
            }
        } catch (error) {
            throw new BadRequestError('Error');
        }
    }


}

module.exports = ContactService;  // xuất class