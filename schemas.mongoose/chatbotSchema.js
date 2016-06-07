var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;

var chatbotSchema   = new Schema({
    	   	
  	key: 				String,
	prompt: 			String,
	promptID: 			String,
	message: 			{},
	responses: 			[],
	name: 				String,
	
	
});

module.exports = mongoose.model('chatbot', chatbotSchema);



