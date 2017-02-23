module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'welcome message', 
			body:{
				displayName:name, 
				text:"Thanks for visiting our website. We're eager to get to know you, and hopefully help you find the information you need!",
				image: URL+'/backend/icons/PNG/robertson-logo.png',
			}

		},
		responses: {
			type:'response welcome',
			body:{
				yes:{
					text: "Let's Chat!",
					id: 'begin',
					message: {
						type: "text message",
						qCode: null,
						meta: 'yes',
						body: {
							text:"Okay, let's go",
						},
					},
				},
				no:{
					text: "I'd rather not",
			  		id: 'cancel',	
					message: {
						type: "text message",
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

	responses['avatar'] = chooseAvatar('get symptom');

	// ---- GET SPECIALTY OF INTEREST ----

	responses['get specialty'] = {
		message: textMessage(name,"What are you struggling with?",null,null),
		responses:{
			type:'response list text',
			variable: 'specialty',
			body:[
				{text:"Chronic Pain", message:textMessage(null,"Chronic Pain","get bio chronic pain",null)},
				{text:"Low Back Pain", message:textMessage(null,"Low Back Pain","get bio low back pain",null)},
				{text:"Neck Pain", message:textMessage(null,"Neck Pain","get bio neck pain",null)}
			],
		}
	}

	// ---- BIOS ----

	responses['get bio chronic pain'] = {
		message: textMessage(name,"Chronic Pain Specialists", null,null),
		responses:{
			type:'specialty bio',
			variable: 'specialtyChosen',
			body:[
				{text:"Contact Me", message:textMessage(null,"Contact Me","contact me",null)},
				{text:"Read More", message:textMessage(null,"Read More", "ask question", null)},
			],
		}
	}

	responses['get bio low back pain'] = {
		message: textMessage(name,"Low Back Pain Specialists", null,null),
		responses:{
			type:'specialty bio',
			variable: 'specialtyChosen',
			body:[
				{text:"Contact Me", message:textMessage(null,"Contact Me","contact me",null)},
				{text:"Read More", message:textMessage(null,"Read More", "ask question", null)},
			],
		}
	}

	responses['get bio neck pain'] = {
		message: textMessage(name,"Neck Pain Specialists", null,null),
		responses:{
			type:'specialty bio',
			variable: 'specialtyChosen',
			body:[
				{text:"Contact Me", message:textMessage(null,"Contact Me","contact me",null)},
				{text:"Read More", message:textMessage(null,"Read More", "ask question", null)},
			],
		}
	}

	// HERE HAVE A FUNCTION KICKED OFF IN OPERATOR.JS -> contactMe
	responses['contact me'] = {
		message: {
			type:'text message', 
			body:{
				displayName: contactMe, 
				text: 'Gret! We look forward to talking with you about [_specialtyChosen_].'
			}
		},
		responses:{
			type:'small free response',
			body:{
				buttonText:"Add Details",
				prompt:"Type in your email in the box below:",
				message:{
					type:"text message",
					qCode:"end",
					body:{
						text:"",
					}
				}
			},
		}
	}

	// ---- FINISH ----

	responses['ask question'] = {
		message: textMessage(name,"Thanks for sharing that! As you can see, we're actually not talking with you live. It's a bummer because we're sure you're a really nice person. We'd love to meet you soon. But first, is it okay to email with feedback on our conversation?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Yes, that's awesome", message:textMessage(null,"Yes, that's right","email me",null)},
				{text:"No thanks", message:textMessage(null,"No, not quite", "dont email me", null)},
				],
		}
	}

	responses['dont email me'] = {
		message: textMessage(name,"Thank you for chatting with me.", "end",null),			
	}

	responses['email me'] = {
		message: textMessage(name,"OK, great! This is exciting. We use an app called Kurbi for these conversations. It'll make sure you stay anonymous so that your information and identity aren't used inappropriately. If you're happy with my feedback you can rate me and share your contact information so that we can set up a time to talk in person.",null, null),
		responses:{
			type:'small free response',
			body:{
				buttonText:"Add Details",
				prompt:"Type in your email in the box below:",
				message:{
					type:"text message",
					qCode:"scored the email",
					body:{
						text:"",
					}
				}
			},
		}
	}

	responses['end'] = {
		message:{
			type:'end message', 
			body:{
				displayName:name, 
				text:"Well, this is the end of our chat. Thanks a lot for taking the time to get to know us. We hope that the answers we find for you are helpful. Look for a summary of our conversation in your email inbox momentarily. If we happened to get something wrong or if there is something else you'd like to add follow the instructions to revisit our chat session.\n\n We wish you all the best!",
				image: URL+'/backend/icons/PNG/robertson-logo.png',
			}

		},
		responses: {
			type:'response end',
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
		temp['type'] = 'text message';
		temp.body = {};
		temp.qCode = qCode;
		temp.meta = meta;
		temp.body.displayName = name;
		temp.body.text = text;
		
		return temp;
		
	}

	function chooseAvatar(qCode){

		var body = [];
		var letters = 'ABCDEFGHIJKLMNO';

		for(var i = 1; i < 13; i++){
			var temp = {};
			
			temp.url = URL+"/backend/icons/PNG/icon-"+i+".png";
			temp.message = {};
			temp.message.type = 'image message';
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
					type:'text message', 
					body:{
						displayName:name, 
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'response list icons',
					body:body,
				}

		};

		return msg;
	}

}