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

    initialize() {
        this.wss.on('connection', (ws) => {
            console.log("client connected");

            ws.on('message', (messageAsString) => {
                console.log(messageAsString);
            });

            ws.on("close", () => {
                console.log("client disconnected");
            });

            this.ws = ws;
        });

        this.wss.on('message', (messageAsString) => {
            console.log(messageAsString);
        });
    }

    sendScan(scan) {
        this.ws.send(JSON.stringify(scan));
    }
}


module.exports = { WebSocketServer };