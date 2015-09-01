const CartItem = require('./CartItem');

class Cart {
	/**
	 * Construct
	 * @param token
	 * @param affiliateId
	 * @param remoteCart
	 * @param items
	 * @param checkoutUrl
	 */
	constructor(token, affiliateId, remoteCart, items, checkoutUrl)
	{
		this.affiliateId = affiliateId;
		this.remoteCart  = remoteCart;
		this.token       = token;
		this.checkoutUrl = checkoutUrl;
		this.subtotal    = 0;

		this.items = items || [];

		this.recalculateSubtotal();
	}

	/**
	 * Recalculates subtotal bases on items in cart
	 */
	recalculateSubtotal()
	{
		if (this.items && this.items.length > 0) {
			for (let i = 0; i < this.items.length; i++) {
				this.subtotal = +this.items[i].calculatePrice();
			}
		}
	}

	/**
	 * Add and item to the cart
	 * @param productId
	 * @param color
	 * @param size
	 * @param quantity
	 * @returns {Promise}
	 */
	addItem(productId, color, size, quantity)
	{
		return new Promise((resolve, reject) =>
		{
			let item = new CartItem(productId, color, size, quantity);
			this.remoteCart.addItemToCart(item)
				.then((itemData) =>
				{
					// Map dynamic data to the item
					item.mapItemDataFromResponse(itemData);

					// Add item or adjust quantit if exists
					let search = this.items.indexOf(item);
					if (search !== -1) {
						this.items[search].adjustQuantity(quantity);
					} else {
						this.items.push(item);
					}

					resolve(item);

				}).catch((errorMessage) =>
				{
					reject(errorMessage);
				});
		});
	}

	/**
	 * Remote item from cart
	 * @param item
	 * @returns {Promise}
	 */
	removeItem(item)
	{
		let index = this.items.indexOf(item);
		if (index === -1) {
			throw new Error('Could not find the item!');
		}
		return new Promise((resolve, reject) =>
		{
			this.remoteCart.removeItemFromCart(item.remoteKey, 1)
				.then(() =>
				{
					// Deduct quantity, and remove if below 0
					let item = this.items[index];
					item.quantity--;

					if (item.getQuantity() <= 0) {
						item = this.items.splice(index, 1);
					}

					resolve(item);

				}).catch((errorMessage) =>
				{
					reject(errorMessage);
				});
		});

	}
	
	/**
	 * Get checkout URL
	 */
	getCheckoutUrl()
	{
		return this.checkoutUrl + '&token=' + this.token + '&affiliate_id=' + this.affiliateId;
	}

	/**
	 * @returns {number|*}
	 */
	getSubtotal()
	{
		return this.subtotal;
	}

	/**
	 * @returns {*|Array}
	 */
	getItems()
	{
		return this.items;
	}

}

module.exports = Cart;

