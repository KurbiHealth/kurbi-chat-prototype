module.exports = function(service) {
	
	var BotDialog = require('./schemas.mongoose/botDialogSchema');
	service.getBotDialog = getBotDialog;
	service.getBotDialogs = getBotDialogs;
	// service.setBotDialog = setBotDialog;
	service.createBotDialog = createBotDialog;



function getBotDialog(query){
  return new Promise(function(resolve,reject){
		BotDialog.findOne(query, function(err,doc){
			if(err) reject(err);
			else {
				if(doc) resolve(doc);
				else resolve({});
				}
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

// function createBotDialog(input){
// 	return new Promise(function(resolve,reject){
// 		var bd = new BotDialog(input, false);
// 		bd.save(function(err,doc){
// 			if(err) reject(err);
// 			else resolve(doc);
// 		});
// 	});
// }

function createBotDialog(input){
	return new Promise(function(resolve,reject){
		BotDialog.remove({
						qCode:input.qCode,
						owner:input.owner,
						name:input.name,
						version:input.version
					}, 
		function(err){
			if(err) reject(err);
			else{
				console.log('deleted successfully');
				console.log('writing', input);
				var doc = new BotDialog(input,false);
				doc.save();
				resolve(doc);
			}
		});
	});	
}

} // end exports

    
 