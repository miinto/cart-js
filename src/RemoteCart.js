class RemoteCart {
	/**
	 * Constructor
	 * @param baseUrl
	 * @param http
	 * @param token
	 */
	constructor(baseUrl, http, token)
	{
		this.baseUrl = baseUrl;
		this.http    = http;
		this.token   = token;
	}

	/**
	 * @param token
	 * @returns {boolean}
	 */
	setToken(token)
	{
		this.token = token;
		return true;
	}

	/**
	 * Returns the "base url" with the token appended if present
	 * @returns {*}
	 */
	getUrl()
	{
		let url = this.baseUrl;
		if (this.token) {
			url = url + '&token=' + this.token;
		}

		return url;
	}

	/**
	 * Get the shopping cart
	 * @returns {Promise}
	 */
	getShoppingCart()
	{
		return new Promise((resolve, reject) =>
		{
			const url = this.getUrl() + '/api/basket/remote';

			this.http.get(url)
				.then((response) =>
				{
					if (response.data.status !== 'success') {
						throw response.data.message;
					}
					resolve(response.data.data);
				})
				.catch((response) =>
				{
					reject(Error(response));
				});
		});

	}

	/**
	 * @param cartItem
	 * @returns {Promise}
	 */
	addItemToCart(cartItem)
	{
		return new Promise((resolve, reject) =>
		{
			const url = this.getUrl() + '/api/basket/product';

			this.http.post(url, {
				productId: cartItem.getProductId(),
				color: cartItem.getColor(),
				size: cartItem.getSize(),
				amount: cartItem.getQuantity()
			})
				.then((response) =>
				{
					if (response.data.status === 'error') {
						throw response.data.message;
					}
					resolve(response.data.data.added_item);
				})
				.catch((response) =>
				{
					reject(new Error(response));
				});
		});
	}

	/**
	 * @param hash
	 * @param quantity
	 * @returns {Promise}
	 */
	removeItemFromCart(hash, quantity)
	{
		return new Promise((resolve, reject) =>
		{
			const url = this.getUrl() + '/api/basket/product/' + hash;

			this.http.delete(url, {
				quantity
			})
				.then((response) =>
				{
					if (response.data.status === 'error') {
						throw response.data.message;
					}
					resolve(response.data.data);
				})
				.catch((response) =>
				{
					reject(new Error(response));
				});
		});
	}

}

module.exports = RemoteCart;
