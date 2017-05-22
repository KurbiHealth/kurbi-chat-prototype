(function(d, scope, script) {

	if(!scope.kurbi) scope.kurbi={};

		//var serverURL = 'http://chat.gokurbi.com';
	//var serverURL = 'http://kchat:8080'
	var serverURL = window.location.origin;
	var config={};
console.log('---in snippet_template.js----');

	scope.kurbi.parentTemplate = null;

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
		    if(kbar*hbar*sbar*bstrap)loadScript();
		    
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
		}else{
			bstrap = 1;
			if(kbar*hbar*sbar*bstrap)loadScript(obj.js);
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
	    d.head.appendChild(s);
	}


	function loadHtml(newHtml){
		scope.kurbi.parentTemplate = newHtml;
	}


	function loadScript(newScript){
		kbar = 0;
		var script = d.createElement('script');
	    script.type = 'text/javascript';
	    script.src = 'admin_chat.js';
	    script.async = false;
	    d.getElementsByTagName('head')[0].appendChild(script);

	}


	

}(document, this));