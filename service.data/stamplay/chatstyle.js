
			// }else if(DATASOURCE == 'stamplay'){
			// 	var chatObj = {};
			// 	chatObj.js = js
			// 		.replace(/#SERVER_URL/g,URL);
			// 	chatObj.html = results[0]
			// 		.replace(/#SERVER_URL/g,URL);
			// 	chatObj.css = results[1];
			// 	// Data Layer is Stamplay Node SDK
			// 	var data = {
			// 	    "js": chatObj.js,
			// 	    "html": chatObj.html,
			// 	    "css": chatObj.css
			// 	}
			// 	db.Object('chatbox').save(data, function(error, result){
			// 	    if(error) 
			// 	    	console.log(error);
			// 		else{
			// 			result = JSON.parse(result);
			// 			var customSnippet = snippet.replace('#BANANA', result.id).replace(/#SERVER_URL/g,URL);
			// 			var uglySnippet = UglifyJS.minify(customSnippet, {fromString: true});
			// 			return res.json({'snippet':uglySnippet.code, 'chatBoxId': result.id});	
			// 		}
			// 	})
			// }