const FACEBOOK_ACCESS_TOKEN = 'my token';
const request = require('request');

var FBBotFramework = require('fb-bot-framework');
var bot = new FBBotFramework({
	page_token:FACEBOOK_ACCESS_TOKEN,
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
