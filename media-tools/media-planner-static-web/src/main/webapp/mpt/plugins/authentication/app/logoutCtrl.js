app.controller('logoutCtrl', function ($rootScope,$scope, $location, Data) { 
	
	Data.get('authentication/logout').then(function (results) {
		results.status = 'success';
        results.message = 'Logged out successfully';
        Data.toast(results);
		$rootScope.authenticated = false;
        $rootScope.userId = null;
        $rootScope.name = null;
        $rootScope.email = null;
		$location.path('/');
     });
});