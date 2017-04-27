module.exports = function(service,db) {
	
	service.getChatBox = getChatBox;
	service.getChatBoxes = getChatBoxes;
	service.setChatBox = setChatBox;
	service.createChatBox = createChatBox;
	service.getStyle = getStyle;
	service.getBot = getBot;

function getChatBoxes(query){
	_cleanApiFieldsForStamplay(query);
	return new Promise(function(resolve,reject){

  		db.Object('chatbox').get(query,function(err,docs){
  			if(err) reject(err);
			else{				
				docs = docs.data;
				// docs.forEach(function(doc){
				// 	_cleanStamplayFieldsForSave(doc);
				// });
				resolve(docs);
			}
  		});
	
  });
}

function getChatBox(query){
	console.log('getting chatbox')
	_cleanApiFieldsForStamplay(query);
	return new Promise(function(resolve,reject){
		console.log('using query', query);
		db.Object('chatbox').get(query,function(err,doc){
  			if(err) reject(err);

			else{				
				doc = doc.data[0];
				if(doc){
					_cleanStamplayFieldsForSave(doc);
					resolve(doc);	
				} else{
					resolve({});
				}
				
			}
  		});
	
  });
}

function createChatBox(input){
	_cleanApiFieldsForStamplay(input);
	return new Promise(function(resolve,reject){
		db.Object('chatbox').save(input,function(err,doc){
			if(err) reject(err);
			else{				
				_cleanStamplayFieldsForSave(doc);
				resolve(doc);
			}
		});
	});
}

function setChatBox(input){
	var box = JSON.parse(JSON.stringify(input));
console.log('in setChatBox, input:',box);
	
	_cleanApiFieldsForStamplay(box);

	return new Promise(function(resolve,reject){

		//_cleanStamplayFieldsForSave(box);
		var id = box._id;
		delete box._id;
		delete box.id;

		db.Object('chatbox').update(id,box,function(err,doc){
			if(err) reject(err);
			else resolve(doc);
		})
		// // if !input._id, create with input
		// if(!input._id){  console.log('line 66');
		// 	// create new chatbox
		// 	db.Object('chatbox').save(input,function(err,doc){
		// 		if(err) reject(err);
		// 		else{					
		// 			_cleanStamplayFieldsForSave(doc);
		// 			resolve(doc);
		// 		}
		// 	});
		// }else{  console.log('line 75');
		// 	var id = input._id;
		// 	delete input._id;
		// 	if(input.id) delete input.id;

		// 	// db.Object('chatbox').get({'id': id}).then(function(result){
		// 		// merge the existing record with new values
				
		// 		db.Object('chatbox').patch(id,input,function(err,doc){
								
		// 			if(err){
		// 				log('err',err);
		// 				reject(err);
		// 			}else{
		// 				_cleanStamplayFieldsForSave(doc);
		// 				resolve(doc);
		// 			}
		// 		});
		// 	// });
		// }
		
	});	
}

function getStyle(styles){
// console.log('styles: ',typeof styles, styles);
	if(typeof styles == 'string'){
		return styles;
	}
	var index = Math.floor(Math.random(styles.length));
	return styles[index];
}

function getBot(box){
	var owner = box.owner;
	var that = this;
	var index = Math.floor(Math.random()*box.bots.length);
	var chosenBot = box.bots[index];
	return new Promise(function(resolve,reject){
		console.log("owner", owner);
		console.log('bot', chosenBot);
		db.Object('chatbot').get({'owner': owner, 'name':chosenBot},function(err,docs){
			if(err) reject(err);
			else{
				console.log(docs);
				resolve(docs.data[0]);
			}
		});
	});
	
}

function _cleanApiFieldsForStamplay(input){
	return input;
	// clean owner
	// if(input.owner) input.user_owner = input.owner;
	// // delete input.owner;

	// // clean styles
	// if(input.styles){
	// 	//input.styles = ['5887b9882db6c92956a22c55'];
	// 	var styles = [];
	// 	if(typeof input.styles == 'string'){
	// 		// get rid of extra characters
	// 		styles = styles.replace(',','');
	// 		styles = styles.replace('\\','');
	// 		var temp = styles.split(',');
	// 		for(var i in temp){
	// 			styles.push(temp[i]);
	// 		}
	// 	}else{
	// 		for(var i in input.styles){
	// 			var temp = input.styles[i];
	// 			temp = temp.replace(',','');
	// 			temp = temp.replace('\\','');
	// 			styles.push(temp);
	// 		}
	// 	}
	// 	input.styles = styles;
	// }

	// // clean bots
	// if(input.bots){
	// 	//input.bots = ['588f93b31961261f5614c13c'];
	// 	var bots = [];
	// 	if(typeof input.bots == 'string'){
	// 		bots = bots.replace(',','');
	// 		bots = bots.replace('\\','');
	// 		var temp = bots.split(',');
	// 		for(var i in temp){
	// 			bots.push(temp[i]);
	// 		}
	// 	}else{
	// 		for(var i in input.bots){
	// 			var temp = input.bots[i];
	// 			temp = temp.replace(',','');
	// 			temp = temp.replace('\\','');
	// 			bots.push(temp);
	// 		}
	// 	}
	// 	input.bots = bots;
	// }

	// // clean allowedPages
	// if(input.allowedPages){
	// 	//input.allowedPages = ['chat.gokurbi.com'];
	// 	var allowedPages = '';
	// 	input.allowedPages = allowedPages;
	// }

	// // clean documents
	// if(input.documents){
	// 	input.documents = [];
	// 	var documents = [];
	// 	input.documents = documents;
	// }
}
function _cleanStamplayFieldsForSave(input){
	if(input.__v || input.__v === 0) delete input.__v;
	if(input.appId) delete input.appId;
	if(input.cobjectId) delete input.cobjectId;
	if(input.actions) delete input.actions;
	if(input.dt_update) delete input.dt_update;
	if(input.dt_create) delete input.dt_create;
	if(input.user_owner) input.owner = input.user_owner;
	delete input.user_owner;
}

} // end exports

    
 