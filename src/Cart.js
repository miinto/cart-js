const CartItem = require('./CartItem');

class Cart {
	/**
	 * Construct
	 * @param token
	 * @param affiliateId
	 * @param locationIds
	 * @param remoteCart
	 * @param items
	 * @param checkoutUrl
	 */
	constructor(token, affiliateId, locationIds, remoteCart, items, checkoutUrl)
	{
		this.affiliateId = affiliateId;
		this.locationIds = locationIds || [];
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
		this.subtotal = 0;
		if (this.items && this.items.length > 0) {
			for (let i = 0; i < this.items.length; i++) {
				this.subtotal = this.subtotal + this.items[i].calculatePrice();
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

					// Add item or adjust quantity if exists
					let similarItem = this.findSimilarItem(item);
					if (similarItem !== -1) {
						similarItem.item.adjustQuantity(quantity);
					} else {
						this.items.push(item);
					}
					this.recalculateSubtotal();

					resolve(item);

				}).catch((errorMessage) =>
			{
				reject(errorMessage);
			});
		});
	}

	/**
	 * @param hash
	 * @returns {*}
	 */
	findItemByHash(hash)
	{
		for (let i = 0; i < this.items.length; i++) {
			let currentItem = this.items[i];
			if (currentItem.hash == hash) {
				return {
					item: currentItem,
					index: i
				};
			}
		}

		return -1;
	}

	findSimilarItem(item)
	{
		return this.findItemByHash(item.hash);
	}

	/**
	 * Remote item from cart
	 * @param item
	 * @param quantity
	 * @returns {Promise}
	 */
	removeItem(item, quantity)
	{
		if (!quantity) {
			quantity = 1;
		}

		let search = this.findItemByHash(item.hash);

		if (search === -1) {
			throw new Error('Could not find the item to be removed!!' + item.hash);
		}
		return new Promise((resolve, reject) =>
		{
			this.remoteCart.removeItemFromCart(search.item.hash, quantity)
				.then(() =>
				{
					let itemToBeRemoved = search.item;
					// Deduct quantity, and remove if below 0
					itemToBeRemoved.adjustQuantity(-1 * quantity);

					if (itemToBeRemoved.getQuantity() <= 0) {
						itemToBeRemoved = this.items.splice(search.index, 1);
					}
					this.recalculateSubtotal();
					resolve(itemToBeRemoved);

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
		return this.checkoutUrl + '&token=' + this.token + '&affiliate_id=' + this.affiliateId + (Array.isArray(this.locationIds) ? this.locationIds.reduce((query, id) => query + '&locationIds[0][]=' + id, '') : '');
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
