module.exports = function(){
/**
 * ----------------------------------------
 * SET UP WINSTON
 * ----------------------------------------
 */ 
 	//URL of the endpoint that receives errors
    var url = 'localhost';
    var port = '8080';
    var path = '/error';

	var winston 				= require('winston');
	winston.add(winston.transports.Http, {
		host:url,
		port:port,
		path:path,
		level:'warn',
	});

	winston.add(winston.transports.File, {
		filename: './error.log',
		level: 'info',

	});


/**
 * ----------------------------------------
 * SET UP MODULE SERVICE
 * ----------------------------------------
 */


	var service = {};
	service.ErrorHandler 		= ErrorHandler;
	service.httpErrorHandler 	= httpErrorHandler;
	service.error 				= appError;

	return service;


/**
 * ----------------------------------------
 * SET UP FUNCTIONS
 * ----------------------------------------
 */


function ErrorHandler(err, promise){
	if(!err.handled) 
		shutdown('== GENERAL ERROR ==', err);
	else
		winston.log('warn', err.meta);	
	
}

function httpErrorHandler(err,req,res,next){
	res.status(500).send('Server Error');
	if(!err.handled) 
		shutdown('== ENDPOINT ERROR ==',err);
	else
		winston.log('warn', err.meta);	
	
	
}

function appError(msg, meta){
	var e = new Error(msg);
	e.handled = true;
	if(meta)
		e.meta = meta;
	return e;
}

function shutdown(msg, err){
	//we encountered an unexpected error... we have no idea what might be broken
	//so shutdown the server!  
	winston.log('error', msg, err.stack, function(err){
	process.exit(1);
	});
}


}