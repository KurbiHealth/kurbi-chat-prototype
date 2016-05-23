module.exports = function(io){


var express 						= require('express');
var mongoose  						= require('mongoose');

var ChatRoom 						= require('./chatRoomSchema');
var KingBot							= require('./chatbot_manager')();

var rooms = {};						//list of active rooms
var checkRooms = [];				//list of rooms that might be empty (and need their bots removed)

//we need a mechanism to disconnect the bots when all the humans have
//left the channel.  
//so there will be a task runner that looks through empty rooms
//and if there are no people in them, it disconnects the bots. 
//for now it's setInterval
setInterval(clearRooms, 1000*60*5);
function clearRooms(){
	console.log('clearing empty rooms');
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
		var room = getRoom(info.sessionID,info.url,info.key);
		if(!rooms[room]) {
			createRoom(room, info);	
			KingBot.requestBot(room,info);	
			}
		socket.source = 'patient';
		joinRoom(room);
	});

	socket.on('join room', function(data){
		var room = data.room;
		socket.source = data.source;

		if(!rooms[room]) rooms[room] = [];
		rooms[room].push(socket);
		joinRoom(room);
	});

	socket.on('message', function(data){
		data.source = socket.source;
		io.to(socket.room).emit('message',data);
		logChat(data,socket.room);
	});

	socket.on('disconnect', function(){
		console.log('disconnecting: ' + socket.source, socket.id);
		if(socket.source == 'patient') checkRooms.push(socket.room);
	});


	function joinRoom(room){
		socket.room = room;
		socket.join(room);
		getChatHistory();

	}

	function createRoom(room,info){
		chatroom = new ChatRoom();
		chatroom.url = info.url;
		chatroom.room = room;
		chatroom.key = info.key;
		chatroom.sessionID = info.sessionID;
		chatroom.save();
	}


	function logChat(message, room){
		ChatRoom.findOne({'room':room}).then(function(chatroom){
			chatroom.messages.push(message);
			chatroom.save();
		});
		
	}

	function getChatHistory(){
		ChatRoom.findOne({'room':socket.room}).then(function(chatroom){
			io.to(socket.id).emit('history', chatroom.messages);
		});
	}


	});
/// end of io.on

function getRoom(id,url,key){
	var string = id + url + key;
	return require('crypto').createHash('md5').update(string).digest("hex");
}


}