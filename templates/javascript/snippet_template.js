(function(d, script) {

	//should create our own html parent
	//because their body may not be position relative;
	var parent = d.createElement('div');
	parent.style.position = 'absolute';
	parent.style.top = '0px';
	parent.style.left = '0px';
	parent.setAttribute('class','kurbi-chat-parent');
	
    d.getElementsByTagName('body')[0].appendChild(parent);
    var kirbyApiKey = "#BANANA";
	var request = new XMLHttpRequest();
	request.open('GET', 'http://public.foolhardysoftworks.com:9000/chatbox'+'?key='+kirbyApiKey, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		    var resp = request.responseText;
		    var obj = JSON.parse(resp);
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

	function loadScript(newScript){
		script = d.createElement('script');
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
