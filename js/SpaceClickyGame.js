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
						var drill = new Kinetic.Image({
							x: 0,
							y: 0,
							width: 50,
							height: 50,
							offset: { x: 25, y: 25 },
							image: this.images["bigdrill.png"]
						});
						this.objects.autoDrills.push(drill);
						this.mainLayer.add(drill);
					}
					
					if(this.autoDrillsAnimation != null) {
						this.autoDrillsAnimation.stop();
					} 
					this.createAutoDrillsAnimation();
				},

				createAutoDrillsAnimation: function () {
					var layer = this.mainLayer;
					var stage = this.mainStage;
					var autoDrills = this.objects.autoDrills;
					
					var radius = 200;
					var period = 5000;
					var center = { x: stage.width()/2, y : stage.height()/2 };
					
					this.autoDrillsAnimation = new Kinetic.Animation(function(frame) {
						for(var i = 0; i < autoDrills.length; i++) {
							var autoDrill = autoDrills[i];
							autoDrill.setX(radius * Math.cos(frame.time * 2 * Math.PI / period + i / (2 * Math.PI)) + center.x);
							autoDrill.setY(radius * Math.sin(frame.time * 2 * Math.PI / period + i / (2 * Math.PI)) + center.y);
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
					this.loadImage("bigdrill.png");
					
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
/*
.factory("Upgrade", function(){
	function Upgrade(name, description, type, value, cost){
		this.name = name;
		this.description = description;
		this.type = type;
		this.value = value;
		this.cost = cost;
	}
	return (Upgrade);
});*/
