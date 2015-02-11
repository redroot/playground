var DashboardDispatcher = require('../dispatcher/DashboardDispatcher'),
		DashboardConstants  = require('../constants/DashboardConstants'),
		EventEmitter  = require('events').EventEmitter,
		moment = require('moment'),
		_ = require('underscore');

// private var for our data

var _dataPoints    = [],
		_limit         = 60,
		_dispatchToken = null

// private functions

var _addDataPoint = function(time,data){
	var update = _dataPoints.slice(0,_limit);
	update.push({x: time, y: data })
	_dataPoints = update;
}

// public api

var DataStore = _.extend({},EventEmitter.prototype, {

	getData: function(){
		return _dataPoints;
	},

	emitChange: function(){
		this.emit('change');
	},

	addChangeListener: function(callback){
		this.on('change', callback);
	},

	removeChangeListener: function(callback){
		this.removeListener('change', callback);
	}

});

// register with dispatcher
_dispatchToken = DashboardDispatcher.register(function(payload){

	switch(action.actionType){
		case DashboardConstants.DATA_ADD:
			_addDataPoint(moment().unix(), action.data);
			break;
		default:
			return true;
	}

	DataStore.emitChange();
	return true;

});

// preload data store with data
_(40).times(function(n){
	var time  = moment().subtract(n,'minutes').unix(),
			value = Math.floor(Math.random() * 100);
	_addDataPoint(time, value)
});

module.exports = DataStore;