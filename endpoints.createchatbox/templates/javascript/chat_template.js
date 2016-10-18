(function(d,namespace){


var serverURL = '#SERVER_URL'

console.log('---in chat_template.js---');
console.log('serverURL',serverURL);

var ChatBox = function(info){

	var that = this;
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
	that.end = end;
	var socket = null;

///// Okay here is some weirdness...
// I want to be able to use the handlebar templating to loop over data objects
// ... like when we want to show a list of icons.  
//
// We also want the ability to have these items do things when clicked
// We also want the ChatBox methods private to the chatbox.
// 
// The problem is that the onclick methods inside of the templating engines
// do not have access to the chatbox scope, because it's private.
// so our options seemed to be: expose some methods for chatting on the global scope
// the methods could be general utilites that are then invoked by the chat messages
// or they could be message specific handlers.  
// for example the Icon Picker message object needs to assign an icon.
// I thought it would be nice to be able to define the methods that a message object uses
// inside of the template that defines the message itself.  

// So currently, the hbs templates define their own message handlers
// and these message handlers are attached to the ChatBox scope
// via the attachClickHandler function.
// once they are attached to the chatbox scope, they can use the chatbox
// methods.  

// the #pickle stuff.. is because so far, the chatbox could *ALMOST* be instantiated more than one time
// to make multiple boxes per window, if we wanted.
// however, the attachHandler functions then need to know which chatbox
// to attach the clickhandler to.  So the chatbox now generates an id
// when it's instantiated and puts that into the templates
// as they're attached to the DOM.
// so they can call the correct handler attachers.
//
// I remember not having to pass in the scope (that)... but now I do.  So whatever.

	if(!kurbi.attachClickHandler) kurbi.attachClickHandler = {};
	if(!kurbi.click) kurbi.click = {};

	kurbi.attachClickHandler[that.instanceId] = function(id,fn){
		that.click[id] = fn;
	}

	kurbi.click[that.instanceId] = function(id, data){
		that.click[id](data, that);
	}


	setup();

	function start(){
		socket.emit('start');
	}

	function end(){
		clearKey();
		socket.emit('end');
		that.banner.parentNode.removeChild(that.banner);
	}

	function sendMessage(msg){
		console.log('send msg', msg);	
		msg.userId = that.userId;
		msg.body.displayName = 
		that.footer.innerHTML = "";
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
		if(data.responses) setInput(data.responses);
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
					if(data.length > 0) setInput(data[data.length - 1].responses);
					that.content.scrollTop = that.content.scrollHeight;
				}
			});
		}
		
	}

	function setup(){
		Handlebars.registerHelper('json', function(context){
			return JSON.stringify(context);
		});

		that.box = d.getElementsByClassName('kurbi-chat-box')[0];
		that.banner = d.getElementsByClassName('kurbi-chat-banner')[0];
		that.backdrop = d.getElementsByClassName('kurbi-backdrop')[0];	
		that.content = d.getElementsByClassName('kurbi-chat-body')[0];
		that.footer  = d.getElementsByClassName('kurbi-chat-footer')[0];

	}

	function getTemplate(templateName, callback){
		if(that.template[templateName]) callback(that.template[templateName]);
		else{
			$.get(serverURL+'/template', {client:kurbi.client_id, version:kurbi.version, template:templateName}, function(res){
						that.template[templateName] = res;
						callback(that.template[templateName]);
					});
		}
	}

	function hide(){
		
		this.box.style.height='0px';
		this.box.style.top="-500px";
		this.backdrop.style.height='0px';

	}

	function show(){	
		//the socket load is set here, because
		//the way this code is loaded from the snippet loads the source
		//asynchronously, so this script may run before 
		//it loads the socket.io script.  
		if(io) setupSocket();
		else console.log('no io available');

		if(socket){
			
			this.box.style.height='100vh';
			this.box.style.paddingBottom='25px';
			this.box.style.top="0px";
			this.backdrop.style.height="100vh";
			this.content.scrollTop = this.content.scrollHeight;

		}
		
	}

	function clear(){
		that.content.innerHTML = "";
	}

	function setupSocket(){
		if(!socket){
			socket = io(serverURL);
			socket.emit('register', that.info);
			socket.on('history', addHistory);
			socket.on('message', addMessage);
		}
	}

}



//setup public members
if(!namespace.kurbi) namespace.kurbi = {};
namespace.kurbi.params = params;     // callback that can receive variables from the clients webpage.
kurbi.version = 1.0;
kurbi.client_id = 'web';
kurbi.getPatientIcon = getPatientIcon;
// loadJQuery(this, init);
var that = this;
var info = null;

function params(apikey){
	info = {
			 key: apikey,
			 sessionID: getKey(),
			 url: window.location.href,
			 icon: null,
			}
console.log('info',info);
	loadJQuery(that, init);
}

function init(local){

	local.chatbox = chatFactory(local);
	
}

function getPatientIcon(){
	var iconPath = localStorage.getItem('patient_icon');
	if(iconPath == null) iconPath = serverURL+'/backend/icons/PNG/a01.png';
	return iconPath;
}

function chatFactory(local){
	
	var parent = document.getElementsByClassName('kurbi-chat-parent')[0];
	var visible = false;
	var bannerVisible = true;
	var clicked = {};
		clicked['button'] = toggleChat;
		clicked['kurbi-banner-sure'] = toggleChat;
		clicked['kurbi-backdrop'] = toggleChat;
		clicked['kurbi-close-button'] = toggleChat;
		clicked['kurbi-banner-nope'] = toggleBanner;
		clicked['kurbi-banner-handle'] = toggleBanner;

	 if(!connectToButton('kurbi-chat')) {
	 				//setup banner
	 				var banner = attachToDom('kurbi-chat-banner', parent);
	 				var bannerIconContainer = attachToDom('kurbi-banner-icon-container', banner);
	 				var bannerIcon = attachToDom('kurbi-banner-icon', bannerIconContainer, 'img');
	 				var bannerContent = attachToDom('kurbi-banner-content', banner);
	 				var bannerHeader = attachToDom('kurbi-banner-header', bannerContent);
	 				var bannerQuestion = attachToDom('kurbi-banner-question', bannerContent);
	 				var bannerButtons = attachToDom('kurbi-banner-buttons', bannerContent);
	 				var bannerSure = attachToDom('kurbi-banner-sure', bannerButtons);
	 				var bannerNoThanks = attachToDom('kurbi-banner-nope', bannerButtons);
	 				var bannerHandle = attachToDom('kurbi-banner-handle', banner);

	 				bannerIcon.src = "http://chat.gokurbi.com/demo/img/logo.png";
	 				bannerHeader.innerHTML = "Madison Area Wellness Collective";
	 				bannerQuestion.innerHTML = "Can I help you find what you're looking for?";
	 				bannerSure.innerHTML = "Sure!";
	 				bannerNoThanks.innerHTML = "No thank you";

	 				d.getElementById('kurbi-chat-close-button').addEventListener('click', clicked['kurbi-close-button']);
	 				
	 	}
	 attachToDom('kurbi-backdrop', parent);

	 return new ChatBox(info);

	function toggleBanner(e){
		console.log('toggleBanner clicked');
		bannerVisible = !bannerVisible;
		var banner  = d.getElementsByClassName('kurbi-chat-banner')[0];
		if(bannerVisible){
			banner.style.left="0px";
		}
		if(!bannerVisible){
			banner.style.left="-265px";
		}
		//visible = !visible;
		//toggleChat();
	}


	function toggleChat(e){
		visible = !visible
		if(visible) {
			chatbox.show();

		}
		if(!visible) {
			chatbox.hide();
		}
		toggleBanner();
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