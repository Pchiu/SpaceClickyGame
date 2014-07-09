angular.module('SpaceClickyGameApp')
.factory('GameObjects', function () {
	var sprites = {
		rocks: {
			basicRock: {
				'id': 'basicRock',
				'imgpath': 'images/rock.png',
				'anchorPoints': {}
			}
		},
		drones: {
			miningDrone: {
				'id': 'miningDrone',
				'imgpath': 'images/miningdrone.png',
				'anchorPoints': {
					drill: {'x': 18, 'y': 0},
					left: {'x':0, 'y': 22},
					right: {'x':36, 'y': 22},
				}
			},
		},
		drills: {
			basicDrill: {
				'id': 'basicDrill',
				'imgpath': 'images/basicdrill.png',
				'anchorPoints': {
					base: {'x': 8, 'y': 18}
				}
			},
		},
	}

	return {
		/* oliverdoaner -- begin experimental */
		rocks: {
			basicRock: {
				'id': 'basicRock',
				'imgpath':'images/rock.png'
		    }
		},
		drones: {
			miningDrone: {
				'id':'miningDrone',
				'imgpath': 'images/miningdrone.png'
			},
		},
		/* oliverdoaner -- end experimental */
		/* pchiu */

		spriteGroups: {
			rocks: {
				basicRock: {
					'id': 'basicrock',
					components: [{sprite: sprites.rocks.basicRock, name: 'basicRock'}],
					cachedImages: {}
				}
			},
			drones: {
				miningDrone: {
						'id': 'miningDrone',
						components: [{sprite: sprites.drones.miningDrone, name: 'droneBody'},
									 {sprite: sprites.drills.basicDrill, 
									 	parentNode: 'droneBody',
									 	name: 'drill',
									 	parentAnchorPoint: sprites.drones.miningDrone.anchorPoints.drill, 
									 	childAnchorPoint: sprites.drills.basicDrill.anchorPoints.base, 
									 	angle: 0}
						],
						cachedImages: {}
				}
			}
		},

		/* pchiu */
		tiers: [
				{
					'id': 0,
					'name': 'Mining Operation',
					upgrades: [
						{
							'id':'bigDrill',
							'name':'Big drill',
							'description':'A big drill',
							'value': 1,
							'costincrease': 1.15,
							'cost':10,
							'imgpath':'images/bigdrill.png'
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
							'id':'miningDrone',
							'name':'Mining Drone',
							'description':'It drills automatically',
							'moneyPerTick': 1,
							'costincrease': 1.15,
							'maximum': 50,
							'cost':30,
							'imgpath': 'images/miningdrone.png'
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