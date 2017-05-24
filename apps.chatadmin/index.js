(function(scope){

$(document).ready(init);
	// var compiledTemplate = Handlebars.compile(template);
	// 		that.content.innerHTML += compiledTemplate(msg.body).replace(/#pickle/g, that.instanceId);


	function init(){
		setTimeout(function(){

		$.get('/admin/chats', function(data){
			
			$(".room-container").unbind();
			$("body").html("");
			// var background = $("<div class='kurbi-backdrop'></div>");
			// background.appendTo('body');
			data.forEach(function(x){
				console.log(x);
				var div = append(x, chat);
				var chat = chatFactory({info:{sessionId:'admin', useIo:true, room:x.key}},div[0]);
				// div.click(clickHandler(x,div,chat));
			});

		});
		},500);

	}

	function append(x){

		var s = "<div><div class='room-container'> <div>"+syntaxHighlight(x)+"</div></div>"+"<div class='kurbi-parent'>" + scope.kurbi.parentTemplate +"</div></div>";
		var div = $(s);
		div.appendTo('body');

		return div;
	}

	function syntaxHighlight(json) {
	    if (typeof json != 'string') {
	         json = JSON.stringify(json, undefined, 2);
	    }

	    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
	        var cls = 'number';
	        if (/^"/.test(match)) {
	            if (/:$/.test(match)) {
	                cls = 'key';
	            } else {
	                cls = 'string';
	            }
	        } else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        } else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
	}

	function clickHandler(x,div,chat){
		return function(e){
			chat.toggleChat();
			// var mybox = ChatBox({sessionId:'admin', useIo:true}, e.target);
		}
		
	}

})(this)