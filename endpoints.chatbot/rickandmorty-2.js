module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'rickandmorty.welcome message',
			body:{
				displayName:name,
				headline: "SIKE!",
				text:"LOL... It's me - Rick! \n Let's talk about your stupid leg pain.",
				image: URL+'/img/rickandmorty/morty-headshot.png',
				mainimage: URL+'/img/rickandmorty/morty-welcome.jpg',
			}

		},
		responses: {
			type:'rickandmorty.response welcome',
			body:{
				yes:{
					text: "Ok. Fine! Let's talk, Rick.",
					id: 'begin',
					message: {
						type: "rickandmorty.text message",
						qCode: null,
						meta: 'yes',
						body: {
							text:"Ok. Fine! Let's talk, Rick.",
						},
					},
				},

			}
		}

	};

	// ---- CHOOSE AVATAR ----

	responses['avatar'] = chooseAvatar('get duration');

	// ---- CHAIN OF QUESTIONS ----

///------------ how long has your leg hurt?
	responses['get duration'] = {
		message: textMessage(name,"Alright. For once in life, be honest. Tell me about your leg pain.",null,null),
		responses:{
			type:'rickandmorty.response list text',
			variable: 'symptomDuration',
			body:[
				{text:"It's hurt for a day", message:textMessage(null,"A day or so","day of pain",null)},
				{text:"It's hurt for more than a day", message:textMessage(null,"About a week", "days of pain", null)},
				{text:"It's hurt a week or more", message:textMessage(null,"Longer than a week", "weeks of pain", null)},
			],
		}
		}

		responses['day of pain'] = {
		message: textMessage(name,"So you got a cramp.  Walk it off big guy.","day of pain 2",null),
		}
		responses['day of pain 2'] = {
		message: textMessage(name,"It happens. But you know what doesn't need to happen.  You don't need to be a little bitch about it.","follow-up",null),
		}

		responses['days of pain'] = {
		message: textMessage(name,"Haha... so your leg has been hurting for that long and you're just now asking for help?","days of pain 2",null),
		}
		responses['days of pain 2'] = {
		message: textMessage(name,"You know people like you are the reason why healthcare is so F*** in the galaxy.","follow-up",null),
		}

		responses['weeks of pain'] = {
		message: textMessage(name,"Oh Geez.  That long Mr. Anonymous Internet Tough Guy?","weeks of pain 2",null),
		}
		responses['weeks of pain 2'] = {
		message: textMessage(name,"It's basically set in now. You'll just have to live with it.","follow-up",null),
		}


		responses['follow-up'] = {
		message: textMessage(name,"*sigh*","follow-up 2",null),
		}
		responses['follow-up 2'] = {
		message: textMessage(name,"this is happening, isn't it?","follow-up 3",null),
		}
		responses['follow-up 3'] = {
		message: textMessage(name,"Okay. What were you doing when you 'hurt' it?",null,null),
		responses:{
			type:'rickandmorty.response list text',
			variable: 'suspiciousActivity',
			body:[
				{text:"'Physical' activity", message:textMessage(null,"I hurt myself doing a 'Physical' activity","physical-youtube",null)},
				{text:"Non-physical activity", message:textMessage(null,"Ummm.. why is that important? It hurts okay?", "non-physical-gif", null)},
			],
		}
		}

/// --------------- youtube setup

	responses['physical-youtube'] = {
		message: youtubeMessage(name,"Hold up!  Real quick ... here's what I'm picturing. This is you doing a 'Physical' activity. HaHa... you look so dumb.","http://www.youtube.com/embed/znEliSV2Hbg?rel=0&amp;controls=0&amp;showinfo=0","Youtube",null,null),
		responses:{
			type:'rickandmorty.response list text',
			body:[
				{text:"Funny. Now, let's move on.", message:textMessage(null,"Ha.. Ha.. Too funny. Now, let's get back to business","back to business",null)},
			],
		}
	}	
	responses['non-physical-gif'] = {
		message: imageMessage(name,"",URL+'/img/rickandmorty/rick-logic.gif','back to business',null),
	}	


	responses['back to business'] = {
	message: textMessage(name,"Alright. Fine. Do you have any specific questions you'd like me to answer?",null,null),
		responses:{
			type:'rickandmorty.response list text',
			body:[
				{text:"I certainly do!", message:textMessage(null,"That's why I'm here...","get details",null)},
				{text:"Not at this time", message:textMessage(null,"You know what I've just realized? Scientists aren't real doctors.", "get a real doctor", null)},
			],
		}
		}


// ----- Any Specifics?

	responses['get details'] = {
	message: textMessage(name,"Okay whatever. Fill out the form.",null,null),
		responses:{
			type:'rickandmorty.large free response',
			variable: 'specificQuestion',
			body:{
				buttonText:"Type your stupid question here",
				prompt:"Type in the box below:",
				message:{
					type:"rickandmorty.text message",
					qCode:"that far",
					body:{
						text:"",
					}
				}
			},
		}
		}

	responses['that far'] = {
		message: textMessage(name,"Oh my god.","that far 2",null),
		}
	responses['that far 2'] = {
		message: textMessage(name,"You actually filled it out.","that far 3",null),
		}
	responses['that far 3'] = {
		message: textMessage(name,"You have a clear case of the measels","that far 4",null),
		}
	responses['that far 4'] = {
		message: textMessage(name,"mumps?","that far 5",null),
		}
	responses['that far 5'] = {
		message: textMessage(name,"bad legitis?","that far 6",null),
		}
	responses['that far 6'] = {
		message: textMessage(name,"You're not buying this are you?",null,null),
		responses:{
			type:'rickandmorty.response list text',
			variable:"needsHuman",
			body:[
				{text:"Nope", message:textMessage(null,"Get me a human.","discovered",null)},
				{text:"Yep", message:textMessage(null,"It all makes perfect sense now.", "youre cured", null)},
			],
		}
		}

	responses['get a real doctor'] = {
		message: textMessage(name,"should have a full screen robot image here","end page",null),
	}

	responses['discovered'] = {
		message: imageMessage(name,'', URL + "/img/rickandmorty/robots.jpg",null,null),
	}

	responses['youre cured'] = {
		message: textMessage(name,"Great!","end page",null),
		}
	responses['end page'] ={
		message:{
			type:'original.end message', 
			body:{
				displayName:name, 
				text:"You're cured!  And you're welcome.  Pleasure to service.",
				image: URL+'/img/rickandmorty/end.png',
			}

		},
		responses: {
			type:'original.response end',
			body:{
				bye:{
					text: "Peace!",
					id: 'end',
				},				
			}
		}
	}

	return responses;

	function textMessage(name,text,qCode,meta){
		var temp = {};
		temp['type'] = 'rickandmorty.text message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;

		return temp;

	}

	function imageMessage(name,text,url,qCode,meta){
		var temp = {};

		temp.type = 'rickandmorty.image message';
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body = {
						image: url,
						displayName: name,
							};

		return temp;
	}

	function specialMessage(name,text,img,source,qCode,meta){
		var temp = {};
		temp['type'] = 'rickandmorty.special message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		temp.body.img = img;
		temp.body.source = source;

		return temp;

	}

	function youtubeMessage(name,text,video,source,qCode,meta){
		var temp = {};
		temp['type'] = 'rickandmorty.youtube message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		temp.body.video = video;
		temp.body.source = source;

		return temp;

	}

	function linkMessage(name,text,link,source,qCode,meta){
		var temp = {};
		temp['type'] = 'rickandmorty.link message';
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
		temp['type'] = 'rickandmorty.event message';
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
			temp.message.type = 'rickandmorty.image message';
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
					type:'rickandmorty.text message',
					body:{
						displayName:name,
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'rickandmorty.response list icons',
					body:body,
				}

		};

		return msg;
	}

}
