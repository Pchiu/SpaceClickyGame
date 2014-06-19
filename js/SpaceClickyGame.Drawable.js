var Drawable = function(gameObject, kineticLayer, position) {
	this.kLayer = kineticLayer;
	GameEntity.call(this, gameObject, position);

	if (!this.kImage) {
		this.kImage = new Kinetic.Image({
			x: position.x,
			y: position.y,
		});
		this.kLayer.add(this.kImage);
	}
	this.cacheImage(gameObject);
};
angular.extend(Drawable.prototype, GameEntity.prototype);

Drawable.prototype.cacheImage = function(gameObject) { /* TODO: Should this function belong to the gameObject itself? */
	if (!gameObject.cachedImage) {
		gameObject.cachedImage = new Image();
		gameObject.cachedImage.onload = this.onLoadedImage.bind(this);
		gameObject.cachedImage.src = gameObject.imgpath;
	}
	else { // Image was already Cached, carry on.
		this.onLoadedImage.call(this);
	}
};

Drawable.prototype.animate = function(frame) {
	console.log("no animation present for " + this.id);
};

Drawable.prototype.onLoadedImage = function() {
	this.kImage.setImage(this.gameObject.cachedImage);
	this.kImage.on('click', this.onClick.bind(this));
	this.kImage.cache();
	this.kImage.drawHitFromCache();
};

Drawable.prototype.onClick = function() {
	console.log(this.id + " was CLICKED!");
};
