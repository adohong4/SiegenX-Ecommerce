'use strict'

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Users'

const AddressSchema = new Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    precinct: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
})

const HistorySchema = new Schema({
    createdBy: { type: String, required: true }, //id
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, default: 'USER' },
    fullName: { type: String },
    dateOfBirth: { type: Date },
    profilePic: { type: String },
    numberPhone: { type: String },
    gender: { type: String },
    address: [AddressSchema],
    cartData: { type: Object, default: {} },
    active: { type: Boolean, default: true },
    creator: [HistorySchema],
}, { minimize: false, timestamps: true })

const profileModel = mongoose.models.user || mongoose.model(DOCUMENT_NAME, UserSchema)

module.exports = profileModel;
