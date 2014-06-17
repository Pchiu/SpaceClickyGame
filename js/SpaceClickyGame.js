angular.module('SpaceClickyGameApp', [])
.controller('SpaceController', ['$scope', function ($scope){
	$scope.clicks = 0;
	$scope.multiplier = 1.00;
	$scope.money = 0;

	$scope.purchasesToggleTitle = "Open Purchases Menu";
	
	$scope.purchasedUpgrades = {};

	$scope.purchaseMenuOpen = false;
	$scope.togglePurchasesMenu = function () {
		$scope.purchaseMenuOpen = !$scope.purchaseMenuOpen;

		if($scope.purchaseMenuOpen) {
			$scope.purchasesToggleTitle = "Close Purchases Menu";
		} else {
			$scope.purchasesToggleTitle = "Open Purchases Menu";
		}
	};
	
	$scope.spendMoney = function(amount) {
		if($scope.money >= amount) {
			$scope.money -= amount;
			return true;
		}
		return false;
	}
	
	$scope.purchaseUpgrade = function(purchase) {
		if($scope.spendMoney(purchase.cost)) {
			if(!$scope.purchasedUpgrades[purchase.id]) {
				$scope.purchasedUpgrades[purchase.id] = 
				{
					purchase: purchase,
					amountOwned: 0
				};
			}
			else
			{
				if(!purchase.multiple)
				{
					console.log('You can only have one of this upgrade.')
					return;
				}
				$scope.purchasedUpgrades[purchase.id].amountOwned++;
			}
			$scope.multiplier += purchase.value;
			purchase.cost *= purchase.costincrease;
			console.log('Purchased ' + purchase.name);
		} else {
			console.log('Not enough money');
		}
	}

	$scope.purchaseOptions = [
		{
			'id':'bigDrill',
			'name':'Big drill',
			'description':'A big drill',
			'value': 1,
			'multiple': true,
			'costincrease': 1.15,
			'cost':10,
			'imgpath':'images/bigdrill.png'
		},
		
		{ 
			'id':'biggerDrill',
			'name':'Bigger drill',
			'description':'A bigger drill',
			'value': 2,
			'multiple': false,
			'costincrease': 1.15,
			'cost':25,
			'imgpath':'images/biggerdrill.png'
		}
	];
	
	$scope.clickButton = function() {
		$scope.clicks += 1;
		$scope.money += 1.00 * $scope.multiplier;
	};

}])

// Set up kinetic.js stage
.directive('spaceClickyStage', function() {
	return {
		link: function (scope, element, attrs) {
			scope.kineticCanvas = {
				canvas: null,
				context: null,
				totalResources: 1,
				numResourcesLoaded: 0,
				images: {},
				mainStage: null,
				mainLayer: null,

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
					this.images[name].src = "images/" + name + ".png";
				},
				
				drawInitialItems: function() {
					this.drawClickable(this.mainLayer, this.images["rock"], 100, 100);
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
					this.loadImage("rock");
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

.factory("Upgrade", function(){
	function Upgrade(name, description, type, value, cost){
		this.name = name;
		this.description = description;
		this.type = type;
		this.value = value;
		this.cost = cost;
	}
	return (Upgrade);
});
