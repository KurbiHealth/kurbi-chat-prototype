var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;

var chatbotSchema   = new Schema({
    	   	
	owner: 			{type:ObjectId, ref:'provider'},
	name: 			String,
	
	
});

module.exports = mongoose.model('chatbot', chatbotSchema);



