//literally pasted from tutorial
'use strict'	

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
//STARTING STUFF
const CRISIS_WORD = "MANGO";
var FBBotFramework = require('fb-bot-framework');
var bot = new FBBotFramework({
	page_token:"EAAVLUYzaFhIBAEmIX9u5FszDjdy1roZBmz5SzfPnmPan0emZBZC5hZBVV4lD4wYXN4T7ZC07Et7ilnfx1hejLOuW0yTuz0XyctKdD4eDIlOZAntfh4A86XBxSqbVZCPu0gZCI7RjhrIaFR7UznoadZA9NDQXrlGL9lP5IZBOL3ZAKNfvvIPkRhrt0pY",
	verify_token: "verify_token"
});
var step_number = 0;
// Setup Express middleware for /webhook
app.use('/webhook', bot.middleware());
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
	var name;
	var meds;
	var active;
	var sleep;
	var relax;
	var rate;
	var desc;
	var errors = false;
	bot.getUserProfile(userId, function (err, profile) {
		if(message.trim().toUpperCase() == CRISIS_WORD){
			bot.sendLocationRequest(userId, "I want to get you help. Can you please let me know where you are?");

		}else{
			if(step_number==0){
				bot.sendTextMessage(userId, "Hey " + profile.first_name + "! Did you take medication today? (Y/N)");
				meds = message.trim();
				if(meds.toUpperCase()!="Y" && meds.toUpperCase()!="N") {error_msg(userId); errors=true;}
			}else if(step_number==1){
				bot.sendTextMessage(userId, "Cool cool, how many hours were you active today?");
				active = parseInt(message.trim());
				if(active == NaN) {error_msg(userId);  errors=true;}
			}else if(step_number==2){
				bot.sendTextMessage(userId, "Moving on, how many hours did you sleep last night, " + profile.first_name + "?");
				sleep = parseInt(message.trim());
				if(sleep == NaN) {error_msg(userId);  errors=true;}
			}else if(step_number==3){
				bot.sendTextMessage(userId, "Thanks for letting me know, " + profile.first_name + "! Did you get a chance to relax or hang out with friends today? (Y/N)");
				relax = message.trim();
				if(relax.toUpperCase()!="Y" && relax.toUpperCase()!="N") {error_msg(userId);  errors=true;}
			}else if(step_number==4){
				bot.sendTextMessage(userId, "Thanks for answering my questions! Just a few more. How would you rate your day? (1 to 10, 10 being an awesome day)");
				rate = parseInt(message.trim());
				if(rate == NaN || rate < 1 || rate > 10) {error_msg(userId);  errors=true;}
			}else if(step_number==5){
		 		bot.sendTextMessage(userId, "Last thing: give me a quick description of your day.");
		 		desc = message.trim();
			}else if(step_number==6){
		 		bot.sendTextMessage(userId, "Thank you " + profile.first_name + "! Our daily session is done.");
		 		bot.sendTextMessage(userId, "You can always text me for more entries, or if you ever feel unsafe. Remember your emergency word: " + CRISIS_WORD);
		 		bot.sendTextMessage(userId, "Have an awesome day!");
		 		//gif
		 		step_number = 0;
		 		errors = true;
		 		//write to db
			}
			if(!errors) {step_number++;}
		}	
	});
});


function error_msg(userId){
	var responses= ["Oops! Try again", "Not quite the answer I was looking for, try again :)", 
	"Sorry, I don't understand your response, can you reply again?", "I don't quite understand! Please send again."];
	var num = Math.floor(Math.random() * 100) % 4; 
	bot.sendTextMessage(userId, responses[num]);
}

app.get("/", function (req, res){
	res.send("hello world");
});
//Make Express listening
app.listen(8000); 