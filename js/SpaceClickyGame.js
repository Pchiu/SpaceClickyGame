angular.module('SpaceClickyGameApp', ['ngAnimate'])
.controller('SpaceController', ['$scope', '$timeout', 'Player', 'Shop', 'NotificationCenter',
		function ($scope, $timeout, Player, Shop, NotificationCenter) {
	
	$scope.player = Player;
	$scope.shop = Shop;
	$scope.notificationCenter = NotificationCenter;
	
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
.directive('spaceClickyStage', function() {
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
				
				objects: {
					autoDrills: []
				},
				
				setAutoDrillCount: function (count) {
					while(this.objects.autoDrills.length > count) {
						this.objects.autoDrills.pop();
					}
					while(this.objects.autoDrills.length < count) {
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
						this.objects.autoDrills.push(drill);
						this.mainLayer.add(drill.image);
					}
					
					if(this.autoDrillsAnimation == null) {
						this.createAutoDrillsAnimation();
					} 
				},

				getRandomInt: function(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				},

				createAutoDrillsAnimation: function () {
					var layer = this.mainLayer;
					var stage = this.mainStage;
					var autoDrills = this.objects.autoDrills;
					
					this.autoDrillsAnimation = new Kinetic.Animation(function(frame) {
						for(var i = 0; i < autoDrills.length; i++) {
							var autoDrill = autoDrills[i];
							//autoDrill.setX(radius * Math.cos(frame.time * 2 * Math.PI / period + Math.PI * i / (Math.PI)));
							//autoDrill.setY(radius * Math.sin(frame.time * 2 * Math.PI / period + Math.PI * i/ (Math.PI)));
							var angleDiff = frame.timeDiff * ((360/(autoDrill.period/1000))/ 1000);
							autoDrill.image.rotate(angleDiff)						
						}
					}, layer);
					 
					this.autoDrillsAnimation.start();
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
					this.drawClickable(this.mainLayer, this.images["rock.png"], 100, 100);
				},
				
				drawClickable: function(layer, image, x, y) {
					var clickable = new Kinetic.Image({
						x: x,
						y: y,
						image: image
					});

					clickable.on('click', function() {
						scope.clickButton();
						scope.$apply();
					});

					layer.add(clickable);
					clickable.cache();
					clickable.drawHitFromCache();
					layer.draw();
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
					
				}				
			};
			
			scope.kineticCanvas.init();
		}
	}
})
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