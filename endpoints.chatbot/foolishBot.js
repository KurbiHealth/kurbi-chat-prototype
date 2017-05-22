module.exports = function(name,URL){

	var responses = {};

	responses['welcome2'] = {
		message:{
			type:'mawc.welcome message', 
			body:{
				displayName:name, 
				text:"We know how confusing it can be to find the answers to health questions. If that's what brought you here, we’d love to help you connect with our members.\n\nChatting with us is completely anonymous because your privacy is very important.\n\nTo get started, simply click \"Let\'s Chat\" button and follow the prompts.",
				image: URL+'/backend/icons/PNG/mawc.png',
			}

		},
		responses: {
			type:'mawc.response welcome',
			body:{
				yes:{
					text: "Ok, let's go",
					id: 'begin',
					message: {
						type: "mawc.text message",
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
						type: "mawc.text message",
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

	responses['avatar'] = chooseAvatar('favorite food');

	// ---- CHAIN OF QUESTIONS ----

	responses['favorite food'] = {
        message: textMessage(name,"So, tell me how much like pizza homie?",null, null),
        responses:{
            type:'mawc.small free response',
            body:{
                buttonText:"Add Details",
                prompt:"Type pizza in the box below:",
                message:{
                    type:"mawc.text message",
                    qCode:"get symptom",
                    variable: "food",
                    body:{
                        text:"",
                    }
                }
            },
        }
    }

	responses['get symptom'] = {
		message: textMessage(name,"So, let's talk about your situation. What seems to be bothering you?",null, null),
		responses:{
			type:'mawc.small free response',
			body:{
				buttonText:"Add Details",
				prompt:"Type in your main symptom in the box below:",
				message:{
					type:"mawc.text message",
					qCode:"get duration",
					variable: "symptom",
					body:{
						text:"",
					}
				}
			},
		}
	}

	responses['get duration'] = {
		message: textMessage(name,"How long has it been bothering you?",null,null),
		responses:{
			type:'mawc.response list text',
			variable: 'symptomDuration',
			body:[
				{text:"A day or so", message:textMessage(null,"A day or so","get treatment",null)},
				{text:"About a week", message:textMessage(null,"About a week", "get treatment", null)},
				{text:"Longer than a week", message:textMessage(null,"Longer than a week", "get treatment", null)},
			],
		}
	}

	responses['get treatment'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'mawc.response list text',
			variable: 'treatmentType',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","user summary",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "user summary", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "user summary", null)},
			],
		}
	}


	// HERE HAVE A FUNCTION KICKED OFF IN OPERATOR.JS, THAT SENDS SUMMARY OF 
	// QUESTIONS ASKED FROM USER
	responses['user summary'] = {
		message: {
			type:'mawc.text message', 
			body:{
				displayName: name, 
				text: 'So here is what we have so far. Your problem is [_params.symptom_], it has been going on for [_symptomDuration_], and you have treated it with [_treatmentType_]. Is that right?'			}

		},
		responses:{
			type:'mawc.response list text',
			body:[
				{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
				{text:"No, not quite", message:textMessage(null,"No, not quite", "you dont got it", null)},
				],
		}
	}


	// ---- FINAL QUESTIONS ----

	responses['you got it'] = {
		message: textMessage(name,"OK, great! Is there anything you'd like to add to help us understand what's going on?", null,null),
		responses:{
			type:'mawc.large free response',
			body:{
				buttonText:"Add Details",
				prompt:"Type in the box below:",
				message:{
					type:"mawc.text message",
					qCode:"ask question",
					body:{
						text:"",
					}
				}
			},
		}
	}

	responses['you dont got it'] = {
		message: textMessage(name,"OK, can you help us understand what's going on by typing in some details?", null,null),
		responses:{
			type:'mawc.large free response',
			body:{
				buttonText:"Add Details",
				prompt:"Type in the box below:",
				message:{
					type:"mawc.text message",
					qCode:"ask question",
					body:{
						text:"",
					}
				}
			},
		}	
	}

	responses['ask question'] = {
		message: textMessage(name,"Thanks for sharing that! As you can see, we're actually not talking with you live. It's a bummer because we're sure you're a really nice person. We'd love to meet you soon. But first, is it okay to email with feedback on our conversation?", null,null),
		responses:{
			type:'mawc.response list text',
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
			type:'mawc.small free response',
			body:{
				buttonText:"Add Details",
				prompt:"Type in your email in the box below:",
				message:{
					type:"mawc.text message",
					qCode:"scored the email",
					body:{
						text:"",
					}
				}
			},
		}
	}

	responses['scored the email'] = {
		message: textMessage(name,"What would you like to be called?",null, null),
		responses:{
			type:'mawc.small free response',
			body:{
				buttonText:"Add Name",
				prompt:"Type in your first name in the box below:",
				message:{
					type:"mawc.text message",
					qCode:"end",
					body:{
						text:"",
					}
				}
			},
		}
	}

	responses['end'] = {
		message:{
			type:'mawc.end message', 
			body:{
				displayName:name, 
				text:"Well, this is the end of our chat. Thanks a lot for taking the time to get to know us. We hope that the answers we find for you are helpful. Look for a summary of our conversation in your email inbox momentarily. If we happened to get something wrong or if there is something else you'd like to add follow the instructions to revisit our chat session.\n\n We wish you all the best!",
				image: URL+'/backend/icons/PNG/mawc.png',
			}

		},
		responses: {
			type:'mawc.response end',
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
		temp['type'] = 'mawc.text message';
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
			temp.message.type = 'mawc.image message';
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
					type:'mawc.text message', 
					body:{
						displayName:name, 
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'mawc.response list icons',
					body:body,
				}

		};

		return msg;
	}

}