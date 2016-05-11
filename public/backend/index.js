(function(scope){
var URL = 'http://public.foolhardysoftworks.com:9000/chatbox';
$(document).ready(init);


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

		});
		

	});

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