var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;
var ChatStyle  	 = require('./styleSchema');
var ChatBot 	 = require('./chatbotSchema');

//the chatschema will combine: 
// styles to be served to clients
// bots to served to clients
// rules which determine what pages get what styles/bots.

//for now we'll keep the rule simple: just random

var chatBoxSchema   = new Schema({
        
    owner: 			{type:ObjectId, ref:'provider'},
	styles: 		[],
	bots: 			[],
	documents: 		[],
	allowedPages: 	[],
	rule: 			String,
	snippet: 		String,

});


// chatBoxSchema.methods.getBot = function(domain){
// 	var bot = null;
// 	console.log('requested domain', domain);
// 	console.log('allowed domains', this.allowedPages);
// 	if(this.allowedPages.indexOf(domain) > -1) {
// 	    bot = {};
// 		var index = Math.floor(Math.random()*this.bots.length);
// 		console.log("bot numberes,",index,this.bots.length);
// 		bot.owner = this.owner;
// 		bot.name = this.bots[index];
// 	}
// 	return bot;
// }

chatBoxSchema.methods.getStyle = function(){
	var index = Math.floor(Math.random()*this.styles.length);
	return this.styles[index];
}

chatBoxSchema.methods.getBot = function(){
	var that = this;
	return new Promise(function(resolve,reject){
	ChatBot.find({owner:that.owner}, function(err, docs){
		if(err) reject(err);
		var bot = {};
		var index = Math.floor(Math.random()*docs.length);
		
		bot.owner = docs[index].owner;
		bot.name = docs[index].name;
		console.log(index,bot.name);
		resolve(bot);
	})
	});
	
}



module.exports = mongoose.model('chatbox', chatBoxSchema);


