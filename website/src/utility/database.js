const sql = require('mysql2/promise');
const redis = require('redis');

const { 
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_DATABASE,

    REDIS_HOST,
    REDIS_PORT,
    REDIS_USERNAME,
    REDIS_PASSWORD
 } = process.env;

const sqlConnection = sql.createPool({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_DATABASE
});

const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});
redisClient.on('error', console.error);

redisClient.sendCommand('AUTH', [REDIS_PASSWORD, REDIS_USERNAME]);  // This is purposely reversed as the library
                                                                    // appears to have reversed the arguments

function redisConnection(methodName, ...args) {
    return new Promise(function(resolve, reject) {
        redisClient[methodName](...args, function(error, response) {
            if (error !== null) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

module.exports = {
    sqlConnection,
    redisConnection,
    redisClient
 };