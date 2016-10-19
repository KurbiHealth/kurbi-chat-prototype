module.exports = function(service,db) {
	
	service.getChatRoom = getChatRoom;
	service.getChatRooms = getChatRooms;
	service.setChatRoom = setChatRoom;
	service.setChatRoom = setChatRoom;

function getChatRoom(input){
	
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
							resolve(doc.data[0]);
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
	return new Promise(function(resolve,reject){
		var chatroom = {
			'url': input.url,
			'room': input.room,
			'key': input.key,
			'sessionID': input.sessionID,
			'parent_chatbox': input.key,
		}
		db.Object('chatroom').get({room:chatroom.room}, function(err,doc){
			if(err) reject(err);
			else {
				doc = JSON.parse(doc);
				if(doc.data.length == 0){
					db.Object('chatroom').save(chatroom)
					.then(function(res){
						res = JSON.parse(res);
						resolve(res.data[0]);
					});
				}else resolve(doc.data[0]);
			}
		});
	});
}

} // end exports
