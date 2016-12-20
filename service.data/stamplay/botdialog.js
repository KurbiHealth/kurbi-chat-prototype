module.exports = function(service,db) {

	// NOTE: the "stuff" field holds random crap, but needs moving up the chain
	// to the return object - Matt Eckman 10/18/2016
	
	service.getBotDialog = getBotDialog;
	service.createBotDialog = createBotDialog;


function getBotDialog(query){
	// if(query.owner){
	// 	query.user_owner = query.owner;
	// 	delete query.owner;
	// }
	return new Promise(function(resolve,reject){
		
  		db.Object('botdialog').get(query,function(err,doc){
  			if(err) reject(err);
  			else{
  				
  				doc = doc.data[0];
  				if(doc) {
  					_unpack(doc);
	  				if(doc.user_owner){
	  					doc.owner = doc.user_owner;
	  				}
  				} else doc = {};
  				resolve(doc);
  			}
  		});
	
  });
}

function createBotDialog(input){
	return new Promise(function(resolve,reject){
		
		var data = {
			owner: input.owner,
			name: input.name,
			version: input.version,
			qcode: input.qcode
		};
		
		delete input.owner;
		delete input.name;
		delete input.version;
		delete input.qcode;

		data.stuff = input;
		
		db.Object('botdialog').save(data,function(err,doc){
			if(err) reject(err);
			else{
				
				doc = doc.data[0];
				_unpack(doc);
				resolve(doc);
			}
		});

	});
}

function _unpack(input){
	if(input.stuff){
		Object.keys(input.stuff).forEach((key) => {
			input[key] = input.stuff[key];
		});
		delete input.stuff;
	}
}

} // end exports

    
 