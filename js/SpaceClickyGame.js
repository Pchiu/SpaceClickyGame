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
						//Need to modify gameobjects or create an object that contains these items for use with 
						//createSpriteGroup and addChildToSpriteGroup.
						var droneSprite = {
										'anchorPoints': [{'x': 18, 'y': 0}, {'x': 0, 'y': 23}, {'x': 36, 'y': 23}],
										'imageName': 'drone'
									};
						var drillSprite = {
										'anchorPoints': [{'x': 9, 'y': 19}],
										'imageName': 'drill'
									};
						var spriteGroup = this.createSpriteGroup(droneSprite, this.mainStage.width()/2, this.mainStage.height()/2);
						this.addChildToSpriteGroup(spriteGroup, "root", drillSprite, 0, 0, "maindrill")

						//Daisy chaining parenting example.
						//this.addChildToSpriteGroup(spriteGroup, "root", droneSprite, 1, 2, "leftdrone")
						//this.addChildToSpriteGroup(spriteGroup, "leftdrone", drillSprite, 0, 0, "leftdrill")
						//this.addChildToSpriteGroup(spriteGroup, "leftdrone", droneSprite, 1, 2, "lefterdrone")
						//this.addChildToSpriteGroup(spriteGroup, "lefterdrone", drillSprite, 0, 0, "lefterdrill")

						var drill = { 'spriteGroup': spriteGroup,
									  'period': this.getRandomInt(4000, 10000)
						}
						this.objects.autoDrills.push(drill);
						drill.spriteGroup.imageGroup.offsetX(this.getRandomInt(200, 250));
					}
					this.mainLayer.add(drill.spriteGroup.imageGroup);
					if(this.autoDrillsAnimation == null) {
						this.createAutoDrillsAnimation();
					} 
				},
				
				getRandomInt: function(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				},

				addChildToSpriteGroup: function(spriteGroup, parentNodeName, child, parentAnchorIndex, childAnchorIndex, childNodeName) {
					var targetNode = this.findNode(spriteGroup.root, parentNodeName);
					if (targetNode == null)
					{
						console.log("Failed to find a node with the name '" + parentNodeName + "'.")
						return;
					}
					if (targetNode.id == childNodeName)
					{
						console.log("A node with the name '" + childNodeName + "' already exists!")
						return;
					}
					var previousXOffset = 0;
					var previousYOffset = 0;
					var thisXOffset = targetNode.anchorPoints[parentAnchorIndex].x - child.anchorPoints[childAnchorIndex].x 
					var thisYOffset = targetNode.anchorPoints[parentAnchorIndex].y - child.anchorPoints[childAnchorIndex].y
					var node = targetNode;
					while (node.parent != null)
					{
						previousXOffset += node.xOffset;
						previousYOffset += node.yOffset;

						node = node.parent;
					}
					var childSprite = new Kinetic.Image({
						x: thisXOffset + previousXOffset,
						y: thisYOffset +  previousYOffset,
						image: this.images[child.imageName + ".png"]
					})
					targetNode.children.push({'parent': targetNode, 'id': childNodeName, 'xOffset': thisXOffset, 'yOffset': thisYOffset, 'children': [], 'anchorPoints': child.anchorPoints})
					spriteGroup.imageGroup.add(childSprite);
				},

				findNode: function(node, nodeName){
					if (node.id == nodeName)
					{
						return node;
					}
					var result = null;
					for (var i = 0; result == null && i < node.children.length; i++) {
						result = this.findNode(node.children[i], nodeName)
					}
					return result;
				},

				createSpriteGroup: function(parent, x, y) {
					var imageGroup = new Kinetic.Group({
						x: x,
						y: y
					})
					var parentImage = new Kinetic.Image({
						image: this.images[parent.imageName + ".png"]
					})
					imageGroup.offsetX(parentImage.width()/2)
					imageGroup.offsetY(parentImage.height()/2)	
					imageGroup.add(parentImage)
					var spriteGroup = {
										'imageGroup': imageGroup
					}
					spriteGroup["root"] = {'parent': null, 'id': 'root', 'xOffset': 0, 'yOffset': 0, 'children': [], 'anchorPoints' : parent.anchorPoints }
					//spriteGroup[parent.imageName + "0"] = parent.anchorPoints
					return spriteGroup
				},

				createAutoDrillsAnimation: function () {
					var layer = this.mainLayer;
					var stage = this.mainStage;
					var autoDrills = this.objects.autoDrills;
					
					this.autoDrillsAnimation = new Kinetic.Animation(function(frame) {
						for(var i = 0; i < autoDrills.length; i++) {
							var autoDrill = autoDrills[i];
							var angleDiff = frame.timeDiff * ((360/(autoDrill.period/1000))/ 1000);
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