(function(scope){
	var password = document.getElementById("input.password")
	if(!scope.kurbi) scope.kurbi = {};
	scope.kurbi.getBots = getBots;

	var selector = document.getElementById('input.bots');
	selector.addEventListener('change', function(){
		loadBot(selector.value);
	});

	password.addEventListener('blur', function(){
		getBots();
	});

	function loadBot(botName){
		$.get(window.location.origin + "/bot_from_file", {file:botName}, function(data){
			scope.kurbi.bot = data;
		})	
	}

	function getBots(){
		$.get(window.location.origin + "/bot_files", function(data){
			setupBotSelectors(data)
		});	
	}

	function setupBotSelectors(bots){
		selector.innerHTML = "";
		bots.forEach(function(bot){
			selector.innerHTML += '<option value='+bot+'>'+bot+'</option>\n';
		});
		loadBot(selector.value);
	}

})(this);