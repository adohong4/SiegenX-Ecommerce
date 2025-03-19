const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.mongodb');
const compression = require('compression');
const app = express();
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

// Init middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Init db
connectDB();

// Serve static files

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

module.exports = app;
