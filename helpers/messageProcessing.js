const FACEBOOK_ACCESS_TOKEN = 'EAAfXrjONIi4BAMuZBvRdS9B8UlHN9EGFjLOCUR1FiK7Yk4ZCkXUkhQU6Wi7GVRzCSk2VLClYO65490VOeFA3BiWF2Chk6dPcZAZC6PGcvsrxuurvlEp3bSZCtbFlfuu2GVg8kgSCZCGo1l0LgbYQK2hDZBVgdF17u5X8VJde1iXPaCqzxn3yyQT';
const request = require('request');

var FBBotFramework = require('fb-bot-framework');
var bot = new FBBotFramework({
	page_token:"EAAfXrjONIi4BAMuZBvRdS9B8UlHN9EGFjLOCUR1FiK7Yk4ZCkXUkhQU6Wi7GVRzCSk2VLClYO65490VOeFA3BiWF2Chk6dPcZAZC6PGcvsrxuurvlEp3bSZCtbFlfuu2GVg8kgSCZCGo1l0LgbYQK2hDZBVgdF17u5X8VJde1iXPaCqzxn3yyQT",
	verify_token: "verify_token"
});

const CRISIS_WORD = "MANGO";
const EMERGENCY_NUM = "15193629642";	

//make a menu
var menuButtons = [
    {	
        "type": "web_url",
        "title": "Dashboard",
        "url": "localhost:5000"
    }
];
bot.setPersistentMenu(menuButtons);
bot.setGreetingText( "Hi! Welcome to Good2Chat. If you're ever in an intense situation, text '" + 
	CRISIS_WORD + "'. Start by texting anything!");

module.exports = {
	bot,
	CRISIS_WORD,
	EMERGENCY_NUM
}