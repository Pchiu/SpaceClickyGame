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
				// StageItem: 
				//		GameObject static
				//		cached image file
				//		
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
											offset: { x: this.getRandomInt(200, 250), y: 0 },
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
				
				drawInitialItems: function() {
					console.log("drawing initial items");
					this.rock = this.drawClickable(this.mainLayer, this.images["rock.png"], 100, 100, 250, 250);
				},
				
				drawClickable: function(layer, image, x, y, width, height) {
					var clickable = new Kinetic.Image({
						x: this.mainStage.width()/2,
						y: this.mainStage.height()/2,
						width: 250,
						height: 250,
						// offset: {x: 0, y: 0},
						// offset: {x: 25, y:25},
						// offset: {x: -25, y:-25},
						offset: {x: 125, y: 125},
						// offset: {x: -125, y: -125},
						//offset: {x: width/2, y: height/2},
						image: image
					});

			        // clickable = new Kinetic.Rect({
			        //   x: 250,
			        //   y: 250,
			        //   width: 100,
			        //   height: 100,
			        //   fill: 'yellow',
			        //   stroke: 'black',
			        //   strokeWidth: 4,
			        //   offset: {x:50, y:50}
			        // });

					clickable.on('click', function() {
						scope.clickButton();
						scope.$apply();
					});

					layer.add(clickable);
					clickable.cache();
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

					var autoDrills = this.drawables.autoDrills;
					this.mainAnimation = new Kinetic.Animation(function(frame) {
						//TODO: for each drawable, compute animation.
						for(var i = 0; i < autoDrills.length; i++) {
							var autoDrill = autoDrills[i];
							var angleDiff = frame.timeDiff * ((360/(autoDrill.period/1000))/ 1000);
							autoDrill.image.rotate(angleDiff)						
						}
						if (scope.kineticCanvas.rock) {
							scope.kineticCanvas.rock.rotate(frame.timeDiff * ((360/(20000/1000))/1000));
						}
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