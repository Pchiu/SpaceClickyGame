var spaceClickyGameApp = angular.module('SpaceClickyGameApp', []);
spaceClickyGameApp.controller('SpaceController', ['$scope', function ($scope){

	$scope.clicks = 0;
	$scope.multiplier = 1.00;
	$scope.money = 0;


	$scope.clickButton = function() {
		$scope.clicks += 1;
		$scope.money += 1.00 * $scope.multiplier
	}

	$scope.drawClickable = function(layer, image, x, y) {
		var clickable = new Kinetic.Image({
			x: x,
			y: y,
			image: image
		})

		clickable.on('click', function() {
			var scope = angular.element($("#display")).scope();
			scope.$apply(function(){
				scope.clickButton();
			})
		})

		layer.add(clickable)
		clickable.cache();
		clickable.drawHitFromCache();
		layer.draw();
	}
}])

var canvas;
var context;
var totalResources = 1;
var numResourcesLoaded = 0;
var images = {};
var mainStage;
var mainLayer;

spaceClickyGameApp.factory("Upgrade", function(){
	function Upgrade(name, description, type, value, cost){
		this.name = name;
		this.description = description;
		this.type = type;
		this.value = value;
		this.cost = cost;
	}
	return (Upgrade);
})

window.onload = function() {
	mainStage = new Kinetic.Stage({
		container: 'mainStage',
		width: 500, 
		height: 500
	})

	mainLayer = new Kinetic.Layer();
	mainStage.add(mainLayer)
	loadImage("rock");
}

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function() {		
		resourceLoaded();
	}
	images[name].src = "images/" + name + ".png";
}

function resourceLoaded() {
	numResourcesLoaded += 1;
	if (numResourcesLoaded === totalResources) {
		drawInitialItems()
	}
}

function drawInitialItems(){
	var scope = angular.element($("#display")).scope();
	scope.$apply(function(){
		scope.drawClickable(mainLayer, images["rock"], 100, 100);
	})
}
