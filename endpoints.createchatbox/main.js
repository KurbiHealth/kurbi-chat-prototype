var UglifyJS 						= require('uglify-js');
var Handlebars 						= require('handlebars');
var Less 							= require('less');
var fs 								= require('fs');

module.exports = function(router,db,BASEURL,PORT,ENV){

	var URL = BASEURL;
	if(PORT && ENV != 'prod') URL += ":" + PORT;

	var globFunc = require('../sharedFunctions/chatCreateFunctions')();

	var ICONS = [];						
	var less,
		hbs,
		js,
		snippet;

// -------------------------------------------
// ROUTE DEFINITION
// this endpoint is called by the backend, to generate a chatbox and a corresponding snippet
	log('\n');
	log('creating chatbox routes');
	//this decides if we'll load the chat style from the database or generate it fresh
	//it's so we can modify the snippet code while in DEV mode.
	var _getUserChat = (ENV=='dev') ? debugGetUserChat : getChatboxes;
	router
		.route('/chatbox')
			.get(_getUserChat)
			.post(createChatbox)
			.put(updateChatbox);
	log('\t/chatbox');
	router
		.route('/style')
			.get(getStyles)
			.post(createStyle)
			.put(updateStyle);
	log('\t/style');

	router
		.route('/bot')
			.get(getBots)
			.post(createBot);
	log('\t/bot');

	router
		.route('/deleteBot')
			.post(deleteBot);
	log('\t/deleteBot');

	router
		.route('/convert')
			.post(createBotFromFile);
	log('\t/convert');

	

function deleteBot(req,res){
	// log("deleteBot()", {body:req.body,user:req.user});
	db.deleteChatBot({owner:req.user._id,name:req.body.name}).then(function(){
	res.json({okay:"okay", body:req.body});
	});

}

function createBotFromFile(req,res){
	var serverURL = BASEURL;
	if(PORT && PORT != 80) serverURL = BASEURL + ":" + PORT;

	if(!req.body.fileName || req.body.fileName == '')
		var botFileName = '../endpoints.chatbot/demoBot.js';
	else
		var botFileName = '../endpoints.chatbot/' + req.body.fileName;

	if(!req.body.orgName || req.body.orgName == '')
		var orgName = 'Madison Area Wellness Collective';
	else
		var orgName = req.body.orgName;

	var responses = require(botFileName)(orgName,serverURL);

	for(var key in responses) {

		var message = responses[key];
		message.qcode = key;
		message.owner = "57699528f4924a7f641e4950";
		//message.name = "demoBot";
		//message.owner="58041b251769e0406744deff";
		// message.owner="580e57b8de7ab85f033b4e41";
		message.name = "demoBot";
		message.version = "0.0.1";
		db.createBotDialog(message);
		
	}
		
    var bot = {};
    //bot.owner = "57699528f4924a7f641e4950";
    //bot.name = "demoBot";
    //bot.owner="58041b251769e0406744deff";
    bot.owner="580e57b8de7ab85f033b4e41";
    bot.name = "demoBot";
    db.createChatBot(bot);

	return res.send(responses);
}


// -------------------------------------------

	new Promise(loadTemplates).then(function(templates){

		less = templates.less;
		hbs = templates.hbs;
		js = templates.js;
		snippet = templates.snippet;

	});

	populateIconList(BASEURL);

	return router;


function getStyles(req,res){
    db.getChatStyles({owner:req.user._id}).then((docs)=>res.json(docs));
}

function createStyle(req,res){

		if(req.body.avatar && req.body.avatar != '') var userAvatar = req.body.avatar;
			else var userAvatar = '/backend/icons/PNG/mawc.png'; // https://lh6.ggpht.com/HZFQUEzeti5NttBAuyzCM-p6BjEQCZk5fq4ryopFFYvy6qPp8zMFzVHk1IdzWNLr4X7M=w300
		if(req.body.headline && req.body.headline != '') var userHeadline = req.body.headline;
			else var userHeadline = 'Welcome';

		var hbsData = {
			headline: userHeadline,
			icon_url: userAvatar,
			icon_urlb: 'http://chat.gokurbi.com/backend/icons/PNG/mawc.png',
			server_url: URL,
			server_close_button: URL + '/img/icons/button_close.png',
		}
console.log('hbsData',hbsData);
		var lessData = {};

		if(req.body.color && req.body.color != '') 
			lessData.headerColor = req.body.color;

		var response = {};
		var promises = [];

		var configuration = { 
							hbsData:hbsData,
							lessData:lessData,
							};

		promises.push(compileHBS(hbsData,hbs));
		promises.push(compileLESS(lessData,less));
	
		Promise.all(promises).then(function(results){	
			var style = {};
		  	style.js = js.replace(/#SERVER_URL/g,URL);
		   	style.html = results[0].replace(/#SERVER_URL/g,URL);
			style.css = results[1];
			style.owner = req.user._id;
			style.configuration = configuration;
			db.setChatStyle(style).then((doc) => res.json(doc));
		});
}

function updateStyle(req,res){
	return res.json({okay:"okay"});
}


function getBots(req,res){
	
	db.getChatBots({owner:req.user._id}).then((docs) => {
			return res.json(docs)
		});
}

function createBot(req,res){
	var dialogs = req.body.questionJSON;
	var graph = req.body.graphJSON;
	var owner = req.user._id;
	var name = req.body.name;
	//first clear the bot with that name/owner
	console.log('deleting the old bot');
	db.deleteChatBot({owner:owner, name:name}).then(function(){

	//then create chatbot
	console.log('creating the new bot object');
	db.createChatBot({owner:owner,name:name,graph:graph}).then((bot)=>{console.log('created', bot)});


	//then create a new bot
	console.log('creating the new bot dialog');
	Object.keys(dialogs).forEach(function(key){
		dialogs[key].owner = owner;
		db.createBotDialog(dialogs[key])
	});

	});
	
	return res.json({okay:"okay"});
}

function getChatboxes(req,res){


	var key = req.query.key;
	if(!key) db.getChatBoxes({owner:req.user._id}).then((docs) => {return res.json(docs)});
	else db.getChatBox({_id:key}).then((doc) => {
		var chosenStyle = db.getStyle(doc.styles);
		//if(chosenStyle)  //need to load some sort of default style
		db.getChatStyle({_id:chosenStyle}).then((style) => {return res.json(style)});
	});


}	

function debugGetUserChat(req,res){
		var key = req.query.key;
		if(!key) db.getChatBoxes({owner:req.user._id}).then((docs) => {return res.json(docs)});
		else{
		//this is to force it to recompile the html/css every time
		var lTemps = new Promise(globFunc.loadTemplates);
		var url = BASEURL;
		if(PORT) url += ":" + PORT; 
		lTemps.then(function(template){
			var hbsData = {
				headline: 'debug mode',
				icon_urlb: url + '/img/icons/juggernaut.png',
				server_url: url,
				server_close_button: url + '/img/icons/button_close.png'

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


function createChatbox(req,res){

	var chatbox = {};
console.log('req.user',req.user);
    chatbox.owner 			= req.user._id;
	chatbox.styles 			= [];
	chatbox.bots 			= [];
	chatbox.allowedPages 	= [];
	chatbox.rule 			= "random";	s

	db.createChatBox(chatbox).then(function(doc){
		var key = doc._id;
		console.log('new chatbox id',key);
		doc.snippet = createSnippet(key);
		db.setChatBox(doc).then((box) => {console.log(doc)});
	});
	

	return res.json({okay:"okay"});
}

	function updateChatbox(req,res){

		var chatbox = {};
console.log('req.body',typeof req.body,req.body);
console.log('req.user',req.user);
		if(req.user)
			var user = req.user;
		else
			var user = {};
		chatbox._id 			= req.body.chatbox_id ? req.body.chatbox_id : '';
	    chatbox.owner 			= user._id ? user._id : '';
		chatbox.styles 			= req.body.styles ? req.body.styles : '';
		chatbox.bots 			= req.body.bots ? req.body.bots : '';
		chatbox.allowedPages 	= req.body.allowedPages ? req.body.allowedPages : '';
		chatbox.documents		= req.body.documents ? req.body.documents : '';
		chatbox.rule 			= req.body.rule ? req.body.rule : '';	
console.log('chatbox obj',chatbox);
		db.setChatBox(chatbox).then(function(doc){
			// if(typeof doc == 'string'){ doc = JSON.parse(doc); }
// console.log('---doc',doc);
			// if(doc.error)
			// 	return res.json({error:doc.error});
			// else
			return res.json({okay:doc});
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

	function createSnippet(id){
		var customSnippet = snippet.replace('#BANANA', id).replace(/#SERVER_URL/g,URL);
		var uglySnippet = UglifyJS.minify(customSnippet, {fromString: true});
		return uglySnippet.code;	

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
console.log('data in compile',data);
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
	function populateIconList(URL){
	//I had a shitton of icons, so I made it choose randomly from them because it was funny
		// if(BASEURL == '' || typeof BASEURL == 'undefined')
		// 	var BASEURL = 'http://public.foolhardysoftworks.com:9000';
		fs.readdir('./apps.providerconfig/icons/PNG', function(err,items){
			var limit = items.length < 12 ? items.length : 12;
			for(var i = 0; i < limit; i++){
				var choice = Math.floor(Math.random()*(items.length-1));
				ICONS.push(URL + '/backend/icons/PNG/'+items[choice]);	
			}
		});

	}


}