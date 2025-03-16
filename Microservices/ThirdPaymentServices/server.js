'use strict';

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const app = require("./src/app");

require('dotenv').config();

const PORT = process.env.PORT || 9007;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} đang chạy`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} đã dừng với code ${code}`);
        cluster.fork();
    });

    process.on('SIGINT', () => {
        console.log('Master received SIGINT. Shutting down all workers...');
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }
        process.exit(0);
    });
} else {
    const server = app.listen(PORT, () => {
        console.log(`Worker ${process.pid} chạy trên port ${PORT}`);
    });

    server.on('error', (error) => {
        console.error(`Worker ${process.pid} gặp lỗi khi khởi động server:`, error);
        process.exit(1);
    });
}