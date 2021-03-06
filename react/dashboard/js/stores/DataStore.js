var DashboardDispatcher = require('../dispatcher/DashboardDispatcher'),
		DashboardConstants  = require('../constants/DashboardConstants'),
		EventEmitter  = require('events').EventEmitter,
		moment = require('moment'),
		_ = require('underscore');

// private var for our data

var _dataPoints    = [],
		_limit         = 50,
		_dispatchToken = null

// private functions

var _addDataPoint = function(time,data){
	var update = _.last(_dataPoints,_limit);
	update.push({x: time, y: data })
	_dataPoints = update;
}

// public api

var DataStore = _.extend({},EventEmitter.prototype, {

	getData: function(){
		return _dataPoints;
	},

	getBandedData: function(){
		var memo = {
			"0-10": 0,
			"10-20": 0,
			"20-30": 0,
			"30-40": 0,
			"40-50": 0,
			"50-60": 0,
			"60-70": 0,
			"70-80": 0,
			"80-90": 0,
			"90-100": 0
		}; // pants but meh
		return _.reduce(_dataPoints, function(memo, obj){
			var band  = Math.floor(obj.y/10);
			var label = (parseInt(band)*10) + "-" + ((parseInt(band)+1)*10);
			memo[label]++;
			return memo;
		}, memo);
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
	var action = payload.action;

	switch(action.actionType){
		case DashboardConstants.DATA_ADD:
			_addDataPoint(action.time, action.data);
			break;
		default:
			return true;
	}

	DataStore.emitChange();
	return true;

});

// preload data store with data
_(_limit).times(function(n){
	var time  = moment().subtract(40-n,'minutes').unix(),
			value = Math.floor(Math.random() * 100);
	_addDataPoint(time, value)
});

module.exports = DataStore;