module.exports = function(router,DATASOURCE,db){

// -------------------------------------------
// ROUTE DEFINITION
	router
		.route('/log')
			.post(saveLog);
    router			
		.route('/error')
			.post(receiveError);

// -------------------------------------------

	return router;

	/* LOG TEMPLATE
	 	{
			type: 'error', // error notification useraction
			shortcode: 'test',
			origin: 'test',
			description: 'test of a logging' 
		}
	 */

	function receiveError(req,res){
		console.log("Error Transmitted");
		console.log(req.body);
		console.log(req.params);
		console.log(req.query);
		res.json({okay:'okay'});
	 }

//CANT DO THIS WAY, because SERVER SHUTS DOWN BEFORE IT WORKS
	function saveLog(req,res){
		console.log('IN SAVE LOG');
		var log = req.body.log;
		if(typeof log == 'string'){
			log = JSON.parse(log);
		}
		var source = req.body.source;
		if(req.body.alert){
			var alert = req.body.alert;
		}else{
			var alert = false;
		}

		if(DATASOURCE == 'stamplay'){
			console.log('DETECTED STAMPLAY');
			db.Object('logs')
			.save( { log: log, source: source, alert: alert }, function(err,doc) {
				if(err){
					console.log('error attempting to log',err);
					return res.sendStatus(500,'error attempting to log: ' + err);
				}else{
					console.log('successfully logged to stamplay');
					return res.sendStatus(200,'Logged successfully');
				}
			})

		}

	}

}