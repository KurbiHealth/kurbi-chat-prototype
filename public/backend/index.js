(function(scope){
var URL = 'http://public.foolhardysoftworks.com:9000/chatbox';
$(document).ready(init);
var apiKey = 'public';

function init(){

	$('form').on('submit', function(e){
		e.preventDefault();
		var input = {};

		$(this).serializeArray().forEach(function(o){
			if(o.value != '') input[o.name] = o.value;
		})
		
		$.post(URL,input).then(function(response){
			console.log(response);
			var div = $('.code').append('<div></div>');
			div.text("<script>"+response.snippet + "</script>");
			apiKey = response.apiKey;

		});
		

	});

	var socket = io();
	socket.on('connect', function(data){
	
	});

	socket.emit('join room', 'beer');

	socket.on('message', function(data){
		console.log(data);
	})
}

// scope.getSnippet = getSnippet;


// function getSnippet(e){
// 	var inputs = $('form');
// 	console.log(inputs);
// 	inputs.each(function(){
// 		console.log($(this).val());
// 	});
// }


})(this);