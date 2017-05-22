module.exports = function(router,operator){
	router
		.route('/admin/chats')
			.get(getActiveChats);


	function getActiveChats(req,res){
		var roomKeys = Object.keys(operator.getActiveRooms());
		var rooms = [];
		roomKeys.forEach(function(key){
			var data = operator.getRoomData(key);
			data.key = key;
			rooms.push(data);
		});	
		return	res.status(200).json(rooms);
	}
			
}

