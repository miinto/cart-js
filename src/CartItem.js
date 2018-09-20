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
		this.colorRGB      = ['0', '0', '0'];
		this.largePhotoUrl = '';
		this.remoteUrl     = '';
		this.hash          = '';
	}

	/**
	 * This takes itemData dynamically retrieved from the remote shopping cart,
	 * and populates the properties
	 * @param itemData
	 */
	mapItemDataFromResponse(itemData)
	{
		this.ownerId       = itemData.ownerId;
		this.unitPrice     = itemData.unitPrice;
		this.photoUrl      = itemData.photoThumbUrl;

		this.remoteUrl = itemData.productUrl;
		this.quantity  = itemData.uantity;
		this.colorRGB  = [itemData.color.r, itemData.color.g, itemData.color.b];
		this.title     = itemData.title;
		this.hash      = itemData.hash;
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

	getHash()
	{
		return this.hash;
	}

}

module.exports = CartItem;
