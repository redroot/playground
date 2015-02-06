var AppDispatcher = require('../dispatcher/AppDispatcher'),
		FluxCartConstants = require('../constants/FluxCartConstants');

// these will then get dispatched by the dispatcher, and the stores will
// listen in for changes, then fire change evnets whcih the views will listen to

module.exports = FluxCartActions = {
	receiveProduct: function(data){
		AppDispatcher.handleViewAction({
			actionType: FluxCartConstants.RECIEVE_DATA
		});
	},

  // Set currently selected product variation
  selectProduct: function(index) {
    AppDispatcher.handleViewAction({
      actionType: FluxCartConstants.SELECT_PRODUCT,
      data: index
    })
  },

  // Add item to cart
  addToCart: function(sku, update) {
    AppDispatcher.handleViewAction({
      actionType: FluxCartConstants.CART_ADD,
      sku: sku,
      update: update
    })
  },

  // Remove item from cart
  removeFromCart: function(sku) {
    AppDispatcher.handleViewAction({
      actionType: FluxCartConstants.CART_REMOVE,
      sku: sku
    })
  },

  // Update cart visibility status
  updateCartVisible: function(cartVisible) {
    AppDispatcher.handleViewAction({
      actionType: FluxCartConstants.CART_VISIBLE,
      cartVisible: cartVisible
    })
  }
}
