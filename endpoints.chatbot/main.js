module.exports = function(router,DATASOURCE,db,BASEURL){

	if(DATASOURCE == 'mongodb'){
		var Chat 							= require('./schemas.mongoose/chatSchema');
		var Bot								= require('./schemas.mongoose/chatbotSchema');
	}

// -------------------------------------------
// ROUTE DEFINITION
// This is a dev/debug version of the endpoint, the production version is on Stamplay
// Each time this is loaded, it recompiles the chat box & serves the chat box to the 
// client webpage (snippet_template.js)
	router.route('/chatboxes')
		.get(getboxlist);

	router.route('/message')
		.post(newMessage);
// -------------------------------------------

	return router;

	/*
	 * FUNCTIONS
	 */

	function newMessage(req,res){
		console.log(req.body);
		var msg = {};
		msg.body = req.body.messageBody;
		msg.type = req.body.messageType;
		msg.id   = req.body.messageId;

		if(DATASOURCE == 'mongodb'){
			var bot = new Bot();
			bot.key = 			req.body.chatbox;
			bot.name = 			req.body.name;
			bot.prompt = 		req.body.prompt;
			bot.promptID = 		req.body.promptID;
			bot.message = 		msg;
			bot.save(function(err){
				if(err) console.log(err);
				console.log('success');
			});
		}else if(DATASOURCE == 'stamplay'){
			var bot = {};
			bot.key = 			req.body.chatbox;
			bot.name = 			req.body.name;
			bot.prompt = 		req.body.prompt;
			bot.promptID = 		req.body.promptID;
			bot.message = 		msg;
			db.Object('bot_messages').save(data, function(error, result){
			    if(error) 
			    	console.log(error);
				else{
					console.log('success');
				}
			})
		}
		res.redirect('botbuilder');
	}

	function getboxlist(req,res){

		if(DATASOURCE == 'mongodb'){

			Chat.find({},{id:1}).then(function(boxes){
				res.send(boxes);
			});

		}else if(DATASOURCE == 'stamplay'){

			db.Object("chat_instance")
				.get({url:url, token:token}, function(err, doc) {
					if(err) 
						return console.log(err);
					if(!doc || doc.token == '') {
						doc.url = url;
						doc.chatbox = key;
						var fingerprint = (new Date()).valueOf().toString() + Math.random().toString();
						doc.token = require('crypto').createHash('md5').update(fingerprint).digest("hex");
						doc.question = question;
						doc.userInformation = userInformation;
					}

					db.Object('chat_instance').save(doc,function(err,res){
						if(err) 
							return console.log(err);
						if(res){

						}
					});

					res.json({token:doc.token});
				});

		}

	}

}