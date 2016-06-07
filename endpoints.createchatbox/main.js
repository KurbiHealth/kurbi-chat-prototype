var UglifyJS 						= require('uglify-js');
var Handlebars 						= require('handlebars');
var Less 							= require('less');
var fs 								= require('fs');

module.exports = function(router,DATASOURCE,db,BASEURL){

	if(DATASOURCE == 'mongodb'){
		var Chat 	= require('./schemas.mongoose/chatSchema')(db);
	}

	var globFunc = require('../sharedFunctions/chatCreateFunctions')();

	var ICONS = [];						
	var less,
		hbs,
		js,
		snippet;

// -------------------------------------------
// ROUTE DEFINITION
// this endpoint is called by the backend, to generate a chatbox and a corresponding snippet
	router
		.route('/chatbox')
			.post(createSnippet);
// -------------------------------------------

	new Promise(loadTemplates).then(function(templates){

		less = templates.less;
		hbs = templates.hbs;
		js = templates.js;
		snippet = templates.snippet;

	});

	populateIconList(BASEURL);

	return router;


/// General Work Flow  (createSnippet)
//   create snippet takes the custom user preferences
//   and merges them with handlebar templates (hbs) and 
//   less templates to generate final 
//   html and css files.   (compileHBS/ compileLESS)

//   these html, css, and the template js files are then 
//   converted into strings and stored in the database on
//   chat a new chat entity.
//   (chat.save)
//
//   a snippet template is then compiled, replacing the word
//   #BANANA with the chat entity id.  This snippet can then
//   be pasted into a webpage to call our database 
//   and download the previously referenced html/css/js files
//   as strings. 
//
//   the snippet is uglified, so that it will take up less space
//   and be harder to read, then returned to the backend to be displayed
//   to the user.      

	function createSnippet(req,res){

		var hbsData = {
			content: req.body.title,
			icons: ICONS,
		}
		var lessData = {};
		if(req.body.color) lessData.headerColor = req.body.color;


		var response = {};
		var promises = [];
		promises.push(compileHBS(hbsData,hbs));
		promises.push(compileLESS(lessData,less));

		Promise.all(promises).then(function(results){

			if(DATASOURCE == 'mongodb'){
				// Data Layer is Mongoose
				var chat = new Chat();
				chat.js = js;
				chat.html = results[0];
				chat.css = results[1];

				chat.save(function(err){
					if(err) console.log(err);
					else{
						var customSnippet = snippet.replace('#BANANA', chat._id);
						var uglySnippet = UglifyJS.minify(customSnippet, {fromString: true});
						return res.json({'snippet':uglySnippet.code});	
					}
					
				});
			}else if(DATASOURCE == 'stamplay'){
				// Data Layer is Stamplay Node SDK
				var data = {
				    "js": js,
				    "html": results[0],
				    "css": results[1]
				}
				db.Object('chatbox').save(data, function(error, result){
				    if(error) 
				    	console.log(error);
					else{
						result = JSON.parse(result);
						var customSnippet = snippet.replace('#BANANA', result.id);
						var uglySnippet = UglifyJS.minify(customSnippet, {fromString: true});
						return res.json({'snippet':uglySnippet.code});	
					}
				})
			}

		});
	}

	function loadTemplates(resolve,reject){
		//this just loads the templates as strings using: loadHBS, loadLESS, loadJS, and loadSnippet.
		//called on server boot.  

		var promises = [];
		promises.push(new Promise(loadHBS('./endpoints.createchatbox/templates/html/chat_template.hbs')));
		promises.push(new Promise(loadLESS));
		promises.push(new Promise(loadJS));
		promises.push(new Promise(loadSnippet));

		Promise.all(promises).then(function(results){
			var template = {};
			template.hbs = results[0];
			template.less = {
									vars:results[1][0],
									file:results[1][1],
							};
			template.js = results[2];
			template.snippet = results[3];
			
			resolve(template);

		});	
	}


//worker functions for createSnippet --------------------------

	function compileHBS(data,hbs){
		return new Promise(function(resolve,reject){
			var html = Handlebars.compile(hbs)(data);
			resolve(html);
		});
	}

	function compileLESS(data,less){
		//because of the cascading nature of css
		//the less file had to be broken into two pieces
		//a template holding default css variables
		//which is loaded first.
		//then the user preferences can overwrite those.
		//then they can be applied to the 
		//chat_template.less

		var dataString = less.vars;
		return new Promise(function(resolve,reject){
			for(var key in data){
				dataString += '@'+key +":"+data[key] +';';
			}
			dataString += less.file;
			Less.render(dataString, function(err,output){
				if(err) return console.log(err);
				resolve(output.css);
			})

		});

	}
// DELETE
	function loadHBS(filename){

		return function(resolve,reject){
			fs.readFile(filename, 'utf8',function(err,data){
				if(err) return console.log(err);
				resolve(data);
			});

		}
	}
// DELETE
	function loadLESS(resolve,reject){
			Promise.all([new Promise(loadDefaultLessVariables), new Promise(loadDefaultBaseLess)])
			.then(function(results){
				resolve(results);
			});
	}

	function loadDefaultLessVariables(resolve,reject){
		fs.readFile('./endpoints.createchatbox/templates/css/default_variables.less', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});	
	}

	function loadDefaultBaseLess(resolve,reject){
			fs.readFile('./endpoints.createchatbox/templates/css/chat_template.less', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});	
	}
// DELETE
	function loadJS(resolve,reject){
			fs.readFile('./endpoints.createchatbox/templates/javascript/chat_template.js', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});			
	}
// DELETE
	function loadSnippet(resolve,reject){
			fs.readFile('./endpoints.createchatbox/templates/javascript/snippet_template.js', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});			
	}



/////////////////////////////////////////////////////////////////
/// UN-IMPORTANT SHNITZELS /// 
//------------------------------------------------------------///
	function populateIconList(BASEURL){
	//I had a shitton of icons, so I made it choose randomly from them because it was funny
		if(BASEURL == '' || typeof BASEURL == 'undefined')
			var BASEURL = 'http://public.foolhardysoftworks.com:9000';
		fs.readdir('./apps.providerconfig/icons/PNG', function(err,items){
			var limit = items.length < 12 ? items.length : 12;
			for(var i = 0; i < limit; i++){
				var choice = Math.floor(Math.random()*(items.length-1));
				ICONS.push(BASEURL + '/backend/icons/PNG/'+items[choice]);	
			}
		});

	}


}