angular.module('SpaceClickyGameApp')
.factory('NotificationCenter', ['$timeout',function ($timeout) {
	return {
		notificationDuration: 5000,
		maximumDisplayed: 5,
		activeNotifications: [
			
		],
		
		timers: [],
		
		addError: function (title, text) {
			this.addNotificationType(title,text,'error');
		},
		addNotification: function (title, text) {
			this.addNotificationType(title,text,'');
		},
		removeNotificationAtIndex: function(index) {
			if(index < 0 || index >= this.activeNotifications.length) {
				return;
			}
			this.activeNotifications.splice(index,1);
			this.timers.splice(index,1);
		},
		addNotificationType: function (title, text, type) {
			var notifications = this.activeNotifications;
			var timers = this.timers;
			var cssClass = "";
			var self = this;
			if(type === 'error') {
				cssClass = 'error';
			}
			var notification = {
				'title':title,
				'text':text,
				'cssClass':cssClass
			};
			
			this.activeNotifications.push(notification);

			if(this.activeNotifications.length > this.maximumDisplayed) {
				this.removeNotificationAtIndex(0);
			}
			
			var dismiss = function () {
				var index = notifications.indexOf(notification);
				self.removeNotificationAtIndex(index);
			}
			
			notification.close = function () {
				dismiss();
			}
			var timer = $timeout(dismiss,this.notificationDuration);
			
			this.timers.push(timer);
		},
	}
	
}])
.directive('notificationCenter', function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: "templates/notificationCenter.html",
	}
})
.directive('notification', function() {
	return {
		restrict: 'E',
		templateUrl: "templates/notification.html",
	}
})
		
		