var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId 	 = Schema.Types.ObjectId;

var chatInstance   = new Schema({
    
    // loadCount: 	{type:Number, default: 0},
	chatbox:  	{type:ObjectId, ref:"chatbox"},
	url: 		{type:String, unique:true},
	token: 	{type:String, unique:true},
	messages: 	[],
	
});


module.exports = mongoose.model('chatboxInstance', chatInstance);

//I played with the idea of injecting some counters into the mongoose save function
//this code is kept here to remind me of how to do it!  

// chatInstance.pre('save', function(next) {
// 		// var fingerprint = (new Date()).valueOf().toString() + Math.random().toString();
// 		// this.token = require('crypto').createHash('md5').update(fingerprint).digest("hex");
		 
//         next();

// });
