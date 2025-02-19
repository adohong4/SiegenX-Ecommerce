'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const DOCUMENT_NAME = 'Staffs';  

const StaffSchema = new Schema(
    {
            Username: { type: String, required: true, unique: true },
            StaffName: { type: String, required: true },
            Email: { type: String, required: true, unique: true },
            Password: { type: String, required: true },
            Numberphone: { type: String, required: true },
            Tax: { type: String, required: true, unique: true },
            Role: { type: String, required: true },
            StatusActive: { type: Boolean },
            
        
    },
    { minimize: false, timestamps: true }
);



StaffSchema.index({ _id: -1, category: 1 });

const staffModel = mongoose.models.staff || mongoose.model(DOCUMENT_NAME, StaffSchema);

module.exports = staffModel;