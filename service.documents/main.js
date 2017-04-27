module.exports = function(chatbox, bot, data){
var Handlebars 						= require('handlebars');
//should be handlebar templates
//each template should know what variables it needs.
debug('Generating Documents');
getOwner().then(getTemplates).then(generateDocuments).then(function(documents){
	debug("here are the documents", documents);
});

function getOwner(){
	return new Promise(function(resolve,reject){
		resolve('tony');
	});

}

function getTemplates(owner){
	return new Promise(function(resolve,reject){
	var dummyData = [
		{
			template:"<div>HI {{symptom}}</div>",
			variables:["symptom"],
		},
		{
			template:"<div>Bye {{symptom}}</div>",
			variables:["name"],
		}
	];

	resolve(dummyData);

	});

}

function generateDocuments(templates){
	var documents = [];
	return new Promise(function(resolve,reject){
		templates.filter(isComplete).forEach(function(t){
			documents.push(Handlebars.compile(t.template)(data));
			resolve(documents);
		});
	});
}


function isComplete(template){
	var result = true;
	var variables = Object.keys(data);

	template.variables.forEach(function(e){
		if(variables.indexOf(e) == -1) result = false;
	});
	return result;
}




}


