/**
 * changePassowrd is a controller for User functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */


app.controller('changePassowrd', function ($scope, Data, $http, cssInjector, Validation, $route, $location, ModalService,$rootScope) {
	// Add required css file
	cssInjector.add("plugins/user/css/user-style.css");
	
	// Add user property file to load static data.
	$http.get('plugins/user/js/user-properties.js').then(function (response) {
		
		var property = {};
		$scope.property = response.data;
      });
	
	// Add user message property file to load static messages
	$scope.getUserMessageProperties = function (){
		$http.get('plugins/user/js/user-message-properties.js').then(function (response) {
			var propertyMessage = {};
			$scope.propertyMessage = response.data;
	      });
	};
	$scope.getUserMessageProperties();
	
	$scope.isActive = function (viewLocation) {
        if(viewLocation === '/admin/change-password') {
        	return true;
        }
    };

    /**
	 * Show admin tab as active 
	 * @param - location value 
	 * @output � true or false  
	 */
    $rootScope.isActive = function (viewLocation) {
        if(viewLocation === '/admin') {
        	return true;
        }
    };
	$scope.changePassword = function() {
		$scope.checkErrors= false;
		$scope.isPasswordContainingComma = false;
		$scope.isOldPasswordMatch = false;
		$scope.isMinimumSixChar = false;
		$scope.isPassword = false;
		 var flag = false;
		 $scope.checkErrors = true;
		 if($scope.changePasswordForm.$error.required != undefined && $scope.changePasswordForm.$error.required.length > 0){
			 flag = true;
		 } 
		 if ($scope.changePasswordForm.confirmPassword.$error.noMatch){ 
			 flag = true;
		 }
	     if(!($scope.password == undefined || $scope.password == "")){
	    	 if($scope.password.indexOf(',') > -1){
				$scope.isPasswordContainingComma = true;
				flag = true;
	    	 }
	    	 else if($scope.password.length<6 && $scope.password.indexOf(',')  === -1){
				$scope.isMinimumSixChar = true;
				flag = true;
	    	 }
		 }else{
			 $scope.isPassword = true;
				flag = true;
		 }
		 if(flag) {
			 return; 
		 }
		 $scope.changePasswordArray = {
				 clientSecret:$scope.oldPassword+","+$scope.password
		};
		 
		 Data.put('auth',$scope.changePasswordArray).success(function(results){
				results.status = 'success';
				results.message = $scope.propertyMessage.changePasswordMsg;
				Data.toast(results);
				$location.path("/dashboard");
				//$route.reload();
		    }).error(function(results){
		    	//results.status = 'error';
		    	//results.message = results.error[0].message;
		    	//Data.toast(results);
		    	if (results.status=='failed'){ 
		    		 $scope.isOldPasswordMatch = true;
					 flag = true;
				 }
		    	
		    });
	};
	
	
	$scope.cancelChangePassword = function() {
			  $location.path("/dashboard");
	  }
	
  });