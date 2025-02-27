const express = require('express');
const cors = require('cors');
const connectDB = require('./config/config.db.mongo');
const cookieParser = require('cookie-parser');
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
// Init middlewares
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
        credentials: true, // Cho phép gửi cookie/token
    })
);
app.use(cookieParser());
// Init db
connectDB();

// Serve static files

// Init router
app.use('', require('./routes'));

//app.use('/images', express.static('upload'));

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

module.exports = app;
