(function(d, script) {
<<<<<<< HEAD
=======

	//var serverURL = 'http://public.foolhardysoftworks.com:9000';
	//var serverURL = 'http://chat.gokurbi.com';
	var serverURL = 'http://kchat:8080'

console.log('---in snippet_template.js----');

>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
	var overlay = true;
	//should create our own html parent
	//because their body may not be position relative;
	var parent = d.createElement('div');

	
	parent.style.top = '0px';
	parent.style.left = '0px';
	parent.setAttribute('class','kurbi-chat-parent');
<<<<<<< HEAD
<<<<<<< HEAD:templates/javascript/snippet_template.js
=======
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
	if(overlay){
	 parent.style.position = 'absolute';	
	 d.getElementsByTagName('body')[0].appendChild(parent);
	}else{
 	 d.getElementsByTagName('body')[0].insertBefore(parent,d.getElementsByTagName('body')[0].firstChild);	
	}
	var hbar = 0;
	var sbar = 0;
	var kbar = 0;
	var obj = null;
	loadHandlebars();
	loadSocket();

    var kurbiApiKey = "#BANANA";
<<<<<<< HEAD
	var request = new XMLHttpRequest();
	request.open('GET', 'http://public.foolhardysoftworks.com:9000/chatbox'+'?key='+kurbiApiKey, true);
=======
	
    d.getElementsByTagName('body')[0].appendChild(parent);
    var kurbiApiKey = "#BANANA"; // it's the Stamplay _id from 'chatbox' data model
	var request = new XMLHttpRequest();
	// for production
	request.open('GET', 'https://kurbi.stamplayapp.com/api/cobject/v1/chatbox/' + kurbiApiKey, true);
	// for dev
	//request.open('GET', 'http://chat.gokurbi.com/chatbox' + kurbiApiKey, true);
>>>>>>> matt:endpoints.createchatbox/templates/javascript/snippet_template.js
=======
	var request = new XMLHttpRequest();
	request.open('GET', serverURL + '/chatbox'+'?key='+kurbiApiKey, true);
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		    var resp = request.responseText;
<<<<<<< HEAD
		    obj = JSON.parse(resp);
=======
		    obj = JSON.parse(JSON.parse(resp));
		    obj = obj.data[0];
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
		    kbar = 1;
		    loadSocket();
		    loadHandlebars();
		    loadCSS(obj.css);
		    loadHtml(obj.html);
		    if(kbar*hbar*sbar)loadScript(obj.js);
		    
	  } else {
	    	console.log('error', request.status);
	  }
	};

	request.onerror = function() {
	  console.log('connection error');
	};

	request.send();

<<<<<<< HEAD
<<<<<<< HEAD:templates/javascript/snippet_template.js
=======
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
	function loadHandlebars(){

		var script = d.createElement('script');
		script.type = 'text/javascript';
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js";
		script.async = true;
		script.onload = function(){
			hbar = 1;
			if(kbar*hbar*sbar)loadScript(obj.js);
		}
		d.getElementsByTagName('head')[0].appendChild(script);
<<<<<<< HEAD
=======
	function loadScript(newScript){
		script = d.createElement('script');
	    script.type = 'text/javascript';
	    script.innerHTML = newScript;
	    d.getElementsByTagName('head')[0].appendChild(script);
	    kirby.params(kurbiApiKey);
=======

>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
	}
>>>>>>> matt:endpoints.createchatbox/templates/javascript/snippet_template.js

<<<<<<< HEAD
	}

	function loadSocket(){
		var script = d.createElement('script');
		script.type = 'text/javascript';
		script.src = "http://public.foolhardysoftworks.com:9000/socket.io/socket.io.js";
		script.async = true;
		script.onload = function(){
			sbar = 1;
			if(kbar*hbar*sbar)loadScript(obj.js);
		}
		d.getElementsByTagName('head')[0].appendChild(script);

	}	

=======
	function loadSocket(){
		var script = d.createElement('script');
		script.type = 'text/javascript';
		socketCDNUrl = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.6/socket.io.js';
		//script.src = serverURL + "/socket.io/socket.io.js";
		script.src = socketCDNUrl;
		script.async = true;
		script.onload = function(){
			sbar = 1;
			if(kbar*hbar*sbar)loadScript(obj.js);
		}
		d.getElementsByTagName('head')[0].appendChild(script);
	}

>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce

	function loadCSS(newCSS){
		var s = d.createElement('style');
	    s.innerHTML = newCSS;
	    d.body.appendChild(s);
	}

<<<<<<< HEAD

	function loadHtml(newHtml){
		parent.innerHTML += newHtml;
	}


	function loadScript(newScript){
		kbar = 0;
		var script = d.createElement('script');
	    script.type = 'text/javascript';
	    script.innerHTML = newScript;
	    script.async = false;
	    d.getElementsByTagName('head')[0].appendChild(script);
	    kurbi.params(kurbiApiKey);
	}

	

=======

	function loadHtml(newHtml){
	    var s = d.createElement('div');
	    s.innerHTML = newHtml;
		parent.appendChild(s);
	}


	function loadScript(newScript){
		kbar = 0;
		var script = d.createElement('script');
	    script.type = 'text/javascript';
	    script.innerHTML = newScript;
	    script.async = false;
	    d.getElementsByTagName('head')[0].appendChild(script);
	    // Per John, 'kurbi' is defined in chat_template.js. Used to pass values into chatbox
	    // from snippet. -Matt 6/6/2016
	    kurbi.params(kurbiApiKey);
	}


>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce
}(document));