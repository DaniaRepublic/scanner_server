var redis_conn = require('./redis_conn')

// get redis connection
const redis = new redis_conn.RedisConnection('localhost', 6379, 'password');
const redisCli = redis.client;

(async () => {
    var res = await redisCli.sendCommand(['sort', 'scanIds', 'alpha', 'desc', 'limit', '0', '10']);
    console.log(res);
})();
