angular.module('SpaceClickyGameApp', [])
.controller('SpaceController', ['$scope', '$timeout', 'Player', 'Shop',  
		function ($scope, $timeout, Player, Shop) {
	
	$scope.player = Player;
	$scope.shop = Shop;
	
	$scope.timerLoop = function () {
		$scope.player.money += $scope.player.moneyPerTick;
        $timeout($scope.timerLoop, 1000);
	}
	
	$scope.timer = $timeout($scope.timerLoop,1000);
	$scope.$on("$destroy",
		function(event) {
			$timeout.cancel($scope.timer);
		}
	);
	
	$scope.$watch('shop.purchaseMenuOpen', function(open) {
        $scope.purchasesToggleTitle = open ? 'Close purchases menu' : 'Open purchases menu';
    }, true);

	$scope.$watch("player.purchasedUpgrades['autoDrill']", function(autoDrills) {
		if(autoDrills) {
			$scope.kineticCanvas.addDrone();
		}
	}, true);
}])

// Set up kinetic.js stage
.directive('spaceClickyStage', ['GameObjects', function(GameObjects) {
	return {
		link: function (scope, element, attrs) {
			scope.kineticCanvas = {
				canvas: null,
				context: null,
				mainStage: null,
				mainLayer: null,

				drawables: [],

				addDrawable: function (drawable) {
					this.drawables.push(drawable);
				},

				addDrone: function() {
					this.addDrawable(new Drone(GameObjects.drones.autoDrill, this.mainLayer, {x:250, y:250},
										 this.getRandomInt(200,250), 20000));
				},

				getRandomInt: function(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				},

				setStage: function() {
					/* Setting up the first asteroid */
					var moneyAstroid = new Asteroid(GameObjects.rocks.basicRock, this.mainLayer, {x:250, y:250}, -80000);
					moneyAstroid.onClick = function() {
						scope.player.clicks += 1;
						scope.player.money += 1.00 * scope.player.multiplier;
						scope.$apply();
					};
					this.addDrawable(moneyAstroid);
				},

				init: function() {
					this.mainStage = new Kinetic.Stage({
						container: 'mainStage',
						width: 500, 
						height: 500
					});

					this.mainLayer = new Kinetic.Layer();
					this.mainStage.add(this.mainLayer);
					this.setStage();

					var drawables = this.drawables;
					this.mainAnimation = new Kinetic.Animation(function(frame) {
						drawables.forEach(function(drawable) {
							drawable.animate(frame);
						});
					}, this.mainLayer);
					this.mainAnimation.start();
				}				
			};
			
			scope.kineticCanvas.init();
		}
	}
}])
.directive('purchase',function() {
	return {
		restrict: 'E',
		
		scope: {
			purchaseOption:'=',
			'purchase':'&onPurchase'
		},
		templateUrl: 'templates/purchase.html'
	}
})


/********************************/
/* A new file should start here */
/********************************/

var GameEntity = function(gameObject, position) {
	this.id = gameObject.id;
	this.position = position; // TODO: Should this be here?
	this.gameObject = gameObject;
};

GameEntity.prototype.sayID = function() {
	console.log("Hello, my ID is " + this.id);
};


/********************************/
/* A new file should start here */
/********************************/

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


/********************************/
/* A new file should start here */
/********************************/

// TODO: wtf is the units of period?
var Orbiter = function(gameObject, kineticLayer, orbitCenter, orbitDistance, orbitPeriod) {
	this.orbitDistance = orbitDistance;
	this.orbitPeriod = orbitPeriod;
	Drawable.call(this, gameObject, kineticLayer, orbitCenter);
};
angular.extend(Orbiter.prototype, Drawable.prototype);

Orbiter.prototype.onLoadedImage = function() {
	Drawable.prototype.onLoadedImage.call(this); //TODO: remove?
	this.kImage.offset({x: this.gameObject.cachedImage.width/2 + this.orbitDistance, y: this.gameObject.cachedImage.height/2});
};

Orbiter.prototype.animate = function(frame) {
	this.kImage.rotate(frame.timeDiff * ((360/(this.orbitPeriod/1000))/1000));
};

/********************************/
/* A new file should start here */
/********************************/

var Asteroid = function(gameObject, kineticLayer, orbitCenter, orbitSpeed) {
	Orbiter.call(this, gameObject, kineticLayer, orbitCenter, 0, orbitSpeed);
};
angular.extend(Asteroid.prototype, Orbiter.prototype);

Asteroid.prototype.onClick = function() {
	console.log("PLEASE GIVE THE PLAYER MONEY!!!");
};


/********************************/
/* A new file should start here */
/********************************/

var Drone = function(gameObject, kineticLayer, orbitCenter, orbitDistance, orbitSpeed) {
	Orbiter.call(this, gameObject, kineticLayer, orbitCenter, orbitDistance, orbitSpeed);
};
angular.extend(Drone.prototype, Orbiter.prototype);