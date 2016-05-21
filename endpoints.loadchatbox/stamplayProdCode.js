module.exports = function(context,req,res){

	var id = req.query.key;

	// get url from req, and use that to find the chat box id for that url

	// use chat box id to load the chat box from Stamplay data model
	Chat.findById(id, function(err,doc){
		if(err) console.log(err);
		else return res.json(doc);
	});

};