'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DOCUMENT_NAME = 'Campaigns';

const HistorySchema = new Schema({
    createdBy: { type: String, required: true }, //id
    createdName: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const CampaignSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, enum: ['percentage', 'fixed_amount'] }, // percentage
        value: { type: Number, required: true }, // 10.000 , 10
        code: { type: String, required: true }, // campaignCode
        startDate: { type: Date, required: true }, // ngay bat dau
        endDate: { type: Date, required: true }, // ngay ket thuc
        status: {
            type: String, enum: [
                'active',          // Chiến dịch đang hoạt động
                'paused',          // Chiến dịch tạm dừng
                'completed',       // Chiến dịch đã hoàn thành
                'pending',         // Chiến dịch đang chờ xử lý
                'cancelled',       // Chiến dịch đã bị hủy
                'failed',          // Chiến dịch không thành công
                'draft'            // Chiến dịch đang ở dạng nháp
            ], default: 'active'
        },
        maxValue: { type: Number, required: true },
        appliesTo: { type: String, required: true, enum: ['all', 'category', 'items'] },
        // productCategory: { type: Array, default: [] },
        productIds: { type: Array, default: [] }, // so san pham duoc ap dung
        creator: [HistorySchema],
        active: { type: Boolean, default: true },
    }, { minimize: false, timestamps: true }
);

CampaignSchema.index({ _id: -1, category: 1 });

const campaignModel = mongoose.models.campaign || mongoose.model(DOCUMENT_NAME, CampaignSchema);

module.exports = campaignModel;