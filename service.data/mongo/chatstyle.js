module.exports = function(service) {
	
	var ChatStyle = require('./schemas.mongoose/styleSchema');
	service.getChatStyle = getChatStyle;
	service.getChatStyles = getChatStyles;
	service.setChatStyle = setChatStyle;
	service.createChatStyle = createChatStyle;




function getChatStyle(query){
  return new Promise(function(resolve,reject){
		ChatStyle.findOne(query, function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	
  });
	

}

function getChatStyles(query){
  return new Promise(function(resolve,reject){
		ChatStyle.find(query, function(err,docs){
			if(err) reject(err);
			else resolve(docs);
		});
	
  });
	

}

function createChatStyle(input){
	return new Promise(function(resolve,reject){
		var cs = new ChatStyle(input);
		cs.save(function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	});
}

function setChatStyle(input){
	return new Promise(function(resolve,reject){
		ChatStyle.findOne(input, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) doc = new ChatStyle(input);
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

    
 