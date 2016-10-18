var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;

var dialog   = new Schema({
    
    owner: 				{type:ObjectId, ref:'provider'},
    name: 				String,
    version: 			String,
    qcode: 				String,

});


module.exports = mongoose.model('botDialog', dialog);


