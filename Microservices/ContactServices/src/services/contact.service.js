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

    static getListContact = async () => {
        try {
            const contacts = await contactModel.find({});
            return {
                contacts
            }
        } catch (error) {
            throw error;
        }
    }

    static GetDetailContact = async (id) => {
        try {
            const contacts = await contactModel.findById(id);
            if (!contacts) {
                throw new BadRequestError('Không tìm thấy id contact.');
            }
            return {
                contacts
            }
        } catch (error) {
            throw error;
        }
    }

    static updateIsCheck = async (contactId, isCheckValue) => {
        try {
            // Tìm và cập nhật trường isCheck
            const updatedContact = await contactModel.findByIdAndUpdate(
                contactId,
                { isCheck: isCheckValue },
                { new: true, runValidators: true } // Trả về tài liệu đã cập nhật
            );

            return updatedContact;
        } catch (error) {
            throw error;
        }
    };

    static findByEmail = async (email) => {
        const contacts = await contactModel.find({ email: { $regex: email, $options: 'i' } });
        if (!contacts.length) throw new Error("No contacts found with the given email");
        return { contacts };
    };

    static countDocuments = async () => {
        return await contactModel.countDocuments();
    };



}

module.exports = ContactService;  // xuất class