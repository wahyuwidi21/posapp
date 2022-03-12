import redis from 'redis';
import utils from './utils';

const connectionPool = [];

const createConnectionPool = async (config) => {
    const currConnection = connectionPool.findIndex(conf => conf.config.toString() === config.toString());
    if (currConnection === -1) {
        const client = redis.createClient({
            retry_strategy: function (options) {
                if (options.error) {
                    if (options.error.code === 'ECONNREFUSED') {
                        //   logger.log('redis', 'The server refused the connection', 'error');
                        return new Error('The server refused the connection');
                    }
                    if (options.error.code === 'ECONNRESET') {
                        //   logger.log('redis', 'The server reset the connection', 'error');
                        return new Error('The server reset the connection');
                    }
                    if (options.error.code === 'ETIMEDOUT') {
                        //   logger.log('redis', 'The server timeouted the connection', 'error');
                        return new Error('The server timeouted the connection');
                    }
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    // logger.log('redis', 'Retry time exhausted', 'error');
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    // logger.log('redis', 'Retry attempt exceed', 'error');
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            },
            ...config,
        });

        connectionPool.push({
            config,
            client
        });
        return connectionPool;
    }
    return currConnection;
};

const getConnection = async () => {
    return connectionPool;
};

export default class Redis {
    constructor(config) {
        this.config = config.connection;
        this.index = config.index;
    }

    async setData(key, value) {

        let client = await getConnection(this.config);
        if (client.length <= 0) {
            client = await createConnectionPool(this.config);
        }
        const convertToString = JSON.stringify({
            data: value
        });
        const clientRedis = client[0].client;
        clientRedis.on('error', (err) => {
            // logger.log('redis-db', err, 'Failed to set data on Redis');
            return utils.wrapperError(err);
        });
        clientRedis.select(this.index, async (err) => {
            if (err) {
                // logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis set data');
                return utils.wrapperError(err);
            }
            clientRedis.set(key, convertToString);
        });
    }

    async setDataEx(key, value, duration) {
        let client = await getConnection(this.config);
        if (client.length <= 0) {
            client = await createConnectionPool(this.config);
        }
        const convertToString = JSON.stringify({
            data: value
        });
        const clientRedis = client[0].client;
        clientRedis.on('error', (err) => {
            // logger.log('redis-db', err, 'Failed to set dataEx on Redis');
            return utils.wrapperError(err);
        });

        clientRedis.select(this.index, async (err) => {
            if (err) {
                // logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis set data');
                return utils.wrapperError(err);
            }
            clientRedis.set(key, convertToString, 'EX', duration);
        });
    }

    async getData(key) {
        let client = await getConnection(this.config);

        if (client.length <= 0) {
            client = await createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            // logger.log('redis-db', err, 'Failed Get data From Redis');
            return utils.wrapperError(err);
        });
        
        return new Promise(((resolve, reject) => {
            clientRedis.select(this.index, async (err) => {
                if (err) {
                    // logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis get data');
                    return utils.wrapperError(err);
                }
                clientRedis.get(key, (err, replies) => {
                    if (err) {
                        reject(utils.wrapperError(err));
                    }
                    resolve(replies);
                });
            });

        }));
    }

    async deleteKey(key) {
        let client = await getConnection(this.config);
        if (client.length <= 0) {
            client = await createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            // logger.log('redis-db', err, 'Failed Delete Key From Redis');
            return utils.wrapperError(err);
        });
        return new Promise(((resolve, reject) => {
            clientRedis.select(this.index, async (err) => {
                if (err) {
                    // logger.log('redis-db', `change db to ${this.index}, : ${err}`, 'redis delete key');
                    return utils.wrapperError(err);
                }
                clientRedis.del(key, (err, replies) => {
                    if (err) {
                        reject(utils.wrapperError(err));
                    }
                    resolve(replies);
                });
            });
        }));
    }
}