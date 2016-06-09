module.exports = function(router,ENV,DATASOURCE,db){

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
		if(DATASOURCE == 'mongodb'){
			var Chat = require('../schemas.mongoose/chatSchema');
			Chat.findById(id, function(err,doc){
				if(err) console.log(err);
				else return res.json(doc);
			});

		}else if(DATASOURCE == 'stamplay'){

			db.Object('chatbox')
			.get({ _id : id }, function(err,doc) {
				if(err){
					return console.log(err);
				}else{
					var tempResult = JSON.parse(JSON.parse(doc));
					var finalResult = tempResult.data;
					return res.json(finalResult);
				}
			})

		}

	}

	function debugGetUserChat(req,res){
		//this is to force it to recompile the html/css every time
		var lTemps = new Promise(globFunc.loadTemplates);

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

				response.js = template.js;
				response.css = results[1];
				response.html = results[0];
				return res.json(response);
			
			});
		});
	}

}