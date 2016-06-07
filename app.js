/**
 * ----------------------------------------
 * GET COMMAND LINE PARAMETERS
 * ----------------------------------------
 * ON DEV:  PORT=?? DATASOURCE=?? BASEURL=?? ENV=?? node app.js
 * ON PROD: PORT=?? DATASOURCE=?? BASEURL=?? ENV=?? forever app.js
 * 
 * 		PORT 		= 8080
 * 		DATASOURCE 	= stamplay|mongodb 
 * 		BASEURL 	= http://kchat:8080|http://chat.gokurbi.com|http://public.foolhardysoftworks.com:9000
 * 		ENV 		= prod|dev|local
 * 
 * @TODO figure out how to pass BASEURL to the apps (static routes); the express.
 * static() middleware does not use next(), so there is now way to intercept the 
 * static file prior to sending to user
 * TEMP: PORT=8080 DATASOURCE=stamplay BASEURL=http://kchat:8080 ENV=local node app.js
 */

var ENV 		= process.env.ENV 			|| 'prod';
var PORT 		= process.env.PORT 			|| 8080;
var BASEURL		= process.env.BASEURL		|| 'http://chat.gokurbi.com';
var DATASOURCE	= process.env.DATASOURCE 	|| 'stamplay';


/**
 * ----------------------------------------
 * SET UP APP FUNCTIONS
 * ----------------------------------------
 */

var express 						= require('express');
var app								= express();
<<<<<<< HEAD
<<<<<<< HEAD


var bodyParser 						= require('body-parser');
var cors       						= require('cors');
var port 							= process.argv[2] || 8080; 

var ioServer 						= require('http').Server(app)
var io 								= require('socket.io')(ioServer);
var publicRoutes 					= require('./javascript/chatloader_routes')(app);
var botRoutes 						= require('./javascript/botbuilder_routes')(app);
var operatorRoutes 					= require('./javascript/operator')(io);
=======
var port 							= process.argv[2] || 8080;
var baseDir							= 'http://kchat:8080';
//var baseDir							= 'http://public.foolhardysoftworks.com:9000';
//var baseDir							= 'http://chat.gokurbi.com'
=======
var ioServer 						= require('http').Server(app)
var io 								= require('socket.io')(ioServer);

>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce

/**
 * ----------------------------------------
 * DATA LAYER 
 * ----------------------------------------
 */
>>>>>>> matt

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

<<<<<<< HEAD
var router = express.Router();  
app.use('/',publicRoutes);
app.use('/',botRoutes);
app.use('/backend',express.static('public/backend'));
app.use('/demo', express.static('public/kurbi-chat-demo'));
app.use('/botbuilder', express.static('public/botbuilder'));
=======
>>>>>>> matt

/**
 * ----------------------------------------
 * ROUTES
 * ----------------------------------------
 */

// *************
// * IMPORTANT *  set up core route engine, which gets passed to all routes below
// *************
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
require('./endpoints.createchatbox/main.js')(router,DATASOURCE,db,BASEURL);

/**
 * Load Chat Box
 * This endpoint is called by the snipped from a user's website. It 
 * returns the chat box referred to by the key in the snippet url.
 */
require('./endpoints.loadchatbox/main.js')(router,DATASOURCE,db);

/**
 * Load Chat Box Message Templates
 * This endpoint is used by the chat box to load templates that are needed by 
 * the chatbot messages.
 */
require('./endpoints.loadmessagetemplate/main.js')(router,DATASOURCE,db);

/**
 * Chat Box Conversations (SocketIO)
 * This manages the sockets that the chat boxes use to communicate with
 * the Bot and with (potentially) other human beings.
 */
require('./endpoints.conversate/operator')(io,DATASOURCE,db,express);

/**
 * ChatBot
 * This endpoint sends messages and accepts responses from chat boxes
 * on user websites. These are sent through SocketIO.
 */
require('./endpoints.chatbot/main.js')(router,DATASOURCE,db,BASEURL);

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


// *************
// * IMPORTANT *  Add all routes to root URL
// *************
app.use('/',router);


/**
 * ----------------------------------------
 * INITIALIZE THE APP
 * ----------------------------------------
 */

<<<<<<< HEAD
ioServer.listen(port, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + port);
});




=======
ioServer.listen(PORT, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + PORT + ', using DATASOURCE ' + DATASOURCE + ', on ENV ' + ENV + ', using BASEURL: ' + BASEURL);
});
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
