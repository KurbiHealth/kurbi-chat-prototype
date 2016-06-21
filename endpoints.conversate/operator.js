module.exports = function(io,DATASOURCE,express,BASEURL,PORT,db){

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

	var mongoose  						= require('mongoose');

	if(DATASOURCE == 'mongodb'){
		var ChatRoom 					= require('../schemas.mongoose/chatRoomSchema');
	}

	var KingBot							= require('./chatbot_manager')(DATASOURCE,BASEURL,PORT);

	var rooms = {};						//list of active rooms
	var checkRooms = [];				//list of rooms that might be empty (and need their bots removed)

//we need a mechanism to disconnect the bots when all the humans have
//left the channel.  
//so there will be a task runner that looks through empty rooms
//and if there are no people in them, it disconnects the bots. 
//for now it's setInterval

	//setInterval(clearRooms, 1000*60*5);

	function clearRooms(){
		console.log('--------clearing empty rooms');
		var emptyRooms = checkRooms.filter((room) => {		
			//assumes room is empty, if it finds a patient, 
			//it means the room is not empty - so don't add it
			//to the list of rooms that are empty and need to be cleared
			return rooms[room].reduce((isEmpty, client) => {
						if(!isEmpty) return false;
						if(client.source == 'patient') return false;
						return true;
					}, true);
		});
		emptyRooms.forEach((room) => {
			rooms[room].forEach(client => client.disconnect());
			delete rooms[room];
		});

		checkRooms = [];
	}

	io.on('connect', function(socket){

		socket.on('register', function(info){
			console.log('-------registering');
			var room = getRoom(info.sessionID,info.url,info.key);
			if(!rooms[room]) {
				createRoom(room, info);	
				KingBot.requestBot(room,info);
				}
			socket.source = 'patient';
			joinRoom(room);
		});

		socket.on('join room', function(data){
			console.log('-------joining room');
			var room = data.room;
			socket.source = data.source;

			if(!rooms[room]) rooms[room] = [];
			rooms[room].push(socket);
			joinRoom(room);
		});

		socket.on('start', function(){
			console.log('--------starting');
			socket.broadcast.to(socket.room).emit('start');
		});

		socket.on('message', function(data){
			console.log('--------message: ',JSON.stringify(data).substring(0,20));
			data.source = socket.source;
			socket.broadcast.to(socket.room).emit('message',data);
			logChat(data,socket.room);
		});

		socket.on('disconnect', function(){
			console.log('disconnecting: ' + socket.source, socket.id);
			if(socket.source == 'patient') checkRooms.push(socket.room);
		});


		function joinRoom(room){
			console.log('-------in joinRoom()');
			socket.room = room;
			socket.join(room);
			getChatHistory();

		}

		function createRoom(room,info){
console.log('-------running createRoom()');
			if(DATASOURCE == 'mongodb'){
				chatroom = new ChatRoom();
				chatroom.url = info.url;
				chatroom.room = room;
				chatroom.key = info.key;
				chatroom.sessionID = info.sessionID;
				chatroom.save();
			}else if(DATASOURCE == 'stamplay'){
				var chatroom = {
					'url': info.url,
					'room': room,
					'key': info.key,
					'sessionID': info.sessionID
				}
				db.Object('chatroom').get({room: room},function(err,result){
					if(err) return console.log(err);
					result = JSON.parse(result);
					console.log('--result.data.length: ',result.data.length);
					if(result.data.length == 0){
						console.log('--creating new room',chatroom);
						db.Object("chatroom")
						.save(chatroom, function(err,success) {
							if(err) return console.log('--ERROR unable to create a room: ',err);
							console.log('--successfully created room: ',success);
						});
					}else{
						console.log('--room already existed');
					}
				})
			}
		}


		function logChat(message, room){
			if(DATASOURCE == 'mongodb'){
				ChatRoom.findOne({'room':room}).then(function(chatroom){
					chatroom.messages.push(message);
					chatroom.save();
				});
			}else if(DATASOURCE == 'stamplay'){
				console.log('room id: ',room);
				db.Object("chatroom")
				.get({room: room},function(err,result){
					if(err) return console.log(err);
					result = JSON.parse(result);
					if(result.data.length == 0){
						return console.log('ERROR: unable to load room to log a chat');
					}else{
						var roomId = result.data[0].id;
						var messages = result.data[0].messages || [];
						if(typeof message == 'object')
							message = JSON.stringify(message);
						messages.push(message);
						db.Object("chatroom").patch(roomId,{messages: messages},function(err,success){
							if(err) 
								console.log('ERROR logChat(): ',err);
							else 
								console.log('message logged to room successfully');
						});
					}
				});
			}
		}

		function getChatHistory(){
			if(DATASOURCE == 'mongodb'){
				ChatRoom.findOne({'room':socket.room}).then(function(chatroom){
					io.to(socket.id).emit('history', chatroom.messages);
				});
			}else if(DATASOURCE == 'stamplay'){
				console.log('-------in getChatHistory() -- DATASOURCE==stamplay');
				db.Object("chatroom")
				.get({room: socket.room},function(err,result){
					result = JSON.parse(result);
					console.log('--loaded ' + result.data.length + ' chatRoom records from stamplay');
					if(result.data[0]){
						var messages = result.data[0].messages || [];
					}else{
						var messages = [];
					}
					if(messages.length > 0){
						messages = messages.map(function(e){
							return JSON.parse(e);
						});
					}
					console.log('--var messages is ',typeof messages,', and length: ' + messages.length + ', and first message is type: '+ typeof messages[0]);
					io.to(socket.id).emit('history', messages);
				});
			}
		}

	}); /// end of io.on

	function getRoom(id,url,key){
		var string = id + url + key;
		return require('crypto').createHash('md5').update(string).digest("hex");
	}

}