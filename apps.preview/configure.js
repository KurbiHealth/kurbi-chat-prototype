(function(scope){

	if(!scope.kurbi) scope.kurbi = {};
	scope.kurbi.getConfig = getConfig;

	var iframe = document.getElementById("myiframe");
	var submitButton = document.getElementById("submit");
	var inputFields = document.getElementsByTagName("input");
	var head = document.getElementsByTagName("head")[0];
	var configPanel = document.getElementById("config_panel");
	var backdrop = document.getElementById('backdrop');
	var password = document.getElementById("input.password")
	var selector = document.getElementById('input.bots');
	var provider = document.getElementById("provider-list");
	var organization = document.getElementById("organization-name");

	configPanel.addEventListener('click', function(){
		configPanel.style.top = "0px";
		backdrop.style.display="block";
	
	});
	backdrop.addEventListener('click', function(){
		configPanel.style.top = "-640px";
		backdrop.style.display="none";
		
	});


	var defaultConfig = {
		"template":"default",
			"hbs":{
			
				},

			"less":{
			
			},
			"js":{
			
			}
	
	}



	$('.modal-box').on('click', function(e){
		e.stopPropagation();
	});
	submitButton.addEventListener('click',function(){
		head.innerHTML="";
		var encoded = getConfig();
		kurbi.runSnippet({config:encoded});
	});

function getConfig(){
		var styles = document.getElementsByTagName('style');
		for(var i = 0; i < styles.length; i++){
			styles[i].remove();
		}
		var kurbiParents = document.getElementsByClassName("kurbi-chat-parent");
		while(kurbiParents.length > 0){
			kurbiParents[0].remove();
		}
		var config = JSON.parse(JSON.stringify(defaultConfig));

		Object.keys(config.hbs).forEach(function(key){
			var input = document.getElementById("input.hbs."+key);
			if(input && input.value.trim().length > 0)	config.hbs[key] =  input.value;
		});
		Object.keys(config.less).forEach(function(key){
			 var input = document.getElementById("input.less."+key);
			 if(input && input.value.trim().length > 0) config.less[key] = input.value;
		});
		Object.keys(config.js).forEach(function(key){
			var input = document.getElementById("input.js."+key);
			if(input && input.value.trim().length > 0)	config.js[key] = input.value;
		});
		var inputTemplate = document.getElementById("input.template");
		config.template = inputTemplate.options[inputTemplate.selectedIndex].value;

		config.page = document.getElementById("input.page").value;
		if(config.template.length == 0) config.template = defaultconfig.template;

		config.bot = selector.value;
		config.provider = provider.value;
		config.organization = organization.value;
		iframe.src = config.page;

		var configString = CryptoJS.AES.encrypt(JSON.stringify(config),password.value).toString();
		return encodeURIComponent(configString);
}
})(this);

