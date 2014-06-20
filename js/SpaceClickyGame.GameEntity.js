var GameEntity = function(gameObject, position) {
	this.id = gameObject.id;
	this.position = position; // TODO: Should this be here?
	this.gameObject = gameObject;
};

GameEntity.prototype.sayID = function() {
	console.log("Hello, my ID is " + this.id);
};

