const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.mongodb");
const cookieParser = require("cookie-parser");
const compression = require('compression');
const { initRedis, closeRedis } = require('./config/init.redis');
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const client = require('prom-client');

// Thu thập các metrics mặc định (CPU, memory, v.v.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Tạo metric tùy chỉnh
// 1. Số lượng request
const counter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

// 2. Thời gian phản hồi (latency) của request
const histogram = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.3, 0.5, 1, 3, 5] // Các bucket thời gian (giây)
});

// Middleware để ghi lại metrics
app.use((req, res, next) => {
    const start = Date.now(); // Ghi lại thời gian bắt đầu

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000; // Thời gian phản hồi (giây)
        const route = req.path;

        // Ghi lại số lượng request
        counter.inc({
            method: req.method,
            route: route,
            status: res.statusCode
        });

        // Ghi lại thời gian phản hồi
        histogram.observe({
            method: req.method,
            route: route,
            status: res.statusCode
        }, duration);
    });

    next();
});

// Endpoint để Prometheus scrape
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Middleware
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

//init redis
initRedis();

// Kết nối database
connectDB();

// Khởi tạo router
app.use("", require("./routes"));
app.use("/images", express.static("upload"));

// Xử lý lỗi 404
app.use((req, res, next) => {
    next({ status: 404, message: "Not Found" });
});

// Xử lý lỗi chung
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: "error",
        code: error.status || 500,
        message: error.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
