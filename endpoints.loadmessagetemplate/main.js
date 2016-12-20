module.exports = function(router,db,BASEURL,PORT){
	var serverURL = BASEURL;
	if(PORT && PORT != 80) serverURL = BASEURL + ":" + PORT;

	var globFunc = require('../sharedFunctions/chatCreateFunctions')();


// -------------------------------------------
// ROUTE DEFINITION
// This is a dev/debug version of the endpoint, the production version is on Stamplay
// Each time this is loaded, it recompiles the chat box & serves the chat box to the 
// client webpage (snippet_template.js)
	router
		.route('/template')
			.get(getTemplate);
// -------------------------------------------

	return router;

	function getTemplate(req,res){
		var templateName = req.query.template;

		var dir = './endpoints.loadmessagetemplate/templates/';
		var filename = null;

		switch(templateName){

			case 'welcome message':
			filename = dir + 'welcome_page.hbs';
			break;

			case 'text message':
			filename = dir + 'text_message.hbs';
			break;

			case 'image message':
			filename = dir + 'image_message.hbs';
			break;

			case 'end message':
			filename = dir + 'end_page.hbs';
			break;

			case 'response welcome':
			filename = dir + 'response_welcome.hbs';
			break;

			case 'response list text':
			filename = dir + 'response_list_text.hbs';
			break;

			case 'response list icons':
			filename = dir + 'response_list_icons.hbs';
			break;

			case 'large free response':
			filename = dir + 'response_free_large.hbs';
			break;

			case 'small free response':
			filename = dir + 'response_free_small.hbs';
			break;

			case 'response end':
			filename = dir + 'response_end.hbs';
			break;


			default:

		}
		

		new Promise(globFunc.loadHBS(filename))
		.then(function(template){

			res.send(template.replace(/#SMALL_IMAGE_URL/g, serverURL+'/backend/icons/PNG/small-image.png'));

		});

	}

}