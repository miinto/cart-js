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
		this.color    = color;
		this.size      = size;
		this.quantity  = quantity;

		// These are being set from the response
		this.ownerId   = 0;
		this.unitPrice = 0;
		this.photoUrl  = '';
		this.remoteKey = 0;
		this.remoteUrl = '';
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
	}

	/**
	 * Calculates price for this entry
	 * @returns {number}
	 */
	calculatePrice()
	{
		return this.quantity * this.unitPrice;
	}

	getProductId()
	{
		return this.productId;
	}

	getColor()
	{
		return this.color;
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

}

module.exports = CartItem;
