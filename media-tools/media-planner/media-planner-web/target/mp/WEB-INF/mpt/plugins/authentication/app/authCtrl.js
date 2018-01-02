app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.user = [
                   {email:'manjeet.singh@tavant.com',password:'Welcome123',name:'Manjeet'},
                   {email:'arun.jain@tavant.com',password:'Welcome123',name:'Arun'},
                   {email:'shivani.koul@tavant.com',password:'Welcome123',name:'Shivani'},
                   {email:'kapil.kumar@tavant.com',password:'Welcome123',name:'Kapil'},
                   {email:'prasun.mishra@tavant.com',password:'Welcome123',name:'Prasun'},
                  ];
    
    $scope.doLogin = function (customer) {
    	
    	var isLogin=false;
    	for(var i=0;i<$scope.user.length;i++){
    	    if($scope.user[i].email===customer.username && $scope.user[i].password===customer.password){
    	    	$rootScope.uid=1;
    	    	$rootScope.name = $scope.user[i].name;
    	    	isLogin=true;
    	    }
    	}
    	if(isLogin)
    	{
    		$location.path('admin');
    	}
    	else
    	{
    		alert("Incorrect Email and Password combination");
    	}
    	/*
        Data.login('authentication/login', {
            customer: customer
        }).success(function (results) {        
        	Data.toast(results);
            if (results.status == "success") {
                $location.path('welcome');
            }
        }).error(function(result){
        	
        });
        */
    };
    $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('welcome');
            }
        });
    };
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
    }
});