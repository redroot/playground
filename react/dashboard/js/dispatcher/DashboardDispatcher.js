var Dispatcher = require('flux').Dispatcher;
var DashboardDispatcher = new Dispatcher();

DashboardDispatcher.handleViewAction = function(action){
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}

module.exports = DashboardDispatcher;