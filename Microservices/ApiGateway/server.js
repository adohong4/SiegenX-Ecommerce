const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

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
});

// Create API gateway server
const server = http.createServer((req, res) => {
    corsMiddleware(req, res, () => {
        proxy(req, res);
    });
});

const port = process.env.PORT || 4001;
server.listen(port, () => {
    console.log(`API gateway running on port http://localhost:${port}`);
});