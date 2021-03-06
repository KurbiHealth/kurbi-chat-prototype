module.exports = function(name,URL){

	var responses = {};

	responses['welcome'] = {
		message:{
			type:'original.end message', 
			body:{
				displayName:name, 
				text:"Sorry, this website does not have permission to use this service.",
				image: URL+'/img/icons/mawc.png',
			}

		},
		responses: {
			type:'original.response end',
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
			
			temp.url = URL+"/img/icons/icon-"+i+".png";
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
					type:'original.text message', 
					body:{
						displayName:name, 
						text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
					}

				},
				responses: {
					type:'original.response list icons',
					body:body,
				}

		};

		return msg;
	}

}