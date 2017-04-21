module.exports = function(service) {
	
	var ChatBot = require('./schemas.mongoose/chatbotSchema');
	var BotDialog = require('./schemas.mongoose/botDialogSchema');
	service.getChatBot = getChatBot;
	service.getChatBots = getChatBots;
	service.deleteChatBot = deleteChatBot;
	// service.setChatBot = setChatBot;
	service.createChatBot = createChatBot;




function getChatBot(query){
  return new Promise(function(resolve,reject){
		ChatBot.findOne(query, function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	
  });


	

}

function getChatBots(query){
  return new Promise(function(resolve,reject){
		ChatBot.find(query, function(err,docs){
			if(err) reject(err);
			else resolve(docs);
		});
	
  });


}
function deleteChatBot(query){
	return new Promise(function(resolve,reject){

		BotDialog.remove({owner:query.owner, name:query.name}, function(err,removed){
			if(err) reject(err);
			else
			ChatBot.remove({owner:query.owner, name:query.name}, function(err, removed){
				if(err) reject(err);
				else resolve();
			});	
		});
		
	});
}
	



// function createChatBot(input){
// 	return new Promise(function(resolve,reject){
// 		console.log("creating, ", input);
// 		var cb = new ChatBot(input);
// 		cb.save(function(err,doc){
// 			if(err) reject(err);
// 			else resolve(doc);
// 		});
		
// 	});
// }

function createChatBot(input){
	return new Promise(function(resolve,reject){
		ChatBot.findOne(input, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) doc = new ChatBot(input);
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

    
 