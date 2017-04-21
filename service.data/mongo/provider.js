module.exports = function(service) {


	var Provider = require('./schemas.mongoose/providerSchema');
	service.getProvider = getProvider;
	service.getProviders = getProviders;
	service.setProvider = setProvider;
    service.createProvider = createProvider;



function getProvider(input){
  return new Promise(function(resolve,reject){
		Provider.findOne({email:input.email}, function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		});
	
  });
	

}


function getProviders(query){
  return new Promise(function(resolve,reject){
		Provider.find(query, function(err,docs){
			if(err) reject(err);
			else resolve({data:docs});
		});
	
  });
	

}


function createProvider(input){
	return new Promise(function(resolve,reject){

		Provider.findOne({email:input.email}, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) {
					doc = new Provider();
					doc.email = input.email;
					doc.role = input.role;
					doc.enabled = input.enabled;
					doc.chatboxes = input.chatboxes;
					doc.save();
				}
				resolve(doc);
			}
		});
	});
}

function setProvider(input){
	return new Promise(function(resolve,reject){
		Provider.findOne({email:input.email}, function(err,doc){
			if(err) reject(err);
			else{
				if(!doc) doc = new Provider();

				doc.email = input.email;
				doc.role = input.role;
				doc.enabled = input.enabled;
				doc.chatboxes = input.chatboxes;
				doc.save();
			
				resolve(doc);
			}
		});
	});
}

} // end exports