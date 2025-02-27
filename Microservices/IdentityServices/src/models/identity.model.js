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

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, required: true },
    FullName: { type: String },
    DateOfBirth: { type: Date },
    ProfilePic: { type: String },
    NumberPhone: { type: Number },
    Gender: { type: String },
    address: [AddressSchema],
    cartData: { type: Object, default: {} }
}, { minimize: false, timestamps: true })

const identityModel = mongoose.models.user || mongoose.model(DOCUMENT_NAME, UserSchema)

module.exports = identityModel;
