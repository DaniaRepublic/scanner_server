// talk to wallet managment server
const https = require("https");

function generateOptions(passTypeId, serialNum) {
    return {
        hostname: 'f4c2-195-91-208-19.ngrok.io',
        port: 443,
        path: encodeURI(`/scan/${ passTypeId }/${ serialNum }/status`),
        method: 'POST',
        headers: {
            "Authorization": "Basic wIkT4grB5ay3rL24ARJKYHFDUmqqS3caT+UEyjhRDu0="
        }
    }
}

// this function requests status of a pass from wallet api
function requestPassStatus(passTypeId, serialNum) {
    const req = https.request(generateOptions(passTypeId, serialNum), res => {
        switch (res.statusCode) {
        case 200:
            console.log("Ok: user can enter.");
            break;
        case 400:
            console.log("BadRequest: pass type or/and serial number are bad.");
            break;
        case 404:
            console.log("NotFound: pass with that type and serial number is not registered.");
            break;
        default:
            console.log("Unknown error.");
            break;
        }

        res.on('data', d => {
            // if data returns
            // TODO:
            // !!!! insert data into database !!!!
            // !!!! then display it !!!!
        });
    });

    req.on('error', error => {
        displayError(error);
    });

    req.end();
}

module.exports = { requestPassStatus };