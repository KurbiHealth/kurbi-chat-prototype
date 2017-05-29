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
		if(req.query.theme) req.query.template = req.query.theme + "." + req.query.template;
		// else req.query.template = "mawc." + req.query.template;

		var templateArray = req.query.template.split(".");
		var templateName = templateArray[templateArray.length - 1];
		var templatePath = templateArray.slice(0,templateArray.length-1).join("/");

		var dir = './endpoints.loadmessagetemplate/templates/'+templatePath +"/";
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

			case 'special message':
			filename = dir + 'special_message.hbs';
			break;

			case 'youtube message':
			filename = dir + 'youtube_message.hbs';
			break;

			case 'link message':
			filename = dir + 'link_message.hbs';
			break;

			case 'event message':
			filename = dir + 'event_message.hbs';
			break;

			case 'end message':
			filename = dir + 'end_page.hbs';
			break;

			case 'begin chat':
			filename = dir + 'response_begin_chat.hbs';
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


		globFunc.loadFile(filename)
		.then(function(template){

			res.send(template.replace(/#SMALL_IMAGE_URL/g, serverURL+'/img/icons/small-image.png'));

		});

	}

}
