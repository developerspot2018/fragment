/**
 * changePassowrd is a controller for User functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */


app.filter('startaAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});
app.controller('manageUsers', function ($scope, Data, $http, cssInjector, Validation, $route, $location,$rootScope,ModalService) {
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
        if(viewLocation === '/admin/manage-users') {
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
		$scope.clientId = data.data.clientId;
	});
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	$scope.salestargetFlag = true;
	$scope.recordPerPage = ['10','20','30'];
	$scope.users = {};
    $scope.getUsers = function (currentRecordPerPage) {
    	$scope.selectedNumber = currentRecordPerPage;
    	//$scope.selectedFilterAttribute =  $scope.filterAttribute;
   	 	Data.get('auth/users').then ( function (data) {
   	        $scope.users = data.data;
   	        //$scope.userFullName = data.data.firstName+" "+data.data.lastName;
   	        $scope.totalItems = $scope.users.length;
   	        $scope.currentPage = 1; // current page

   	        $scope.entryLimit = $scope.selectedNumber; // max no of items to display in a page
   	        $scope.filteredItems = $scope.users.length;
   	        // Initially for no filter
   	         $scope.sort_by_id('clientId');
   	    });
   }

   $scope.getUsers();
   
   $scope.getUsers($scope.recordPerPage[0]);
   $scope.setRecordPerPage = function () {
	   $scope.entryLimit = $scope.selectedNumber;
	}
   
   $scope.sort_by = function(predicate) {
	   if ($scope.salestargetFlag) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
	   }
	};
	
	 $scope.sort_by_id = function(predicate) {
			 $scope.predicate = predicate;
			 $scope.reverse = true;
	};
	
	$scope.refreshAttributeGrid =function () {
		$route.reload();
	};
	  // remove Attribute
	  $scope.deleteUser = function (userId) {
		  var msg = $scope.propertyMessage.confirmDeleteMsg;
			var ModalTemplate = warnigAlertBox(msg);
			ModalService.showModal({
				template: ModalTemplate,
				controller: "ModalController"
				}).then(function(modal) {
					modal.element.modal();
					modal.close.then(function(result) {
				    	if (result === 'yes') {
							  Data.delete('auth/'+userId+'/').success(function() {
								  $scope.results={};
								  $scope.results.status = 'success';
								  $scope.results.message = $scope.propertyMessage.deleteUserMsg;
								  Data.toast($scope.results);
								  $route.reload();
							  }).error(function(results){
							    	results.status = 'error';
							    	results.message = results.error[0].message;
							    	Data.toast(results);
							  });
				    	}else{
					    	}
					    });
					  });
	  };
	  
	  
	  
	  function warnigAlertBox(msg){
		var modalBody = '<div class="modal fade proposal">'+
		'<div class="modal-dialog dialog-size-position">'+
			' <div class="modal-content">'+
			'  <div class="modal-header dialog-header-warnig">'+
			'    <button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
			'  <span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
			'<span class="modal_title">Confirmation'+
			'</span>'+
			'</div>'+
			'<div class="modal-body">'+
			'   <p>'+msg+'</p>'+
				'</div>'+
				'<div class="modal-footer modal-cuntom-footer">'+
			'<button type="button" ng-click="close(\'yes\')" class="btn btn-default" data-dismiss="modal">Yes</button>'+
			'<button type="button" ng-click="close(\'no\')" class="btn btn-primary" data-dismiss="modal">No</button>'+
			'</div>'+
			'</div>'+
			'</div>'+
			'</div>'	;
		return modalBody;
	}
	  
	  $scope.editUser = function(clientId) {
		  //alert("API Needed");
		  $location.path("/admin/update/"+clientId);
      }
	

  });