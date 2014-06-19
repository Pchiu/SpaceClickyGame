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
						var droneSprite = {
										'anchorPoints': [{'x': 18, 'y': 0}],
										'imageName': 'drone.png'
									};
						var drillSprite = {
										'anchorPoints': [{'x': 8, 'y': 18}],
										'imageName': 'drill.png'
									};
						var spriteGroup = this.createSpriteGroup(droneSprite, this.mainStage.width()/2, this.mainStage.height()/2);
						this.addChildToSpriteGroup(spriteGroup, drillSprite, 0, 0)

						var drill = { 'spriteGroup': spriteGroup,
									  'period': this.getRandomInt(4000, 10000)
						}
						this.objects.autoDrills.push(drill);

					}
					this.mainLayer.add(drill.spriteGroup.imageGroup);
					if(this.autoDrillsAnimation == null) {
						this.createAutoDrillsAnimation();
					} 
				},
				
				getRandomInt: function(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				},

				createImageGroup: function(parent, children) {
					if (children.length != parent.anchorPoints.length)
					{
						return null;
					}
				},

				addChildToSpriteGroup: function(spriteGroup, child, parentAnchorIndex, childAnchorIndex)
				{
					if (childAnchorIndex >= spriteGroup.anchorPoints.length)
					{
						return null
					}
					var childSprite = new Kinetic.Image({
						x: spriteGroup.anchorPoints[parentAnchorIndex].x - child.anchorPoints[childAnchorIndex].x,
						y: spriteGroup.anchorPoints[parentAnchorIndex].y - child.anchorPoints[childAnchorIndex].y,
						image: this.images[child.imageName]
					})
					spriteGroup.imageGroup.add(childSprite)
				},

				createSpriteGroup: function(parent, x, y) {
					var imageGroup = new Kinetic.Group({
						x: x,
						y: y
					})
					var parentImage = new Kinetic.Image({
						image: this.images[parent.imageName]
					})
					imageGroup.offsetX(parentImage.width()/2)
					imageGroup.offsetY(parentImage.height()/2)
					imageGroup.add(parentImage)
					var spriteGroup = {
										'anchorPoints': parent.anchorPoints,
										'imageGroup': imageGroup
					}
					return spriteGroup
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
							autoDrill.spriteGroup.imageGroup.offsetX(18);
							autoDrill.spriteGroup.imageGroup.offsetY(-19);
							autoDrill.spriteGroup.imageGroup.rotate(angleDiff)						
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
					this.loadImage("drill.png");
					
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