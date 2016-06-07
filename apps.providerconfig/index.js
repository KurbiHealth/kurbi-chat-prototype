(function(scope){
<<<<<<< HEAD
//var URL = 'http://public.foolhardysoftworks.com:9000/chatbox'
//var URL = 'kchat:8080/chatbox'
var URL = 'http://chat.gokurbi.com/chatbox';
$(document).ready(init);
var apiKey = 'public';
=======

	//var URL = 'http://public.foolhardysoftworks.com:9000/chatbox'
	var URL = 'http://kchat:8080/chatbox';
	//var URL = 'http://chat.gokurbi.com/chatbox';
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce

$(document).ready(init);

	var apiKey = 'public';

<<<<<<< HEAD
		$(this).serializeArray().forEach(function(o){
			if(o.value != '') input[o.name] = o.value;
		})
		
		$.post(URL,input).then(function(response){
			console.log(response);
			var div = $('.code').append('<div></div>');
			div.text("<script>"+response.snippet + "</script>");
			apiKey = response.apiKey;
=======
	function init(){
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce

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

<<<<<<< HEAD
	var socket = io();
	socket.on('connect', function(data){
	
	});

	socket.emit('join room', 'beer');

	socket.on('message', function(data){
		console.log(data);
	})
}
=======
			});
			
>>>>>>> cf754e9e9a54eb191808bda8cf3473f2182343ce

		});

		var socket = io();
		
		socket.on('connect', function(data){
		
		});

		socket.emit('join room', 'beer');

		socket.on('message', function(data){
			console.log(data);
		})

	}

})(this);