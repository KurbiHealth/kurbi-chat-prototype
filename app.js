/**
 * ----------------------------------------
 * SET UP APP FUNCTIONS
 * ----------------------------------------
 * node app.js [port] stamplay
 */

var express 						= require('express');
var app								= express();
var port 							= process.argv[2] || 8080;
var baseDir							= 'http://kchat:8080';
//var baseDir							= 'http://public.foolhardysoftworks.com:9000';
//var baseDir							= 'http://chat.gokurbi.com'

/**
 * ----------------------------------------
 * DATA LAYER 
 * ----------------------------------------
 */

var mongoose   = require('mongoose');
mongoose.connect('mongodb://inferno:27017/kurbichat');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection Error : '));
db.once('open', function(){
  console.log('Mongo connection ok!');
});

var Stamplay = require('stamplay');
var stamplay = new Stamplay('kurbi', '7d99dc081cf607a09b09590cc2869bc3c39b1c3b176894fd0cca237e677213d0');
if(process.argv[3] == 'stamplay')
	var useStamplay = true;
else
	var useStamplay = false;

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

// set up core route engine, which gets passed to all the sub-route definition files
var router = express.Router();

/**
 * Create Chat Box
 * this endpoint ...
 */
require('./endpoints.createchatbox/main.js')(router,mongoose,useStamplay,stamplay,baseDir);

/**
 * Load Chat Box
 * this endpoint ...
 */
require('./endpoints.loadchatbox/main.js')(router);

/**
 * Chat Box Conversations (SocketIO)
 * COMING...
 */
require('./endpoints.conversate/main.js')(router,mongoose,useStamplay,stamplay);

/**
 * Chat Box Configuration Form for Providers (app)
 */
app.use('/backend',express.static('apps.providerconfig'));

/**
 * Demo of a web page calling a chat box
 */
app.use('/demo', express.static('apps.demo'));


// ADD ALL ROUTES TO ROOT URL
app.use('/',router);


/**
 * ----------------------------------------
 * INITIALIZE THE APP
 * ----------------------------------------
 */

app.listen(port, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + port);
});