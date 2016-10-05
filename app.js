/**
 * ----------------------------------------
 * GET COMMAND LINE PARAMETERS
 * ----------------------------------------
 * ON DEV:  PORT=?? DATASOURCE=?? BASEURL=?? ENV=?? node app.js
 * ON PROD: PORT=?? DATASOURCE=?? BASEURL=?? ENV=?? forever app.js
 * 
 * 		PORT 		= 8080|3000
 * 		DATASOURCE 	= stamplay|mongodb 
 * 		BASEURL 	= http://kchat:8080|http://chat.gokurbi.com|http://public.foolhardysoftworks.com:9000
 * 		ENV 		= prod|dev|local
 * 
 * LOCAL (MATT'S): PORT=8080 DATASOURCE=stamplay BASEURL=http://kchat:8080 ENV=local node app.js
 * PROD: PORT=3000 DATASOURCE=stamplay BASEURL=http://chat.gokurbi.com ENV=prod forever app.js
 */

var ENV 		= process.env.ENV 			|| 'prod';
var PORT 		= process.env.PORT 			|| '';
var LISTENPORT	= process.env.LISTENPORT	|| 3000;
var BASEURL		= process.env.BASEURL		|| 'http://chat.gokurbi.com';
var DATASOURCE	= process.env.DATASOURCE 	|| 'stamplay';


/**
 * ----------------------------------------
 * SET UP APP FUNCTIONS
 * ----------------------------------------
 */

var express 						= require('express');
var app								= express();
var ioServer 						= require('http').Server(app)
var io 								= require('socket.io')(ioServer);


/**
 * ----------------------------------------
 * DATA LAYER 
 * ----------------------------------------
 */

if(DATASOURCE == 'mongodb'){
	var mongodbUrl = 'mongodb://inferno:27017/kurbichat';
	var db = require('mongoose');
	db.connect(mongodbUrl);
	var conn = db.connection;
	conn.on('error', console.error.bind(console, 'Mongo connection Error : '));
	conn.once('open', function(){
	  console.log('Mongo connection ok!');
	});
}

if(DATASOURCE == 'stamplay'){
	var Stamplay = require('stamplay');
	var db = new Stamplay('kurbi', '7d99dc081cf607a09b09590cc2869bc3c39b1c3b176894fd0cca237e677213d0');
}


/**
 * ----------------------------------------
 * UTILITIES (MIDDLEWARE)
 * ----------------------------------------
 */

var bodyParser 						= require('body-parser');
var cors       						= require('cors');

app.use(bodyParser.urlencoded({ extended: true, parameterLimit:10000, limit:'5mb'}));
app.use(bodyParser.json({parameterLimit:10000, limit:'5mb'}));
app.use(cors());


/**
 * ----------------------------------------
 * ROUTES
 * ----------------------------------------
 */

// IMPORTANT 
// set up core route engine, which gets passed to all routes below
var router = express.Router();

// ---- ENDPOINTS ----

/**
 * Create Chat Box
 * This endpoint accepts the POST from the Chat Box Config app below, 
 * and compiles the config options along with the templates (html,css,JS),
 * to produce the chat box and save it to the db. A snippet of code is 
 * returned to the app.  The snippet is displayed to the user so the user 
 * can embed it on their site.
 */
require('./endpoints.createchatbox/main.js')(router,DATASOURCE,db,BASEURL,PORT,ENV);

/**
 * Load Chat Box
 * This endpoint is called by the snipped from a user's website. It 
 * returns the chat box referred to by the key in the snippet url.
 */
require('./endpoints.loadchatbox/main.js')(router,ENV,DATASOURCE,db,BASEURL,PORT);

/**
 * Load Chat Box Message Templates
 * This endpoint is used by the chat box to load templates that are needed by 
 * the chatbot messages.
 */
require('./endpoints.loadmessagetemplate/main.js')(router,DATASOURCE,db,BASEURL,PORT);

/**
 * Chat Box Conversations (SocketIO)
 * This manages the sockets that the chat boxes use to communicate with
 * the Bot and with (potentially) other human beings.
 */
require('./endpoints.conversate/operator')(io,DATASOURCE,express,BASEURL,PORT,db);

/**
 * ChatBot
 * This endpoint sends messages and accepts responses from chat boxes
 * on user websites. These are sent through SocketIO.
 */
require('./endpoints.chatbot/main.js')(router,DATASOURCE,db,BASEURL);

/**
 * Contact Form
 * save the contact form hosted on our Webflow site (www.gokurbi.com)
 */
require('./endpoints.receivecontactform/main.js')(router,DATASOURCE,db);

/**
 * Logging
 * save logs to stamplay
 */
require('./endpoints.log/main.js')(router,DATASOURCE,db);


// ---- APPS ----

/**
 * Chat Box Configuration Form for Providers (app)
 */
app.use('/backend',express.static('apps.providerconfig'));

/**
 * Demo of a web page calling a chat box
 */
app.use('/demo', express.static('apps.demo'));

/**
 * App to build bot conversations
 */
app.use('/botbuilder', express.static('apps.botbuilder'));


// ---- STATIC ASSETS ----
app.use(express.static('static'));


// IMPORTANT 
// Add all routes to root URL
app.use('/',router);


/**
 * ----------------------------------------
 * INITIALIZE THE APP
 * ----------------------------------------
 */

ioServer.listen(LISTENPORT, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + LISTENPORT + ', using DATASOURCE ' + DATASOURCE + ', on ENV ' + ENV + ', using BASEURL: ' + BASEURL);
});