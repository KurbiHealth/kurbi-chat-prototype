module.exports = function(DATASOURCE){
/**
 * ----------------------------------------
 * SET UP WINSTON
 * ----------------------------------------
 */ 
 	//URL of the endpoint that receives errors
    var url = 'kurbi.stamplayapp.com';
    var port = '';
    var path = '/api/cobject/v1/logs';
    var count = 0;
    var levels = {
    	'debug' : 	0,
    	'error' : 	1,
    	'warn'  : 	2, 
    	'info'  : 	3,
    	'verbose' : 4,
    	'silly'   : 5,
    }

	var winston 				= require('winston');
	//creating a separate logger to handle debugging
	//because we don't want debug logs to be sent to stamplay
	//but we do want debug stuff to be entered into the error log
	
	var debugLogger = new (winston.Logger)({
	    levels: levels,
	    transports: [
	        new winston.transports.Console({level:'info'})
	    ]
	});

	if(DATASOURCE == 'stamplay'){
		console.log('Stamplay Detected, sending errors to ' + url + path);
		winston.add(winston.transports.Http, {
			host:url,
			port:port,
			path:path,
			level:'warn',
		});
	}
	

	winston.add(winston.transports.File, {
		filename: './error.log',
		level: 'info',
		json: false,
		formatter: fileFormat,
	});


	debugLogger.add(winston.transports.File, {
		filename: './error.log',
		level: 'debug',
		json: false,
		formatter: fileFormat,
	});
winston.default.transports.console.level='error';


var restarted = true;
winston.log("info", "restart server");


function fileFormat(data){
	var s = "";
	if(restarted){
		s += "\n\n";
		restarted = false;
	}
	
	s += new Date().getTime() + "\t "; 
	if(data.level != 'info') s += "\t level: "+ data.level + ", ";
	s += data.message;
	
	if(data.meta && Object.keys(data.meta).length > 0) s+= "\n\t\t\t\t meta: " + JSON.stringify(data.meta);	
	
	return s;
}

function fileFormat2(data){
	var s = "qcode: " + count + "," + data.meta.qcode;
	console.log("fileFormat2 " + s);
	count++;
	return s;
}



/**
 * ----------------------------------------
 * SET UP MODULE SERVICE
 * ----------------------------------------
 */


	var service = {};
	service.ErrorHandler 		= ErrorHandler;
	service.httpErrorHandler 	= httpErrorHandler;
	service.error 				= appError;
	service.log 				= winston.info;
	service.debug 				= debugLogger.debug;
	service.logFactory 			= loggerFactory;
	return service;


/**
 * ----------------------------------------
 * SET UP FUNCTIONS
 * ----------------------------------------
 */

function loggerFactory(id){
		var log =  new (winston.Logger)({
		    transports: [
		        new winston.transports.Console({level:'info'})
		    ]
		});

		log.add(winston.transports.File, {
			filename: './service.error/logs/sessions/' + id + '.log',
			level: 'info',
			json: false,
			formatter: fileFormat2,
		});

		log.transports.console.level='error';
		
		return log;

}

function ErrorHandler(err, promise){
	if(!err.handled) 
		shutdown('== GENERAL ERROR ==', err);
	else
		winston.log('warn', err, err.meta);	
	
}

function httpErrorHandler(err,req,res,next){
	res.status(500).send('Server Error: ',err.toString());
	if(!err.handled) 
		shutdown('== ENDPOINT ERROR ==',err);
	else
		winston.log('warn', err, err.meta);	
	
	
}

function appError(msg, meta){
	var e = new Error(msg);
	e.handled = true;
	if(meta)
		e.meta = meta;
	else e.meta = {};
	e.meta.source = "server";
	return e;
}

function shutdown(msg, err){
	//we encountered an unexpected error... we have no idea what might be broken
	//so shutdown the server! 
	if(!err) err = {};
console.log('err',err);    
	if(!err.meta || err.meta == null) err.meta = {};
	if(err.stack) err.meta.stack = err.stack;
	err.meta.source = "server";
	winston.log('error', msg, err.meta, function(err){
		process.exit(1);
	});
}


}



		// socket.sessionLogger = new (winston.Logger)({
		// 			    transports: [
		// 			        new winston.transports.Console({level:'info'})
		// 			    ]
		// 			});
		// socket.sessionLogger.add(winston.transports.File, {
		// 		filename: './service.error/logs/socket_sessions/'+socket.session.id+".log",
		// 		level: 'info',
		// 		json: false,
		// 		formatter: function(data){
		// 			var s = data.meta[0] +"\t\t " + JSON.stringify(data.meta[1]);
		// 			return s;
		// 		}
		// 	});
