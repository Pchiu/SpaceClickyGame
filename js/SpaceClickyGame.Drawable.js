var Drawable = function(gameObject, kineticLayer, position) {
	this.kLayer = kineticLayer;
	GameEntity.call(this, gameObject, position);

	if (!this.spriteGroup) {
		this.spriteGroup = this.createSpriteGroup(gameObject.components[0], position.x, position.y)
	}

	for (var i = 1; i < gameObject.components.length; i++)
	{
		this.addChildToSpriteGroup(spriteGroup, components[i]);
	}

	this.finalizeGroup(this.kLayer, this.spriteGroup);

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

/*
Drawable.prototype.cacheImage = function(gameObject) { 
	if (!gameObject.cachedImage) {
		gameObject.cachedImage = new Image();
		gameObject.cachedImage.onload = this.onLoadedImage.bind(this);
		gameObject.cachedImage.src = gameObject.imgpath;
	}
	else { // Image was already Cached, carry on.
		this.onLoadedImage.call(this);
	}
};
*/

Drawable.prototype.cacheImage = function(spriteGroup, image, imagePath) {
	if (!spriteGroup.cachedImages[image]) {
		spriteGroup.cachedImages[image] = new Image();
		spriteGroup.cachedImages[image].onload = this.onLoadedImage.bind(this);
		spriteGroup.cachedImages[image].src = imagePath
	}
};

Drawable.prototype.animate = function(frame) {
	console.log("no animation present for " + this.id);
};

Drawable.prototype.finalizeGroup = function(layer, spriteGroup) {
	/*
	spriteGroup.imageGroup.toImage({
		callback: function(img) {
			var image = new Kinetic.Image({
				image: img,
				x: spriteGroup.imageGroup.x,
				y: spriteGroup.imageGroup.y,
				offsetX: spriteGroup.cachedImages[0].width()/2,
				offsetY: spriteGroup.cachedImages[0].height()/2,
			})
			image.cache();
			image.drawHitFromCache();
			image.on('click', this.onClick.bind)
			layer.add(image);
		}
	})
	*/
	spriteGroup.imageGroup.on('click', this.onClick.bind(this));
	spriteGroup.imageGroup.cache();
	spriteGroup.imageGroup.drawHitFromCache();
	
};

Drawable.prototype.onLoadedImage = function() {
	//this.kImage.setImage(this.gameObject.cachedImage);
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

	var kParentImage = new Kinetic.Image({
	}) 
	this.cacheImage(spriteGroup, parent.name, parent.sprite.imgpath)

	kParentImage.src = spriteGroup.cachedImages[parent.name];
	spriteGroup.imageGroup.offsetX(kParentImage.width()/2);
	spriteGroup.imageGroup.offsetY(kParentImage.height()/2);
	spriteGroup.imageGroup.add(kParentImage);
	
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
	if (parentNode.id == childNodeName)
	{
		console.log("A node with the name'" + component.name + "' already exists!");
		return;
	}

	var childSprite = new Kinetic.Image({
		x: parentNode.xOffset + component.parentAnchorPoint.x,
		y: parentNode.yOsset + component.parentAnchorPoint.y,
		offset: {x: component.childAnchorPoint.x, y: component.childAnchorPoint.y},
		rotation: component.angle,
	})
	childSprite.image.src = component.sprite.imgpath;
	parentNode.children.push({'parent': parentNode, 'id': component.name, 'xOffset': childSprite.x() - childSprite.offsetX(), 'yOffset': childSprite.y() - childSprite.offsetY(), 'children': []})
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

