//var io 								= require('socket.io')()

module.exports = function(router,mongoose,useStamplay,stamplay){

	//require('../sharedFunctions.js'); // is this needed here????
	var cInstance = require('../endpoints.createchatbox/schemas/chatInstanceSchema')(mongoose);

// -------------------------------------------
// ROUTE DEFINITION
	router
		.route('/chat')
			.post(registerChat);
// -------------------------------------------

	return router;

	function registerChat(req,res,next){
	//unfinished -- there's going to be some user token storage... 
	//might be needed for socket coordination 
		var url = req.body.url;
		var key = req.body.key;
		var token = req.body.token;
		var question = req.body.question;
		var userInformation = req.body.userInformation;

		if(useStamplay){
			stamplay.Object("chat_instance")
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

					stamplay.Object('chat_instance').save(doc,function(err,res){
						if(err) 
							return console.log(err);
						if(res){

						}
					});

					res.json({token:doc.token});
				});
		}else{
			cInstance.findOne({url:url, token:token}).then(function(doc){
				if(!doc || doc.token == '') {
					doc = new cInstance();
					doc.url = url;
					doc.chatbox = key;
					var fingerprint = (new Date()).valueOf().toString() + Math.random().toString();
					doc.token = require('crypto').createHash('md5').update(fingerprint).digest("hex");
					doc.question = question;
					doc.userInformation = userInformation;
				}

				doc.save();

				res.json({token:doc.token});
			});
		}

		// 	next();
	}

}