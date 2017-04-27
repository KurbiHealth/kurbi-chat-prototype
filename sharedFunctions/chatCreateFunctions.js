var UglifyJS 						= require('uglify-js');
var Handlebars 						= require('handlebars');
var Less 							= require('less');
var fs 								= require('fs');

module.exports = function(){

	var returnObj = {
		loadTemplates: loadTemplates,
		compileHBS: compileHBS,
		compileLESS: compileLESS,
		loadSnippet: loadSnippet,
		loadFile: loadFile,

	}
	
	return returnObj;

	function loadTemplates(configuration){
		var templateName = configuration.template;
		return new Promise(function(resolve,reject){
			//this just loads the templates as strings using: loadHBS, loadLESS, loadJS, and loadSnippet.
			//called on server boot.  
			var hbsPath = './endpoints.createchatbox/templates/'+templateName+'/html/chat_template.hbs';
			var defaultLESSPath = './endpoints.createchatbox/templates/'+templateName+'/css/default_variables.less';
			var chatLESSPath = './endpoints.createchatbox/templates/'+templateName+'/css/chat_template.less';
			var jsPath = './endpoints.createchatbox/templates/chat_template.js';
			var snippetPath = './endpoints.createchatbox/templates/snippet_template.js';
			var configurationPath = './endpoints.createchatbox/templates/'+templateName+'/configuration.json';

			var promises = [];
			promises.push(loadFile(hbsPath));
			promises.push(loadFile(defaultLESSPath));
			promises.push(loadFile(chatLESSPath));
			promises.push(loadFile(jsPath));
			promises.push(loadFile(snippetPath));
			promises.push(loadFile(configurationPath));
			

			Promise.all(promises).then(function(results){

				var template = {};
				template.hbs = results[0];

				template.less = {
										vars:results[1],
										file:results[2],
								};
				template.js = results[3];
				template.snippet = results[4];
				template.configuration = JSON.parse(results[5]) || {};
				//merge the custom settings and default settings;
				if(configuration){
					Object.keys(configuration.js).forEach((key) => {template.configuration.js[key] = configuration.js[key]});
					Object.keys(configuration.hbs).forEach((key) => {template.configuration.hbs[key] = configuration.hbs[key]});
					Object.keys(configuration.less).forEach((key) => {template.configuration.less[key] = configuration.less[key]});	
				}
				//now put the js configuration the js template
				Object.keys(template.configuration.js).forEach((key)=>{template.js = template.js.split(key).join(template.configuration.js[key])});
				resolve(template);

			});	
			
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


	function loadFile(filename){
		return new Promise(function(resolve,reject){
				fs.readFile(filename, 'utf8',function(err,data){
					if(err) return reject(err);
					resolve(data);
				});
		});
	}


/// General Work Flow  (createSnippet)
//   create snippet takes the custom user preferences
//   and merges them with handlebar templates (hbs) and 
//   less templates to generate final 
//   html and css files.   (compileHBS/ compileLESS)

//   these html, css, and the template js files are then 
//   converted into strings and stored in the database on
//   chat a new chat entity.
//   (chat.save)
//
//   a snippet template is then compiled, replacing the word
//   #BANANA with the chat entity id.  This snippet can then
//   be pasted into a webpage to call our database 
//   and download the previously referenced html/css/js files
//   as strings. 
//
//   the snippet is uglified, so that it will take up less space
//   and be harder to read, then returned to the backend to be displayed
//   to the user.      

	function loadSnippet(id, url){
		var snippetPath = './endpoints.createchatbox/templates/snippet_template.js';
		return loadFile(snippetPath).then((snippet)=>{ return createSnippet(id, url,snippet)});
	}

	function createSnippet(id,url,snippet){
		return new Promise(function(resolve,reject){
			var customSnippet = snippet.replace('#BANANA', id).replace(/#SERVER_URL/g,url);
			var uglySnippet = UglifyJS.minify(customSnippet, {fromString: true});
			resolve(uglySnippet.code);	
		});
		
		

	}



}