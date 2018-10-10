require("babelify/polyfill");
require("whatwg-fetch");
const cookieManager = require('js-cookie');
const RemoteCart    = require('./RemoteCart');
const Cart          = require('./Cart');
const CartItem      = require('./CartItem');

const settings = window.miintoSettings;

// Handle token and cookie stuff
const suffixForCookieName = settings.baseUrl.replace('http:', 'https:').split('.').pop();
const expiration          = settings.cartExpiration || 7;
let tokenCookieKey        = 'miinto_affiliate_cart_' + suffixForCookieName.replace(/:/, '');
let cookieOptions         = {expires: expiration};

if (settings.affiliateId === 'miintomobile') {

	if(settings.forcedCookieDomain && settings.forcedCountryCode) {
		tokenCookieKey          = settings.forcedCountryCode + 'devmiinookie';
		cookieOptions['domain'] = settings.forcedCookieDomain;
	} else if(settings.baseUrl.replace('http:', 'https:').indexOf('sta.miinto.net') > -1) {
		// staging
		// key: {countryCode}devmiinokie
		// domain: .dk.sta.miinto.net
		let hostname = settings.baseUrl.replace(/https?:\/\//, '');
		tokenCookieKey          = hostname.split('.').shift() + 'devmiinookie';
		cookieOptions['domain'] = '.' + hostname;

	} else {
		// prod
		// key: {countryCode}miinookie
		let hostname = settings.baseUrl.replace(/https?:\/\//, '').replace(/www\./, '');
		tokenCookieKey          = hostname.split('.').pop() + 'miinookie';
		cookieOptions['domain'] = '.' + hostname;
	}
}

const token = cookieManager.get(tokenCookieKey);

// Base settings
const baseUrl = settings.baseUrl.replace('http:', 'https:');
const checkoutUrl = settings.baseUrl.replace('http:', 'https:') + '/api/basket/remote';
const remoteCart  = new RemoteCart(baseUrl.replace('http:', 'https:'), token);

// Fetch cart, and report back to the onready function
remoteCart.getShoppingCart()
	.then((cartData) =>
	{
		if (window.miintoCartReady) {

			// Place token
			cookieManager.set(tokenCookieKey, cartData.id, cookieOptions);

			// Add ensure correct token on the remote cart
			remoteCart.setToken(cartData.id);

			// Restore items alreay in the cart
			let items = [];
			cartData.items.map((itemData) =>
			{
				let item = new CartItem(itemData.productId, itemData.color.name, itemData.size, itemData.quantity);
				item.mapItemDataFromResponse(itemData);
				items.push(item);
			});

			// Create cart
			let cart = new Cart(cartData.id, settings.affiliateId, settings.locationIds, remoteCart, items, checkoutUrl);

			// We're ready!!
			window.miintoCartReady(cart);
		} else {
			throw new Error('miintoCartReady method not found!');
		}
	}).catch((err) =>
{
	console.log('Getting cart failed', err);
});
