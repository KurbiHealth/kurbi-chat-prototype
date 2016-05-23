var express 						= require('express');
var app								= express();


var bodyParser 						= require('body-parser');
var cors       						= require('cors');
var port 							= process.argv[2] || 8080; 

var ioServer 						= require('http').Server(app)
var io 								= require('socket.io')(ioServer);
var publicRoutes 					= require('./javascript/chatloader_routes')(app);
var botRoutes 						= require('./javascript/botbuilder_routes')(app);
var operatorRoutes 					= require('./javascript/operator')(io);

var mongoose   = require('mongoose');
mongoose.connect('mongodb://inferno:27017/kurbichat');

app.use(bodyParser.urlencoded({ extended: true, parameterLimit:10000, limit:'5mb'}));
app.use(bodyParser.json({parameterLimit:10000, limit:'5mb'}));
app.use(cors());

var router = express.Router();  
app.use('/',publicRoutes);
app.use('/',botRoutes);
app.use('/backend',express.static('public/backend'));
app.use('/demo', express.static('public/kurbi-chat-demo'));
app.use('/botbuilder', express.static('public/botbuilder'));


ioServer.listen(port, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + port);
});




