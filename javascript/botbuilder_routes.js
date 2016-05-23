module.exports = function(){

var express 						= require('express');
var router 							= express.Router();
var mongoose  						= require('mongoose');

var Chat 							= require('./chatSchema');
var Bot								= require('./chatbotSchema');




router.route('/chatboxes')
	.get(getboxlist);
	
router.route('/message')
	.post(newMessage);


return router;


function newMessage(req,res){
	var bot = new Bot();
	console.log(req.body);
	var msg = {};
	msg.body = req.body.messageBody;
	msg.type = req.body.messageType;
	msg.id   = req.body.messageId;

	bot.key = 			req.body.chatbox;
	bot.name = 			req.body.name;
	bot.prompt = 		req.body.prompt;
	bot.promptID = 		req.body.promptID;
	bot.message = 		msg;


	bot.save(function(err){
		if(err) console.log(err);
		console.log('success');
	});
	res.redirect('botbuilder');
}

//
function getboxlist(req,res){
	Chat.find({},{id:1}).then(function(boxes){
		res.send(boxes);
	});

}



}
