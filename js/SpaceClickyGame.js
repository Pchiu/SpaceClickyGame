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
										 this.getRandomInt(200,250), this.getRandomInt(7000,25000)));
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