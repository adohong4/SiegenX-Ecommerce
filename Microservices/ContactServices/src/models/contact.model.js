'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Contacts'

const ContactSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    content: { type: String, required: true },
    date: {
        type: String,
        default: () => {
            // get the current time in VN time zone
            const now = new Date();
            return now.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    },
    isCheck: { type: Boolean, default: false }
}, { minimize: false, timestamps: true })

const contactModel = mongoose.models.contact || mongoose.model(DOCUMENT_NAME, ContactSchema)

module.exports = contactModel;