#!/usr/bin/env node

/*
 sequence of actions:
 1. connect to redis server
 2. connect to scanner
 3. start websocket server
 4. start web server
*/

// import my modules
var redis_conn = require('./redis_conn')
var scanner_c = require("./scanner_conn");
var wallet_c = require('./wallet_conn');
var webSocket = require('./web_socket');
var webInterface = require('./web_interface');

// get redis connection
const redis = new redis_conn.RedisConnection('localhost', 6379, 'UPM7iLsubdA70JWauKltS9Flb6NVfHdE9z0OmVOg2DDjwzfVVIRys+DwN+SRJu8dEH0robvfkmzJN27kCEcg2A==');
const redisCli = redis.client;

// get scanner connection
const scannerConn = new scanner_c.ScannerConn(3118, 4231);
scannerConn.connect();
var scanner = scannerConn.device;

// get websocket server instance
var wss = new webSocket.WebSocketServer(7071);
wss.initialize(redisCli);

// start web interface
const webApp = webInterface.startWebService(5000, redis);

// configure scanner connection for actions on new scan
scanner.on("data", function (data) {
    // remove trailing 0x00
    zeroDataIdx = data.indexOf(0x00);
    // remove Q1 prefix with trash
    precedingTrash = data.indexOf(0x5131);
    if (zeroDataIdx !== -1 && precedingTrash !== -1) {
        data = data.slice(precedingTrash+1, zeroDataIdx);
    }

    var passStr = new Buffer.from(data).toString();
    var [serialNumber, passType] = passStr.split('@');
    if (serialNumber===undefined || passType===undefined) {
        console.log("error: serialNumber or passType undefined");
        return null;
    }
        
    // let wallet connection handle pass data
    wallet_c.request_save_display_PassStatus(passType, serialNumber, wss, redisCli);
});
