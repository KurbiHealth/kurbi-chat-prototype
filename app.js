/**
 * ----------------------------------------
 * GET COMMAND LINE PARAMETERS
 * ----------------------------------------
 * ON DEV:  PORT=?? DATASOURCE=?? BASEURL=?? ENV=?? node app.js
 * ON PROD: PORT=?? DATASOURCE=?? BASEURL=?? ENV=?? forever app.js
 * 
 * 		PORT 		= 8180|3000
 *			The external port of the server, that people on the outside will use to access the server's resources
 *		LISTENPORT  = 8080
 *			The internal port of the server.
 * 		DATASOURCE 	= stamplay|mongodb 
 * 		BASEURL 	= http://kchat:LISTENPORT|http://chat.gokurbi.com|http://public.foolhardysoftworks.com:LISTENPORT
 * 		ENV 		= prod|dev|local
 *
 * LOCAL (MATT'S):  
 * 		LISTENPORT=8080 PORT=8180 DATASOURCE=stamplay BASEURL=http://kchat:8080 ENV=local node app.js
 * PROD: 
 * 		LISTENPORT=3000 DATASOURCE=stamplay BASEURL=http://chat.gokurbi.com ENV=prod forever start app.js
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
var socketwild 						= require('socketio-wildcard')();
var bodyParser 						= require('body-parser');
var cors       						= require('cors');



/////

io.use(socketwild);
io.set('origins', '*:*');


/**
 * ----------------------------------------
 * SET UP ERROR HANDLING
 * ----------------------------------------
 */

var kurbiErrors 					= require('./service.error/main')(DATASOURCE);
global.appError = kurbiErrors.error;

global.log = kurbiErrors.log;
global.debug = kurbiErrors.debug;

process.on('unhandledRejection', kurbiErrors.ErrorHandler);

function setupExpressErrorHandling(){
	log("\n")
	log("Error Handling ");
	//this needs to be called after all the other app.use() 
	app.use(kurbiErrors.httpErrorHandler);
}

/**
 * ----------------------------------------
 * SET UP SESSION
 * ----------------------------------------
 */
//session management
//can't use express-session, because we can't use cookies.
//we can't use cookies because the snippet can be on any webpage, so our server
//has no idea what domains the requests will come from.
//so our clients send a custom header from the physics token generated by the client.
var session 						= require('./service.session/main')(kurbiErrors);
app.use(session);
io.use(session);


/**
 * ----------------------------------------
 * SET UP EXPRESS UTILITIES
 * ----------------------------------------
 */

app.use(bodyParser.urlencoded({ extended: true, parameterLimit:10000, limit:'5mb'}));
app.use(bodyParser.json({parameterLimit:10000, limit:'5mb'}));
app.options('/template', cors());
app.use(cors());


/**
 * ----------------------------------------
 * ATTACH THE DATASOURCe, THEN: Attach Routes
 * ----------------------------------------
 */

log('connecting data service');
require('./service.data/dataService.js')(DATASOURCE).then(function(db){
//we are now connected to our data service, so it's safe to make data calls
log('data service connected');

var devUser = function(req,res,next){

    var admin = {};
	admin.email = "matteckman@gmail.com";
	//admin.email = "john@foolhardysoftworks.com";
	admin.role = 'admin';
	admin.enabled = true;
	admin.chatboxes = [];
	// db.createProvider(admin).then(function(doc){
	// 	req.user = doc;
	// 	next();
	// });
if(DATASOURCE == "stamplay")
	req.user = {
      "_id": "57699528f4924a7f641e4950",
      "email": "matteckman@gmail.com",
      "password": "$2a$12$3CKMLBaQONjgjznfldd.oOfl3bQmUaUnsJ/40B38L/oOD8QEFHVfW",
      "displayName": "matteckman",
      "givenRole": "571670d1c961e8ec69779144",
      "appId": "kurbi",
      "__v": 0,
      "customData": {
        "email me": "Yes, that's right",
        "ask for email": "It hurts more when I ride my bike.",
        "you got it": "Yes, that's right",
        "user summary": "Professional Care",
        "get treatment": "Longer than a week",
        "get duration": "back pain"
      },
      "firstName": "Matt",
      "dt_update": "2016-08-17T16:26:05.315Z",
      "dt_create": "2016-06-21T19:27:36.880Z",
      "emailVerified": true,
      "verificationCode": "7420e16a731fe06f7deb",
      "profileImg": "",
      "id": "57699528f4924a7f641e4950"
    };
if(DATASOURCE="mongodb")
	req.user = {
		"_id":"58041b251769e0406744deff",
		"enabled":"true",
		"role":"admin",
		"email":"john@foolhardysoftworks.com",
	}

    next();
	
}

if(ENV == 'dev' || ENV == 'prod') {
	log("using hardcoded user, devUser()");
	app.use(devUser);
}

/**
 * ----------------------------------------
 * ROUTES
 * ----------------------------------------
 */

// IMPORTANT 
// set up core route engine, which gets passed to all routes below
log('\n');
log('connecting main routes');
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

require('./endpoints.createchatbox/main.js')(router,db,BASEURL,PORT,ENV);
log('./endpoints.createchatbox ');

/**
 * Load Chat Box Message Templates
 * This endpoint is used by the chat box to load templates that are needed by 
 * the chatbot messages.
 */

require('./endpoints.loadmessagetemplate/main.js')(router,db,BASEURL,PORT);
log('./endpoints.loadmessagetemplate ');

/**
 * Chat Box Conversations (SocketIO)
 * This manages the sockets that the chat boxes use to communicate with
 * the Bot and with (potentially) other human beings.
 */
var operator = require('./endpoints.conversate/operator')(io,express,BASEURL,LISTENPORT,db);
log('./endpoints.conversate/operator ');

require('./endpoints.admin/main.js')(router,operator);
log('./endpoints.admin ');
/**
 * ChatBot
 * This endpoint sends messages and accepts responses from chat boxes
 * on user websites. These are sent through SocketIO.
 */
//require('./endpoints.chatbot/main.js')(router,db,BASEURL);

/**
 * Contact Form
 * save the contact form hosted on our Webflow site (www.gokurbi.com)
 */
require('./endpoints.receivecontactform/main.js')(DATASOURCE,router,db);
log('./endpoints.receivecontactform ');
/**
 * Logging
 * save logs to stamplay
 */
require('./endpoints.log/main.js')(router,DATASOURCE,db);
log('./endpoints.log ');

// ---- APPS ----
log('\n');
log('connecting static apps');
/**
 * Chat Box Configuration Form for Providers (app)
 */
app.use('/backend',express.static('apps.providerconfig'));
log('./backend ');
/**
 * Demo of a web page calling a chat box
 */
app.use('/demo', express.static('apps.demo'));
log('./demo ');

app.use('/matias', express.static('apps.matias'));
log('./demo ');

app.use('/builder', express.static('apps.builder'));
log('./builder ');

app.use('/preview', express.static('apps.preview'));
log('./preview ');

app.use('/modea', express.static('apps.demo.rickandmorty'));
log('./modea ');

app.use('/modea/admin',express.static('apps.chatadmin'));
log('./admin')
/**
 * App to build bot conversations
 */
//app.use('/botbuilder', express.static('apps.botbuilder'));


// ---- STATIC ASSETS ----
 app.use(express.static('static'));


// IMPORTANT 
// Add all routes to root URL
app.use('/',logRoutes);
io.use(logSockets);
app.use('/',router);

//ERROR HANDLER
setupExpressErrorHandling();

log('\n');
log('SERVER READY \n');

function logSockets(socket,next){
	socket.on('*', function(packet){
	 log("SOCKET/"+packet.data[0], packet.data[1]);

	 // if(socket.session){
	 // 	console.log("logSockets: ", socket.session.log.transports.file.filename);
		// packet.data[1].sessionID = socket.session.id;
		// if(socket.room) packet.data[1].room = socket.room;
		// socket.session.log.info("SOCKET/"+packet.data[0], packet.data[1]);
	 //  }
	});
	next();
}


function logRoutes(req,res,next){

	var data = {};
	if(req.body && Object.keys(req.body).length > 0) data.body = req.body;
	if(req.params && Object.keys(req.params).length > 0) data.params = req.params;
	if(req.query && Object.keys(req.query).length > 0) data.query = req.query;
	log(req.method + req.path, data);
	if(req.session) {
		//req.session.log.info(req.method + req.path, data);
		data.sessionID = req.session.id;
	}
	next();
}

/**
 * ----------------------------------------
 * INITIALIZE THE APP
 * ----------------------------------------
 */

ioServer.listen(LISTENPORT, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + LISTENPORT + ', using DATASOURCE ' + DATASOURCE + ', on ENV ' + ENV + ', using BASEURL: ' + BASEURL);
  console.log('\n');

});


}); //end of the dataservice bracket.



