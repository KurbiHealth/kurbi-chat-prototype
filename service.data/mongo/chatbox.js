module.exports = function(service) {
	
	var ChatBox = require('./schemas.mongoose/chatBoxSchema');
	service.getChatBox = getChatBox;
	service.getChatBoxes = getChatBoxes;
	service.setChatBox = setChatBox;
	service.createChatBox = createChatBox;
	service.getStyle = getStyle;
	service.getBot = getBot;


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
		var cb = new ChatBox(input);
		cb.save(function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	});
}

function setChatBox(input){
	return new Promise(function(resolve,reject){
		ChatBox.findOne({_id:input._id}, function(err,doc){
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

function getStyle(styles){
	var index = Math.floor(Math.random(styles.length));
	return styles[index];
}

function getBot(box){
	var that = this;
	return box.getBot();
	// return new Promise(function(resolve,reject){
	// ChatBot.find({owner:that.owner}, function(err, docs){
	// 	if(err) reject(err);
	// 	var bot = {};
	// 	var index = Math.floor(Math.random()*docs.length);
		
	// 	bot.owner = docs[index].owner;
	// 	bot.name = docs[index].name;
	// 	console.log(index,bot.name);
	// 	resolve(bot);
	// })
	// });
}

} // end exports

    
 