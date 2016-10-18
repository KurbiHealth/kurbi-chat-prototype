var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;

var styleSchema   = new Schema({
    
    owner: 				{type:ObjectId, ref:'provider'},
	js : 				String,
	css: 				String,
	html: 				String,
	configuration: 		{},
});


module.exports = mongoose.model('style', styleSchema);


