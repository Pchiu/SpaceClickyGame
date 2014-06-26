var Drawable = function(gameObject, kineticLayer, position) {
	this.kLayer = kineticLayer;
	GameEntity.call(this, gameObject, position);

	this.cacheGroupImage(gameObject, position);

	//this.kLayer.add(this.spriteGroup.imageGroup);
	/*
	if (!this.kImage) {
		this.kImage = new Kinetic.Image({
			x: position.x,
			y: position.y,
		});
		this.kLayer.add(this.kImage);
	}
	this.cacheImage(gameObject);
	*/
};
angular.extend(Drawable.prototype, GameEntity.prototype);


Drawable.prototype.cacheGroupImage = function(gameObject, position) { 
	if (!gameObject.cachedImage) {
		var spriteGroup = this.createSpriteGroup(gameObject.components[0], position.x, position.y)
		for (var i = 1; i < gameObject.components.length; i++)
		{
			this.addChildToSpriteGroup(spriteGroup, gameObject.components[i]);
		}
		this.finalizeGroupToImage(spriteGroup);

		//gameObject.cachedImage = new Image();
		//gameObject.cachedImage.onload = this.onLoadedImage.bind(this);
		//gameObject.cachedImage.src = gameObject.imgpath;
	}
	else { // Image was already Cached, carry on.
		//this.onLoadedImage.call(this);
	}
};


Drawable.prototype.cacheImage = function(spriteGroup, image, imagePath) {
	if (!spriteGroup.cachedImages[image]) {
		spriteGroup.cachedImages[image] = new Image();
		//spriteGroup.cachedImages[image].onload = this.onLoadedImage.bind(spriteGroup);
		spriteGroup.cachedImages[image].src = imagePath
	}
};

Drawable.prototype.animate = function(frame) {
	console.log("no animation present for " + this.id);
};

Drawable.prototype.finalizeGroupToImage = function(spriteGroup) {
	
	spriteGroup.imageGroup.toImage({
		callback: function(img) {
			var image = new Kinetic.Image({
				image: img,
				x: spriteGroup.imageGroup.x,
				y: spriteGroup.imageGroup.y,
				offsetX: spriteGroup.cachedImages[0].width()/2,
				offsetY: spriteGroup.cachedImages[0].height()/2,
			})
			this.gameObject.cachedImage = image;
			image.cache();
			image.drawHitFromCache();
			image.on('click', this.onClick.bind)
		}
	})
	/*
	spriteGroup.imageGroup.on('click', this.onClick.bind(this));
	spriteGroup.imageGroup.cache();
	spriteGroup.imageGroup.drawHitFromCache();
	*/
	
};

Drawable.prototype.onLoadedImage = function() {
	this.kImage.setImage(this.gameObject.cachedImage);
	//this.kImage.on('click', this.onClick.bind(this));
	//this.kImage.cache();
	//this.kImage.drawHitFromCache();
};

Drawable.prototype.onClick = function() {
	console.log(this.id + " was CLICKED!");
};

Drawable.prototype.createSpriteGroup = function(parent, x, y) {
	var kGroup = new Kinetic.Group({
		x: x,
		y: y
	})

	var spriteGroup = {
		'imageGroup': kGroup,
		'cachedImages': {}
	};

	var kImage = new Kinetic.Image({
	}) 
	this.cacheImage(spriteGroup, parent.sprite.id, parent.sprite.imgpath)

	kImage.src = spriteGroup.cachedImages[parent.sprite.id];
	spriteGroup.imageGroup.offsetX(kImage.width()/2);
	spriteGroup.imageGroup.offsetY(kImage.height()/2);
	spriteGroup.imageGroup.add(kImage);
	
	spriteGroup["root"] = {'parent': null, 'id': parent.name, 'xOffset': 0, 'yOffset': 0, 'children': []};
	return spriteGroup
};

Drawable.prototype.addChildToSpriteGroup = function(spriteGroup, component){
	var parentNode = this.findNode(spriteGroup.root, component.parentNode)
	if (parentNode == null)
	{
		console.log("Failed to find a node with the name '" + component.parentNode + "'.");
		return;
	}
	if (parentNode.id == component.name)
	{
		console.log("A node with the name'" + component.name + "' already exists!");
		return;
	}

	var kImage = new Kinetic.Image({
		x: parentNode.xOffset + component.parentAnchorPoint.x,
		y: parentNode.yOsset + component.parentAnchorPoint.y,
		offset: {x: component.childAnchorPoint.x, y: component.childAnchorPoint.y},
		rotation: component.angle,
	})
	this.cacheImage(spriteGroup, component.sprite.id, component.sprite.imgpath)
	kImage.image.src = spriteGroup.cachedImages[component.sprite.id];
	spriteGroup.imageGroup.add(kImage);
	parentNode.children.push({'parent': parentNode, 'id': component.name, 'xOffset': kImage.x() - kImage.offsetX(), 'yOffset': kImage.y() - kImage.offsetY(), 'children': []})
}

Drawable.prototype.findNode = function(node, nodeName) {
	if (node.id == nodeName)
	{
		return node;
	}
	var result = null;
	for (var i = 0; resullt == null && i < node.children.length; i++) {
		result = this.findNode(node.children[i], nodeName)
	}
	return result;
};

