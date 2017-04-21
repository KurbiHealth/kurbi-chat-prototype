module.exports = function(service,db) {
	
	service.getChatBot = getChatBot;
	service.getChatBots = getChatBots;
	service.setChatBot = setChatBot;
	service.createChatBot = createChatBot;


function getChatBot(query){
  return new Promise(function(resolve,reject){

  		db.Object('chatbot').get(query,function(err,doc){
  			if(err) reject(err);
  			else{  		
  				resolve(doc.data[0]);
  			}
  		});
	
  });
}

function getChatBots(query){
  return new Promise(function(resolve,reject){

  		db.Object('chatbot').get(query,function(err,docs){
  			if(err) reject(err);
  			else{  		
  				resolve(docs.data);
  			}
  		});

  });
}

function createChatBot(input){
	return new Promise(function(resolve,reject){

		db.Object('chatbot').save(input,function(err,doc){
			if(err) reject(err);
			else{		
				resolve(doc);
			}
		});
		
	});
}

function setChatBot(input){
	return new Promise(function(resolve,reject){
		db.Object('chatbot').get({owner: input.owner, name: input.name},function(err,doc){
			if(err) reject(err);
			else{		
				if(doc.data.length == 0){
					// create new
					db.Object('chatbot').save(input,function(err,doc){
						if(err) reject(err);
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

} // end exports

    
 