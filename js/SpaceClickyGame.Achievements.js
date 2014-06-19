angular.module('SpaceClickyGameApp')
.factory('Achievements', ['Player', 'NotificationCenter', function (Player, NotificationCenter) {
	return {
		completed: {},
		
		//TODO: toast when achievement completed
		completeAchievement: function(ach){
			this.completed[ach.id] = ach;
			NotificationCenter.addNotification("Achievement unlocked!", ach.title, 3000);
		},
		
		//TODO: create sorted ID scheme or sort completed list so cheevos are categorized correctly
		list: [
			{
				'id': 'click005',
				'title': 'Entrepreneur',
				'description': 'Clicked 5 times',
				'condition': function(){
					return Player.clicks >= 5;
				}
			},
			{
				'id': 'click010',
				'title': 'Businessman',
				'description': 'Clicked 10 times',
				'condition': function(){
					return Player.clicks >= 10;
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