angular.module('SpaceClickyGameApp')
.factory('UI', function () {
	return {
		sidebar: {
			activePanel: 'stats',
			changeToPanel: function(panel) {
				this.activePanel = panel;
			}
		}
	}
});