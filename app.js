#!/usr/bin/env node

/*
 sequence of actions:
 1. connect to scanner
 2. start websocket server
 3. start web server
*/

// imports
var scanner_c = require("./scanner_conn");
var wallet_c = require('./wallet_conn');
var webSocket = require('./web_socket');
var webInterface = require('./web_interface');

// get scanner connection
const scannerConn = new scanner_c.ScannerConn(3118, 4231);
scannerConn.connect();
var scanner = scannerConn.device;

// get websocket server instance
var wss = new webSocket.WebSocketServer(7071);
wss.initialize();
console.log("wss up");

// start web interface
var wi = new webInterface.WebService(5000);

// configure scanner connection for actions on new scan
scanner.on("data", function (data) {
    // remove trailing 0x00
    zeroData = data.indexOf(0x00);
    data = data.slice(0, zeroData);

    var passStr = new Buffer.from(data).toString();
    var [serialNumber, passTypeId] = passStr.split('@');
    if (serialNumber===undefined || passTypeId===undefined) {
        console.log("error: serialNumber or passTypeId undefined");
        return null;
    }

    // remove preceding Q1
    var q1idx = serialNumber.indexOf("Q1");
    if (q1idx===-1) {
        console.log("error: q1idx not present");
        return null;
    }
    serialNumber = serialNumber.slice(q1idx+2);

    // let wallet connection handle pass data
    wallet_c.requestPassStatus(passTypeId, serialNumber);
});
