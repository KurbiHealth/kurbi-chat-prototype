module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'kickstarter.welcome message',
			body:{
				displayName:name,
				text:"",
				image: URL+'',
				mainimage: URL+'/img/kickstarter/kickstarter-header.jpg',
			}

		},
		responses: {
			type:'kickstarter.response welcome',
			body:{
				yes:{
					text: "Let's talk about it",
					id: 'begin',
					message: {
						type: "kickstarter.text message",
						qCode: null,
						meta: 'yes',
						body: {
							text:"Let's talk about it",
						},
					},
				},
				no:{
					text: "I'd rather not",
			  		id: 'cancel',
					message: {
						type: "kickstarter.text message",
						qCode: null,
						meta: 'no',
						body: {
							text:"I'd rather not",
						},
					},
				}

			}
		}

	};

	// ---- CHOOSE AVATAR ----

	responses['avatar'] = chooseAvatar('get firstArticle');

	// ---- CHAIN OF QUESTIONS ----

	responses['get firstArticle'] = {
		message: specialMessage(name,"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempore consectetur, quo inventore velit? Culpa, quis necessitatibus illo. Ratione voluptates autem itaque rem eos omnis enim aspernatur officia tempore commodi.",URL+"/img/kickstarter/article-1.jpg","#","#ff667b",null,null),
		responses:{
			type:'kickstarter.response list text',
			body:[
				{text:"Next Article", message:textMessage(null,"Next Article","get secondArticle",null)},
			],
		}
	}

	responses['get secondArticle'] = {
		message: specialMessage(name,"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempore consectetur, quo inventore velit? Culpa, quis necessitatibus illo. Ratione voluptates autem itaque rem eos omnis enim aspernatur officia tempore commodi.",URL+"/img/kickstarter/article-2.jpg","#","#00bdec",null,null),
		responses:{
			type:'kickstarter.response list text',
			body:[
				{text:"Next Article", message:textMessage(null,"Next Article","get thirdArticle",null)},
			],
		}
	}

	responses['get thirdArticle'] = {
		message: specialMessage(name,"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempore consectetur, quo inventore velit? Culpa, quis necessitatibus illo. Ratione voluptates autem itaque rem eos omnis enim aspernatur officia tempore commodi.",URL+"/img/kickstarter/article-3.jpg","#","#debe8c",null,null),
		responses:{
			type:'kickstarter.response list text',
			body:[
				{text:"Next Article", message:textMessage(null,"Next Article","get fourthArticle",null)},
			],
		}
	}

	responses['get fourthArticle'] = {
		message: specialMessage(name,"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempore consectetur, quo inventore velit? Culpa, quis necessitatibus illo. Ratione voluptates autem itaque rem eos omnis enim aspernatur officia tempore commodi.",URL+"/img/kickstarter/article-4.jpg","#","#a2e73e",null,null),
		responses:{
			type:'kickstarter.response list text',
			body:[
				{text:"That's It", message:textMessage(null,"That's It","end",null)},
			],
		}
	}

	responses['end'] = {
		message:{
			type:'kickstarter.end message',
			body:{
				displayName:name,
				text:"Well, this is the end of our chat. Thanks a lot for taking the time to get to know us. We hope that the answers we find for you are helpful. Look for a summary of our conversation in your email inbox momentarily. If we happened to get something wrong or if there is something else you'd like to add follow the instructions to revisit our chat session.\n\n We wish you all the best!",
				image: URL+'/img/stv/stv-logo.png',
			}

		},
		responses: {
			type:'kickstarter.response end',
			body:{
				bye:{
					text: "End Chat Session",
					id: 'end',
				},
			}
		}

	};

	return responses;

	function textMessage(name,text,qCode,meta){
		var temp = {};
		temp['type'] = 'kickstarter.text message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;

		return temp;

	}

	function specialMessage(name,text,img,source,color,qCode,meta){
		var temp = {};
		temp['type'] = 'kickstarter.special message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		temp.body.img = img;
		temp.body.source = source;
		temp.body.color = color;

		return temp;

	}

	function linkMessage(name,text,link,source,qCode,meta){
		var temp = {};
		temp['type'] = 'kickstarter.link message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		temp.body.link = link;
		temp.body.source = source;

		return temp;

	}

	function eventMessage(name,img,qCode,meta){
		var temp = {};
		temp['type'] = 'kickstarter.event message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.img = img;

		return temp;

	}

	function chooseAvatar(qCode){

		var body = [];
		var letters = 'ABCDEFGHIJKLMNO';

		for(var i = 1; i < 13; i++){
			var temp = {};

			temp.url = URL+"/backend/icons/PNG/icon-"+i+".png";
			temp.message = {};
			temp.message.type = 'kickstarter.image message';
			temp.message.qCode = qCode;
			temp.message.meta = i;
			temp.message.body = {
							image: temp.url,
								};
			temp.id = i;
			body.push(temp);
		}

		var msg =	{
				message:{
					type:'kickstarter.text message',
					body:{
						displayName:name,
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'kickstarter.response list icons',
					body:body,
				}

		};

		return msg;
	}

}
