var AppDispatcher = require('../dispatcher/AppDispatcher'),
		EventEmitter = require('events').EventEmitter,
		FluxCartConstants = require('../constants/FluxCartConstants'),
		_ = require('underscore');

// this is the state for the store, kept in private vars within the file
// probably not the only way to do things to be honest buthey ho
var _product = {}, _selected = null, _dispatchToken;

// private function

var _loadProductData = function(data){
	_product = data[0];
	_selected = _product.variants[0];
}

var _setSelected = function(index){
	if(_product.variants){
		_selected = _product.variants[index];
	}
}

// make product store extend event emitter to proive event caps
var ProductStore = _.extend({}, EventEmitter.prototype, {

	// now we define out api fo rhow it interacts
	getProduct: function() { 
		return _product; 
	},

	getSelected: function() {
		return _selected;
	},

	getDispatchToken: function(){
		return _dispatchToken;
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

// now we register, use dispatch token to allow a wait for
_dispatchToken = AppDispatcher.register(function(payload){
	var action = payload.action;

	switch(action.actionType){
		case FluxCartConstants.RECEIVE_DATA:
			_loadProductData(action.data);
			break;
		case FluxCartConstants.SELECT_PRODUCT:
			_setSelected(action.data);
			break;
		default:
			return true; // do nuthing
	}

	ProductStore.emitChange();
	return true;

});

module.exports = ProductStore;