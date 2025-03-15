const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.mongo');
const compression = require('compression')
const cookieParser = require('cookie-parser');
const path = require('path');
const { initRedis, closeRedis } = require('./config/init.redis');

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
// Init middlewares
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(cookieParser());

// Init db
connectDB();

//init redis
initRedis();

// Init router
app.use('', require('./routes'));

// Handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    try {
        await closeRedis();
        console.log('Redis connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

module.exports = app;
