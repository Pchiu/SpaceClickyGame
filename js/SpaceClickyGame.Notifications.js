angular.module('SpaceClickyGameApp')
.factory('NotificationCenter', ['$timeout',function ($timeout) {
	return {
		notificationDuration: 5000,
		activeNotifications: [
			
		],
		
		timers: [],
		

		addNotification: function (title, text) {
			var notifications = this.activeNotifications;
			var timers = this.timers;
			var notification = {
				'title':title,
				'text':text
			};
			
			this.activeNotifications.push(notification);
			
			var expire = function () {
				var index = notifications.indexOf(notification);
				this.activeNotifications = notifications.splice(index,1);
				this.timers = timers.splice(index,1);
			}
			var timer = $timeout(expire,this.notificationDuration);
			
			this.timers.push(timer);
		},
		
		pushTestNotification: function () {
			this.addNotification("test","this is a test");
			
		}
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
		
		