'use strict'

const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            dbName: 'Product',
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};

module.exports = { connectDB, closeDB };