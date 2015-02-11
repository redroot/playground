var DashboardDispatcher = require('../dispatcher/DashboardDispatcher'),
		DashboardConstants  = require('../constants/DashboardConstants');

module.exports = DashboardActions = {
	addDataPoint: function(dataPoint){
		DashboardDispatcher.handleViewAction({
			actionType: DashboardConstants.DATA_ADD,
			data: data
		})
	}
};