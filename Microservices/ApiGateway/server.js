const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

// Define API routes and corresponding backend services
const routes = {
    '/v1/api/identity': 'http://localhost:9001',
    '/v1/api/profile': 'http://localhost:9002',
    '/v1/api/product': 'http://localhost:9003',
    '/v1/api/contact': 'http://localhost:9004',
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
    cors()(req, res, () => {
        proxy(req, res);
    });
});

const port = process.env.PORT || 4001;
server.listen(port, () => {
    console.log(`API gateway running on port http://localhost:${port}`);
});