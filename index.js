
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

var bot = require('./helpers/messageProcess');
// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());


const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');
app.get('/', verificationController);
app.post('/', messageWebhookController);


app.set('port', 8000); 
// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});


