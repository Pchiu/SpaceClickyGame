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
		],
		
		setWatches: function(scope){
			// Watch achievement conditions and complete achievements
			angular.forEach(this.list, function(ach){
				scope.$watch(ach.condition, function(){
					if (scope.achievements.completed[ach.id] == undefined && ach.condition()){	// This bit is weird and has weird scoping issues, need to fix
						scope.achievements.completeAchievement(ach);
					}
				});
			});
		}
    };
}]	)
.directive('achievement',function(){
	return{
		restrict: 'E',
		
		scope: {
			achievement:'='
		},
		templateUrl: 'templates/achievement.html'
	}
})