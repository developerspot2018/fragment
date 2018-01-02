app.controller('dashBoardCtrl', function ($scope, $location, Data, cssInjector) { 
	cssInjector.add("plugins/dashboard/css/dashboard-style.css");
	$rootScope.isActive = function(viewLocation) { 
        return viewLocation === $location.path();
    };
});