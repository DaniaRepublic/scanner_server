const ws = new WebSocket('ws://localhost:7071/ws');

ws.onmessage = (webSocketMessage) => {
    // receive new scan and display it
    jsonscan = JSON.parse(webSocketMessage.data);
    
    scanId = jsonscan.id;
    scanCode = jsonscan.code;
    scanAccepted = jsonscan.accepted;
    scanTime = jsonscan.time;

    var newscan = document.createElement('div');
    newscan.className = `scan c${scanCode}`;
    newscan.id = `${scanId}`;
    newscan.innerHTML = `<h4>${scanAccepted}</h4><h4>${scanTime}</h4>`;

    scanList = document.getElementById("scansRow");
    scanList.prepend(newscan);
};

ws.onopen = () => {
    ws.send("ping");
}

