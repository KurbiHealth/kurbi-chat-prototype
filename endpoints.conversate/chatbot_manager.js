module.exports = function(BASEURL,PORT,db){
	var serverURL = BASEURL;
	if(PORT && PORT != 80) serverURL = BASEURL + ":" + PORT;

	var KEEP_ALIVE_TIME = 1000*60*5;
	
	var io = require('socket.io-client');

	var service = {};

	var bots = {};


	service.requestBot = requestBot;
	service.connections = [];

	// setInterval(function(){
	// console.log('---- printing bot connections ----');
	// console.log(service.connections);
	// console.log('----------------------------------');
	// console.log('---- removing bots ---------------');
	// removeOldBots();
	// },KEEP_ALIVE_TIME);




	function requestBot(room,info){
		var domain = extractDomain(info.url);
		var bot = null;
		var chatData = {};

		chatData.roomKey = room;
		chatData.boxKey = info.key;

		loadRoom(chatData)
		.then(loadBox)
		.then(function(sessionData){
			//removeOldBots();
			console.log('sessionData',sessionData);
			//sessionData.box
			db.getBot(sessionData.box.owner).then(function(botInfo){

			if(!bots[room]) {
					bots[room] = {};
					bots[room].socket = io.connect('http://localhost:'+PORT, {forceNew:true});
					bots[room].lastMessage = new Date();
					
				var connection = bots[room];
				
				if(sessionData.room.bot) botInfo = sessionData.room.bot;
				
				console.log('bot info', botInfo);
				var bot = new getBot(connection, botInfo);
				console.log('============bot',bot);
				if(!sessionData.room.userVariables) sessionData.room.userVariables = {};
				var userVariables = sessionData.room.userVariables;
				console.log('loaded variables, ', userVariables);
				
				connection.socket.on('history', (data) => {
						if(!data || data.length == 0) {
							bot.reply({qCode:'welcome'}, userVariables, 1);
						}
					});
				
				connection.socket.on('start', () => { 
						bot.reply({qCode:'avatar'}, userVariables, 1);
						
					});

				connection.socket.on('message', function(data){
						//save any variables
						if(data.message.variable) {	userVariables[data.message.variable] = data.message.body.text; }
						bot.reply(data.message, userVariables);	
					});

				connection.socket.on('connect', function(){
					connection.socket.emit('join room', {'room':room, 'source':'bot'});
					sessionData.room.bot = botInfo;
					db.setChatRoom(sessionData.room);
				});

				connection.socket.on('disconnect', () => {
						delete bots[room];
					});

				service.connections.push(connection);
			}


			});


		});


	}

	function loadRoom(data){
		return new Promise(function(resolve,reject){
			db.getChatRoom({room:data.roomKey}).then((doc) => {
				data.room = doc;
				resolve(data);
			});
		});
	}

	function loadBox(data){
		return new Promise(function(resolve,reject){
			var query = {_id:data.boxKey};
			db.getChatBox(query).then((doc) => {
				data.box = doc;
				resolve(data);
			});
			
			
		});
	}

	function getBot(connection, botInfo){
		this.reply = reply;

				function reply(msg, userVariables, waitTime){
					if(!waitTime) waitTime = Math.floor(Math.random()*2500+1000);
					setTimeout(function(){
						if(msg) {
							getResponse(null,msg.qCode,botInfo,function(rawResponse){
								var response = runtimeReplace(rawResponse,userVariables);
								if(response) {
									connection.socket.emit('message', response);
									reply(response);
								}
							});
							
						}

					}, waitTime);
				}

				function getResponse(prompt,qcode,bot, callback){

					if(bot)
						db.getBotDialog({owner:bot.owner,name:bot.name,qcode:qcode}).then((doc)=>{callback(doc);});
					else 
						callback(require('../endpoints.chatbot/noPermission.js')('Kurbi Health Services',serverURL)[qcode]);
					

				}

				function runtimeReplace(data,variables){
					var temp = JSON.stringify(data);
						temp = temp.replace(/\[_(.+?)_\]/g, function(whole,variable){
							return variables[variable];
						});
					
					return JSON.parse(temp);
					
				}

	}


	function extractDomain(url) {
	    var domain;
	    //find & remove protocol (http, ftp, etc.) and get domain
	    if (url.indexOf("://") > -1) {
	        domain = url.split('/')[2];
	    }
	    else {
	        domain = url.split('/')[0];
	    }

	    //find & remove port number
	    domain = domain.split(':')[0];

	    return domain;
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