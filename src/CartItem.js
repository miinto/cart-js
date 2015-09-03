class CartItem {
	/**
	 * Construct cart ite,
	 * @param productId
	 * @param color
	 * @param size
	 * @param quantity
	 */
	constructor(productId, color, size, quantity)
	{
		this.productId = productId;
		this.color     = color;
		this.size      = size;
		this.quantity  = quantity;

		// These are being set from the response
		this.title         = '';
		this.ownerId       = 0;
		this.unitPrice     = 0;
		this.photoUrl      = '';
		this.colorRGB      = '0,0,0';
		this.largePhotoUrl = '';
		this.remoteKey     = 0;
		this.remoteUrl     = '';
	}

	/**
	 * This takes itemData dynamically retrieved from the remote shopping cart,
	 * and populates the properties
	 * @param itemData
	 */
	mapItemDataFromResponse(itemData)
	{
		this.remoteKey = itemData['key'];
		this.ownerId   = itemData.product_owner_id;
		this.unitPrice = itemData.product_unit_price_raw;
		this.photoUrl  = itemData.product_image;
		this.remoteUrl = itemData.product_url;
		this.quantity  = itemData.product_quantity;
		this.colorRGB  = itemData.product_color_rgb;
		this.title     = itemData.product_title;
	}

	/**
	 * Calculates price for this entry
	 * @returns {number}
	 */
	calculatePrice()
	{
		return this.quantity * this.unitPrice;
	}

	getTitle()
	{
		return this.title;
	}

	getProductId()
	{
		return this.productId;
	}

	getColor()
	{
		return this.color;
	}

	getColorRGB()
	{
		return this.colorRGB;
	}

	getSize()
	{
		return this.size;
	}

	getQuantity()
	{
		return this.quantity;
	}

	adjustQuantity(value)
	{
		this.quantity += value;
	}

	getOwnerId()
	{
		return this.ownerId;
	}

	getUnitPrice()
	{
		return this.unitPrice;
	}

	getPhotoUrl()
	{
		return this.photoUrl;
	}

	getLargePhotoUrl()
	{
		return this.largePhotoUrl;
	}

	getRemoteUrl()
	{
		return this.remoteUrl;
	}

}

module.exports = CartItem;
