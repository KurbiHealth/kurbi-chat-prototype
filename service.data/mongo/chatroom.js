module.exports = function(service) {
	
	var ChatRoom = require('./schemas.mongoose/chatRoomSchema');
	service.getChatRoom = getChatRoom;
	service.getChatRooms = getChatRooms;
	service.setChatRoom = setChatRoom;
	service.createChatRoom = createChatRoom;




function getChatRoom(input){
  return new Promise(function(resolve,reject){
		ChatRoom.findOne({room:input.room}, function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	
  });
	

}

function getChatRooms(query){
  return new Promise(function(resolve,reject){
		ChatRoom.find(query, function(err,docs){
			if(err) reject(err);
			else resolve(docs);
		});
	
  });
	

}

function createChatRoom(input){
	return new Promise(function(resolve,reject){
		ChatRoom.findOne({room:input.room}, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) {
					doc = new ChatRoom(input);
					doc.save();
				}
				resolve(doc);
			}
		});
	});
}

function setChatRoom(input){
	return new Promise(function(resolve,reject){
		ChatRoom.findOne({room:input.room}, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) doc = new ChatRoom(input);
				Object.keys(input).forEach((key) => {
					doc[key] = input[key];
				});
				doc.save();
				
				resolve(doc);
			}
		});
	});	
}

} // end exports

    
 