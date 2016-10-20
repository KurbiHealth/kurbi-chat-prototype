module.exports = function(service,db) {
	
	service.getChatRoom = getChatRoom;
	service.getChatRooms = getChatRooms;
	service.setChatRoom = setChatRoom;
	service.setChatRoom = setChatRoom;

function getChatRoom(input){
	console.log('in getChatRoom()');
	return new Promise(function(resolve,reject){
  		
  		db.Object('chatroom').get({room:input.room}).then(function(doc){
  			doc = JSON.parse(doc);
  			resolve(doc.data[0]);
  		},function(err){
  			reject(err);
  		});
	
  });

}

function getChatRooms(query){
	console.log('in getChatRooms()');
	return new Promise(function(resolve,reject){
		
  		db.Object('chatroom').get(query,function(err,docs){
  			if(err) reject(err);
  			else{
  				docs = JSON.parse(docs);
  				resolve(docs.data);
  			}
  		});
	
  });

}

function createChatRoom(input){
	console.log('in createChatRoom()');
	return new Promise(function(resolve,reject){

		db.Object('chatroom').get({room: input.room},function(err,doc){
			if(err) reject(err);
			else{
				doc = JSON.parse(doc);
				if(!doc.data){
					db.Object('chatroom').save(input,function(err,doc){
						if(err) reject(err);
						else{
							doc = JSON.parse(doc);
							resolve(doc);
						}
					});
				}else{
					resolve(doc.data[0]);
				}
			}
		});

	});
}


function setChatRoom(input){
	console.log('in setChatRoom()');
	return new Promise(function(resolve,reject){
		var chatroom = {
			'url': input.url,
			'room': input.room,
			'key': input.key,
			'sessionID': input.sessionID,
			'parent_chatbox': input.key,
		}
		db.Object('chatroom').get({room:chatroom.room}, function(err,doc){
			console.log('getting chatroom with room,',chatroom.room,'err:',err);
			if(err) reject(err);
			else {
				doc = JSON.parse(doc);
				console.log('chatroom doc',doc);
				if(doc.data.length == 0){
					console.log('chatroom not found');
					db.Object('chatroom').save(chatroom,function(err,doc){
						console.log('created chatroom, err:',err);
						if(err) reject(err)
						else{
							doc = JSON.parse(doc);
							resolve(doc);
						}
					});
				}else resolve(doc.data[0]);
			}
		});
	});
}

} // end exports

