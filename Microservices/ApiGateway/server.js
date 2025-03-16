const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

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

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    next();
};


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
        // Select backend server based on the requested route
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
    const server = http.createServer((req, res) => {
        corsMiddleware(req, res, () => {
            proxy(req, res);
        });
    });

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