// web interface for cashier
const express = require('express');
const exphbs = require('express-handlebars');

function startWebService(port, redis) {
    const app = express();
    
    var hbs = exphbs.create({
        defaultLayout: 'main',
        extname: '.hbs',

        // add helper to handlebars
        helpers : {
            hasUserName: (userName) => {
                return userName !== '-';
            }
        }
    });

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.use(express.static(__dirname + '/public'));

    app.get('/', (req, res) => {
        // get last N scans
        var scans = redis.getLastNScans(8);
        res.render('home', {
            scans: scans
        });
    });

    app.listen(port, () => {
    });

    return app;
}

module.exports = { startWebService };