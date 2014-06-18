angular.module('SpaceClickyGameApp')
.factory('Player', function () {
	return {
		clicks: 0,
		money: 100000,
		multiplier: 1,
		moneyPerTick: 0,
		tier: 0,
		purchasedUpgrades: {
		},
		
		spendMoney: function(amount) {
			if(this.money >= amount) {
				this.money -= amount;
				return true;
			}
			return false;
		}
	}
});