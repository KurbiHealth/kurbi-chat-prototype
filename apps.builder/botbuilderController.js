function botbuilderController($stateParams, notification, Restangular, $q, $scope) {

	/* 
	NOTE: 
		app.js (this) has 
			var $scope		- undefined
			var angular 	- has utility functions
			var jQuery & var $
			var joint		- core Joint.js object
			var qad			- belongs to this app
		THEN $scope has
			var controller 	- this
		THEN window has
			everything that app.js (this) has
	NOTE: 
		it looks like 'window' is the root scope, and the only reason the 
		backbone app and the angular app don't conflict is that the botbuilder app
		uses var app and the angular app doesn't. Otherwise, unless there is a 
		dependency function that both libraries share, they should co-exist
	*/ 


}

botbuilderController.$inject = ['$stateParams', 'notification', 'Restangular', '$q', '$scope'];

export default botbuilderController;