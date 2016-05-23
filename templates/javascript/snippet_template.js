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
	

    var kirbyApiKey = "#BANANA";
	var request = new XMLHttpRequest();
	request.open('GET', 'http://public.foolhardysoftworks.com:9000/chatbox'+'?key='+kirbyApiKey, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		    var resp = request.responseText;
		    var obj = JSON.parse(resp);
		    loadSocket();
		    loadScript(obj.js);
		    loadCSS(obj.css);
		    loadHtml(obj.html);
		    
	  } else {
	    	console.log('error', request.status);
	  }
	};

	request.onerror = function() {
	  console.log('connection error');
	};

	request.send();

	function loadSocket(){
		var script = d.createElement('script');
		script.type = 'text/javascript';
		script.src = "http://public.foolhardysoftworks.com:9000/socket.io/socket.io.js";
		d.getElementsByTagName('head')[0].appendChild(script);

	}	


	function loadScript(newScript){
		var script = d.createElement('script');
	    script.type = 'text/javascript';
	    script.innerHTML = newScript;
	    d.getElementsByTagName('head')[0].appendChild(script);
	    kirby.params(kirbyApiKey);
	}

	function loadHtml(newHtml){
	    var s = d.createElement('div');
		s.innerHTML = newHtml;
		parent.appendChild(s);
	}

	function loadCSS(newCSS){
		var s = d.createElement('style');
	    s.innerHTML = newCSS;
	    d.body.appendChild(s);
	}

	

}(document));
