module.exports = function(service,db) {

	// NOTE: the "stuff" field holds random crap, but needs moving up the chain
	// to the return object - Matt Eckman 10/18/2016
	
	service.getBotDialog = getBotDialog;
	service.createBotDialog = createBotDialog;


function getBotDialog(query){
	console.log('in getBotDialog(), query: ',query);
	return new Promise(function(resolve,reject){
  		db.Object('botdialog').get(query,function(err,doc){
  			console.log('botdialog.get, err:',err,',doc: ',doc);
  			if(err) reject(err);
  			else{
  				doc = JSON.parse(doc);
  				doc = doc.data[0];
  				_unpack(doc);
  				resolve(doc);
  			}
  		});
	
  });
}

function createBotDialog(input){
	console.log('in createBotDialog()');
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
				doc = JSON.parse(doc);
				doc = doc.data[0];
				_unpack(doc);
				resolve(doc);
			}
		});

	});
}

function _unpack(input){
	Object.keys(input.stuff).forEach((key) => {
		input[key] = input.stuff[key];
	});
	delete input.stuff;
}

} // end exports

    
 