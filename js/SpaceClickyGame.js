var spaceClickyGameApp = angular.module('SpaceClickyGameApp', []);
spaceClickyGameApp.controller('SpaceController', ['$scope', function ($scope){
	$scope.clicks = 0;
	$scope.clickButton = function() {
		$scope.clicks += 1;
	}
}])

var canvas;
var context;
var totalResources = 1;
var numResourcesLoaded = 0;
var images = {};
var mainStage;
var mainLayer;


window.onload = function() {
	//canvas = document.getElementById('mainDisplay');
	//context = canvas.getContext('2d');
	mainStage = new Kinetic.Stage({
		container: 'mainStage',
		width: 500, 
		height: 500
	})

	mainLayer = new Kinetic.Layer();
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
	rock = new Kinetic.Image({
		x: 100,
		y: 100,
		image: images["rock"],
	})

	rock.on('click', function() {
		console.log("click");
		var scope = angular.element($("#display")).scope();
		scope.$apply(function(){
			scope.clickButton();
		})
		
	})

	mainLayer.add(rock);
	mainStage.add(mainLayer);
	rock.cache();
	rock.drawHitFromCache();
	mainLayer.drawHit();
}
