(function(scope){

	//var URL = 'http://public.foolhardysoftworks.com:9000/chatbox'
	//var URL = 'http://kchat:8080/chatbox';
	//var URL = 'http://chat.gokurbi.com/chatbox';
	var URL = 'http://' + window.location.host + '/chatbox';

$(document).ready(init);
	// var compiledTemplate = Handlebars.compile(template);
	// 		that.content.innerHTML += compiledTemplate(msg.body).replace(/#pickle/g, that.instanceId);

	var apiKey = 'public';

	function init(){

		$.get('/backend/styles.hbs', function(temp){
				$.get('http://'+window.location.host + '/style', function(data){
					console.log(data);
					$('.styles').html(Handlebars.compile(temp)({styles:data}));

					$('#createStyle').on('submit', function(e){
						e.preventDefault();
						var input = {};
						console.log('submitting');
						$(this).serializeArray().forEach(function(o){
							if(o.value != '') input[o.name] = o.value;
						})
						
						$.post('http://'+window.location.host + '/style',input).then(function(response){
							console.log(response);
							location.reload();

						});
						

					});


				});




		});

		$.get('/backend/boxes.hbs', function(temp){
			console.log('loading boxes');
				$.get('http://'+window.location.host + '/chatbox', function(data){
					console.log('bacon')
					$('.boxes').html(Handlebars.compile(temp)({boxes:data}));
					console.log('boxes', data);
					$('#createBox').on('submit', function(e){
						e.preventDefault();
						var input = {};
						console.log('submitting');
						$(this).serializeArray().forEach(function(o){
							if(o.value != '') input[o.name] = o.value;
						})
						
						$.post('http://'+window.location.host + '/chatbox',input).then(function(response){
							console.log(response);
							location.reload();

						});
						

					});



				});
		});

		$.get('/backend/bots.hbs', function(temp){
				$.get('http://'+window.location.host + '/bot', function(data){
					console.log(data);
					$('.bots').html(Handlebars.compile(temp)({bots:data}));
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