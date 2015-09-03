require("babelify/polyfill");
const httpRequest   = require('axios');
const cookieManager = require('js-cookie');
const RemoteCart    = require('./RemoteCart');
const Cart          = require('./Cart');
const CartItem      = require('./CartItem');

const settings = window.miintoSettings;

// Handle token and cookie stuff
const suffixForCookieName = settings.baseUrl.split('.').pop();
const tokenCookieKey      = 'miinto_affiliate_cart_' + suffixForCookieName.replace(/:/, '');
const token               = cookieManager.get(tokenCookieKey);

// Base settings
const baseUrl = settings.baseUrl + '/actions/shoppingcart_remote.php?easter=egg';
//var baseUrl    = settings.baseUrl + '/actions/shoppingcart_remote.php?easter=egg&XDEBUG_SESSION_START=PHPSTORM';
const checkoutUrl = settings.baseUrl + '/actions/shoppingcart_remote.php?method=getCheckoutRemoteCart';

const remoteCart = new RemoteCart(baseUrl, httpRequest, token);

// Fetch cart, and report back to the onready function
remoteCart.getShoppingCart()
	.then((cartData) =>
	{
		if (window.miintoCartReady) {

			// Place token
			let expiration = settings.cartExpiration || 7;
			cookieManager.set(tokenCookieKey, cartData.cart.id, {expires: expiration});

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




