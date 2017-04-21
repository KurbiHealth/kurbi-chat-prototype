(function(scope){
	var publishButton = document.getElementById('publish');
	var provider = document.getElementById("provider-list");
	var password = document.getElementById("input.password")
	var currentProvider = "";
	if(!scope.kurbi) scope.kurbi = currentProvider;

	provider.addEventListener('change', function(){
		currentProvider = provider.value;
		$(".currentProvider").each(function(i,obj){
			obj.innerHTML=currentProvider;
		});
	});
	password.addEventListener('blur', function(){
		getProviders();
	});

	publishButton.addEventListener('click',function(){
		$("#publish-modal").css("display", "inline");
		if(currentProvider.length == 0) warn("add password and choose Provider");
		else warn(false);
	});

	$('#publish-modal .curtain').on('click', function(){
		$("#publish-modal").css("display", "none");	
	});

	$("#submit-publish").on('click', function(){
		$.get( window.location.origin+'/simple_publish',{config:kurbi.getConfig()},function(response){
			console.log(response);
			warn('loaded');
			document.getElementById('last-snippet').innerHTML = "<span>&ltscript&gt</span>"+response.snippet+"<span>&lt/script&gt</span>";
		});
	})

function getProviders(){
		var password = document.getElementById("input.password").value;
		var configString = CryptoJS.AES.encrypt(JSON.stringify({allowed:true}),password).toString();
		var encoded = encodeURIComponent(configString);

		$.get(window.location.origin+'/providers', {config:encoded}, function(response){
			provider.innerHTML="";
			response.data.forEach(function(user){
				provider.innerHTML += '<option value='+user.email+'>'+user.email+'</option>\n';
			});
			currentProvider = provider.value;
			$(".currentProvider").each(function(i,obj){
			obj.innerHTML=currentProvider;
			});
		});
	}


function warn(warn){
	if(warn){
		$('#submit-publish-msg').text(warn);
		$('#submit-publish-msg').css("visibility", "visible");
		$('#submit-publish').css("visibility", "hidden");	
	}else {
		$('#submit-publish-msg').css("visibility", "hidden");
		$('#submit-publish').css("visibility", "visible");	
	}
	
}

})(this)