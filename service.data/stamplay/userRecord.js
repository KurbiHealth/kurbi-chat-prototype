		// function createUserRecord(roomId){
		// 	if(!(roomId in userRecords)){
		// 		// the var roomId is used as a unique key to save the Stamplay 
		// 		// record id for use in checkForUserData()
		// 		var tempObj = {
		// 			stamplayId: '',
		// 			chatRoomId: '',
		// 			email: '',
		// 			firstName: '',
		// 			customData: {}
		// 		};
		// 		userRecords[roomId] = tempObj;
		// 	}
		// }

		// function checkForUserData(message,roomId){
		// 	var source = message.source;
		// 	message = message.message;
		// 	// switch statement, map qCodes and body.text values to the 
		// 	// Stamplay field names used in userRecords[roomId] object
		// 	if(source == 'patient'){
		// 		switch(message.qCode){
		// 			case 'scored the email':
		// 				// user's email
		// 				userRecords[roomId]['email'] = message.body.text;
		// 				break;

		// 			case 'end': // TODO change to a more readable qCode
		// 				// user's first name
		// 				userRecords[roomId]['firstName'] = message.body.text;
		// 				break;
		// 			default:
		// 				// save to customData object field in user record
		// 				if(message.body.text){
		// 					var value = message.body.text;
		// 					userRecords[roomId]['customData'][message.qCode] = message.body.text;
		// 				}
		// 				break;
		// 		} // end switch
		// 		if(userRecords[roomId].stamplayId == ''){
		// 			// Stamplay doesn't allow creating a user record without
		// 			// an email address, so wait until we have an email addr to 
		// 			// add new user record
		// 			if(userRecords[roomId]['email'] != ''){
		// 				db.User.get({email: userRecords[roomId]['email']},function(err,result){
		// 					if(err){return err;}
		// 					result = JSON.parse(result);
		// 					if(result.data && result.data.length > 0){
		// 						var data = result.data[0];
		// 						// insert result.id into userRecords
		// 						userRecords[roomId]['stamplayId'] = data.id;
		// 						// add user record to current chatRoom record
		// 						db.Object('chatroom')
		// 							.update(userRecords[roomId]['chatRoomId'],{'visitor_user_id': data.id},function(err,result){
		// 								result = JSON.parse(result);
		// 							});
		// 					}else{
		// 						// create new user
		// 						var data = {
		// 							"email": userRecords[roomId]['email'],
		// 							//"password": crypto.createHash(userRecords[roomId]['email']),
		// 							"password": "botpassword",
		// 							"firstName": userRecords[roomId]['firstName'],
		// 							"customData": userRecords[roomId]['customData']
		// 						};
		// 						db.User
		// 						.save(data,function(err,result){
		// 							if(err){return console.log('error saving user, error:',err);}
		// 							result = JSON.parse(result);
		// 							if(result.id){
		// 								userRecords[roomId]['stamplayId'] = result.id;
		// 							}
		// 							// add user id to current chatroom.visitor_user_id
		// 							db.Object('chatroom')
		// 								.update(userRecords[roomId]['chatRoomId'],{visitor_user_id: result.id},function(err,result){
		// 									result = JSON.parse(result);
		// 								});
		// 						});
		// 					}
		// 				});

		// 			}
		// 		}else{
		// 			var data = {
		// 				"firstName": userRecords[roomId]['firstName'],
		// 				"customData": userRecords[roomId]['customData']
		// 			};
		// 			db.User.update(userRecords[roomId]['stamplayId'],data,function(err,result){
		// 				if(err) return console.log('err',err);
		// 			});
		// 		}
		// 	} // end if()