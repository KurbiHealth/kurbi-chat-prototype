module.exports = function(io,express,BASEURL,PORT,db){

// SOCKET CHEAT SHEET
// // sending to sender-client only
//  socket.emit('message', "this is a test");

//  // sending to all clients, include sender
//  io.emit('message', "this is a test");

//  // sending to all clients except sender
//  socket.broadcast.emit('message', "this is a test");

//  // sending to all clients in 'game' room(channel) except sender
//  socket.broadcast.to('game').emit('message', 'nice game');

//  // sending to all clients in 'game' room(channel), include sender
//  io.in('game').emit('message', 'cool game');

//  // sending to sender client, only if they are in 'game' room(channel)
//  socket.to('game').emit('message', 'enjoy the game');

//  // sending to all clients in namespace 'myNamespace', include sender
//  io.of('myNamespace').emit('message', 'gg');

//  // sending to individual socketid
//  socket.broadcast.to(socketid).emit('message', 'for your eyes only');

	var KingBot							= require('./chatbot_manager')(BASEURL,PORT,db);

	var crypto 							= require('crypto');

	// https://github.com/nodemailer/nodemailer
	var nodemailer = require('nodemailer');
	var smtpTransport = require('nodemailer-smtp-transport');

	var rooms = {};						//list of active rooms
	var checkRooms = [];				//list of rooms that might be empty (and need their bots removed)
	var roomVars = {};					//will hold the user variables that are detected during chat.
	var BOT_WAIT_TIME = 15000; 			//how long a bot will wait after a client has disconnected, before leaving the room.			


	function clearRooms(){

		var emptyRooms = checkRooms.filter((room) => {		
			//assumes room is empty, if it finds a patient, 
			//it means the room is not empty - so don't add it
			//to the list of rooms that are empty and need to be cleared
			return rooms[room].reduce((isEmpty, client) => {
						if(!isEmpty) return false;
						if(client.source == 'patient' && client.connected) return false;
						return true;
					}, true);
		});
		emptyRooms.forEach((room) => {
			if(rooms && rooms[room]) rooms[room].forEach(client => {	if(client.connected) client.disconnect(); });
			delete rooms[room];
			delete roomVars[room];
			// delete userRecords[room];
		});

		checkRooms = [];
	}

	io.on('connect', function(socket){
		// THIS EVENT ('register') IS EMITTED BY THE CHATBOX WHEN IT LOADS 
		// (/endpoints.createchatbox/templates/js/chat_template.js)

		socket.on('register', function(info){
			//info.key (chatbox key)
			//info.sessionId (chat session token, this changes when a new chat is made)
			//info.url (url that the snippet is embedded in)
			//info.icon (image the user chose to represent them)
			var roomName = generateRoomName(info.sessionID,info.url,info.key);


			// createUserRecord(room);
			// userRecords[room]['chatboxId'] = info.key;
			loadRoom(roomName,info).then(function(room){

				roomVars[roomName] = room.userVariables || {};
				KingBot.requestBot(roomName,info);    //this should be idempotent - bot wont join if he's already in this room.
				socket.source = 'patient';
				joinRoom(roomName);
			});
			
			
		});

		socket.on('join room', function(data){
			var room = data.room;
			socket.source = data.source;
			joinRoom(room);
		});

		socket.on('start', function(){
			socket.broadcast.to(socket.room).emit('start');
		});

		socket.on('message', function(data){
			data.source = socket.source;
			//checkForUserData(data,socket.room);
			if(data.message.variable) {	roomVars[socket.room][data.message.variable] = data.message.body.text; }
			var currentMessage = OperatorRuntimeReplace(data,roomVars[socket.room]);
			socket.broadcast.to(socket.room).emit('message', currentMessage);
			logChat(currentMessage,roomVars[socket.room],socket.room);
		});

		socket.on('disconnect', function(){
			if(socket.source == 'patient') {
				checkRooms.push(socket.room);
				setTimeout(clearRooms,BOT_WAIT_TIME);

				}
		});


		function OperatorRuntimeReplace(data,variables){
			var temp = JSON.stringify(data);
				temp = temp.replace(/\$_(.+?)_\$/g, function(whole,variable){
					return variables[variable];
				});
			
			return JSON.parse(temp);
			
		}


		function joinRoom(room){
			if(!rooms[room]) rooms[room] = [];
			rooms[room].push(socket);
			socket.room = room;
			socket.join(room);
			getChatHistory();

		}

		function loadRoom(roomId,info){
			return new Promise(function(resolve,reject){
				var chatroom = {};
					chatroom.url = info.url;
					chatroom.room = roomId;
					chatroom.key = info.key;
					chatroom.sessionID = info.sessionID;
				db.setChatRoom(chatroom).then((doc)=>resolve(doc));


				});
			}


		function logChat(message, userVars, room){
			db.getChatRoom({room:room}).then(function(chatroom){
				if(!chatroom.messages) 
					chatroom.messages = [];
				
				chatroom.messages.push(message);
				chatroom.userVariables = userVars;
				db.setChatRoom(chatroom);
			});

		}

		function getChatHistory(){
			db.getChatRoom({room:socket.room}).then((chatroom) => { io.to(socket.id).emit('history',chatroom.messages)});
		}

	}); /// end of io.on




	function generateRoomName(id,url,key){
		var string = id + url + key;
		return require('crypto').createHash('md5').update(string).digest("hex");
	}

	// https://www.paubox.com/blog/api-documentation
	var transporter = nodemailer.createTransport(smtpTransport({
	  "port": 587,
	  "host": "api.paubox.com",
	  "auth": {
	    "user": "user@api.paubox.com",
	    "pass": "password"
	  },
	  "tls": {
	    "rejectUnauthorized": false
	  }
	}));
	
	function sendHipaaEmail(userAddress,headline){
		var emailHtmlTemplate = require('./userWelcomeEmailHtmlTemplate.html');
		var emailTextTemplate = require('./userWelcomeEmailTextTemplate.html');
		var fromAddress = '';
		var subject = headline;

		transporter.sendMail({
			from: fromAddress,
			to: userAddress,
			subject: subject,
			html: emailHtmlTemplate,
			text: emailTextTemplate
			// etc
		}, function (err) {
			// error handling
		});
	}

}