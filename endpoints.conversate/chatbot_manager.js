module.exports = function(BASEURL,PORT,db){
	var serverURL = BASEURL;
	if(PORT && PORT != 80) serverURL = BASEURL + ":" + PORT;

	var KEEP_ALIVE_TIME = 1000*60*5;
	
	var io = require('socket.io-client');

	var service = {};

	var bots = {};
	var documents = require('../service.documents/main.js');

	service.requestBot = requestBot;
	service.connections = [];

	function requestBot(room,info){
		var domain = extractDomain(info.url);
		var bot = null;
		var chatData = {};
		var botSessionId = makeKey();

		chatData.roomKey = room;
		chatData.boxKey = info.key;
		
		log('Creating Bot', {sessionID:botSessionId});
		loadRoom(chatData)
		.then(loadBox)
		.then(function(sessionData){
			//removeOldBots();
			//sessionData.box
			db.getBot(sessionData.box).then(function(botInfo){
			console.log(botInfo);
			if(!bots[room]) {
					bots[room] = {};
					bots[room].socket = io.connect('http://localhost:'+PORT, {forceNew:true, query:{'sessionID':botSessionId}});
					bots[room].lastMessage = new Date();
					
				var connection = bots[room];
				if(sessionData.room.bot) botInfo = sessionData.room.bot;
				
				var bot = new getBot(connection, botInfo);
				if(!sessionData.room.userVariables) sessionData.room.userVariables = {};
				var userVariables = sessionData.room.userVariables;
				
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
					documents('charlie','be gone',userVariables);
					
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
								if(Object.keys(response).length === 0 && response.constructor === Object) response = null;
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
						callback(require('../endpoints.chatbot/noPermission-mawc-1.js')('Kurbi Health Services',serverURL)[qcode]);
					

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

	function makeKey(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 16; i++ )
		    text += possible.charAt(Math.floor(Math.random() * possible.length));
		
		return text;	
	}

	return service;

}