module.exports = function(service) {
	
	var BotDialog = require('./schemas.mongoose/botDialogSchema');
	service.getBotDialog = getBotDialog;
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

function createBotDialog(input){
	return new Promise(function(resolve,reject){
		BotDialog.findOne(input, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) {
					doc = new BotDialog(input,false);
					doc.save();
				}
				resolve(doc);
			}
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

    
 