var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var documentSchema   = new Schema({
    
    roomId: 	String,
    owner: 		String,

});


module.exports = mongoose.model('document', documentSchema);


