module.exports = function(){
var KEEP_ALIVE_TIME = 1000*60*5;
var io = require('socket.io-client');
var Bot = require('./chatbotSchema.js');

var service = {};
service.requestBot = requestBot;
service.connections = [];


// setInterval(function(){
// console.log('---- printing bot connections ----');
// console.log(service.connections);
// console.log('----------------------------------');
// console.log('---- removing bots ---------------');
// removeOldBots();
// },1000*60*5);

function requestBot(room,info){
	removeOldBots();
	var connection = {};
	connection.socket = io.connect('http://localhost:8080', {forceNew:true});
	connection.lastMessage = new Date();
	connection.botName = getBotName();

	connection.socket.on('connect', function(){
		console.log('connecting bot');
		connection.socket.emit('join room', {'room':room, 'source':'bot'});	
		greeting(info.key);
		connection.socket.on('message', function(data){

			if(data.message.name != connection.botName){
			
				connection.lastMessage = new Date();
			
				var botMessage = response(connection.botName,data);
				connection.socket.emit('message', botMessage);

			}
			
		});

		function greeting(key){
			Bot.findOne({'prompt':'hello', 'key':key}).then(function(bot){
				console.log('found bot:', bot);
				var message = {
					message: bot.message,
					responses: bot.responses,
					name: bot.name,
					}
				console.log('saying hello');
				connection.socket.emit('message', message );
			});
		}



	});

	service.connections.push(connection);
	
}

function response(botName, userMessage){

	var botMessage = {
			message: {
				body: '['+botName+'] ' + 'do you need to lose weight?',
				name: botName,	
			},
			
			responses: [
			{
				body:'yes',
				type:'text',
			},

			{
				body:'no',
				type:'text',
			},

			{
				body:'maybe',
				type:'text',
			},

			],
	}
	return botMessage;
}


function removeOldBots(){
	var currentTime = new Date();
	var dt = KEEP_ALIVE_TIME;
	service.connections = service.connections.filter(function(connection){
		if(currentTime - connection.lastMessage > dt) {
			 connection.socket.disconnect();
			 return false;
		}
		else return true;
		
	});
}



function getBotName(){
	var names = ['candybot','tenderbot','hug-a-tron','bad-touch-2000'];
	var name = names[Math.floor(Math.random()*names.length)];
	return name;

}


return service;

}