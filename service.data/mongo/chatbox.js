module.exports = function(service) {
	
	var ChatBox = require('./schemas.mongoose/chatBoxSchema');
	service.getChatBox = getChatBox;
	service.getChatBoxes = getChatBoxes;
	service.setChatBox = setChatBox;
	service.createChatBox = createChatBox;




function getChatBoxes(query){
  return new Promise(function(resolve,reject){
		ChatBox.find(query, function(err,docs){
			if(err) reject(err);
			else resolve(docs);
		});
	
  });
}

function getChatBox(query){
  return new Promise(function(resolve,reject){
		ChatBox.findOne(query, function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	
  });
}

function createChatBox(input){
	return new Promise(function(resolve,reject){
		ChatBox.findOne(input, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) {
					doc = new ChatBox(input);
					doc.save();
				}
				resolve(doc);
			}
		});
	});
}

function setChatBox(input){
	return new Promise(function(resolve,reject){
		ChatBox.findOne(input, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) doc = new ChatBox(input);
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

    
 