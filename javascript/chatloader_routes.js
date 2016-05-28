var express 						= require('express');
var router 							= express.Router();
var mongoose  						= require('mongoose');

var Chat 							= require('./chatSchema');

var UglifyJS 						= require('uglify-js');
var Handlebars 						= require('handlebars');
var Less 							= require('less');
var fs 								= require('fs');



module.exports = function(){
var debug = true;     				//this forces a recompile of the chatbox every time the endpoint is hit - so you can immediately see changes made to the template
var _getUserChat = debug ? debugGetUserChat : getUserChat;  //this is how the above is done

var ICONS = [];						
var less,hbs,js,snippet;

router.route('/chatbox')
	.get(_getUserChat)              //serves the chat box to the client webpage (snippet_template.js)
	.post(createSnippet);  			//this endpoint is called by the backend, to generate a chatbox and a corresponding snippet

router.route('/template')
	.get(getTemplate);


new Promise(loadTemplates).then(function(templates){
	
	less = templates.less;
	hbs = templates.hbs;
	js = templates.js;
	snippet = templates.snippet;

});

populateIconList();

return router;


function getTemplate(req,res){
	var templateName = req.query.template;

	var dir = './templates/html/';
	var filename = null;
	switch(templateName){

		case 'welcome message':
		filename = dir + 'welcome_page.hbs';
		break;

		case 'text message':
		filename = dir + 'text_message.hbs';
		break;

		case 'image message':
		filename = dir + 'image_message.hbs';
		break;

		case 'response welcome':
		filename = dir + 'response_welcome.hbs';
		break;

		case 'response list text':
		filename = dir + 'response_list_text.hbs';
		break;

		case 'response list icons':
		filename = dir + 'response_list_icons.hbs';
		break;

		case 'large free response':
		filename = dir + 'response_free_large.hbs';
		break;

		case 'small free response':
		filename = dir + 'response_free_small.hbs';
		break;

		default:

	}
	console.log('calling filename', filename)
	new Promise(loadHBS(filename)).then(function(template){
		res.send(template);
	});

}

function loadTemplates(resolve,reject){
//this just loads the templates as strings using: loadHBS, loadLESS, loadJS, and loadSnippet.
//called on server boot.  

	var promises = [];
	promises.push(new Promise(loadHBS('./templates/html/chat_template.hbs')));
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


function getUserChat(req,res){
	var id = req.query.key;
	Chat.findById(id, function(err,doc){
		if(err) console.log(err);
		else return res.json(doc);
	});

}

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

		var chat = new Chat();
		chat.js = js;
		chat.html = results[0];
		chat.css = results[1];
		chat.save(function(err){
			if(err) console.log(err);
			else{
				var customSnippet = snippet.replace('#BANANA', chat._id);
				var uglySnippet = UglifyJS.minify(customSnippet, {fromString: true});
				return res.json({'snippet':uglySnippet.code, 'apiKey':chat._id});	
			}
			
		});
		

		
	
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

function loadHBS(filename){

	return function(resolve,reject){
		fs.readFile(filename, 'utf8',function(err,data){
			if(err) return console.log(err);
			resolve(data);
		});

	}
}

function loadLESS(resolve,reject){
		Promise.all([new Promise(loadDefaultLessVariables), new Promise(loadDefaultBaseLess)])
		.then(function(results){
			resolve(results);
		});
}

function loadDefaultLessVariables(resolve,reject){
	fs.readFile('./templates/css/default_variables.less', 'utf8',function(err,data){
			if(err) return console.log(err);
				resolve(data);	
		});	
}

function loadDefaultBaseLess(resolve,reject){
		fs.readFile('./templates/css/chat_template.less', 'utf8',function(err,data){
			if(err) return console.log(err);
				resolve(data);	
		});	
}

function loadJS(resolve,reject){
		fs.readFile('./templates/javascript/chat_template.js', 'utf8',function(err,data){
			if(err) return console.log(err);
				resolve(data);	
		});			
}

function loadSnippet(resolve,reject){
		fs.readFile('./templates/javascript/snippet_template.js', 'utf8',function(err,data){
			if(err) return console.log(err);
				resolve(data);	
		});			
}



/////////////////////////////////////////////////////////////////
/// UN-IMPORTANT SHNITZELS /// 
//------------------------------------------------------------///
function populateIconList(){
//I had a shitton of icons, so I made it choose randomly from them because it was funny
fs.readdir('public/backend/icons/PNG', function(err,items){
	var limit = items.length < 12 ? items.length : 12;
	for(var i = 0; i < limit; i++){
		var choice = Math.floor(Math.random()*(items.length-1));
		ICONS.push('http://public.foolhardysoftworks.com:9000/backend/icons/PNG/'+items[choice]);	
	}
	
});

}


}
