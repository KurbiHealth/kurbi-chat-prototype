module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'welcome message', 
			body:{
				displayName:name, 
				text:"Thanks for visiting our website. We know how confusing it can be to find the answers and care you need. We’d love for you to choose on our members, but more than that we’d like to help you find someone that is the best fit for your needs and interests.\n\nWould you mind answering a couple of questions to help us point you in the right direction?\nIMPORTANT: This chat is anonymous until the end, but if at that point you choose to share private information with us, please know that you are legally sharing this with a HIPAA-compliant vendor. Click on 'Privacy Policy' in the footer of this page for more information.",
				image: URL+'/backend/icons/PNG/mawc.png',
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

	responses['avatar'] = chooseAvatar('get symptom');

	// ---- CHAIN OF QUESTIONS ----



	// ---- FINISH

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