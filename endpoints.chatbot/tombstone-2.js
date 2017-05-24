module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'tombstone.welcome message',
			body:{
				displayName:name,
				text:"Well, ain't that a daisy",
				image: URL+'/img/stv/stv-logo.png',
				mainimage: URL+'/img/tombstone/tstone-main.jpg',
			}

		},
		responses: {
			type:'tombstone.response welcome',
			body:{
				yes:{
					text: "DOC!",
					id: 'begin',
					message: {
						type: "tombstone.text message",
						qCode: null,
						meta: 'yes',
						body: {
							text:"DOC!",
						},
					},
				},
			}
		}

	};

	// ---- CHOOSE AVATAR ----

	responses['choose avatar'] = {
		message:{
			type:'tombstone.avatar choice',
			body:{
				displayName:name,
				text:"Identify Yourself",
				image: URL+'/img/tombstone/filligree.png',
			}

		},
		responses: {
			type:'tombstone.response list icons',
			body:[
				{
					url: URL+'/img/tombstone/wyatt-icon.jpg',
					id: '1',
					text:'Wyatt Earp',
					message: {
						type: "tombstone.text message",
						qCode: "wyatt greeting",
						body: {
							text:"Well,well.\n Howw the hell are you?",
						},
					},
				},
				{
					url: URL+'/img/tombstone/virgil-icon.jpg',
					id: '2',
					text:'Virgil Earp',
					message: {
						type: "tombstone.text message",
						qCode: "virgil greeting",
						body: {
							text:"'Lo, Doc.",
						},
					},
				},
				{
					url: URL+'/img/tombstone/ringo-icon.jpg',
					id: '1',
					text:'Johnny Ringo',
					message: {
						type: "tombstone.text message",
						qCode: "ringo greeting",
						body: {
							text:"Lunger.",
						},
					},
				}
			]
		}

	};
	//wyatt 
	responses['wyatt greeting'] = {
		message: textMessage(name, "Wyatt, I am rolling.", null, null);
		responses: {
			type: 'tombestone.response list text',
			body:[
				{text:"Don't roll too hard.", message:textMessage(null,"Don't roll too hard.","indignation",null)},
				{text:"What has got you so excited?", message:textMessage(null,"What has got you so excited?", "in my prime", null)},
			]
		}
	}

	responses['indignation'] = {
		message: textMessage(name, "Nonsense, Wyatt \n I have hardly begun.", 'in my prime', null);
	}

	responses['in my prime'] = {
		message: textMessage(name, "I'm in my prime", null, null);
		responses: {
			type: 'tombestone.response list text',
			body:[
				{text:"Recollect what that means.", message:textMessage(null,"hmmm...","doc gambling youtube",null)},
			]
		}
	}

	responses['doc gambling youtube'] = {
		message: youtubeMessage(name, "I'm in my prime", 'https://www.youtube.com/watch?v=t2PXlUjWz5M',null, null);
		responses: {
			type: 'tombestone.response list text',
			body:[
				{text:"I think I've seen enough of your 'prime.'", message:textMessage(null,"I think I've seen enough of your 'prime.'","wyatt have a drink",null)},
			]
		}
	}


	responses['wyatt have a drink'] = {
		message: textMessage(name, "Before you get all cross, \n how about you have a drink?", null, null);
		responses: {
			type: 'tombestone.drink',
			body:[
				{text:"Recollect what that means.", message:textMessage(null,"hmmm...","doc gambling youtube",null)},
			]
		}
	}

	//Virgil

	//Ringo 
	responses['ringo greeting'] = {
		message: textMessage(name, "Why Ringo, \n you know I abhor ugliness.", "reminder?", null);
	}

	responses['reminder?'] = {
		message: textMessage(name, "We don't need a reminder, \n do we?", null, null);
		responses: {
			type: 'tombestone.response list text',
			body:[
				{text:"Recall your enchanted moment with Doc.", message:textMessage(null,"...","doc ringo duel",null)},
				
			]
		}
	}

	responses['doc gambling youtube'] = {
		message: youtubeMessage(name, "I'm your huckleberry", 'https://www.youtube.com/watch?v=FSjvgSHK0f0',null, null);
		responses: {
			type: 'tombestone.response list text',
			body:[
				{text:"It didn't keep.", message:textMessage(null,"You shoulda used two bullets.","we can go again",null)},
			]
		}
	}



	// ---- CHAIN OF QUESTIONS ----

	responses['get youtube'] = {
		message: youtubeMessage(name,"Isn't that a daisy!","https://www.youtube.com/embed/MSeFaApcTco?rel=0&amp;controls=0&amp;showinfo=0","Youtube",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"Keep Learning More", message:textMessage(null,"Keep Learning More","get website",null)},
				{text:"Get Involved", message:textMessage(null,"Get Involved", "get website", null)},
			],
		}
	}

	responses['get website'] = {
		message: linkMessage(name,"Twenty-five (25) percent of all med/surg admissions have non-tobacoo related addictive disease, yet very few hospitals have an addiction medicine consult service. This contributes to the current standard of care where 50-80% of actively addicted paitents...","https://www.tombstonecharity.com/physicians/graduate-medical-education-gme/addiction-medicine-fellowship/impact/","Our Website",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"Continue Reading", message:textMessage(null,"Continue Reading", "get addicted", null)},
				{text:"Keep Learning More", message:textMessage(null,"Keep Learning More","get addicted",null)},
			],
		}
	}

	responses['get addicted'] = {
		message: textMessage(name,"Has addiction touched any area of your life before?",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"Yes it has", message:textMessage(null,"Yes it has","get reason",null)},
				{text:"Fortunately it has not", message:textMessage(null,"Fortunately it has not", "get reason", null)},
			],
		}
	}

	responses['get reason'] = {
		message: textMessage(name,"In 2016, Cuyahoga County lost more than 660 to overdose. That's one death every 13 hours. This epidemic can end with the help of people like you. Are you:",null,null),
		responses:{
			type:'tombstone.response list text',
			variable: 'symptomDuration',
			body:[
				{text:"In Need of Help", message:textMessage(null,"In Need of Help","get event",null)},
				{text:"Supporting Someone", message:textMessage(null,"Supporting Someone", "get event", null)},
				{text:"Interested in Helping", message:textMessage(null,"Interested in Helping", "get event", null)},
			],
		}
	}

	responses['get event'] = {
		message: eventMessage(name,URL+"/img/stv/fst-8.png",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"Register for the Event", message:textMessage(null,"Register for the Event","get volunteer",null)},
				{text:"No Thanks", message:textMessage(null,"No Thanks", "get volunteer", null)},
			],
		}
	}

	responses['get volunteer'] = {
		message: textMessage(name,"There are a number of ways to get involved in helping us #EndOurEpidemic. We look forward to getting you connected, and thank you for your interest.",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"Become an Advocate", message:textMessage(null,"Become an Advocate","get progress",null)},
				{text:"Donate Time/Resources", message:textMessage(null,"Donate Time/Resources", "get progress", null)},
				{text:"Partner with Us", message:textMessage(null,"Partner with Us", "get progress", null)},
				{text:"Addiction Mediciine Fellowship", message:textMessage(null,"Addiction Mediciine Fellowship", "get progress", null)},
			],
		}
	}

	responses['get progress'] = {
		message: textMessage(name,"Advocacy is one of our most powerful tools for change. Check out the amazing progress being made in our community.",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"See Stories from the Community", message:textMessage(null,"See Stories from the Community","get tweet",null)},
				{text:"Find Advocacy Opportunities", message:textMessage(null,"Find Advocacy Opportunities", "get tweet", null)},
			],
		}
	}

	responses['get tweet'] = {
		message: eventMessage(name,URL+"/img/stv/fst-12.png",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"More Stories", message:textMessage(null,"More Stories","get grid",null)},
				{text:"Find Advocacy Opportunities", message:textMessage(null,"Find Advocacy Opportunities", "get grid", null)},
			],
		}
	}

	responses['get grid'] = {
		message: eventMessage(name,URL+"/img/stv/fst-13.png",null,null),
		responses:{
			type:'tombstone.response list text',
			body:[
				{text:"More Stories", message:textMessage(null,"More Stories","end",null)},
				{text:"End Chat", message:textMessage(null,"End Chat", "end", null)},
			],
		}
	}

	responses['end'] = {
		message:{
			type:'tombstone.end message',
			body:{
				displayName:name,
				text:"Well, this is the end of our chat. Thanks a lot for taking the time to get to know us. We hope that the answers we find for you are helpful. Look for a summary of our conversation in your email inbox momentarily. If we happened to get something wrong or if there is something else you'd like to add follow the instructions to revisit our chat session.\n\n We wish you all the best!",
				image: URL+'/img/stv/stv-logo.png',
			}

		},
		responses: {
			type:'tombstone.response end',
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
		temp['type'] = 'tombstone.text message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;

		return temp;

	}

	function specialMessage(name,text,img,source,qCode,meta){
		var temp = {};
		temp['type'] = 'tombstone.special message';
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
		temp['type'] = 'tombstone.youtube message';
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
		temp['type'] = 'tombstone.link message';
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
		temp['type'] = 'tombstone.event message';
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

		for(var i = 1; i < 4; i++){
			var temp = {};

			temp.url = URL+"/img/tombstone/icon-"+i+".png";
			temp.message = {};
			temp.message.type = 'tombstone.image message';
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
					type:'tombstone.text message',
					body:{
						displayName:name,
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'tombstone.response list icons',
					body:body,
				}

		};

		return msg;
	}

}
