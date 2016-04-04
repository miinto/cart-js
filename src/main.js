require("babelify/polyfill");
const httpRequest   = require('axios');
const cookieManager = require('js-cookie');
const RemoteCart    = require('./RemoteCart');
const Cart          = require('./Cart');
const CartItem      = require('./CartItem');

const settings = window.miintoSettings;

// Handle token and cookie stuff
const suffixForCookieName = settings.baseUrl.split('.').pop();
const expiration          = settings.cartExpiration || 7;
let tokenCookieKey        = 'miinto_affiliate_cart_' + suffixForCookieName.replace(/:/, '');
let cookieOptions         = {expires: expiration};

if (settings.affiliateId === 'miintomobile') {

	if(settings.forcedCookieDomain && settings.forcedCountryCode) {
		tokenCookieKey          = settings.forcedCountryCode + 'devmiinookie';
		cookieOptions['domain'] = settings.forcedCookieDomain;
	} else if(settings.baseUrl.indexOf('sta.miinto.net') > -1) {
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
const baseUrl = settings.baseUrl + '/actions/shoppingcart_remote.php?easter=egg';
//var baseUrl    = settings.baseUrl + '/actions/shoppingcart_remote.php?easter=egg&XDEBUG_SESSION_START=PHPSTORM';
const checkoutUrl = settings.baseUrl + '/actions/shoppingcart_remote.php?method=getCheckoutRemoteCart';
const remoteCart  = new RemoteCart(baseUrl, httpRequest, token);

// Fetch cart, and report back to the onready function
remoteCart.getShoppingCart()
	.then((cartData) =>
	{
		if (window.miintoCartReady) {

			// Place token
			cookieManager.set(tokenCookieKey, cartData.cart.id, cookieOptions);

			// Add ensure correct token on the remote cart
			remoteCart.setToken(cartData.cart.id);

			// Restore items alreay in the cart
			let items = [];
			cartData.formatted_items.map((itemData) =>
			{
				let item = new CartItem(itemData.product_id, itemData.product_color, itemData.product_size, itemData.product_quantity);
				item.mapItemDataFromResponse(itemData);
				items.push(item);
			});

			// Create cart
			let cart = new Cart(cartData.cart.id, settings.affiliateId, remoteCart, items, checkoutUrl);

			// We're ready!!
			window.miintoCartReady(cart);
		} else {
			throw new Error('miintoCartReady method not found!');
		}
	}).catch((err) =>
{
	console.log('Getting cart failed', err);
});




