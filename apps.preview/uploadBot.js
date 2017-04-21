(function(scope){
	var currentFile = null;
	$('#upload-bot').on('click', function(){
		$('#filename-bot').click();
	});

	$('#filename-bot').change(function(e){
		currentFile = e.target.files[0];
		displayUploadScreen(currentFile);
	});

	$('#filename-bot').on('click touchstart' , function(){
	    $(this).val('');
	});

	$('#upload-modal .curtain').on('click', function(){
		console.log('curtain');
		$("#upload-modal").css("display", "none");	
	});

	$("#submit-file").on('click', function(){
		console.log('uploading', currentFile);
		var formData = new FormData();
		var uploadConfig = {'allowed':true};
		formData.append("bot", currentFile, currentFile.name);
		
		var password = document.getElementById("input.password").value;
		var configString = CryptoJS.AES.encrypt(JSON.stringify(uploadConfig),password).toString();
		var encoded = encodeURIComponent(configString);
		formData.append("config", configString);
	   $.ajax({
	       url: window.location.origin+'/bot_files',
	       type: "POST",
	       data: formData,
	       processData: false,
	       contentType: false,
	       success: function(response) {
	           kurbi.getBots();
	           warn('done');
	       },
	       error: function(jqXHR, textStatus, errorMessage) {
	           console.log(errorMessage); // Optional
	       }
    	},'json');

	})

function displayUploadScreen(file){
	$('#selected-file').text(file.name);
	if(file.type != 'application/javascript') warn("file needs to be a .js file");
	else warn(false);
	$("#upload-modal").css("display", "inline");
}

function warn(warn){
	if(warn){
	$('#submit-msg').text(warn);
	$('#submit-msg').css("visibility", "visible");
	$('#submit-file').css("visibility", "hidden");
	}else {
		$('#submit-publish-msg').css("visibility", "hidden");
		$('#submit-publish').css("visibility", "visible");	
	}
}

})(this)