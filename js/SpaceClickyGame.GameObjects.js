angular.module('SpaceClickyGameApp')
.factory('GameObjects', function () {
	return {
		upgrades: [
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
			},
			{
				'id':'autoDrill',
				'name':'Auto Drill',
				'description':'It drills automatically',
				'moneyPerTick': 1,
				'multiple': true,
				'costincrease': 1.15,
				'cost':30
			}
		]
	}
});