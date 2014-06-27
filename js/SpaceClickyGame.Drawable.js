var Drawable = function(gameObject, kineticLayer, position) {
	this.kLayer = kineticLayer;
	GameEntity.call(this, gameObject, position)

	if (gameObject.cachedImage != null)
	{
		return;
	}
	
	var loaders = [];
	for (var i = 0; i < gameObject.components.length; i++)
	{
		loaders.push(this.loadSprite(gameObject, gameObject.components[i].sprite.id, gameObject.components[i].sprite.imgpath, i))
	}
	var self = this;
	$.when.apply(null, loaders).done(function() {
		var spriteGroup = self.createSpriteGroup(gameObject, gameObject.components[0], position.x, position.y)
		for (var i = 1; i < gameObject.components.length; i++)
		{
			self.addChildToSpriteGroup(spriteGroup, gameObject.components[i]);
		}
		self.finalizeGroupToImage(spriteGroup);
	});
};
angular.extend(Drawable.prototype, GameEntity.prototype);

Drawable.prototype.loadSprite = function(gameObject, id, imagepath, index)
{
	var deferred = $.Deferred();
	if (!this.gameObject.cachedImages[id]){
		var sprite = new Image();
		sprite.onload = function() {
			gameObject.cachedImages[gameObject.components[index].sprite.id] = sprite;
			deferred.resolve();
		};
		sprite.src = imagepath;
	}
	return deferred.promise();
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

Drawable.prototype.onClick = function() {
	console.log(this.id + " was CLICKED!");
};

Drawable.prototype.createSpriteGroup = function(gameObject, parent, x, y) {
	var kGroup = new Kinetic.Group({
		x: x,
		y: y
	})

	var spriteGroup = {
		'imageGroup': kGroup,
	};

	var kImage = new Kinetic.Image({
	}) 

	kImage.src = gameObject.cachedImages[parent.sprite.id];
	spriteGroup.imageGroup.offsetX(kImage.width()/2);
	spriteGroup.imageGroup.offsetY(kImage.height()/2);
	spriteGroup.imageGroup.add(kImage);
	
	spriteGroup["root"] = {'parent': null, 'id': parent.name, 'xOffset': 0, 'yOffset': 0, 'children': []};
	return spriteGroup
};

Drawable.prototype.addChildToSpriteGroup = function(gameObject, spriteGroup, component){
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
	kImage.image.src = gameObject.cachedImages[component.sprite.id];
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

