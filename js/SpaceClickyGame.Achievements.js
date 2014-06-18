angular.module('SpaceClickyGameApp')
.factory('Achievements', ['Player', function (Player) {
	return {
		completed: {},
		
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
		]
    };
}]	);