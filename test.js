var webSocket = require('./web_socket');

var wss = new webSocket.WebSocketServer(7071);

wss.initialize();

console.log("wss up");

newScan1 = {
    id: 4,
    code: 200,
    accepted: "accepted",
    time: '13.02.2022',
}
newScan2 = {
    id: 4,
    code: 400,
    accepted: "not accepted",
    time: '15.02.2022',
}

setTimeout(() => {
    wss.sendScan(newScan1);
}, 7000);
setTimeout(() => {
    wss.sendScan(newScan2);
}, 8000);


var webInterface = require('./web_interface');

var wi = new webInterface.WebService(5000);

