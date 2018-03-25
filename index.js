//literally pasted from tutorial
'use strict'	

var Sequelize = require('sequelize');
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

//DB STUFF-------------------------------------------------------------------------------------------------------------------------------------------
var con = new Sequelize('dbnode', 'root', '',{
	host: 'localhost',
	dialect: 'mysql',
	pool:{
		max: 5,
	    min: 0,
	    acquire: 80000,
	    idle: 1000
	}
}); 

var dailyEntry = con.define('dailyTable', {//making a new table
	identifier: {
		type: Sequelize.STRING,
		unique: false, // all titles are unique
		//if you try to insert something thats already existing, 
		//sq will throw an error
		allowNull: false,
	},
	dbmeds: {type: Sequelize.BOOLEAN},
	dbactive: {type: Sequelize.INTEGER},
	dbsleep: {type: Sequelize.INTEGER},
	dbrelax: {type: Sequelize.BOOLEAN},
	dbrate: {type: Sequelize.INTEGER}, 
	dbdesc: {type: Sequelize.TEXT}
}, {
	timestamps: true
}); 

con.sync({
	force: true,//clears out old tables of same name
	logging: console.log
}).then(function(){
	console.log("connected!!");
}).catch(function(error){
		console.log("connection error: " + error);
});


//DB STUFF-------------------------------------------------------------------------------------------------------------------------------------------


//STARTING STUFF-------------------------------------------------------------------------------------------------------------------------------------------
const CRISIS_WORD = "MANGO";
const EMERGENCY_NUM = "15193629642";
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
    }
];
bot.setPersistentMenu(menuButtons);
bot.setGreetingText( "Hi! Welcome to Good2Chat. If you're ever in an intense situation, text '" + 
	CRISIS_WORD + "'. Start by texting anything!");

//stdlib messagebird
const lib = require('lib')({token: 'TuQeZr5A5d0gAn-sp9hamU6uaSB56_tfaESO3GzPMSQGv_wHmMQFqcUnwe2iYHmw'});
const sms = lib.messagebird.sms['@0.1.3'];
//STARTING STUFF-------------------------------------------------------------------------------------------------------------------------------------------

var meds;var active;var sleep;var relax;var rate;var desc;
var start = true;
// Setup listener for incoming messages
bot.on('message', function(userId, message){
	var errors = false;
	bot.getUserProfile(userId, function (err, profile) {
		if(message.trim().toUpperCase() == CRISIS_WORD){
			bot.sendLocationRequest(userId, "I want to get you help. Can you please let me know where you are?");
			bot.sendTextMessage(userId, "I am sending your emergency contact, " + EMERGENCY_NUM + ", a notification that you are feeling unsafe with your location");
			bot.sendTextMessage(userId, "This is where I'd code emergency response stuff!");
			let result = sms.create({
			  originator: "12048170705",
			  recipient: "15193629642", // (required)
			  body: profile.first_name + " is feeling unsafe at Lat 51.50 Long -0.17" // (required)
			}, (err, results) => {
				if (err) {
					//deal with err
				}
				console.log(results);
			});
		}else if(start){
			start=false;
			bot.sendTextMessage(userId, "Hey " + profile.first_name + "! Did you take medication today? (Y/N)");
		}else{
			if(step_number==0){				
				meds = message.trim();
				if(meds.toUpperCase()!="Y" && meds.toUpperCase()!="N") {
					error_msg(userId); 
					errors=true;
				}else{
					bot.sendTextMessage(userId, "Cool cool, how many hours were you active today?");
				}
			}else if(step_number==1){				
				active = parseInt(message.trim());
				if(isNaN(active)) {
					error_msg(userId);  
					errors=true;
				}else{
					bot.sendTextMessage(userId, "Moving on, how many hours did you sleep last night, " + profile.first_name + "?");
				}

			}else if(step_number==2){				
				sleep = parseInt(message.trim());
				if(isNaN(sleep)) {
					error_msg(userId);  
					errors=true;
				}else{
					bot.sendTextMessage(userId, "Thanks for letting me know, " + profile.first_name + "! Did you get a chance to relax or hang out with friends today? (Y/N)");
				}

			}else if(step_number==3){				
				relax = message.trim();
				if(relax.toUpperCase()!="Y" && relax.toUpperCase()!="N") {
					error_msg(userId);  
					errors=true;
				}else{
					bot.sendTextMessage(userId, "Thanks for answering my questions! Just a few more. How would you rate your day? (1 to 10, 10 being an awesome day)");
				}

			}else if(step_number==4){				
				rate = parseInt(message.trim());
				if(isNaN(rate) || rate < 1 || rate > 10) {
					error_msg(userId);  
					errors=true;
				}else{
					bot.sendTextMessage(userId, "Last thing: give me a quick description of your day. Include why you rated the day " + rate);
				}
			}else if(step_number==5){		 		
		 		desc = message.trim();
		 		bot.sendTextMessage(userId, "Thank you " + profile.first_name + "! Our daily session is done.");
		 		bot.sendTextMessage(userId, "You can always text me for more entries, or if you ever feel unsafe. Remember your emergency word: " + CRISIS_WORD);
		 		bot.sendTextMessage(userId, "Have an awesome day!");
		 		//gif
		 		step_number = 0;
		 		errors = true;
		 		//write to db
		 		console.log("meds: " + meds);
	 			console.log("active: " + active);
	 			console.log("sleep: " + sleep);
	 			console.log("relax: " + relax);
	 			console.log("rate: " + rate);
	 			console.log("desc: " + desc);
		 		dailyEntry.create({
		 			identifier: 'identifier',
					dbmeds: meds != "Y",
					dbactive: active,
					dbsleep: sleep,
					dbrelax: relax != "Y",
					dbrate: rate, 
					dbdesc: desc
		 		}).then(function(insertedRec){					
		 			console.log("inserted!");		 			
		 		}); 
		 		start = true;
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

//port stuff
app.get("/", function (req, res){
	res.send("hello world");
});
app.set('port', 8000); 
// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});


