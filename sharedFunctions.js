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
		promises.push(new Promise(loadSnippet));

		Promise.all(promises).then(function(results){
			var template = {};
			template.hbs = results[0];

			template.less = {
									vars:results[1][0],
									file:results[1][1],
							};
			template.js = results[2];
			template.snippet = results[3];
			
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

	var returnObj = {
		loadTemplates: loadTemplates,
		compileHBS: compileHBS,
		compileLESS: compileLESS
	}

console.log('returnObj',returnObj);
	
	return returnObj;

}