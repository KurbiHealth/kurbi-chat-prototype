var UglifyJS 						= require('uglify-js');
var Handlebars 						= require('handlebars');
var Less 							= require('less');
var fs 								= require('fs');

module.exports = function(){

	function loadTemplates(resolve,reject){
		//this just loads the templates as strings using: loadHBS, loadLESS, loadJS, and loadSnippet.
		//called on server boot.  

		var promises = [];
		promises.push(new Promise(loadHBS('./endpoints.createchatbox/templates/html/chat_template.hbs')));
		promises.push(new Promise(loadLESS));
		promises.push(new Promise(loadJS));
		//promises.push(new Promise(loadSnippet));
		console.log('bark');

		Promise.all(promises).then(function(results){
			console.log('bee');

			var template = {};
			template.hbs = results[0];

			template.less = {
									vars:results[1][0],
									file:results[1][1],
							};
			template.js = results[2];
			template.snippet = results[3];
			console.log('shared', template);
			resolve(template);

		});	
	}

	function compileHBS(data,hbs){
		return new Promise(function(resolve,reject){
			var html = Handlebars.compile(hbs)(data);
			resolve(html);
		});
	}

	function compileLESS(data,less){
		//because of the cascading nature of css
		//the less file had to be broken into two pieces
		//a template holding default css variables
		//which is loaded first.
		//then the user preferences can overwrite those.
		//then they can be applied to the 
		//chat_template.less

		var dataString = less.vars;
		return new Promise(function(resolve,reject){
			for(var key in data){
				dataString += '@'+key +":"+data[key] +';';
			}
			dataString += less.file;
			Less.render(dataString, function(err,output){
				if(err) return console.log(err);
				resolve(output.css);
			})

		});

	}

	function loadHBS(filename){
		return function(resolve,reject){
			fs.readFile(filename, 'utf8',function(err,data){
				if(err) return console.log(err);
				resolve(data);
			});

		}
	}

	function loadJS(resolve,reject){
			fs.readFile('./endpoints.createchatbox/templates/javascript/chat_template.js', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});			
	}

	function loadSnippet(resolve,reject){
			fs.readFile('./endpoints.createchatbox/templates/javascript/snippet_template.js', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});			
	}

	function loadLESS(resolve,reject){
			Promise.all([new Promise(loadDefaultLessVariables), new Promise(loadDefaultBaseLess)])
			.then(function(results){
				resolve(results);
			});
	}
	
	function loadDefaultLessVariables(resolve,reject){
		fs.readFile('./endpoints.createchatbox/templates/css/default_variables.less', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});	
	}

	function loadDefaultBaseLess(resolve,reject){
			fs.readFile('./endpoints.createchatbox/templates/css/chat_template.less', 'utf8',function(err,data){
				if(err) return console.log(err);
					resolve(data);	
			});	
	}

	var returnObj = {
		loadTemplates: loadTemplates,
		compileHBS: compileHBS,
		compileLESS: compileLESS,
		loadHBS: loadHBS,
		loadJS: loadJS,
		loadSnippet: loadSnippet,
		loadLESS: loadLESS
	}
	
	return returnObj;

}