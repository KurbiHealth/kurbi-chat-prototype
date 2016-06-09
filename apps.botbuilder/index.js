$(document).ready(init);

//var URL = 'http://public.foolhardysoftworks.com:9000';
//var URL = 'http://chat.gokurbi.com';
//var URL = 'http://kchat:8080';
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