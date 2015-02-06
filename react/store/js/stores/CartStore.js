var AppDispatcher = require('../dispatcher/AppDispatcher'),
		EventEmitter = require('events').EventEmitter,
		FluxCartConstants = require('../constants/FluxCartConstants'),
		_ = require('underscore');

var _products    = {}
		_cartVisible = false,
		_dispatchToken = null;

var _setCartVisible = function(state){
	_cartVisible = state;
}

var _addProduct = function(sku, update){
	update.quantity = (sku in _products) ? _products[sku].quantity + 1 : 1;
	_products[sku] = _.extend({}, _products[sku], update)
}

var _removeProduct = function(sku){
	delete _products[sku];
}

var CartStore = _.extend({}, EventEmitter.prototype, {

  // Return cart items
  getCartItems: function() {
    return _products;
  },

  // Return # of items in cart
  getCartCount: function() {
    return Object.keys(_products).length;
  },

  getDispatchToken: function(){
  	return _dispatchToken;
  },

  // Return cart cost total
  getCartTotal: function() {
    var total = 0;
    for(product in _products){
      if(_products.hasOwnProperty(product)){
        total += _products[product].price * _products[product].quantity;
      }
    }
    return total.toFixed(2);
  },

  // Return cart visibility state
  getCartVisible: function() {
    return _cartVisible;
  },

  // Emit Change event
  emitChange: function() {
    this.emit('change');
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});

_dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    // Respond to CART_ADD action
    case FluxCartConstants.CART_ADD:
      add(action.sku, action.update);
      break;

    // Respond to CART_VISIBLE action
    case FluxCartConstants.CART_VISIBLE:
      setCartVisible(action.cartVisible);
      break;

    // Respond to CART_REMOVE action
    case FluxCartConstants.CART_REMOVE:
      removeItem(action.sku);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  CartStore.emitChange();

  return true;

});

module.exports = CartStore;