scans = [
    {
        id: 1,
        code: 200,
        accepted: "accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 2,
        code: 409,
        accepted: "not accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 3,
        code: 400,
        accepted: "not accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 4,
        code: 200,
        accepted: "accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 1,
        code: 200,
        accepted: "accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 2,
        code: 409,
        accepted: "not accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 3,
        code: 400,
        accepted: "not accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 4,
        code: 200,
        accepted: "accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 1,
        code: 200,
        accepted: "accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 2,
        code: 409,
        accepted: "not accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 3,
        code: 400,
        accepted: "not accepted",
        time: new Date().getFullYear(),
    },
    {
        id: 4,
        code: 200,
        accepted: "accepted",
        time: new Date().getFullYear(),
    }
]

// web interface for cashier
const express = require('express');
const exphbs = require('express-handlebars');

class WebService {
    constructor(port) {
        const app = express();
        app.engine('hbs', exphbs.engine({
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        app.set('view engine', 'hbs');
        app.use(express.static(__dirname + '/public'));

        app.get('/', (req, res) => {
            res.render('home', {
                scans: scans
            });
        });

        app.listen(port, () => {
            console.log('server started');
        });
    }
}

module.exports = { WebService };