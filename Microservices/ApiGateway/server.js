const http = require('http');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const client = require('prom-client');
require('dotenv').config();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

// Define API routes and corresponding backend services
const routes = {
    '/v1/api/identity': 'http://localhost:9001',
    '/v1/api/profile': 'http://localhost:9002',
    '/v1/api/product': 'http://localhost:9003',
    '/v1/api/contact': 'http://localhost:9004',
    '/v1/api/supplier': 'http://localhost:9005',
    '/v1/api/staff': 'http://localhost:9006',
    '/v1/api/online': 'http://localhost:9007',
};

const app = express();

// Thu thập các metrics mặc định (CPU, memory, v.v.)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Tạo metric tùy chỉnh (ví dụ số lượng request)
const counter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

// Middleware để đếm request
app.use((req, res, next) => {
    res.on('finish', () => {
        counter.inc({ method: req.method, route: req.path, status: res.statusCode });
    });
    next();
});

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') {
        res.writeHead(204).end();
        return;
    }
    next();
};

// Endpoint để Prometheus scrape
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// Create proxy middleware
const proxy = createProxyMiddleware({
    changeOrigin: true,
    xfwd: true,
    pathRewrite: {
        '^/v1/api/identity': '/v1/api/identity',
        '^/v1/api/profile': '/v1/api/profile',
        '^/v1/api/product': '/v1/api/product',
        '^/v1/api/contact': '/v1/api/contact',
        '^/v1/api/supplier': '/v1/api/supplier',
        '^/v1/api/staff': '/v1/api/staff',
        '^/v1/api/online': '/v1/api/online'
    },
    router: (req) => {
        const route = Object.keys(routes).find(r => req.url.startsWith(r));
        if (route) {
            return routes[route];
        }
        return null;
    },
    onError: (err, req, res) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'error',
            message: 'Proxy error',
            details: err.message,
        }));
    },
});

// Áp dụng middleware CORS và proxy
app.use(corsMiddleware);
app.use(proxy);

// Cluster logic
const PORT = process.env.PORT || 4001;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} đang chạy`);

    // Tạo worker cho mỗi CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Xử lý khi worker dừng
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} đã dừng với code ${code}`);
        cluster.fork(); // Khởi động lại worker nếu cần
    });

    // Graceful shutdown cho master
    process.on('SIGINT', () => {
        console.log('Master received SIGINT. Shutting down all workers...');
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }
        process.exit(0);
    });
} else {
    // Worker process: Tạo server cho mỗi worker
    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(`Worker ${process.pid} chạy trên port http://localhost:${PORT}`);
    });

    // Xử lý lỗi khi server không khởi động được
    server.on('error', (error) => {
        console.error(`Worker ${process.pid} gặp lỗi khi khởi động server:`, error);
        process.exit(1);
    });

    // Graceful shutdown cho worker
    process.on('SIGINT', () => {
        console.log(`Worker ${process.pid} shutting down...`);
        server.close(() => {
            console.log(`Worker ${process.pid}: Server closed`);
            process.exit(0);
        });
    });
}