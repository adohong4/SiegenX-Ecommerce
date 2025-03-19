'use stric'

const redis = require('redis')
const { RedisErrorResponse } = require('../core/error.response')

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnect',
    ERROR: 'error',
}

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Redis lỗi kết nối',
        en: 'Service connect error',
    }
}

let connectTimeout;

const handleTimeoutError = () => {
    connectTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            code: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionRedis - Connection status: connected`);
        clearTimeout(connectTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - Connection status: disconnected`);
        //connect retry
        handleTimeoutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - Connection status: reconnected`);
        clearTimeout(connectTimeout)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`connectionRedis - Connection status: ${error}`)
        //connect retry
        handleTimeoutError()
    })
}

const initRedis = async () => {
    return new Promise((resolve, reject) => {
        const instanceRedis = redis.createClient();

        client.instanceRedis = instanceRedis;
        handleEventConnect({ connectionRedis: instanceRedis });

        // Chờ kết nối thành công
        instanceRedis.connect().then(() => {
            resolve(instanceRedis);
        }).catch((error) => {
            reject(new RedisErrorResponse({
                message: 'Không thể kết nối tới Redis server',
                code: -98,
                details: error.message,
            }));
        });

        // Timeout nếu không kết nối được
        handleTimeoutError();
    });
};

const getRedis = () => client

const closeRedis = async () => {
    try {
        clearTimeout(connectTimeout);

        if (client.instanceRedis && client.instanceRedis.isOpen) {
            await client.instanceRedis.quit();
            console.log('Redis connection closed successfully');
        } else {
            console.log('No active Redis connection to close');
        }

        client = {};
    } catch (error) {
        console.error('Error closing Redis connection:', error);
        throw new RedisErrorResponse({
            message: 'Lỗi khi đóng kết nối Redis',
            code: -100,
        });
    }
};

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}