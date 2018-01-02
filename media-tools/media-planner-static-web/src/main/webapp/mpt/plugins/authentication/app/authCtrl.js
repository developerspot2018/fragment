app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data,cssInjector, $cookieStore,$modal) {
	//Remove Scroll from Login page
	cssInjector.add("plugins/authentication/css/authentication-style.css");
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    
    $scope.doLogin = function (customer) {
    	
    	
        Data.login('authentication/login', {
            customer: customer
        }).success(function (results) {        
			$http.defaults.headers.common.Authorization = results.token_type + ' ' + results.access_token;
			$cookieStore.put('userData', results.token_type + ' ' + results.access_token);
			Data.get('auth').success(function (results) {
             	if(results.clientId){
             		 $rootScope.authenticated = true;
    	             $rootScope.userId = results.clientId;
    	             $rootScope.name = results.firstName;
    	             $rootScope.email = results.email;
    	             $rootScope.roleName = results.roles[0].role.split('_')['1'];
    	             results.status = 'success';
       	             results.message = 'Logged in successfully';
       	             Data.toast(results);
    	             if($rootScope.roleName == 'ADMIN' || $rootScope.roleName == 'PLANNER'){
     	            	 $location.path('dashboard');
     	             }
     	             if($rootScope.roleName == 'TRAFFICKER'){
     	            	$location.path('welcome');
     	             }
     	              
             	}
             }).error(function (results){
             	$rootScope.userId=null;
             	$location.path("/");
             });
        }).error(function(result){
        	result.status = 'error';
        	result.message = 'Incorrect email and password combination';
        	Data.toast(result);
        });
        
    };
    
    $scope.signup = {email:'',password:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            //Data.toast(results);
            if (results.status == "success") {
                $location.path('welcome');
            }
        });
    };
    
    
    
    
    $scope.forgetPassword = function(){
    	$scope.open('plugins/authentication/partials/resetPassword.html');
	}
    
    $scope.open = function (modalTemplate) {
		var modalInstance;
		modalInstance = $modal.open({
	      templateUrl: modalTemplate,
	      controller: 'authCtrl',
	      size: 'lg',
	      scope: $scope,
	      closable: false,
	      resolve: {
	        template: function () {
	          return modalTemplate;
	        }
	      }
	    });
	    modalInstance.result.then(function () {}, function () {
	    });
	};
	
	// To close model popup
	 $scope.close = function () {
		 $scope.$close();
	 };
	 
	 $scope.resetPassword = function(userId,statusHtmlForm) {
		 $http.defaults.headers.common.Authorization = '';
		 $scope.clientId = {
				 clientId:userId,
		 };
		 var flag = false;
		 $scope.checkErrors = true;
		 if(statusHtmlForm.$error.required != undefined && statusHtmlForm.$error.required){
			 flag = true;
		 } 			
		 if(statusHtmlForm.$error.email != undefined){
			 flag = true;
		 } 	
		 if(flag) {
			 return; 
		 }
		 Data.put('auth/password',$scope.clientId).success(function(results){
			 $scope.result={};
			 if(results.status=='failed' && results.errorCode=='204') {
				 $scope.result.status = 'failed';
				 $scope.result.message = "Email id does not exist!.";
				 Data.toast($scope.result);
				
			 }else{
				$scope.result.status = 'success';
				$scope.result.message = "Your new password has been sent to your email id.";
				Data.toast($scope.result);
				$scope.$close();
		 }
		    }).error(function(results){
		    	results.status = 'error';
		    	//results.message = results.error[0].message
		    	results.message = results.error_description;
		    	Data.toast(results);
		    });
	 } 
});