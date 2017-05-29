(function(d,namespace){

var serverURL 						= window.location.origin;
var defaultTemplate 				= 'mawc';
console.log('adding chatbox code');
namespace.chatFactory = chatFactory;
namespace.ChatBox = function(info, target){

	var that = this;
	var demoVars = {};
	this.hide = hide;
	this.show = show;
	this.info = info;
	this.userId = info.sessionID;
	this.template = {};
	this.click = {};
	this.instanceId = makeKey();
	this.sendMessage = sendMessage;
	this.start = start;
	that.clear = clear;
	that.sendStart = sendStart;
	this.freechat = false;
	this.freeTemplate = {
					type: 			defaultTemplate+"."+'small free response', 
					body:{
									buttonText:"Send",
									prompt:"Type in the box below:",
									message:{
										type:defaultTemplate+"."+"text message",
										body:{
											text:"",
											displayName:"George, totally a real human",
										}
									}
								}, 
					variable:{}
				}

	this.spyTemplate =  {
				type:'admin.begin chat',
				body:{
				yes:{
					text: "Join the Chat",
					id: 'begin',
				},

			}
		}

	that.end = end;
	var socket = null;

	if(!kurbi.attachClickHandler) kurbi.attachClickHandler = {};
	if(!kurbi.click) kurbi.click = {};

	kurbi.attachClickHandler[that.instanceId] = function(id,fn){
		that.click[id] = fn;
	}

	kurbi.click[that.instanceId] = function(id, data){
		that.click[id](data, that);
	}


	setup();

	function sendStart(){
		socket.emit('freechat',that.info);
		setInput(that.freeTemplate);
	}

	function start(){
		socket.emit('start',that.info);
	}

	function end(){
		clearKey();
		socket.emit('end',that.info);
		that.banner.parentNode.removeChild(that.banner);
	}

	function sendMessage(msg){
		console.log('send msg', msg);	
		msg.userId = that.userId;
		that.footer.innerHTML = "";
		setInput(that.freeTemplate);

		appendMessage(msg, true, function(){
			//only send the message after it has been appended
			//because sometimes the send and response is quicker
			//than the image can load.
			var temp = {};
			temp.message = msg;
			socket.emit('message', temp);	
		});
		
		
	}


	function appendMessage(msg, self,callback){
		msg.body.self = (self != null);
		if(msg.body.displayName == "") msg.body.displayName = "customer";
		getTemplate(msg.type, function(template){
			var compiledTemplate = Handlebars.compile(template);
			that.content.innerHTML += compiledTemplate(msg.body).replace(/#pickle/g, that.instanceId);
			setTimeout(function(){
				$('.kurbi-chat-body').animate({scrollTop:that.content.scrollHeight},500);
				//that.content.scrollTop = that.content.scrollHeight;
			},50);

			if(callback) callback();
		});
				
	}

	function prependMessage(msg, i, callback){
		getTemplate(msg.type, function(template){
			var compiledTemplate = Handlebars.compile(template);
			callback(compiledTemplate(msg.body).replace(/#pickle/g, that.instanceId), i);
			
		});
		
	}


	function setInput(responses){
		console.log(responses);
		getTemplate(responses.type, function(template){
			var compiledTemplate = Handlebars.compile(template);
			that.footer.innerHTML = compiledTemplate({responses:responses.body,variable:responses.variable}).replace(/#pickle/g, that.instanceId);
			
		});

	}

	function addMessage(data){
		console.log('new message', data);
		if(data.message) appendMessage(data.message);
		setInput(that.freeTemplate);
		
	}


	function addHistory(data){
		//prepending the history, lets us start 
		//listening for messages before we have loaded
		//the history... also without having to set a 
		//ready flag.
		console.log('history');
		console.log(data);
		var s = [];
		s.length = data.length;
		var count = 0;
		for(var i = data.length - 1; i >= 0; i--){
			prependMessage(data[i].message, i, function(string, j){
				count++;
				s[j] = string;
				if(count == s.length) {
					that.content.innerHTML = s.join("");
					if(data.length > 0) setInput(that.spyTemplate);
					that.content.scrollTop = that.content.scrollHeight;
				}
			});
		}
		
	}

	function setup(){
		Handlebars.registerHelper('json', function(context){
			return JSON.stringify(context);
		});

		that.box = target.getElementsByClassName('kurbi-chat-box')[0];
		// that.backdrop = target.getElementsByClassName('kurbi-backdrop',target)[0];	
		that.content = target.getElementsByClassName('kurbi-chat-body',target)[0];
		that.footer  = target.getElementsByClassName('kurbi-chat-footer',target)[0];
		that.freeResponse = target.getElementsByClassName('kurbi-free-response',target)[0];
		that.freeResponseInput = target.getElementsByClassName('kurbi-input',target)[0];
		// that.backdrop.style.backgroundColor = "#880000";
		// that.freeResponseInput.onkeypress = function(e){
		//     if (!e) e = window.event;
		//     var keyCode = e.keyCode || e.which;
		//     if (keyCode == '13'){
		//       // sendMessage({body:that.value});
		//       return false;
		//     }
  // 		}

	}

	function getTemplate(templateName, callback){
		if(that.template[templateName]) callback(that.template[templateName]);
		else{
			$.ajax({
				url: 			serverURL+'/template',
			    contentType: 	"application/x-www-form-urlencoded; charset=UTF-8",
			    data : 			{client:kurbi.client_id, version:kurbi.version, template:templateName},
			    success : 		function(res) {
							        that.template[templateName] = res;
									callback(that.template[templateName]);
			   					 },
			});
			// $.get(serverURL+'/template', {client:kurbi.client_id, version:kurbi.version, template:templateName}, function(res){
			// 			that.template[templateName] = res;
			// 			callback(that.template[templateName]);
			// 		});
		}
	}

	function hide(){
		this.box.classList.remove('kurbi-chat-open');
		this.box.classList.add('kurbi-chat-closed');
		// this.backdrop.style.height='0px';
	}

	function show(){	
		//the socket load is set here, because
		//the way this code is loaded from the snippet loads the source
		//asynchronously, so this script may run before 
		//it loads the socket.io script.  
		
		if(io && info.useIo) setupSocket();
		else {
			
			setupFakeSocket();	
			

		}

		if(socket){
			that.box.classList.remove('kurbi-chat-closed');
			that.box.classList.add('kurbi-chat-open');
			// that.backdrop.style.height="100vh";
			that.content.scrollTop = that.content.scrollHeight;

		}
		
	}

	function clear(){
		that.content.innerHTML = "";
	}

	function setupSocket(){
		if(!socket){
			socket = io(serverURL, {query:{'sessionID':info.sessionID}});
			// socket.emit('register', that.info);
			socket.emit('join room',{room:info.room});
			socket.on('history', addHistory);
			socket.on('message', addMessage);
		}
	}

	function setupFakeSocket(){
		console.log("setting up fake socket");
		if(!socket) {
			socket = {};
			socket.callbacks = {};
			socket.emit = function(tag,data){
				if(tag=='message') sendToBot(data);	
				if(tag=='start') sendToBot({message:{qCode:'avatar'}});
			}
			socket.on = function(tag, callback){
				
				socket.callbacks[tag] = callback;
			}
			
			function sendToBot(data){
				if(data.message.variable) demoVars[data.message.variable] = data.message.body.text;
				var botMessage = kurbi.bot[data.message.qCode];

				var temp = JSON.stringify(botMessage) || '{}';
				if(temp) temp = temp.replace(/\[_(.+?)_\]/g, function(whole,variable){return demoVars[variable];});
					
				botMessage = JSON.parse(temp);

				socket.callbacks['message'](botMessage);
			}
			socket.on('message', addMessage);
			socket.emit('message', {message:{qCode:'welcome'}});
			
		}
	}

}



//setup public members
if(!namespace.kurbi) namespace.kurbi = {};

function init(local){

	local.chatbox = chatFactory(local, target);

}

function getPatientIcon(){
	var iconPath = localStorage.getItem('patient_icon');
	if(iconPath == null) iconPath = serverURL+'/img/icons/icon-6.png';
	return iconPath;
}

function chatFactory(local,givenParent){
	
	var parent = givenParent || document.getElementsByClassName(givenParent)[0];
	var visible = false;
	kurbi.getPatientIcon = getPatientIcon;


	var clicked = {};
		clicked['button'] = toggleChat;
		// clicked['kurbi-backdrop'] = toggleChat;
		clicked['kurbi-close-button'] = toggleChat;

	 	// attachToDom('kurbi-backdrop', parent);
	 	console.log(parent);
	 	parent.getElementsByClassName('room-container')[0].addEventListener('click',toggleChat);
	var chatbox = new ChatBox(local.info, parent);
   

	function toggleChat(e){
		visible = !visible
		if(visible) {
			chatbox.show();

		}
		if(!visible) {
			chatbox.hide();
		}

	}

	function attachToDom(c, parent, type){
		if(!type) type = 'div';
		var s = document.createElement(type);
		s.setAttribute('class',c);
		parent.appendChild(s);

		s.addEventListener('click', clicked[c]);
		return s;
	}

	function connectToButton(buttonClass){
		var buttons = d.getElementsByClassName(buttonClass);
		if(buttons.length == 0) return false
		else
			for(var i = 0; i < buttons.length; i++){
				buttons[i].addEventListener('click', clicked['button']);
			}

		return true;
	}
 	return chatbox;
}



///// HELPER FUNCTIONS ////


function getKey(){

	if(!localStorage.getItem('physics')) localStorage.setItem('physics', makeKey());
	return localStorage.getItem('physics');

}

function clearKey(){
	localStorage.removeItem('physics');
}

function makeKey(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 16; i++ )
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	return text;	
}


function loadJQuery(local, callback){
	if(window.jQuery){
		local.$ = jQuery.noConflict();
		return callback(local);
	}else{
	    var s = document.createElement('script'); 
	    s.type = 'text/javascript';
	    s.src = "http://code.jquery.com/jquery-2.2.3.min.js";
	    s.setAttribute('integrity',"sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo=");
	    s.setAttribute('crossorigin', 'anonymous');
	    s.async = true;
	    s.onload = function(){
   			local.$ = jQuery.noConflict();
   			return callback(local);
	    }
	 
	    document.getElementsByTagName('head')[0].appendChild(s);

	}
	
}


})(document,this);