

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
			$scope.kineticCanvas.setAutoDrillCount(autoDrills.amountOwned);
		}
	}, true);
	
	$scope.clickButton = function() {
		$scope.player.clicks += 1;
		$scope.player.money += 1.00 * $scope.player.multiplier;
	};
}])

// Set up kinetic.js stage
.directive('spaceClickyStage', ['GameObjects', function(GameObjects) {
	return {
		link: function (scope, element, attrs) {
			scope.kineticCanvas = {
				canvas: null,
				context: null,
				totalResources: 2,
				numResourcesLoaded: 0,
				images: {},
				mainStage: null,
				mainLayer: null,
				rock: null,

				drawables: {
					autoDrills: []
				},

				kineticImages: {

				},
				
				setAutoDrillCount: function (count) {
					while(this.drawables.autoDrills.length > count) {
						this.drawables.autoDrills.pop();
					}
					while(this.drawables.autoDrills.length < count) {
						var drill = {
										'image': new Kinetic.Image({
											x: this.mainStage.width()/2,
											y: this.mainStage.height()/2,
											width: 38,
											height: 50,
											// offset: { x: this.getRandomInt(200, 250), y: 0 },
											offset: { x: 38/2, y: 50/2 },
											image: this.images["drone.png"]
										}),
										'period': this.getRandomInt(4000,10000)
									}
						this.drawables.autoDrills.push(drill);
						this.mainLayer.add(drill.image);
					}
				},

				getRandomInt: function(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				},

				
				resourceLoaded: function() {
					this.numResourcesLoaded += 1;
					if (this.numResourcesLoaded === this.totalResources) {
						this.drawInitialItems()
					}
				},
				
				loadImage: function(name) {
					this.images[name] = new Image();
					var self = this;
					this.images[name].onload = function() {		
						self.resourceLoaded();
					}
					this.images[name].src = "images/" + name;
				},
				
				// TODO: rename to setupStageItems
				drawInitialItems: function() {
					console.log("drawing initial items");
					this.rock = this.drawClickable(this.mainLayer, this.images["rock.png"], 
								 // this.mainStage.width()/2, this.mainStage.height()/2, 250, 250);
								 this.mainStage.width(), this.mainStage.height(), 250, 250);
				},
				
				drawClickable: function(layer, image, x, y, width, height) {
					var clickable = new Kinetic.Image({
						x: x,
						y: y,
						width: width,
						height: height,
						offset: {x: width/2, y: height/2},
						image: image
					});

					clickable.on('click', function() {
						// scope.clickButton();
						scope.player.clicks += 1;
						scope.player.money += 1.00 * scope.player.multiplier;
						scope.$apply();
					});

					layer.add(clickable);
					clickable.cache({x:-width/2, y:-height/2});
					clickable.drawHitFromCache();
					layer.draw();
					return clickable;
				},
				
				init: function() {
					this.mainStage = new Kinetic.Stage({
						container: 'mainStage',
						width: 500, 
						height: 500
					});

					this.mainLayer = new Kinetic.Layer();
					this.mainStage.add(this.mainLayer);
					this.loadImage("rock.png");
					this.loadImage("drone.png");

					/* DEBUG */
					var drill = new Drawable(GameObjects.drones.autoDrill, this.mainLayer, {x:0, y:0});
					drill.sayID();
					var drill2 = new Drawable(GameObjects.drones.autoDrill, this.mainLayer, {x:50, y:50});
					drill2.sayID();
					var rock = new Asteroid(GameObjects.rocks.basicRock, this.mainLayer, {x:250, y:250}, -80000);
					rock.sayID();
					var drone = new Drone(GameObjects.drones.autoDrill, this.mainLayer, {x:250, y:250}, 200, 20000);
					drone.sayID();
					/* UNDEBUG */

					var autoDrills = this.drawables.autoDrills;
					this.mainAnimation = new Kinetic.Animation(function(frame) {
						//TODO: for each drawable, compute animation.
						for(var i = 0; i < autoDrills.length; i++) {
							var autoDrill = autoDrills[i];
							var angleDiff = frame.timeDiff * ((360/(autoDrill.period/1000))/ 1000);
							autoDrill.image.rotate(angleDiff)						
						}
						if (scope.kineticCanvas.rock) {
							scope.kineticCanvas.rock.rotate(-frame.timeDiff * ((360/(80000/1000))/1000));
						}
						drone.animate(frame);
						rock.animate(frame);
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
			// image: gameObject.cachedImage
		});
		// TODO: offset and animation for "Orbiters"
		this.kLayer.add(this.kImage);
	}
	this.cacheImage(gameObject);
};
angular.extend(Drawable.prototype, GameEntity.prototype);

Drawable.prototype.cacheImage = function(gameObject) { /* TODO: Should this function belong to the gameObject itself? */
	if (!gameObject.cachedImage) {
		console.log("Caching: " + gameObject.imgpath);
		gameObject.cachedImage = new Image();
		gameObject.cachedImage.onload = this.onLoadedImage.bind(this);
		gameObject.cachedImage.src = gameObject.imgpath;
	}
	else {
		console.log("Already cached: " + gameObject.imgpath);
		this.onLoadedImage.call(this);
	}
};

Drawable.prototype.animate = function(frame) {
	console.log("no animation present for " + this.id);
};

Drawable.prototype.onLoadedImage = function() {
	console.log("  width: " + this.gameObject.cachedImage.width + "   height: " + this.gameObject.cachedImage.height);
	this.kImage.setImage(this.gameObject.cachedImage);
	this.kImage.on('click', this.onClick);
	this.kImage.cache();
	this.kImage.drawHitFromCache();
	this.kLayer.draw();
};

Drawable.prototype.onClick = function() {
	console.log("CLICKED!");
};


/********************************/
/* A new file should start here */
/********************************/

var Clickable = function(gameObject, kineticLayer, position) {
	Drawable.call(this, gameObject, kineticLayer, position);
};
angular.extend(Clickable.prototype, Drawable.prototype);

Clickable.prototype.onLoadedImage = function() {
	console.log(this.gameObject.cachedImage.width + " IT'S A THING 2");
	Drawable.prototype.onLoadedImage.call(this);
	console.log(" applying clickable properties");
};

// Clickable.prototype.onClick = function() {
// 	console.log(" onClick");
// };


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


/********************************/
/* A new file should start here */
/********************************/

var Drone = function(gameObject, kineticLayer, orbitCenter, orbitDistance, orbitSpeed) {
	Orbiter.call(this, gameObject, kineticLayer, orbitCenter, orbitDistance, orbitSpeed);
};
angular.extend(Drone.prototype, Orbiter.prototype);