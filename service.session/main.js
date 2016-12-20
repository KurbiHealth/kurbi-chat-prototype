module.exports = function (errorHandler){

	var sessions = {};
	var winston = require('winston');

	return function(){
		var target = arguments[0];
		var id = null;
		var next = arguments[arguments.length - 1];
		if(target.get) id = target.get('x-kurbi-header');
		if(!id){
			if(target.handshake && target.handshake.query && target.handshake.query.sessionID){
				id = target.handshake.query.sessionID;
			}
		}
		if(id){ 
			//has session id
			if(!sessions[id]) {
				sessions[id] = {};
				sessions[id].id = id;
			//	sessions[id].log = errorHandler.logFactory(id);
			}

			arguments[0].session = sessions[id];
		}
		return next();
		
	}

}





//the function is based on these... io and node use different arguments for their middleware.
//function node(req,res,next){
// 	req.session = {};
// 	req.session.id = req.get('x-kurbi-header');
// 	next();
// }

// function io(socket,next){
//  	socket.session = {};
//     if(socket.handshake.query && socket.handshake.query.sessionID) {
//     	socket.session.id = socket.handshake.query.sessionID;
//     }
//     next();
	
// }