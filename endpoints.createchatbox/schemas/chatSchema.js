module.exports = function(mongoose){

	var Schema       = mongoose.Schema;

	var chatSchema   = new Schema({
		js : 				String,
		css: 				String,
		html: 				String,
	});

	return mongoose.model('chatbox', chatSchema);
	
}