module.exports = function(router){

	require('../sharedFunctions.js');

	var ICONS = [];						
	var less,
		hbs,
		js,
		snippet;

// -------------------------------------------
// ROUTE DEFINITION
// This is a dev/debug version of the endpoint, the production version is on Stamplay
// Each time this is loaded, it recompiles the chat box & serves the chat box to the 
// client webpage (snippet_template.js)
	router
		.route('/chatbox')
			.get(debugGetUserChat)
// -------------------------------------------

	return router;

	function debugGetUserChat(req,res){

		//this is to force it to recompile the html/css every time
		var lTemps = new Promise(loadTemplates);

		lTemps.then(function(template){
			var hbsData = {
				content: 'debug mode',
				icons: ICONS,
			}
			var lessData = {
				
			}

			var response = {};
			var promises = [];
			promises.push(compileHBS(hbsData,template.hbs));
			promises.push(compileLESS(lessData,template.less));

			Promise.all(promises).then(function(results){

				response.js = template.js;
				response.css = results[1];
				response.html = results[0];
				return res.json(response);
			
			});
		});
	}

}