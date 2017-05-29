module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'stvincent.welcome message', 
			body:{
				displayName:name, 
				text:"The epidemic can end, but it begins with you.",
				image: URL+'/img/stv/stv-logo.png',
				mainimage: URL+'/img/stv/fst-main.png',
			}

		},
		responses: {
			type:'stvincent.response welcome',
			body:{
				yes:{
					text: "Let's talk about it",
					id: 'begin',
					message: {
						type: "stvincent.text message",
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
						type: "stvincent.text message",
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

	responses['avatar'] = chooseAvatar('get youtube');

	// ---- CHAIN OF QUESTIONS ----

	responses['get youtube'] = {
		message: specialMessage(name,"Where should we focus our resources? What is our best weapon against this epidemic? At Rosary Hall, we know that comprehensive inpatient and outpatient treatment works - because we've been developing this approach and restoring patients to recovery for more than 65 years.",URL+"/img/stv/fst-1.png","Youtube",null,null),
		responses:{
			type:'stvincent.response list text',
			body:[
				{text:"Keep Learning More", message:textMessage(null,"Keep Learning More","get website",null)},
				{text:"Get Involved", message:textMessage(null,"Get Involved", "get website", null)},
			],
		}
	}

	responses['get website'] = {
		message: linkMessage(name,"Twenty-five (25) percent of all med/surg admissions have non-tobacoo related addictive disease, yet very few hospitals have an addiction medicine consult service. This contributes to the current standard of care where 50-80% of actively addicted paitents...","https://www.stvincentcharity.com/physicians/graduate-medical-education-gme/addiction-medicine-fellowship/impact/","Our Website",null,null),
		responses:{
			type:'stvincent.response list text',
			body:[
				{text:"Continue Reading", message:textMessage(null,"Continue Reading", "get addicted", null)},
				{text:"Keep Learning More", message:textMessage(null,"Keep Learning More","get addicted",null)},
			],
		}
	}

	responses['get addicted'] = {
		message: textMessage(name,"Has addiction touched any area of your life before?",null,null),
		responses:{
			type:'stvincent.response list text',
			body:[
				{text:"Yes it has", message:textMessage(null,"Yes it has","get reason",null)},
				{text:"Fortunately it has not", message:textMessage(null,"Fortunately it has not", "get reason", null)},
			],
		}
	}

	responses['get reason'] = {
		message: textMessage(name,"In 2016, Cuyahoga County lost more than 660 to overdose. That's one death every 13 hours. This epidemic can end with the help of people like you. Are you:",null,null),
		responses:{
			type:'stvincent.response list text',
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
			type:'stvincent.response list text',
			body:[
				{text:"Register for the Event", message:textMessage(null,"Register for the Event","get volunteer",null)},
				{text:"No Thanks", message:textMessage(null,"No Thanks", "get volunteer", null)},
			],
		}
	}

	responses['get volunteer'] = {
		message: textMessage(name,"There are a number of ways to get involved in helping us #EndOurEpidemic. We look forward to getting you connected, and thank you for your interest.",null,null),
		responses:{
			type:'stvincent.response list text',
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
			type:'stvincent.response list text',
			body:[
				{text:"See Stories from the Community", message:textMessage(null,"See Stories from the Community","get tweet",null)},
				{text:"Find Advocacy Opportunities", message:textMessage(null,"Find Advocacy Opportunities", "get tweet", null)},
			],
		}
	}

	responses['get tweet'] = {
		message: eventMessage(name,URL+"/img/stv/fst-12.png",null,null),
		responses:{
			type:'stvincent.response list text',
			body:[
				{text:"More Stories", message:textMessage(null,"More Stories","get grid",null)},
				{text:"Find Advocacy Opportunities", message:textMessage(null,"Find Advocacy Opportunities", "get grid", null)},
			],
		}
	}

	responses['get grid'] = {
		message: eventMessage(name,URL+"/img/stv/fst-13.png",null,null),
		responses:{
			type:'stvincent.response list text',
			body:[
				{text:"More Stories", message:textMessage(null,"More Stories","end",null)},
				{text:"End Chat", message:textMessage(null,"End Chat", "end", null)},
			],
		}
	}

	responses['end'] = {
		message:{
			type:'stvincent.end message', 
			body:{
				displayName:name, 
				text:"Well, this is the end of our chat. Thanks a lot for taking the time to get to know us. We hope that the answers we find for you are helpful. Look for a summary of our conversation in your email inbox momentarily. If we happened to get something wrong or if there is something else you'd like to add follow the instructions to revisit our chat session.\n\n We wish you all the best!",
				image: URL+'/img/stv/stv-logo.png',
			}

		},
		responses: {
			type:'stvincent.response end',
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
		temp['type'] = 'stvincent.text message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		
		return temp;
		
	}

	function specialMessage(name,text,img,source,qCode,meta){
		var temp = {};
		temp['type'] = 'stvincent.special message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		temp.body.img = img;
		temp.body.source = source;
		
		return temp;
		
	}

	function linkMessage(name,text,link,source,qCode,meta){
		var temp = {};
		temp['type'] = 'stvincent.link message';
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
		temp['type'] = 'stvincent.event message';
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
			
			temp.url = URL+"/img/icons/icon-"+i+".png";
			temp.message = {};
			temp.message.type = 'stvincent.image message';
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
					type:'stvincent.text message', 
					body:{
						displayName:name, 
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'stvincent.response list icons',
					body:body,
				}

		};

		return msg;
	}

}