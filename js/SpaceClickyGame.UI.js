angular.module('SpaceClickyGameApp')
.factory('UI', function () {
	return {
		sidebar: {
			activePanel: '',
			sidebarActive: false,
			changeToPanel: function(panel) {
				this.toggleSidebar(panel);
				this.activePanel = panel;
			},

			toggleSidebar: function(panel) {
				if (panel == this.activePanel)
				{
					$('.wrapper').toggleClass('active');
					if (this.sidebarActive)
					{
						$('#sidebar').animate({
							right:50
						})
						this.sidebarActive = false
					}
					else
					{
						$('#sidebar').animate({
							right:300
						})
						this.sidebarActive = true
					}
				}
				else
				{
					if (!this.sidebarActive)
					{
						$('.wrapper').toggleClass('active');
						$('#sidebar').animate({
							right:300
						})
						this.sidebarActive = true
					}
				}
			}
		}
	}
});