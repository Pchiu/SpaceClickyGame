angular.module('SpaceClickyGameApp')
.factory('GameObjects', function () {
	return {
		tiers: [
				{
					'id': 0,
					'name': 'Mining Operation',
					upgrades: [
						{
							'id':'drill',
							'name':'Drill',
							'description':'A drill',
							'value': 1,
							'costincrease': 1.15,
							'cost':10,
							'imgpath':'images/bigdrill.png',
							'anchorPoints': [{'x':9, 'y':18}]
						},
						{ 
							'id':'biggerDrill',
							'name':'Bigger drill',
							'description':'A bigger drill',
							'value': 2,
							'maximum': 1,
							'costincrease': 1.15,
							'cost':25,
							'imgpath':'images/biggerdrill.png'
						},
						{
							'id':'autoDrill',
							'name':'Auto Drill',
							'description':'It drills automatically',
							'moneyPerTick': 1,
							'costincrease': 1.15,
							'maximum': 50,
							'cost':30,
							'imgpath': 'images/drone.png',
							'anchorPoints': [{'x': 18, 'y':0}]
						}
					]
				},
				{
					'id': 1,
					'name': 'Large Mining Operation',
					upgrades: [
						{
							'id': 'miningBarge',
							'name': 'Mining Barge',
							'description': 'A small mining barge.',
							'moneyPerTick': 500,
							'costincrease': 1.15,
							'cost': 20000
						}
					]
				}
			]
		}
});