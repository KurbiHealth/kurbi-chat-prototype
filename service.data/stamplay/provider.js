module.exports = function(service,db) {

	service.getProvider = getProvider;
	service.getProviders = getProviders;
	service.setProvider = setProvider;
    service.createProvider = createProvider;



function getProvider(input){
  return new Promise(function(resolve,reject){

  		db.User.get({email: input.email},function(err,doc){
  			if(err) reject(err);
  			else{
  				resolve(doc.data[0]);
  			}
  		});
	
  });
}


function getProviders(query){
  return new Promise(function(resolve,reject){

  		db.User.get(query,function(err,docs){
  			if(err) reject(err);
			else resolve(docs);
  		});
	
  });
}


function createProvider(input){
	return new Promise(function(resolve,reject){

		db.User.get({email: input.email},function(err,doc){
			if(err){reject(err);}
			else{
console.log('doc in service.data/stamplay/provider.js',doc);
				if(doc.data && doc.data.length > 0){
					resolve(doc.data[0]);
				}else{
					// create new user
					var data = {
						"email": input.email,
						//"password": crypto.createHash(userRecords[roomId]['email']),
						"password": "botpassword",
						"role": input.role,
						"enabled": input.enabled,
						"chatboxes": input.chatboxes
					};
					db.User
					.save(data,function(err,doc){
						if(err){return console.log('error saving user, error:',err);}
						resolve(doc.data[0]);
					});
				}
			}
		});

	});
}


function setProvider(input){
	return new Promise(function(resolve,reject){
		
		db.User.get({email: input.email},function(err,doc){
			if(err){reject(err);}
			else{
				// if(!doc.data || doc.data.length == 0){
				// 	// create new user
				// 	var data = {
				// 		"email": input.email,
				// 		//"password": crypto.createHash(userRecords[roomId]['email']),
				// 		"password": "botpassword",
				// 		"role": input.role,
				// 		"enabled": input.enabled,
				// 		"chatboxes": input.chatboxes
				// 	};
				// 	db.User
				// 	.save(data,function(err,doc){
				// 		if(err){return console.log('error saving user, error:',err);}
				// 		resolve(doc.data[0]);
				// 	});
				// }else{
					// overwrite existing user
					var data = {
						// "email": input.email,
						//"password": crypto.createHash(userRecords[roomId]['email']),
						"password": input.password,
						"role": input.role,
						"enabled": input.enabled,
						"chatboxes": input.chatboxes
					};
					console.log('saving user', doc);
					db.User
					.update(doc.data[0]._id, data, function(err,doc){
						if(err){return console.log('error saving user, error:',err);}
						console.log('much success');
						resolve(doc);
					});
				// }
			}
		});

	});
}

} // end exports