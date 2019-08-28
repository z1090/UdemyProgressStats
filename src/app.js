const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const hbs = require('hbs');
const statsGenerator = require('./utils/statsGenerator');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Setup static directory to serve
// Must be after app.use(bodyParser...)
app.use(express.static(publicDirectoryPath));

//Routes
app.get('', (req, res) => {
    res.render('index');
});

app.post('/stats', async (req, res) => {
    try {
        statsGenerator(req.body.date, req.body.progress, req.body.webpageContent, (response) => {
            res.send(response);
        })
    } catch(e) {
        res.status(400).send();
    }

})

//Start Server
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});