(function(d, scope, script) {

	if(!scope.kurbi) scope.kurbi={};
	scope.kurbi.runSnippet = function(config){
		//var serverURL = 'http://chat.gokurbi.com';
	//var serverURL = 'http://kchat:8080'
	var serverURL = 'http://public.foolhardysoftworks.com:8180';
	if(!config) config={};
console.log('---in snippet_template.js----');

	var overlay = true;
	//should create our own html parent
	//because their body may not be position relative;
	var parent = d.createElement('div');

	
	parent.style.top = '0px';
	parent.style.left = '0px';
	parent.setAttribute('class','kurbi-chat-parent bootstrap-iso');
	if(overlay){
	 parent.style.position = 'absolute';	
	 d.getElementsByTagName('body')[0].appendChild(parent);
	}else{
 	 d.getElementsByTagName('body')[0].insertBefore(parent,d.getElementsByTagName('body')[0].firstChild);	
	}
	var hbar = 0;
	var sbar = 0;
	var kbar = 0;
	var bstrap = 0;
	var obj = null;
	// loadHandlebars();
	// loadSocket();
	//generate config keys
    config.key = "preview";
    var queryString = "";
	Object.keys(config).forEach(function(configKey){
		queryString += configKey +'='+config[configKey]+'&';
	});
    queryString = serverURL + '/preview_chat_box?' + queryString;
	var request = new XMLHttpRequest();
	request.open('GET', queryString, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
		    var resp = request.responseText;
		    obj = JSON.parse(resp);
		    kbar = 1;
		    loadSocket();
		    loadHandlebars();
		    loadBootstrap();
		    loadCSS(obj.css);
		    loadHtml(obj.html);
		    if(kbar*hbar*sbar*bstrap)loadScript(obj.js);
		    
	  } else {
	    	console.log('error', request.status);
	  }
	};

	request.onerror = function() {
	  console.log('connection error');
	};

	request.send();

	function detectBootstrap(){
		var bsDetected = false;
		var links = document.getElementsByTagName('link');
		[].forEach.call(links,function(link){
			if(link.href.includes('bootstrap')) bsDetected=true;
		});
		return bsDetected;
	}

	function loadBootstrap(){
		if(!detectBootstrap()){
			var css = d.createElement('link');
			css.rel = 'stylesheet';
			css.type ="text/css";
			css.href = serverURL + "/bootstrap-iso.css";		
			css.async = true;
			css.onload = function(){
				bstrap = 1;
				if(kbar*hbar*sbar*bstrap)loadScript(obj.js);
			}
			d.getElementsByTagName('head')[0].appendChild(css);	
		}
		
	}

	function loadHandlebars(){
		var script = d.createElement('script');
		script.type = 'text/javascript';
		script.src = "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js";
		script.async = true;
		script.onload = function(){
			hbar = 1;
			if(kbar*hbar*sbar*bstrap)loadScript(obj.js);
		}
		d.getElementsByTagName('head')[0].appendChild(script);

	}

	function loadSocket(){
		var script = d.createElement('script');
		script.type = 'text/javascript';
		//socketCDNUrl = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.6/socket.io.js';
		script.src = serverURL + "/socket.io/socket.io.js";
		//script.src = socketCDNUrl;
		script.async = true;
		script.onload = function(){
			sbar = 1;
			if(kbar*hbar*sbar*bstrap)loadScript(obj.js);
		}
		d.getElementsByTagName('head')[0].appendChild(script);
	}


	function loadCSS(newCSS){
		var s = d.createElement('style');
	    s.innerHTML = newCSS;
	    d.body.appendChild(s);
	}


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
	    // Per John, 'kurbi' is defined in chat_template.js. Used to pass values into chatbox
	    // from snippet. -Matt 6/6/2016
	    kurbi.params(config.key,false);
	}

	}
	

}(document, this));