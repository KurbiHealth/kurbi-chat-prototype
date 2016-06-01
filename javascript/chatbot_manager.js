module.exports = function(){
var KEEP_ALIVE_TIME = 1000*60*5;
var io = require('socket.io-client');
var Bot = require('./chatbotSchema.js');

var service = {};
var responses = require('./responses.js')('Madison Area Wellness Collective');
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

	connection.socket.on('connect', function(){
		console.log('connecting bot');
		connection.socket.emit('join room', {'room':room, 'source':'bot'});
		connection.socket.emit('message', responses['welcome']);	
		connection.socket.on('start', () => { connection.socket.emit('message', responses['avatar']) });
		connection.socket.on('message', function(data){
			console.log(data);
			reply(data.message);	
		});

		function reply(msg){
			var waitTime = Math.floor(Math.random()*2500+1000);
			setTimeout(function(){


				console.log('replying to,', msg);
				if(responses[msg.qCode]) {
				console.log('chosen response:', responses[msg.qCode]);
				connection.socket.emit('message',responses[msg.qCode]);
				reply(responses[msg.qCode].message);
				}

			}, waitTime);
			
		}


	});

	service.connections.push(connection);
	
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





return service;

}