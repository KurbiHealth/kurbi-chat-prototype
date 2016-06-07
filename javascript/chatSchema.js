var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var chatSchema   = new Schema({
    
	js : 				String,
	css: 				String,
	html: 				String,


});


module.exports = mongoose.model('chatbox', chatSchema);