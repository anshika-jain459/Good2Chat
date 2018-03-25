//literally pasted from tutorial
'use strict'	

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var FBBotFramework = require('fb-bot-framework');
//init
var bot = new FBBotFramework({
	page_token:"EAAVLUYzaFhIBAEmIX9u5FszDjdy1roZBmz5SzfPnmPan0emZBZC5hZBVV4lD4wYXN4T7ZC07Et7ilnfx1hejLOuW0yTuz0XyctKdD4eDIlOZAntfh4A86XBxSqbVZCPu0gZCI7RjhrIaFR7UznoadZA9NDQXrlGL9lP5IZBOL3ZAKNfvvIPkRhrt0pY",
	verify_token: "verify_token"
});

const CRISIS_WORD = "MANGO";
var step_number = 0;
// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());

//STARTING STUFF
//make a menu
var menuButtons = [
    {	
        "type": "web_url",
        "title": "Dashboard",
        "url": "http://google.com/"
    },
    {
        "type": "web_url",
        "title": "Get Started",
        "url": "http://google.com/"
    }
];
bot.setPersistentMenu(menuButtons);

bot.setGreetingText( "Hi! Welcome to Good2Chat. If you're ever in an intense situation, text '" + 
	CRISIS_WORD + "'. Start by texting anything!");
//STARTING STUFF

// Setup listener for incoming messages
bot.on('message', function(userId, message){
	if(message.trim().toUpperCase() == CRISIS_WORD){
		bot.sendLocationRequest(userId, "I want to get you help. Can you please let me know where you are?");
	}else{
		if(step_number==0){
			bot.sendTextMessage(userId, "Did you take medication today?");
		}else if(step_number==1){
			bot.sendTextMessage(userId, "Did you take medication today?");
		}else if(step_number==2){
			
		}
		step++;
	}	
	
});


app.get("/", function (req, res){
	res.send("hello world");
});
//Make Express listening
app.listen(8000); 