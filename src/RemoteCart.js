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
			this.http.get(this.getUrl(), {
				params: {
					method: 'getShoppingCart'
				}
			})
				.then((response) =>
				{
					resolve(response.data);
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
			this.http.post(this.getUrl(), {
				action: 'addItemToCart',
				product_id: cartItem.getProductId(),
				color: cartItem.getColor(),
				size: cartItem.getSize(),
				amount: cartItem.getQuantity()
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

	/**
	 * @param index
	 * @param quantity
	 * @returns {Promise}
	 */
	removeItemFromCart(index, quantity)
	{
		return new Promise((resolve, reject) =>
		{
			this.http.post(this.getUrl(), {
				action: 'removeItemFromCart',
				key: index,
				quantity: quantity
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
					console.log(response);
					reject(new Error(response));
				});
		});
	}

}

module.exports = RemoteCart;
