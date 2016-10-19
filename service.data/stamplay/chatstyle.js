module.exports = function(service,db) {
	
	service.getChatStyle = getChatStyle;
	service.getChatStyles = getChatStyles;
	service.setChatStyle = setChatStyle;
	service.createChatStyle = createChatStyle;

function getChatStyle(query){

  return new Promise(function(resolve,reject){

  		db.Object('chatstyle').get(query,function(err,doc){
  			if(err) reject(err);
  			else{
  				doc = JSON.parse(doc);
  				resolve(doc.data[0]);
  			}
  		});
	
  });
	
}

function getChatStyles(query){
  return new Promise(function(resolve,reject){

  		db.Object('chatstyle').get(query,function(err,docs){
  			if(err) reject(err);
  			else{
  				docs = JSON.parse(docs);
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
				doc = JSON.parse(doc);
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
				doc = JSON.parse(doc);
				if(doc.data.length == 0){
					// create new
					db.Object('chatstyle').save(input,function(err,doc){
						if(err) reject(err);
						else{
							doc = JSON.parse(doc);
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

