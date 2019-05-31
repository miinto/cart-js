class RemoteCart {
	/**
	 * Constructor
	 * @param baseUrl
	 * @param http
	 * @param token
	 */
	constructor(baseUrl, token, settings)
	{
		this.baseUrl = baseUrl;
		this.token   = token;
		this.affiliateId = settings.affiliateId;
		this.locationIds = settings.locationIds || [];
		this.errorRedirectUrl = settings.errorRedirectUrl;
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
		let url = `${this.baseUrl}${path}${this.getQueryParameters()}`;

		return url;
	}

	getHeaders() {
		let headers = {
			'Content-Type': 'application/json',
		};

		if (this.token) {
			headers['Miinto-Basket-Token'] = this.token
		}

		return headers;
	}

	getQueryParameters()
	{
		var errorRedirectUrlParam = this.errorRedirectUrl ? '&errorRedirectUrl=' + encodeURIComponent(this.errorRedirectUrl) : '';

		return '?token=' + this.token + '&affiliate_id=' + this.affiliateId + ((Array.isArray(this.locationIds) ? this.locationIds.reduce((query, id) => query + '&locationIds[]=' + id, '') : '') + errorRedirectUrlParam);
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
				headers: this.getHeaders(),
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

			return fetch(url, {
				method: 'POST',
				headers: this.getHeaders(),
				body: JSON.stringify({
					productId: cartItem.getProductId(),
					color: cartItem.getColor(),
					size: cartItem.getSize(),
					amount: cartItem.getQuantity()
				})
			})
				.then((response) => {
					response.json().then(data => {
						if(response.status === 200) {
							resolve(data.data)
						} else {
							reject(new Error(data.meta && data.meta.message ? data.meta.message : response.statusText));
						}
					});
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
			const url = this.getUrl('/api/basket/product/' + hash);

			return fetch(url, {
				method: 'DELETE',
				headers: this.getHeaders(),
				body: JSON.stringify({
					amount: quantity
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

}

module.exports = RemoteCart;
