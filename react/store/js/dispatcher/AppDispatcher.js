var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();

// convenince method for handling view actions

AppDispatcher.handleViewAction = function(action){
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}

module.exports = AppDispatcher;