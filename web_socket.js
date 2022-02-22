// websocket server for pushing new scans
const WebSocket = require('ws');

class WebSocketServer {
    constructor(port) {
        this.wss = new WebSocket.Server({ port: port });
    }

    ws = null;
    get ws() {
        return this.ws;
    }

    initialize(redisCli) {
        this.wss.on('connection', (ws) => {
            ws.on('message', (msgBytes) => {
                var msgStr = new Buffer.from(msgBytes).toString();
                // client ping response
                if (msgStr == 'ping') { 
                    console.log('client pingin\'');
                    return;
                }
                var msgJSON = JSON.parse(msgStr);
                if (msgJSON.requestType == 'scanInfoRequest') {
                    var scanId = msgJSON.scanId;
                    (async () => {
                        var scanData = await redisCli.get(scanId);
                        var scanDataJSON = JSON.parse(scanData);
                        scanDataJSON.scanInfoResponse = 1;
                        this.sendScan(scanDataJSON);
                    })();
                }
            });

            ws.on("close", () => {
                this.ws = null;
            });

            this.ws = ws;
        });
    }

    sendScan(scan) {
        if (this.ws !== null) {
            this.ws.send(JSON.stringify(scan));
        } else {
            console.log("client is disconnected, can't send message...");
        }
    }
}


module.exports = { WebSocketServer };