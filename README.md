# Miinto JS cart
## Usage
The cart is loaded asynchronously with the snippet below. A `miintoSettings` object and `miintoCartReady` function must be declared on the window global, defining settings and "on ready" callback from the cart. To load the cart, place this snippet (preferably before the enclosing <body> tag)

```javascript
<script type="text/javascript">

    window.miintoSettings = {
        affiliateId: 'myAwesomeId',
        cartExpiration: 7,
        baseUrl: 'http://www.miinto.dk'
    };

    (function(d)
    {
        var miintocart   = document.createElement('script');
        miintocart.type  = 'text/javascript';
        miintocart.async = true;
        miintocart.src = window.miintoSettings.baseUrl + '/static/scripts/src/shoppingcart/build/cart-bundle.js';
        var s          = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(miintocart, s);
    }(document));
</script>
```

The library will invoke `window.miintoCartReady` with the cart object, when the cart is initialized/restored.

```javascript
window.miintoCartReady = function(myCart)
{
  // myCart is ready now!
};
```

## API

Asynchronous functions (add/remove) returns a Promise/A+ compliant promise.

Examples:
```javascript
window.miintoCartReady = function(myCart)
{
  // Gettings items
  var items = myCart.getItems();

  // Adding item  (addItem returns a promise)
  myCart.addItem(productId, color, size, quantity)
    .then(function(addedItem) {
      console.log('Added this item', addedItem);
    }).catch(function(errorMessage) {
      console.log('Something bad happened!', errorMessage);
    });

   // Removing an item (removeItem returns a promise)
   myCart.removeItem(items[0])
    .then(function(removedItem) {
      console.log('Removed item', removedItem);
    }).catch(function(errorMessage) {
      console.log('Something bad happened!', errorMessage);
    });

  // Getting subtotal  
  var subtotal = myCart.getSubtotal();

  // Getting checkout url
  var checkoutUrl = myCart.getCheckoutUrl()(;)

};
```
