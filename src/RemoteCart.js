class RemoteCart {
	/**
	 * Constructor
	 * @param baseUrl
	 * @param http
	 * @param token
	 */
	constructor(baseUrl, token)
	{
		this.baseUrl = baseUrl;
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
	getUrl(path)
	{
		let url = `${this.baseUrl}${path}`;
		// if (this.token) {
		// 	url = url + '?token=' + this.token;
		// }

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
			const url = this.getUrl('/api/basket');

			return fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			})
				.then((response) =>
				{
					response.json().then(data => resolve(data.data));
				})
				.catch((response) =>
				{
					reject(new Error(response));
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
			const url = this.getUrl('/api/basket/product');

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					productId: cartItem.getProductId(),
					color: cartItem.getColor(),
					size: cartItem.getSize(),
					amount: cartItem.getQuantity()
				})
			})
				.then((response) => {
					response.json().then(data => resolve(data.data));
				})
				.catch((response) => {
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

			fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((response) => {
					response.json().then(data => resolve(data.data));
				})
				.catch((response) => {
					reject(new Error(response));
				});
		});
	}

}

module.exports = RemoteCart;
