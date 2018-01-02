app.controller('logoutCtrl', function ($rootScope,$scope, $location, Data) { 
	$rootScope.uid = null;
	$location.path('/');
	/* 
	Data.get('logout').then(function (results) {
         Data.toast(results);
         $location.path('login');
     });
     */
});