angular.module('SpaceClickyGameApp')
.factory('Player', function () {
	return {
		clicks: 0,
		money: 0,
		multiplier: 1,
		moneyPerTick: 0,
		purchasedUpgrades: {},
		
		spendMoney: function(amount) {
			if(this.money >= amount) {
				this.money -= amount;
				return true;
			}
			return false;
		}
	}
});