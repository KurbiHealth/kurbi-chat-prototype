var express 						= require('express');
var app								= express();
var publicRoutes 					= require('./javascript/public_routes')(app);
var bodyParser 						= require('body-parser');
var cors       						= require('cors');
var port 							= process.argv[2] || 8080; 


var mongoose   = require('mongoose');
mongoose.connect('mongodb://inferno:27017/kurbichat');

app.use(bodyParser.urlencoded({ extended: true, parameterLimit:10000, limit:'5mb'}));
app.use(bodyParser.json({parameterLimit:10000, limit:'5mb'}));
app.use(cors());

var router = express.Router();

app.use('/',publicRoutes);

app.use('/backend',express.static('public/backend'));

app.use('/demo', express.static('public/kurbi-chat-demo'));


app.listen(port, function(err,data){
  if(err) console.log(err);
  console.log(new Date());
  console.log('listening on port ' + port);
});