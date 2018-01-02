/**
 * changePassowrd is a controller for User functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */


app.controller('updateUserDetail', function ($scope, Data, $http, cssInjector,$location,Validation,$rootScope) {
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
	//$scope.selectedRoleList = [];
	
	$scope.isActive = function (viewLocation) {
        if(viewLocation === '/admin/update-user') {
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
	Data.get('auth').then(function(data){
		$scope.userEmail=data.data.clientId;
        $scope.firstName=data.data.firstName;
        $scope.lastName=data.data.lastName;
        $scope.optionalEmail=data.data.email;
        $scope.roles=data.data.roles
	 });
	
	
	$scope.updateUserDetail = function() {
		$scope.checkErrors= false;
		$scope.isRolesListCheckErrors = false;
		$scope.isMinimumSixChar = false;
		$scope.isPassword = false;
		 var flag = false;
		 $scope.checkErrors = true;
		 if($scope.updateUserForm.$error.required != undefined && $scope.updateUserForm.$error.required.length > 0){
			 flag = true;
		 } 			
		 if ($scope.updateUserForm.$invalid ){ 
			 flag = true;
		 }
		 $scope.getRoles=[];
		 for(var val in $scope.roles){
			 $scope.getRoles.push({id: $scope.roles[val].id});
		 }
		 console.log($scope.getRoles)

		 if(flag) {
			 return; 
		 }
		 if($scope.optionalEmail!='' && $scope.optionalEmail !=undefined) {
			 $scope.userDetailsArray = {
					 firstName:$scope.firstName,
					 lastName:$scope.lastName,
					 email:$scope.optionalEmail
				};
		 }else{
			 $scope.userDetailsArray = {
					 firstName:$scope.firstName,
					 lastName:$scope.lastName,
				};
		 }
		 
//		 $scope.userDetailsArray = {
//			 firstName:$scope.firstName,
//			 lastName:$scope.lastName,
//			 //roles:$scope.getRoles,
//			 email:$scope.optionalEmail
//		};
		 
		
		Data.put('auth',$scope.userDetailsArray).success(function(results){
			results.status = 'success';
			results.message = $scope.propertyMessage.userDetailsUpdatedMsg;
			Data.toast(results);
			$location.path("/dashboard");
	    }).error(function(results){
	    	results.status = 'error';
	    	results.message = results.error[0].message;
	    	Data.toast(results);
	    });
		
	};
	$scope.cancelUser = function() {
		$location.path("/dashboard");
	}
	
	
  });