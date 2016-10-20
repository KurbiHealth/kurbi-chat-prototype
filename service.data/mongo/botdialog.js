module.exports = function(service) {
	
	var BotDialog = require('./schemas.mongoose/botDialogSchema');
	service.getBotDialog = getBotDialog;
	service.getBotDialogs = getBotDialogs;
	service.setBotDialog = setBotDialog;
	service.createBotDialog = createBotDialog;



function getBotDialog(query){
  return new Promise(function(resolve,reject){
		BotDialog.findOne(query, function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	
  });
	

}

function getBotDialogs(query){
  return new Promise(function(resolve,reject){
		BotDialog.find(query, function(err,docs){
			if(err) reject(err);
			else resolve(docs);
		});
	
  });
	

}

function createBotDialog(input){
	return new Promise(function(resolve,reject){
		var bd = new BotDialog(input, false);
		bd.save(function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	});
}

function setBotDialog(input){
	return new Promise(function(resolve,reject){
		BotDialog.findOne(input, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) doc = new BotDialog(input,false);
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

    
 