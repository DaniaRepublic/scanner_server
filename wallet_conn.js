// talk to wallet managment server
const https = require("https");

function generateOptions(passType, serialNum) {
    return {
        hostname: 'ipv4',
        port: 443,
        path: encodeURI(`/scan/${ passType }/${ serialNum }`),
        method: 'POST',
        headers: {
            "Authorization": "Basic <token>"
        }
    }
}

// this function requests status of a pass from wallet api
function request_save_display_PassStatus(passType, serialNum, wss, redisCli) {
    const req = https.request(generateOptions(passType, serialNum), res => {
        switch (res.statusCode) {
        case 200:
            console.log("status Ok");
            break;
        case 400:
            console.log("status not accepted");
            break;
        case 404:
            console.log("status not in wallet");
            break;
        default:
            console.log("status unknown error");
            break;
        }

        res.on('data', d => {
            var resJSONstr = new Buffer.from(d).toString();
            try {
                var resJSON = JSON.parse(resJSONstr);
            } catch (e) {
                console.log("error: wallet_conn response not json:", resJSONstr);
            }
            switch (resJSON.usageStatus) {
                case 0:
                    resJSON.status = "accepted";
                    break;
                case 1:
                    resJSON.status = "check id";
                    break;
                case 2:
                    resJSON.status = "not accepted";
                    break;
            }
            
            // insert data into database
            var resId = resJSON.time.toString()+'@'+serialNum+'@'+passType;
            resJSON.id = resId;

            // get formated time
            dateObj = new Date(resJSON.time);
            utcString = dateObj.toLocaleString('en-US', {
                timeZone: 'Europe/Moscow',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            time = utcString.slice(0, -3);
            resJSON.time = time;
            // add scan info to redis
            (async () => {
                await redisCli.lPush("scanIds", resId);
                await redisCli.set(resId, `{"usageStatus":${resJSON.usageStatus},"userName":"${resJSON.userName}","id":"${resId}","status":"${resJSON.status}","time":"${time}"}`);
            })();
            // then display it 
            wss.sendScan(resJSON);
        });
    });

    req.on('error', error => {
        displayError(error);
    });

    req.end();
}

module.exports = { request_save_display_PassStatus };
