module.exports = function(router,ENV,db,BASEURL,PORT){

	var globFunc = require('../sharedFunctions/chatCreateFunctions')();

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
var _getUserChat = (ENV=='dev') ? debugGetUserChat : getUserChat;
	router
		.route('/chatbox')
			.get(_getUserChat);
// -------------------------------------------

	return router;

	function getUserChat(req,res){

		var id = req.query.key;
		db.getChatBox({_id:id}).then((doc) => {return res.json(doc)});

	}

	function debugGetUserChat(req,res){
		//this is to force it to recompile the html/css every time
		var lTemps = new Promise(globFunc.loadTemplates);
		var url = BASEURL;
		if(PORT) url += ":" + PORT; 
		lTemps.then(function(template){
			var hbsData = {
				content: 'debug mode',
				icons: ICONS,
			}
			var lessData = {
				
			}

			var response = {};
			var promises = [];
			promises.push(globFunc.compileHBS(hbsData,template.hbs));
			promises.push(globFunc.compileLESS(lessData,template.less));

			Promise.all(promises).then(function(results){

				response.js = template.js.replace(/#SERVER_URL/g,url);
				response.css = results[1];
				response.html = results[0].replace(/#SERVER_URL/g,url);
				return res.json(response);
			
			});
		});
	}

}