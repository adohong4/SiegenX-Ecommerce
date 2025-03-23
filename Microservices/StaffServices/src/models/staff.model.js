'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DOCUMENT_NAME = 'Staffs';

const HistorySchema = new Schema({
    createdBy: { type: String, required: true }, //id
    createdName: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})
const StaffSchema = new Schema(
    {
        Username: { type: String, required: true, unique: true },
        StaffName: { type: String, required: true },
        Email: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
        HashedPassword: { type: String },
        Numberphone: { type: String },
        Tax: { type: String, required: true, unique: true },
        Role: { type: String, enum: ['ADMIN', 'STAFF'], default: "STAFF" },
        StaffPic: { type: String },
        StatusActive: { type: Boolean, default: true },
        creator: [HistorySchema],

    },
    { minimize: false, timestamps: true }
);



StaffSchema.index({ _id: -1, category: 1 });

const staffModel = mongoose.models.staff || mongoose.model(DOCUMENT_NAME, StaffSchema);

module.exports = staffModel;