var UglifyJS 						= require('uglify-js');
var Handlebars 						= require('handlebars');
var Less 							= require('less');
var fs 								= require('fs');
var CryptoJS 						= require('crypto-js');
var Formidable 						= require('formidable');

module.exports = function(router,db,BASEURL,PORT,ENV){

	var URL = BASEURL;
	if(PORT && ENV != 'prod' && PORT != 80) URL += ":" + PORT;

	var globFunc = require('../sharedFunctions/chatCreateFunctions')();

	var ICONS = [];						


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
			.get(_getUserChat);
			// .post(createChatbox)  			//under development... not currently used in prod
			// .put(updateChatbox);
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

	router
		.route('/providers')
			.get(getProviders)
			.post(createProvider);
	log('\t/providers');

	
	///routes for the preview
	router
		.route('/preview_chat_box')
			.get(debugGetUserChat);
	log('\t/preview_chat_box');
	router
		.route('/bot_files')
		.get((req,res)=>{
				getBotFiles().then((files)=>{ return res.json(files)});
			})
		.post(saveBotTemplate);
	log('\t/bot_files');
	router
		.route('/bot_from_file')
			.get(getBotFromFile);
	log('\t/bot_from_file');
	router
		.route('/simple_publish')
			.get(simplePublish);
	
function decode(str){
	var bytes = CryptoJS.AES.decrypt(decodeURIComponent(str),"voltron");
	try{
		var newConfig = bytes.toString(CryptoJS.enc.Utf8);
		newConfig = JSON.parse(newConfig);	
	} catch(e){
		//dont do anything
	}
	return newConfig || {};
}

function simplePublish(req,res){
	//req.query
	newConfig = decode(req.query.config);
	var providerEmail = newConfig.provider;
	var botTemplate = newConfig.bot;
	var organization = newConfig.organization;
	var provider = null;
	var template = null;
	var chatbox = null;
	if(providerEmail && botTemplate)
	db.getProvider({email:providerEmail}).then(
	(doc)=>{
		provider = doc;
		if(!provider.chatboxes) provider.chatboxes = [];
		if(!provider.chatboxes[0]) provider.chatboxes = [];
		return loadStyleTemplate(newConfig, provider)
	}).then(
		db.createChatStyle	
	).then(
	(doc)=>{
		template = doc;
		var responses = require('../endpoints.chatbot/'+botTemplate)(organization,URL);
		var messages = [];
		for(var key in responses) {

			var message = responses[key];
			message.qcode = key;
			message.owner = provider._id;
			message.name = botTemplate;
			message.version = "0.0.1";
			messages.push(db.createBotDialog(message));
			
		}
			
		return Promise.all(messages);
	}).then(
	()=>{
		var bot = {};
	    bot.owner = provider._id;
	    bot.name = botTemplate;

		return db.setChatBot(bot);
	}).then(
	(doc)=>{
		if(provider.chatboxes.length > 0) return db.getChatBox({_id:provider.chatboxes[0]});
		else {
				chatbox = {};

			    chatbox.owner 			= provider._id;
				chatbox.allowedPages 	= [];
				chatbox.rule 			= "random";
				return db.createChatBox(chatbox);
		}
	}).then(
	(doc)=>{
			chatbox = doc;
			if(!chatbox){
				provider.chatboxes = [];
				chatbox = {};

			    chatbox.owner 			= provider._id;
				chatbox.allowedPages 	= [];
				chatbox.rule 			= "random";
				return db.createChatBox(chatbox).then((doc)=>{
					console.log('arRRRRRRrr')
					chatbox = doc;
					return globFunc.loadSnippet(chatbox._id,URL);
				});
			}else 
				return globFunc.loadSnippet(chatbox._id,URL);
			
	}).then(
	(doc)=>{
			chatbox.styles 			= [template._id];
			chatbox.bots 			= [botTemplate];
			chatbox.snippet 		= doc;
			return db.setChatBox(chatbox);
	}).then(
	()=>{
		provider.chatboxes = [chatbox._id];
		return db.setProvider(provider);
	}).then(()=>{
 		res.status(200).json({snippet:chatbox.snippet});
	}).catch((err)=>{
		console.log('error', err);
		res.status(500).json(err);
	})
	
}

function deleteBot(req,res){
	// log("deleteBot()", {body:req.body,user:req.user});
	db.deleteChatBot({owner:req.user._id,name:req.body.name}).then(function(){
	res.json({okay:"okay", body:req.body});
	});

}

function getProviders(req,res){
	var newConfig = decode(req.query.config);
	if(newConfig.allowed){
	db.getProviders({}).then(function(providers){
		res.json(providers);
	});
	} else res.json({data:[]});
}

function createProvider(req,res){
	res.json({okay:'okay'});
}
function saveBotTemplate(req,res){

	var form = new Formidable.IncomingForm();
	form.uploadDir = __dirname + '/../incoming.bots';
	form.keepExtensions = true;

	form.parse(req, function(err,fields,files){
		if(err) return res.status('400').json({err:"bad file"});
		var newConfig = decode(fields.config);
		if(newConfig.allowed){
			fs.rename(files.bot.path, __dirname+'/../endpoints.chatbot/' + files.bot.name);	
		}else{
			fs.unlink(files.bot.path);
		}
		
		res.json({okay:'okay'});	
	})

	
}
function getBotFiles(){
	return new Promise(function(resolve,reject){
		fs.readdir('./endpoints.chatbot', (err,files) => {
			if(err) reject(err);
			else resolve(files);
		});
	});
}

function getBotFromFile(req,res){
	
	var botname = '../endpoints.chatbot/'+req.query.file;
	var bot = require(botname)('Kurbi9000',URL);
	res.json(bot);
}
function createBotFromFile(req,res){
	var serverURL = BASEURL;
	serverURL = BASEURL

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

	return res.status(200).send(responses);
}


// -------------------------------------------


	populateIconList(BASEURL);

	return router;


function getStyles(req,res){
    db.getChatStyles({owner:req.user._id}).then((docs)=>res.json(docs));
}

function createStyle(req,res){
	var newConfig = decode(req.query.config);
	loadStyleTemplate(newConfig, req.user).then(db.setChatStyle(style)).then((doc) => res.json(doc));
}

function loadStyleTemplate(newConfig, provider){

			var config = {};
			if(newConfig) {
				config.template = newConfig.template;
				config.hbs = newConfig.hbs;
				config.js = newConfig.js;
				config.less = newConfig.less;
			}

			if(!config.template) config.template = 'floating';
			if(!config.js) config.js = {};
			if(!config.hbs) config.hbs = {};
			if(!config.less) config.less = {};

		return globFunc.loadTemplates(config).then((template)=>{

			var response = {};
			var promises = [];

			promises.push(globFunc.compileHBS(template.configuration.hbs,template.hbs));
			promises.push(globFunc.compileLESS(template.configuration.less,template.less));	

			return Promise.all(promises).then(function(results){	
						var style = {};
					  	style.js = template.js.replace(/#SERVER_URL/g,URL);
					   	style.html = results[0].replace(/#SERVER_URL/g,URL);
						style.css = results[1];
						if(provider) style.owner = provider._id;
						style.configuration = template.configuration;
						return style;
					});
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
		if(key=='preview'){
		  var newConfig = decode(req.query.config);
		  loadStyleTemplate(newConfig).then((doc) => res.json(doc));
		}else {
			return getChatboxes(req,res);
		}
	}


function createChatbox(req,res){

	var chatbox = {};

    chatbox.owner 			= req.user._id;
	chatbox.styles 			= [];
	chatbox.bots 			= [];
	chatbox.allowedPages 	= [];
	chatbox.rule 			= "random";
	var key;
	db.createChatBox(chatbox).then(function(doc){
		chatbox = doc;
		return globFunc.loadSnippet(doc._id, URL);
		
	}).then( (snippet) => {
		chatbox.snippet = snippet;
		return db.setChatBox(doc);
	}).then((box) => {console.log(doc)});;
	

	return res.json({okay:"okay"});
}

	function updateChatbox(req,res){

		var chatbox = {};
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

		db.setChatBox(chatbox).then(function(doc){
			return res.json({okay:doc});
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