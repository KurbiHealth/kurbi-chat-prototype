var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;
var ChatStyle  	 = require('./styleSchema');

//the chatschema will combine: 
// styles to be served to clients
// bots to served to clients
// rules which determine what pages get what styles/bots.

//for now we'll keep the rule simple: just random

var chatSchema   = new Schema({
        
    owner: 			{type:ObjectId, ref:'provider'},
	styles: 		[],
	bots: 			[],
	documents: 		[],
	allowedPages: 	[],
	rule: 			String,
	snippet: 		String,

});


chatSchema.methods.getBot = function(domain){
	var bot = null;
	if(this.allowedPages.indexOf(domain) > -1) {
	    bot = {};
		var index = Math.floor(Math.random(this.bots.length));
		bot.owner = this.owner;
		bot.name = this.bots[index];
	}
	return bot;
}

chatSchema.methods.getStyle = function(){
	var index = Math.floor(Math.random(this.styles.length));
	return this.styles[index];
}



module.exports = mongoose.model('chatbox', chatSchema);


