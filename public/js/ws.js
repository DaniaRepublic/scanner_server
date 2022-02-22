// send show scan info message to ws
function requestScanInfo(id, ws) {
    ws.send(`{"requestType":"scanInfoRequest","scanId":"${id}"}`);
}

// set scan info
function setScanInfo(jsonMsg) {        
    var scanStatus = jsonMsg.status;
    var scanTime = jsonMsg.time;
    var userName = jsonMsg.userName;
    var usageStatus = jsonMsg.usageStatus;

    var newscan = document.createElement('div');
    newscan.className = `scanInfoInstance c${usageStatus}`;
    
    var newscanInnerHTML = '';
    if (userName !== "-") {
        newscanInnerHTML += `<h4>Yearly ticket</h4>`;
        newscanInnerHTML += `<h4>Name -> ${userName}</h4>`;
    } else {
        newscanInnerHTML += `<h4>One time ticket</h4>`;
    }
    newscanInnerHTML += `<h4>Result -> ${scanStatus}</h4><h4>Date -> ${scanTime}</h4>`;
    newscan.innerHTML = newscanInnerHTML;

    var scanInfoDiv = document.getElementById('scanInfo');
    scanInfoDiv.innerHTML = newscan.outerHTML;
}

const ws = new WebSocket('ws://localhost:7071/ws');

ws.onmessage = (webSocketMessage) => {
    // receive new scan and display it
    var jsonMsg = JSON.parse(webSocketMessage.data);

    // if it's scan info in responce, display it
    if (jsonMsg.scanInfoResponse) {
        setScanInfo(jsonMsg);
        return;
    }
    
    var scanId = jsonMsg.id;
    var scanStatus = jsonMsg.status;
    var scanTime = jsonMsg.time;
    var userName = jsonMsg.userName;
    var usageStatus = jsonMsg.usageStatus;

    var newscan = document.createElement('div');
    newscan.className = `scan c${usageStatus}`;
    newscan.id = `${scanId}`;
    
    var newscanInnerHTML = `<h4>${scanStatus}</h4><h4>${scanTime}</h4>`;
    if (userName !== "-") {
        newscanInnerHTML += `<h4>${userName}</h4>`;
    }
    newscan.innerHTML = newscanInnerHTML;
    newscan.onclick = () => {
        requestScanInfo(scanId, ws);
    }

    document.getElementById("scansRow").prepend(newscan);

    setScanInfo(jsonMsg);
}

ws.onopen = () => {
    ws.send("ping");
}

// display scan info when user clicks on 'scan' div
var scans = document.getElementsByClassName("scan");
for (let scan of scans) {
    scan.addEventListener('click', (event) => {
        requestScanInfo(scan.id, ws);
    });
}