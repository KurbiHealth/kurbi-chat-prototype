(function(d,namespace){

var BUTTON_CLASS = 'kurbi-chat';
if(!namespace.kirby) namespace.kirby = {};
namespace.kirby.params = params;
//take control of the jquery variable in the local scope.
var URL = 'http://public.foolhardysoftworks.com:9000/';
var key = null;
var userToken = localStorage.getItem('kurbiUserToken');
var userIcon = null;
var $;  	
var visible = false;
var parent = document.getElementsByClassName('kurbi-chat-parent')[0];
loadJQuery(init);

var clicked = {};

clicked['button'] = toggleChat;
clicked['kurbi-chat-banner'] = toggleChat;
clicked['kurbi-backdrop'] = toggleChat;

function toggleChat(e){
	var chatBox = d.getElementsByClassName('kurbi-chat-box')[0];
	var banner = d.getElementsByClassName('kurbi-chat-banner')[0];
	var backdrop = d.getElementsByClassName('kurbi-backdrop')[0];
	visible = !visible
	if(visible) {
		chatBox.style.height='40vh';
		chatBox.style.bottom="3vh";
		backdrop.style.height="100vh";
		if(banner) banner.style.height="45vh";

	}
	if(!visible) {
		chatBox.style.height='0px';
		chatBox.style.bottom="-50px";
		backdrop.style.height='0px';
		if(banner) banner.style.height="10vh";
	}	
}

function params(apikey){
	key = apikey;
}

function init(){
	userToken = null;
	 if(!connectToButton()) attach('kurbi-chat-banner');
	 attach('kurbi-backdrop');

	connectEventListeners();
	if(!userToken) toState('page1');
}

function connectEventListeners(){

	$('.kurbi-icon-selector').children().on('click',function(e){
		userIcon = e.target.src;
		toState('page2');
	});

	$('.kurbi-chat-page2 .kurbi-button').on('click', function(e){
		$('.kurbi-chat-form-responses').html('sewp dude');
		toState('page3');
	});
}


function toState(state){
	var page = ".kurbi-chat-"+state;
	console.log(page);
	$('.kurbi-chat-container').children().hide();
	$(page).show();

}


function registerChatBox(){

	$.post(URL+'chat',{token:userToken, key: key, url: d.location.href})
	.then(function(response){
		localStorage.setItem('kurbiUserToken', response.token);
	});
}

function attach(c){
	var s = document.createElement('div');
	s.setAttribute('class',c);
	parent.appendChild(s);

	s.addEventListener('click', clicked[c]);
}

function connectToButton(){

	var buttons = d.getElementsByClassName(BUTTON_CLASS);
	if(buttons.length == 0) return false
	else
		for(var i = 0; i < buttons.length; i++){
			buttons[i].addEventListener('click', clicked['button']);
		}

	return true;
}


function loadJQuery(callback){
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
   			$ = jQuery.noConflict();
   			return callback();
	    }
	 
	    document.getElementsByTagName('head')[0].appendChild(s);

	}
	
}



})(document,this);