const redis = require('redis');

class RedisConnection {
    constructor(host, port, password) {
        const client = redis.createClient({
            host: host,
            port: port,
            password: password
        })
        client.on('error', (err) => console.log('Redis Client Error', err));    
        client.connect();
        
        this.client = client;
    }

    client = null;
    set client(c) {
        this.client = c;
    }
    get client() {
        return this.client;
    }

    getLastNScans(N) {
        if (this.client === null) {
            return [];
        }
        var client = this.client;

        var scansJSON = [];
        var res;
        (async () => {
            res = await client.sendCommand(['sort', 'scanIds', 'alpha', 'desc', 'limit', '0', N.toString()]);
            if (res) {
                res.forEach(async function(elem) {
                    var scan = await client.get(elem);
                    var scanJSON = JSON.parse(scan);
                    scansJSON.push(scanJSON);
                });
            }
        })();

        return scansJSON;
    }
}

module.exports = { RedisConnection }