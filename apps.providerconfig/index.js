(function(scope){

	//var URL = 'http://public.foolhardysoftworks.com:9000/chatbox'
	//var URL = 'http://kchat:8080/chatbox';
	//var URL = 'http://chat.gokurbi.com/chatbox';
	var URL = 'http://' + window.location.host + '/chatbox';

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


		//this stuff is so that we can have a provider chat live with their clients...
		// var socket = io();
		
		// socket.on('connect', function(data){
		
		// });

		// socket.emit('join room', 'beer');

		// socket.on('message', function(data){
		// 	console.log(data);
		// });

	}

})(this);