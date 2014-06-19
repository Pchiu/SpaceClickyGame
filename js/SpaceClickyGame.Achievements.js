angular.module('SpaceClickyGameApp')
.factory('Achievements', ['Player', function (Player) {
	return {
		completed: {},
		
		//TODO: toast when achievement completed
		completeAchievement: function(ach){
			this.completed[ach.id] = ach;
		},
		
		//TODO: create sorted ID scheme or sort completed list so cheevos are categorized correctly
		list: [
			{
				'id': 'click001',
				'title': 'Getting Things Rolling',
				'description': 'Clicked once',
				'condition': function(){
					return Player.clicks >= 1;
				}
			},
			{
				'id': 'click002',
				'title': "Diggin' it",
				'description': 'Clicked twice',
				'condition': function(){
					return Player.clicks >= 2;
				}
			},
			{
				'id': 'click003',
				'title': 'Rocking out',
				'description': 'Clicked thrice',
				'condition': function(){
					return Player.clicks >= 3;
				}
			},
			{
				'id': 'click004',
				'title': 'You Rock!',
				'description': 'Clicked 4 times',
				'condition': function(){
					return Player.clicks >= 4;
				}
			},
			{
				'id': 'click005',
				'title': 'Rock Star',
				'description': 'Clicked 5 times',
				'condition': function(){
					return Player.clicks >= 5;
				}
			},
			{
				'id': 'bigDrill001',
				'title': 'Drill Baby Drill',
				'description': 'Bought a big drill',
				'condition': function(){
					return Player.purchasedUpgrades['bigDrill'].amountOwned >=1;
				}
			},
			{
				'id': 'biggerDrill001',
				'title': 'Drill Sergeant',
				'description': 'Bought an even biger drill',
				'condition': function(){
					return Player.purchasedUpgrades['biggerDrill'].amountOwned >=1;
				}
			},
			{
				'id': 'miningDrone001',
				'title': 'I AM SPIRALING OUT OF CONTROL',
				'description': 'Bought an auto drill',
				'condition': function() {
					return Player.purchasedUpgrades['autoDrill'].amountOwned >=1;
				}
			}
		]
    };
}]	)
.controller('AchievementsController', ['$scope', 'Achievements',
		function ($scope, Achievements) {
	//Add service watches for achievement conditions
	$scope.achievements = Achievements;
	// Watch achievement conditions and complete achievements
	angular.forEach($scope.achievements.list, function(ach){
		$scope.$watch(ach.condition, function(){
			if ($scope.achievements.completed[ach.id] == undefined && ach.condition()){
				$scope.achievements.completeAchievement(ach);
			}
		});
	});
}])
.directive('achievement',function(){
	return{
		restrict: 'E',
		
		scope: {
			achievement:'='
		},
		templateUrl: 'templates/achievement.html'
	}
})