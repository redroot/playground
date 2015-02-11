var DashboardDispatcher = require('../dispatcher/DashboardDispatcher'),
		DashboardConstants  = require('../constants/DashboardConstants');

module.exports = DashboardActions = {
	addDataPoint: function(time, value){
		DashboardDispatcher.handleViewAction({
			actionType: DashboardConstants.DATA_ADD,
			time: time,
			data: value
		});
	}
};