module.exports = function(router,DATASOURCE,db){

// -------------------------------------------
// ROUTE DEFINITION
// This acts as a POST endpoint for the submission of contact form from
// www.gokurbi.com
	router
		.route('/contact_form')
			.post(receiveContactForm);
// -------------------------------------------

	return router;

	function receiveContactForm(req,res){

		var email = req.body.email;

		if(DATASOURCE == 'stamplay'){

			db.Object('contacts')
			.save({ email : email }, function(err,doc) {
				if(err){
					return console.log(err);
				}else{
 					var result = JSON.parse(doc)
					return res.json(result);
				}
			})

		}

	}

}