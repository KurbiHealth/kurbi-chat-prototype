module.exports = function(service,db) {
	

	service.getChatRoom = getChatRoom;
	service.setChatRoom = setChatRoom;




function getChatRoom(input){
  return new Promise(function(resolve,reject){
  		db.Object('chatroom').get({room:input.room}).then(function(doc){
  			resolve(doc);
  		},function(err){
  			reject(err);
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
						result = JSON.parse(result);
						if(result.data.length == 0){
							db.Object('chatroom').save(chatroom).then(function(res){resolve(JSON.parse(res))});
						}else resolve(result);
					}
				});
	});
}

} // end exports


//the logging code:
// if(DATASOURCE == 'stamplay'){
// //console.log('room id: ',room);
// 				db.Object("chatroom")
// 				.get({room: room},function(err,result){
// 					if(err) return console.log(err);
// 					result = JSON.parse(result);
// 					if(result.data.length == 0){
// 						return console.log('ERROR: unable to load room to log a chat');
// 					}else{
// 						var roomId = result.data[0].id;
// 						var messages = result.data[0].messages || [];
// 						if(typeof message == 'object')
// 							message = JSON.stringify(message);
// 						messages.push(message);
// 						db.Object("chatroom").patch(roomId,{messages: messages},function(err,success){
// 							if(err) 
// 								console.log('ERROR logChat(): ',err);
// 							else 
// 								console.log('message logged to room successfully');
// 						});
// 					}
// 				});
// 			}

//getting the history
// 			else if(DATASOURCE == 'stamplay'){
// //console.log('-------in getChatHistory() -- DATASOURCE==stamplay');
// 				db.Object("chatroom")
// 				.get({room: socket.room},function(err,result){
// 					result = JSON.parse(result);
// //console.log('--loaded ' + result.data.length + ' chatRoom records from stamplay');
// 					if(result.data[0]){
// 						var messages = result.data[0].messages || [];
// 					}else{
// 						var messages = [];
// 					}
// 					if(messages.length > 0){
// 						messages = messages.map(function(e){
// 							return JSON.parse(e);
// 						});
// 					}
// //console.log('--var messages is ',typeof messages,', and length: ' + messages.length + ', and first message is type: '+ typeof messages[0]);
// 					io.to(socket.id).emit('history', messages);
// 				});
// 			}