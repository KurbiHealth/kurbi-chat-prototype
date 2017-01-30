module.exports = function(service,db) {
	
	service.getChatStyle = getChatStyle;
	service.getChatStyles = getChatStyles;
	service.setChatStyle = setChatStyle;
	service.createChatStyle = createChatStyle;

function getChatStyle(query){
	// console.log('in getChatStyle()');
	return new Promise(function(resolve,reject){
  		db.Object('chatstyle').get(query,function(err,doc){
  			if(err) reject(err);
  			else{
  				if(typeof doc == 'string')
  					doc = JSON.parse(doc);
  				if(doc.data){
  					var length = doc.data.length;
  					if(length > 0){
  						resolve(doc.data[0]);
  					}else{
  						resolve('no styles found');
  					}
  				}
  			}
  		});	
	});
	
}

function getChatStyles(query){
  return new Promise(function(resolve,reject){

  		db.Object('chatstyle').get(query,function(err,docs){
  			if(err) reject(err);
  			else{
  				resolve(docs.data);
  			}
  		});
	
  });
	
}

function createChatStyle(input){
	return new Promise(function(resolve,reject){

		db.Object('chatstyle').save(input,function(err,doc){
			if(err) reject(err);
			else{
				resolve(doc);
			}
		});

	});
}

function setChatStyle(input){

	return new Promise(function(resolve,reject){

		db.Object('chatstyle').get({id: input.owner},function(err,doc){
			if(err) reject(err);
			else{
				if(doc.data.length == 0){
					// create new
					db.Object('chatstyle').save(input,function(err,doc){
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

