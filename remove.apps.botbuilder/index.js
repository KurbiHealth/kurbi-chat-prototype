$(document).ready(init);

var URL = 'http://' + window.location.host;

function init(){

	getChatBoxes();

}

function getChatBoxes(){

	$.get(URL + "/chatboxes").then(function(data){
		data.forEach(function(box){
			var x = document.getElementById("chatboxes");
			var option = document.createElement("option");
			option.text = box._id;
			x.add(option);	
		});
	});

}