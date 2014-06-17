angular.module('SpaceClickyGameApp')
.factory('Shop', ['Player','GameObjects', function (Player, GameObjects) {
	return {
		purchaseMenuOpen: false,
		togglePurchasesMenu: function () {
			this.purchaseMenuOpen = !this.purchaseMenuOpen;
		},
		purchaseOptions: GameObjects.upgrades,
		purchaseUpgrade: function(purchase) {
			
			var player = Player;
		
			if(!player.purchasedUpgrades[purchase.id]) {
				player.purchasedUpgrades[purchase.id] = 
				{
					purchase: purchase,
					amountOwned: 0
				};
			}
			if(!purchase.multiple && player.purchasedUpgrades[purchase.id].amountOwned > 0) {
				console.log('You can only have one of this upgrade.')
				return;
			}
			if(player.spendMoney(purchase.cost)) {
				player.purchasedUpgrades[purchase.id].amountOwned++;
				
				if(purchase.moneyPerTick) {
					player.moneyPerTick += purchase.moneyPerTick;
				}
				if(purchase.value) {
					player.multiplier += purchase.value;
				}
				
				purchase.cost *= purchase.costincrease;
				console.log('Purchased ' + purchase.name);
			} else {
				console.log('Not enough money');
			}
		}
	}
}]);