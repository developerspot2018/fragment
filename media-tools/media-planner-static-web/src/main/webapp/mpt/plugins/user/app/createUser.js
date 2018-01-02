/**
 * changePassowrd is a controller for User functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */


app.controller('createUser', function ($scope, Data, $http, cssInjector,$location,Validation) {
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
	$scope.selectedRolesList=[];
	$scope.selectedRoles=[];
	Data.get('roles').then(function(data){
		$scope.usersRoleList = data.data;
		$scope.selectedRolesList = $scope.selectedRoles;
		$scope.selectedRolesList.forEach(function(selectedValue,i){
			$scope.usersRoleList.forEach(function(value,j){
				if(selectedValue.id == value.id){
					value.ticked = true;
				}
			})
			selectedValue.ticked = true;
		})
	});
	
	$scope.$watch("selectedRolesList", function() {
		$scope.isRolesListCheckErrors  = false;
	});
	
	$scope.createUpdateUser = function() {
		$scope.checkErrors= false;
		$scope.isRolesListCheckErrors = false;
		$scope.isMinimumSixChar = false;
		$scope.isPassword = false;
		 var flag = false;
		 $scope.checkErrors = true;
		 if($scope.createUserForm.$error.required != undefined && $scope.createUserForm.$error.required.length > 0){
			 flag = true;
		 } 			
		 if ($scope.createUserForm.$invalid ){ 
			 flag = true;
		 }
		 $scope.getRoles=[];
		 for(var val in $scope.selectedRolesList){
			 $scope.getRoles.push({id: $scope.selectedRolesList[val].id});
		 }
		 if($scope.getRoles == undefined || $scope.getRoles.length == 0){
			$scope.isRolesListCheckErrors  = true;
			flag = true;
		}

		 if(flag) {
			 return; 
		 }
		 $scope.userDetailsArray = {
			 clientId:$scope.userEmail,
			 firstName:$scope.firstName,
			 lastName:$scope.lastName,
			 roles:$scope.getRoles,
			 email:$scope.optionalEmail
		};
		Data.post('auth',$scope.userDetailsArray).success(function(results){
			results.status = 'success';
			results.message = $scope.propertyMessage.changePasswordMsg;
			Data.toast(results);
			$location.path("/admin/manage-users");
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