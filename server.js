const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const request = require('request');
const app = express();

const credentials = (
    require('fs').existsSync(path.join(__dirname, 'credentials.js'))
    ? require('./credentials')
    : console.log('No credentials.js file present')
);

var corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.get('/token', (req,res) => {
    request.post(
        credentials.Authentication,
        { form: credentials.credentials},
        (error, response, body) => {
            if(!error && response.statusCode == 200){
                res.json(JSON.parse(body));
            }
        }
    )
})

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})