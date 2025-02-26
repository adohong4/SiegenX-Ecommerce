'use strict'

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Contacts'

const HistorySchema = new Schema({
    createdBy: { type: String, required: true }, //id
    createdName: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const ContactSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    content: { type: String, required: true },
    isCheck: { type: Boolean, default: false },
    StatusActive: { type: Boolean, default: true },
    creator: [HistorySchema],
}, { minimize: false, timestamps: true })

const contactModel = mongoose.models.contact || mongoose.model(DOCUMENT_NAME, ContactSchema)

module.exports = contactModel;