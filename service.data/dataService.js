module.exports = function(DATASOURCE){
 
   return new Promise(function(resolve,reject){
   	
	connectDatasource(DATASOURCE).then(function(service){
 		resolve(service);
 		});

   });

}

function connectDatasource(DATASOURCE){
	return new Promise(function(resolve,reject){
	if(DATASOURCE=='live') connectMongoDB('mongodb://10.132.88.209:27017/kurbichat').then(function(msg){
	 	console.log(msg);
	 	var service = {};
	 	//build mongo service
	 	require('./mongo/provider.js')(service);
	 	require('./mongo/chatroom.js')(service);
	 	require('./mongo/botdialog.js')(service);
	 	require('./mongo/chatbox.js')(service);
	 	require('./mongo/chatstyle.js')(service);
	 	require('./mongo/chatbot.js')(service);
	 	resolve(service);
	 });

	 if(DATASOURCE=='mongodb') connectMongoDB('mongodb://localhost:27017/kurbichat').then(function(msg){
	 	console.log(msg);
	 	var service = {};
	 	//build mongo service
	 	require('./mongo/provider.js')(service);
	 	require('./mongo/chatroom.js')(service);
	 	require('./mongo/botdialog.js')(service);
	 	require('./mongo/chatbox.js')(service);
	 	require('./mongo/chatstyle.js')(service);
	 	require('./mongo/chatbot.js')(service);
	 	resolve(service);
	 });

	 if(DATASOURCE == 'stamplay') connectStamplay().then(function(db){
	 	console.log('connected to stamplay');
	 	//build stamplay service
	 	var service = {};
	 	require('./stamplay/chatroom.js')(service,db);
	 	require('./stamplay/chatbox.js')(service,db);
		require('./stamplay/provider.js')(service,db);
		require('./stamplay/botdialog.js')(service,db);
		require('./stamplay/chatstyle.js')(service,db);
		require('./stamplay/chatbot.js')(service,db);
	 	resolve(service);
	 });

	});
}

function connectMongoDB(url){

	return new Promise(function(resolve,reject){
		
			var db = require('mongoose');
			db.connect(url);
			var conn = db.connection;
			conn.on('error', function(err){
				reject(err);
			});
			conn.once('open', function(){
			    resolve("Mongo Connected");
			});

	});
	
}


function connectStamplay(){
	return new Promise(function(resolve,reject){
		var Stamplay = require('stamplay');
		var db = new Stamplay('kurbi', '7d99dc081cf607a09b09590cc2869bc3c39b1c3b176894fd0cca237e677213d0');	
		resolve(db);
	});
}
