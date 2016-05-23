(function(d,namespace){



var ChatBox = function(info){

	var that = this;
	this.hide = hide;
	this.show = show;
	this.info = info;
	this.userId = info.sessionID;
	var socket = null;

	setup();

	function appendMessage(msg){
		switch(msg.type){

			case 'text':
				var m = document.createElement('div');
				m.innerHTML = msg.body;
				that.content.appendChild(m);
				m.className = 'kurbi-chat-message';
				if(msg.name == that.userId) m.className+= " kurbi-self-message";
				m.scrollIntoView();
			break;

			case 'icon':
				var m = document.createElement('img');
				m.src = msg.body;
				m.className = 'kurbi-chat-icon';
				if(msg.name == that.userId) m.className+= " kurbi-self-message";
				m.style.display = "block";
				that.content.appendChild(m);
				m.scrollIntoView();
			break;

			default:
				var m = document.createElement('div');
				m.innerHTML = msg.body;
				m.className = 'kurbi-chat-message';
				if(msg.name == that.userId) m.className+= " kurbi-self-message";
				that.content.appendChild(m);
				m.scrollIntoView();
		}
	}
//
	function prependMessage(msg){
		switch(msg.type){

			case 'text':
				var m = document.createElement('div');
				m.innerHTML = msg.body;
				m.className = 'kurbi-chat-message';
				if(msg.name == that.userId) m.className+= " kurbi-self-message";
		 		that.content.insertBefore(m,that.content.firstChild);
			break;

			case 'icon':
				var m = document.createElement('img');
				m.src = msg.body;
				m.className = 'kurbi-chat-icon';
				if(msg.name == that.userId) m.className+= " kurbi-self-message";
				m.style.display = "block";
				that.content.appendChild(m);
				that.content.insertBefore(m,that.content.firstChild);
			break;

			default:
				var m = document.createElement('div');
				m.innerHTML = msg.body;
				m.className = 'kurbi-chat-message';
				if(msg.name == that.userId) m.className+= " kurbi-self-message";
		 		that.content.insertBefore(m,that.content.firstChild);
		}	
	}

//
	function setInput(responses){
		that.footer.innerHTML = "";
		if(!responses || responses.length == 0) {
			var m = document.createElement('input');
			m.className = 'kurbi-input-field';
			that.footer.appendChild(m);
		}
		else{

			var l = document.createElement('div');
			l.className = 'kurbi-response-prompt';
			l.innerHTML = 'Choose One:';
			that.footer.appendChild(l);
			var n = document.createElement('div');
			n.className = 'kurbi-response-container';
			that.footer.appendChild(n);
			responses.forEach(function(response){
				var m;
				switch(response.type){

					case 'text':
						m = document.createElement('div');
						m.className = 'kurbi-response-option';
						m.innerHTML = response.body;
						n.appendChild(m);
					break;

					case 'icon':
						m = document.createElement('img');
						m.className = 'kurbi-response-option kurbi-chat-icon';
						m.src = response.body;
						n.appendChild(m);
					break;

					default:
						m = document.createElement('div');
						m.className = 'kurbi-response-option';
						m.innerHTML = response.body;
						n.appendChild(m);


				}
				
				m.addEventListener('click', function(){
					socket.emit('message', { message: {name:that.userId,body:response.body, type:response.type}});
				});
			});
		}
	}

	function addMessage(data){
		console.log(data);
		appendMessage(data.message);
		setInput(data.responses);
	}


	function addHistory(data){
		//prepending the history, lets us start 
		//listening for messages before we have loaded
		//the history... also without having to set a 
		//ready flag.
		console.log('history');
		console.log(data);
		data.reverse().forEach(function(packet){
			prependMessage(packet.message);
		});
		if(data.length > 0) setInput(data[data.length - 1].responses);
		that.content.scrollTop = that.content.scrollHeight;
	}

	function setup(){
		
		that.box = d.getElementsByClassName('kurbi-chat-box')[0];
		that.banner = d.getElementsByClassName('kurbi-chat-banner')[0];
		that.backdrop = d.getElementsByClassName('kurbi-backdrop')[0];	
		that.content = d.getElementsByClassName('kurbi-chat-text')[0];
		that.footer  = d.getElementsByClassName('kurbi-chat-footer')[0];

	}
//

	function hide(){
		
		this.box.style.height='0px';
		this.box.style.top="-300px";
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
			
			this.box.style.height='35vh';
			this.box.style.top="0px";
			this.backdrop.style.height="100vh";
			this.content.scrollTop = this.content.scrollHeight;

		}
		
	}

	function setupSocket(){
		if(!socket){
			socket = io();
			socket.emit('register', that.info);
			socket.on('history', addHistory);
			socket.on('message', addMessage);
			}
	}



}



//setup public members
if(!namespace.kirby) namespace.kirby = {};
namespace.kirby.params = params;     // callback that can receive variables from the clients webpage.
loadJQuery(this, init);
var info = null;

function params(apikey){
	info = {
			 key: apikey,
			 sessionID: getKey(),
			 url: window.location.href,
			 icon: null,
			}
}

function init(local){
		
	local.chatbox = chatFactory(local);
	
}

function chatFactory(local){
	
	var parent = document.getElementsByClassName('kurbi-chat-parent')[0];
	var visible = false;
	var bannerVisible = true;
	var clicked = {};
		clicked['button'] = toggleChat;
		clicked['kurbi-banner-sure'] = toggleChat;
		clicked['kurbi-backdrop'] = toggleChat;
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

	 				bannerIcon.src = "http://public.foolhardysoftworks.com:9000/backend/icons/PNG/A01.png";
	 				bannerHeader.innerHTML = "Jessica Dufault, PT, DPT";
	 				bannerQuestion.innerHTML = "Can I help you find what you're looking for?";
	 				bannerSure.innerHTML = "Sure!";
	 				bannerNoThanks.innerHTML = "No thank you";
	 				
	 	}
	 attachToDom('kurbi-backdrop', parent);

	 return new ChatBox(info);

	function toggleBanner(e){
		console.log('clicked');
		bannerVisible = !bannerVisible;
		var banner  = d.getElementsByClassName('kurbi-chat-banner')[0];
		if(bannerVisible){
			banner.style.left="0px";
		}
		if(!bannerVisible){
			banner.style.left="-340px";
		}
	}


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

}



///// HELPER FUNCTIONS ////


function getKey(){

	if(!localStorage.getItem('physics')) localStorage.setItem('physics', makeKey());
	return localStorage.getItem('physics');

}

function makeKey(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 16; i++ )
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	return text;	
}


function loadJQuery(local, callback){
	if(window.jQuery) 
		return callback();

	else {
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