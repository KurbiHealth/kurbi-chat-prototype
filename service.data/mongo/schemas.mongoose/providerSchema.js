var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var providerSchema   = new Schema({
    
	email: 			String,
	role: 			String,
	enabled: 		Boolean,
	chatboxes: 		[],


});


module.exports = mongoose.model('provider', providerSchema);


