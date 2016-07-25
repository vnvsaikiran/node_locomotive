var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require ('path');


var mustacheExpress = require('mustache-express'); 
app.engine('html', mustacheExpress());
app.set('view engine', 'html'); 
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('public'));

var flights = require('./routes/flights');
app.use('/', flights);

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});