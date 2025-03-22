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
            const contacts = await contactModel.findById(id)
                .lean();
            if (contacts.creator) {
                contacts.creator = contacts.creator.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return { contacts }
        } catch (error) {
            throw error;
        }
    }

    static updateIsCheck = async (req, res) => {
        try {
            const contactId = req.params.id;
            const userId = req.user;
            const staffName = req.staffName;

            const contact = await contactModel.findById(contactId);
            const newActiveStatus = !contact.isCheck;
            const actionDescription = newActiveStatus ? "Đã liên hệ" : "Chưa liên hệ";

            contact.isCheck = newActiveStatus;
            contact.creator.push({
                createdBy: userId,
                createdName: staffName,
                description: actionDescription
            })
            await contact.save();
            return { metadata: contact }
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

    static find = async (skip, limit) => {
        return await contactModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
    }

    static deleteContact = async (req, res) => {
        try {
            const userRole = req.role;
            const { id } = req.params;
            if (userRole !== "ADMIN") {
                throw new ForbiddenError("Tài khoản bị giới hạn chức năng.")
            }
            const contact = await contactModel.findById(id);

            if (!contact) {
                throw new BadRequestError("Contact ID not found.")
            }

            await contactModel.findByIdAndDelete(id)

            return {
                contact
            }

        } catch (error) {
            throw error;
        }
    }


    static paginateContactTrue = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const contact = await contactModel.find({ StatusActive: true })
                .select('username email phone content isCheck createdAt StatusActive creator')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalContact = await contactModel.countDocuments({ StatusActive: true });
            const totalPages = Math.ceil(totalContact / limit);
            return {
                metadata: {
                    contact,
                    currentPage: page,
                    totalPages,
                    totalContact,
                    limit
                }
            }
        } catch (error) {
            throw new BadRequestError(error);
        }
    }

    static paginateContactFalse = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const contact = await contactModel.find({ StatusActive: false })
                .select('username email phone content isCheck createdAt StatusActive creator')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalContact = await contactModel.countDocuments({ StatusActive: false });
            const totalPages = Math.ceil(totalContact / limit);
            return {
                metadata: {
                    contact,
                    currentPage: page,
                    totalPages,
                    totalContact,
                    limit
                }
            }
        } catch (error) {
            throw new BadRequestError(error);
        }
    }


    static toggleContactStatus = async (req, res) => {
        try {
            const contactId = req.params.id;
            const userId = req.user;
            const staffName = req.staffName;

            const contact = await contactModel.findById(contactId);
            const newStatus = !contact.StatusActive;
            const actionDes = newStatus ? "Hồi phục liên hệ" : "Đã xóa liên hệ";

            contact.StatusActive = newStatus;
            contact.creator.push({
                createdBy: userId,
                createdName: staffName,
                description: actionDes
            })
            await contact.save();
            return contact;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ContactService;  // xuất class