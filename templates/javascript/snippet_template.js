(function(d, script) {
	var overlay = true;
	//should create our own html parent
	//because their body may not be position relative;
	var parent = d.createElement('div');

	
	parent.style.top = '0px';
	parent.style.left = '0px';
	parent.setAttribute('class','kurbi-chat-parent');
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
	var request = new XMLHttpRequest();
	request.open('GET', 'http://public.foolhardysoftworks.com:9000/chatbox'+'?key='+kurbiApiKey, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		    var resp = request.responseText;
		    obj = JSON.parse(resp);
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


	function loadCSS(newCSS){
		var s = d.createElement('style');
	    s.innerHTML = newCSS;
	    d.body.appendChild(s);
	}


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
	    kurbi.params(kurbiApiKey);
	}

	

}(document));