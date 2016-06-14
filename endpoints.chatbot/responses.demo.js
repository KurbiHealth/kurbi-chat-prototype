module.exports = function(name,BASEURL){


var responses = {};

responses['welcome'] = {
				message:{
					type:'welcome message', 
					body:{
						displayName:name, 
						text:"Thanks for visiting our website. We know how confusing it can be to find the care you're looking for. We'd love for you to choose Mindful Motion, but we care more about finding you the right fit for you. \n\nWould you answer a couple of questions to help us point you in the right direction?",
						image: BASEURL+'/backend/icons/PNG/mawc.png',
					}

				},
				responses: {
					type:'response welcome',
					body:{
						yes:{
							text: "Ok, let's go",
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

responses['avatar'] = chooseAvatar('avatar chosen');

responses['avatar chosen'] = {
					message: textMessage(name,"So, let's talk about your situation. What seems to be bothering you?",null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Back Pain", message:textMessage(null,"Back Pain","have back pain",null)},
							{text:"Shoulder Pain", message:textMessage(null,"Shoulder Pain", "have shoulder pain", null)},
							{text:"Knee Pain", message:textMessage(null,"Knee Pain", "have knee pain", null)},
							],
							}
}

// ---- CHOOSE TYPE OF PAIN ----

responses['have back pain'] = {
					message: textMessage(name,"How long has it been bothering you?",null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"A day or so", message:textMessage(null,"A day or so","how have you treated back one day",null)},
							{text:"About a week", message:textMessage(null,"About a week", "how have you treated back one week", null)},
							{text:"Longer than a week", message:textMessage(null,"Longer than a week", "how have you treated back more then week", null)},
							],
							}
}

responses['have shoulder pain'] = {
					message: textMessage(name,"How long has it been bothering you?",null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"A day or so", message:textMessage(null,"A day or so","how have you treated shoulder one day",null)},
							{text:"About a week", message:textMessage(null,"About a week", "how have you treated shoulder one week", null)},
							{text:"Longer than a week", message:textMessage(null,"Longer than a week", "how have you treated shoulder more then one week", null)},
							],
					}
}

responses['have knee pain'] = {
					message: textMessage(name,"How long has it been bothering you?",null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"A day or so", message:textMessage(null,"A day or so","how have you treated knee one day",null)},
							{text:"About a week", message:textMessage(null,"About a week", "how have you treated knee one week", null)},
							{text:"Longer than a week", message:textMessage(null,"Longer than a week", "how have you treated knee more then one week", null)},
						],
					}
}

// ---- TREATMENTS / BACK ----

responses['how have you treated back one day'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","back one day asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "back one day self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "back one day no treatment", null)},
				],
		}
}

responses['how have you treated back one week'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","back one week asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "back one week self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "back one week no treatment", null)},
				],
		}
}

responses['how have you treated back more then one week'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","back more then one week asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "back more then one week self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "back more then one week no treatment", null)},
				],
		}
}

// ---- TREATMENTS / SHOULDER ----

responses['how have you treated shoulder one day'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","shoulder one day asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "shoulder one day self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "shoulder one day no treatment", null)},
				],
		}
}

responses['how have you treated shoulder one week'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","shoulder one week asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "shoulder one week self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "shoulder one week no treatment", null)},
				],
		}
}

responses['how have you treated shoulder more then one week'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","shoulder more then one week asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "shoulder more then one week self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "shoulder more then one week no treatment", null)},
				],
		}
}

// ---- TREATMENTS / KNEE ----

responses['how have you treated knee one day'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","knee one day asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "knee one day self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "knee one day no treatment", null)},
				],
		}
}

responses['how have you treated knee one week'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","knee one week asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "knee one week self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "knee one week no treatment", null)},
				],
		}
}

responses['how have you treated knee more then one week'] = {
		message: textMessage(name,"What have you done the most for treatment?", null,null),
		responses:{
			type:'response list text',
			body:[
				{text:"Professional Care", message:textMessage(null,"Professional Care","knee more then one week asked pros",null)},
				{text:"Self-Care", message:textMessage(null,"Self-Care", "knee more then one week self care", null)},
				{text:"I've done nothing", message:textMessage(null,"Procrastination", "knee more then one week no treatment", null)},
				],
		}
}

// ---- SUMMARY OF CONVERSATION ----

// BACK one day

responses['back one day asked pros'] = {
					message: textMessage(name,"OK, so you've had Back Pain for a day or so and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['back one day self care'] = {
					message: textMessage(name,"OK, so you've had Back Pain for a day or so and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['back one day no treatment'] = {
					message: textMessage(name,"OK, so you've had Back Pain for a day or so and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// BACK one week

responses['back one week asked pros'] = {
					message: textMessage(name,"OK, so you've had Back Pain for a week or so and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['back one week self care'] = {
					message: textMessage(name,"OK, so you've had Back Pain for a week or so and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['back one week no treatment'] = {
					message: textMessage(name,"OK, so you've had Back Pain for a week or so and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// BACK more then one week

responses['back more then one week asked pros'] = {
					message: textMessage(name,"OK, so you've had Back Pain for more then a week and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['back more then one week self care'] = {
					message: textMessage(name,"OK, so you've had Back Pain for more then week and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['back more then one week no treatment'] = {
					message: textMessage(name,"OK, so you've had Back Pain for more then a week and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// ========================================================================

// SHOULDER one day

responses['shoulder one day asked pros'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for a day or so and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['shoulder one day self care'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for a day or so and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['shoulder one day no treatment'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for a day or so and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// SHOULDER one week

responses['shoulder one week asked pros'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for a week or so and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['shoulder one week self care'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for a week or so and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['shoulder one week no treatment'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for a week or so and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// SHOULDER more then one week

responses['shoulder more then one week asked pros'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for more then a week and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['shoulder more then one week self care'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for more then a week and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['shoulder more then one week no treatment'] = {
					message: textMessage(name,"OK, so you've had Shoulder Pain for more then a week and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// ========================================================================

// KNEE one day

responses['knee one day asked pros'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for a day or so and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['knee one day self care'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for a day or so and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['knee one day no treatment'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for a day or so and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// KNEE one week

responses['knee one week asked pros'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for a week or so and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['knee one week self care'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for a week or so and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['knee one week no treatment'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for a week or so and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

// KNEE more then one week

responses['knee more then one week asked pros'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for more then a week and you've been managing it with professional help.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['knee more then one week self care'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for more then a week and you've been managing it with self-care.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}

responses['knee more then one week no treatment'] = {
					message: textMessage(name,"OK, so you've had Knee Pain for then a week and you've been putting off treatment.  Did I get that right?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's right", message:textMessage(null,"Yes, that's right","you got it",null)},
							{text:"No, not quite", message:textMessage(null,"No, not quite", "ya dont got it", null)},
							],
					}
}


// ---- FINAL QUESTIONS ----

responses['you got it'] = {
					message: textMessage(name,"OK, great! Is there anything you'd like to add to help us understand what's going on?", null,null),
					responses:{
						type:'large free response',
						body:{
							buttonText:"Add Details",
							prompt:"Type in the box below:",
							message:{
										type:"text message",
										qCode:"back pain details",
										body:{
											text:"",
										}
									}
						},
					}
}

// TO DO
responses['you dont got it'] = {
					message: textMessage(name,"OK, can you help us understand what's going on by typing in some details?", null,null),
					responses:{
						type:'large free response',
						body:{
							buttonText:"Add Details",
							prompt:"Type in the box below:",
							message:{
										type:"text message",
										qCode:"back pain details",
										body:{
											text:"",
										}
									}
						},
					}	
}

responses['back pain details'] = {
					message: textMessage(name,"Thanks for sharing that! As you can see, we're actually not talking with you live. It's a bummer because we're sure you're a really nice person. We'd love to meet you soon. But first, is it okay to email with feedback on our conversation?", null,null),
					responses:{
						type:'response list text',
						body:[
							{text:"Yes, that's awesome", message:textMessage(null,"Yes, that's right","email me",null)},
							{text:"No thanks", message:textMessage(null,"No, not quite", "dont fucking email me", null)},
							],
					}
}

responses['dont fucking email me'] = {
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

responses['scored the email'] = {
					message: textMessage(name,"What would you like to be called?",null, null),
					responses:{
						type:'small free response',
						body:{
							buttonText:"Add Name",
							prompt:"Type in your first name in the box below:",
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

responses['end'] = {
				message:{
					type:'end message', 
					body:{
						displayName:name, 
						text:"Well, this is the end of our chat. Thanks a lot for taking the time to get to know us. We hope that the answers we find for you are helpful. Look for a summary of our conversation in the email inbox momentarily. If we happened to get something wrong or if there is something else you'd like to add follow the instructions to revisit our chat session.\n\n We wish you all the best!",
						image: BASEURL+'/backend/icons/PNG/mawc.png',
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
		
		temp.url = BASEURL+"/backend/icons/PNG/icon-"+i+".png";
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