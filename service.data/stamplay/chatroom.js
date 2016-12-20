module.exports = function(service,db) {
	
	service.getChatRoom = getChatRoom;
	service.getChatRooms = getChatRooms;
	service.setChatRoom = setChatRoom;
	service.setChatRoom = setChatRoom;

function getChatRoom(input){
	return new Promise(function(resolve,reject){
  		db.Object('chatroom').get({room:input.room},function(err,doc){
  			if(err) reject(appError(err,{file:"chatroom.js", info:"stamplay api"}));
  			else{  				
  				doc = doc.data[0];

  				if(!doc.messages){
  					doc.messages = [];
  				}
  				resolve(doc);
  			}
  		});	
  });

}

function getChatRooms(query){
	return new Promise(function(resolve,reject){
		
  		db.Object('chatroom').get(query,function(err,docs){
  			if(err) reject(appError(err,{file:"chatroom.js", info:"stamplay api"}));
  			else{
  				resolve(docs.data);
  			}
  		});
	
  });

}

function createChatRoom(input){
	return new Promise(function(resolve,reject){

		db.Object('chatroom').get({room: input.room},function(err,doc){
			if(err) reject(appError(err,{file:"chatroom.js", info:"stamplay api"}));
			else{				
				if(!doc.data){
					db.Object('chatroom').save(input,function(err,doc){
						if(err) reject(appError(err,{file:"chatroom.js", info:"stamplay api"}));
						else{							
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

	return new Promise(function(resolve,reject){
		var chatroom = {
			'url': input.url,
			'room': input.room,
			'key': input.key,
			'sessionID': input.sessionID,
			//'parent_chatbox': '["'+input.key+'"]',
		}
		db.Object('chatroom').get({room:chatroom.room}, function(err,doc){
			if(err) reject(appError(err,{file:"chatroom.js", info:"stamplay api"}));
			else {				
				if(doc.data.length == 0){
					db.Object('chatroom').save(chatroom,function(err,doc){
						if(err) reject(err);
						else{							
							resolve(doc);
						}
					});
				}else {
					db.Object('chatroom').patch(doc.data[0].id, {messages:input.messages}, function(err,new_doc){
						if(err) reject(appError(err,{file:"chatroom.js", info:"stamplay api"}));
							else{
								resolve(new_doc);
							}
					})
				}
			}
		});
	});
}

} // end exports

