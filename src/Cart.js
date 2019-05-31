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
	constructor(token, affiliateId, locationIds, remoteCart, items, checkoutUrl, config)
	{
		var cartConfig = config || {};
		this.affiliateId = affiliateId;
		this.locationIds = locationIds || [];
		this.remoteCart  = remoteCart;
		this.token       = token;
		this.checkoutUrl = checkoutUrl;
		this.subtotal    = 0;
		this.errorRedirectUrl = cartConfig.errorRedirectUrl;

		this.items = items || [];

		this.recalculateSubtotal(remoteCart.subtotal);
	}

	/**
	 * Recalculates subtotal
	 */
	recalculateSubtotal(subtotal)
	{
		this.subtotal = subtotal;
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
				.then((cart) =>
				{
					const itemData = cart.items.filter(pItem => pItem.productId == productId)[0];

					// Map dynamic data to the item
					item.mapItemDataFromResponse(itemData);

					this.items = cart.items.map(i => {
						const cartItem = new CartItem(i.productId, i.color.name, i.size, i.quantity);
						cartItem.mapItemDataFromResponse(i);
						return cartItem;
					});

					this.recalculateSubtotal(cart.subtotal);

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
				.then((cart) =>
				{
					const itemToBeRemoved = search.item;

					this.items = cart.items.map(i => {
						const cartItem = new CartItem(i.productId, i.color.name, i.size, i.quantity);
						cartItem.mapItemDataFromResponse(i);
						return cartItem;
					});

					this.recalculateSubtotal(cart.subtotal);

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
		var errorRedirectUrlParam = this.errorRedirectUrl ? '&errorRedirectUrl=' + encodeURIComponent(this.errorRedirectUrl) : '';

		return this.checkoutUrl + '?token=' + this.token + '&affiliate_id=' + this.affiliateId + ((Array.isArray(this.locationIds) ? this.locationIds.reduce((query, id) => query + '&locationIds[]=' + id, '') : '') + errorRedirectUrlParam);
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
