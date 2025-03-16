const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB, closeDB } = require('./config/db.mongodb');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { initRedis, closeRedis } = require('./config/init.redis');
const path = require('path');
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
// Init middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// Cấu hình CORS
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // Cho phép gửi cookie/token
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Xử lý preflight request (OPTIONS)
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.sendStatus(200);
});

// Init redis
initRedis().catch((err) => {
    console.error(`Worker ${process.pid}: Failed to init Redis:`, err);
});

// Init db
if (mongoose.connection.readyState !== 1) {
    connectDB();
}

// Serve static files
app.use("/images", express.static("upload"));
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
    console.log(`Worker ${process.pid} shutting down...`);
    try {
        await closeRedis();
        console.log(`Worker ${process.pid}: Redis connection closed`);
        await closeDB();
        console.log(`Worker ${process.pid}: MongoDB connection closed`);
        process.exit(0);
    } catch (error) {
        console.error(`Worker ${process.pid}: Error during shutdown:`, error);
        process.exit(1);
    }
});

module.exports = app;
