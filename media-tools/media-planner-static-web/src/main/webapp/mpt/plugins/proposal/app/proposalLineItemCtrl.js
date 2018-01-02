/**
 * proposalLineItemCtrl is a controller for proposal detail page functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */

// filter functionality in the line item grid
app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('proposalLineItemCtrl', function ($route,$routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) { 
	
	// Add required css file
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	
	// Add proposal property file to load static data.
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
		
      });
	
	// Add proposals message property file to load static messages
	$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	
	// Make proposal tab selected
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
    };
    
   // Make left menu selected
    $rootScope.isSubMenueActive = function(path){
    	var flag = false;
    	if($scope.selectedTab=='Proposal' && $scope.subSelectedTab==path)
    		flag = true;
    	return flag;
    }
    $scope.subSelectedTab = $rootScope.lefNavActive;
    $scope.selectedTab = '';
    
    $scope.isOpen = function(val){
		var flag = false;
		if(val=='proposal')
			flag = true;
		return flag;
	};
    
    // get proposals  by status
    $scope.setProposalStatus = function(status){
		$scope.selectedTab = 'Proposal';
		switch(status)
		{
		case 'All':
			$scope.subSelectedTab = 'all';
		break;
		case 'MyOrders':
			$scope.subSelectedTab = 'my';
		break;
		case 'Pending':
			$scope.subSelectedTab = 'pending';
		break;
		case 'Proposed':
			$scope.subSelectedTab = 'proposed';
		break;
		case 'Rejected':
			$scope.subSelectedTab = 'rejected';
		break;
		case 'Review':
			$scope.subSelectedTab = 'review';
		break;
		case 'Signed':
			$scope.subSelectedTab = 'signed';
		break;
		case 'Sold':
			$scope.subSelectedTab = 'sold';
		break;
		default:
			$scope.subSelectedTab = 'all';
		};
	}
		
	var proposal_id = $routeParams.id;
//	$scope.isActive = function (viewLocation) { 
//        return viewLocation === $location.path();
//    };
	
	// Meta data for assigned To User
	$scope.assignedToUserList = [
         { value: 'admin@star.com', label: 'Mramalti Prab'},
         { value: 'mp1@star.com', label: 'Ethan Rovelstor'},
         { value: 'mp2@star.com', label: 'Loe Snaketzaie'}
       ];
	 
	$scope.proposalModel = {};
	$scope.proposalModel.otherReason;
	// encode and decode Base64 function
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	
	// assigned to user drop down functionality
	$scope.getAssignedTo = function() {
		var msg = $scope.propertyMessage.areYouSureAssignToThisProposal;
		var ModalTemplate = warnigAlertBox(msg);
		ModalService.showModal({
			template: ModalTemplate,
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {
		    	if (result === 'yes') {
		    		$scope.proposalData.getAssignedToUser = $scope.proposalData.assignedToUser;
		    		/*
		    		Data.patch('proposals/'+proposal_id+'/user?user='+$scope.proposalData.getAssignedToUser).success(function(){
		    			$route.reload();
		    		}).error(function(data,status){
		    			
		    		});
		    		*/
		    		Data.patch('proposals/'+proposal_id+'/user?user='+$scope.proposalData.getAssignedToUser).success(function(data){
		    		//$http({method:'PATCH',url:window.serviceBaseURL+'proposals/'+proposal_id+'/user?user='+$scope.proposalData.getAssignedToUser}).success(function(){
		    			$route.reload();
		    		}).error(function(data,status){
		    			
		    		});
		    		/*
		    		$http({method:'PATCH',url:'http://192.168.64.121:9090/mp/proposals/'+proposal_id+'/user?user='+$scope.proposalData.getAssignedToUser}).success(function(){
		    			$route.reload();
		    		}).error(function(data,status){
		    			
		    		});
		    		*/
		    	}
		    	else{
		    		$route.reload();
		    	}
		    });
		  });
	}
	
	
	
	
	
	 $scope.recordPerPage = ['5','10','20'];
	    /**
		 * Set all grid parameters   
		 * @param - page number 
		 * @output �  NA 
		 */
	    $scope.setLineItemGridParam = function (currentRecordPerPage){
	    	$scope.selectedNumber = currentRecordPerPage; 
	        $scope.maxNoPageSize = 5;
	        $scope.currentPage = 1;
	        $scope.entryLimit = $scope.selectedNumber;
	        $scope.order = 'desc'
	    	$scope.sortBy = 'id';
	    }
	    
	    $scope.setLineItemGridParam($scope.recordPerPage[0]);
	    
	    
	    /**
		 * Get all the attribute based on grid parameters   
		 * @param - NA 
		 * @output � array of attribute 
		 */
	    $scope.getLineItems = function () {
	    	var url = 'proposals/'+proposal_id+'/line-items?&sortBy='+ $scope.sortBy + '&order=' + $scope.order +'&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber ;
	    	Data.get(url).then ( function (data) {
    		    $scope.lineItems= data.data.content;
    	        $scope.totalNoOfItems = data.data.totalElements;
    	        $scope.totalBookedImpressions=0;
    	        $scope.totalInvestment=0;
	    		for(var index in $scope.lineItems){
	    			$scope.lineItems[index].startDate = String(new Date($scope.lineItems[index].startDate)).substring(0,21);
	    			$scope.lineItems[index].endDate = String(new Date($scope.lineItems[index].endDate)).substring(0,21);
	    			$scope.totalBookedImpressions = $scope.totalBookedImpressions+$scope.lineItems[index].offeredQuantity;
	    			$scope.totalInvestment = $scope.totalInvestment+$scope.lineItems[index].investment;
	    		}
	    		$scope.remainingBudget=($scope.proposalData.budget-$scope.totalInvestment);
	    		
	    		// Meta data for status change
	    		 Data.get('reasons').then(function(res){
	    			 $scope.statusChangeReasonList=res.data;
	    		 });
				});
	    };

	    //$scope.getLineItems();
	    
	    /**
		 * Set page number of grid and get all the attribute based on grid parameters  
		 * @param - page number 
		 * @output � array of attribute 
		 */
	    $scope.setPage = function(page){
	    	$scope.currentPage = page;
			$scope.getLineItems();
		};
	    
	    /**
		 * Set number of records per page of grid and get all the attribute based on grid parameters  
		 * @param - NA 
		 * @output � array of attribute 
		 */
		$scope.setRecordPerPage= function () {
			$scope.setLineItemGridParam($scope.selectedNumber);
			$scope.getLineItems();
		}
		
	    /**
		 * Reset all the grid parameters and get all the attribute based on grid parameters 
		 * @param - NA 
		 * @output � array of attribute 
		 */
		$scope.refreshLineItemGrid = function () {
			$scope.setLineItemGridParam($scope.recordPerPage[0]);
			$scope.getLineItems();
		}
		
	    /**
		 * Set grid sort by and order by parameters and get all the attribute based on grid parameters 
		 * @param - NA 
		 * @output � array of attribute 
		 */
		$scope.sort_by = function (predicate) {
				$scope.reverse = !$scope.reverse;
				$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
				$scope.sortBy = predicate;
				$scope.getLineItems();
		};

		
		$scope.sort_by_id = function (predicate) {
				 $scope.predicate = predicate;
				 $scope.reverse = true;
		};
	
	$scope.proposalData = {};
	$scope.lineItems=[];
	var isEditLineItem=false;
	//loads proposal details by id in the page
	$scope.getProposal = function(proposal_id) {
    	Data.get('proposals/'+proposal_id).then(function(data){
    	$scope.proposalData  = data.data;
    	if(proposal_id != $scope.proposalData.id){
    		$location.path('/proposal');
    	}
    	var tempData = angular.copy(data.data);
    	 var dueDate= tempData.dueOn;
	        if(dueDate != null && dueDate != ""){
	        	$scope.proposalData.dueOn = String(new Date(dueDate)).substring(0,21);
	        }else{
	        	$scope.proposalData.dueOn="";
	        }
	    $scope.proposalData.currentStatus = tempData.status;
    	$scope.proposalData.nextStatus = nextStatus(tempData.status);
    	$scope.proposalData.startDate = String(new Date(tempData.startDate)).substring(0,21);
    	$scope.proposalData.endDate  = String(new Date(tempData.endDate)).substring(0,21);
    	$scope.proposalData.requestedOn  = String(new Date(tempData.requestedOn)).substring(0,21);
    	$scope.proposalData.dueOn  = $scope.proposalData.dueOn;
    	$scope.proposalData.assignedToUser =$scope.proposalData.user.clientId;
    	
    	//loads line-items by proposal id in the grid
    	$scope.getLineItems();
	    });
	};
	
	  // remove LineItems
	  $scope.removeLineItem = function(variable) {
			$scope.show(variable);
	  };
	  
	  
	  // cancel insertion
		$scope.cancel=function(lineItem,index,lineform){
			if (lineItem.name==="") {
				$scope.lineItems.splice($scope.lineItems.length-1, 1);
			}else {
				lineform.$cancel();
			}
		};
		
		 //Removes current row from lineItem table
		  function removeCurrentLineItem(lineItem){
			  var index =$scope.lineItems.indexOf(lineItem);
			  $scope.lineItems.splice(index,1);
		  };
	
	if(proposal_id > 0){
		$scope.getProposal(proposal_id);
	} else {
		
	}
	$scope.editPropsal = function(proposal_id) {
		 //$location.path('/proposal/create-proposal/'+proposal_id);
	    $location.path('/proposal/proposal-detail-'+proposal_id+"/edit");
	};

	
	// alert before deleting the values
	 $scope.show = function(variable) {
			var msg = 'Are you sure you want to delete this record?';
			var ModalTemplate = warnigAlertBox(msg);
			ModalService.showModal({
				template: ModalTemplate,
			    controller: "ModalController"
			  }).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {
			    	if (result === 'yes') {
			    		Data.delete('line-items/'+variable.lineItem.id).then(function(result){
				      	  	removeCurrentLineItem(variable.lineItem);
				       		});
			    	}
			    	
			    });
			  });
		};
		 
    $scope.showEditModal = function() {
			ModalService.showModal({
		  	templateUrl: 'editModal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    });
		   });
		 };

		 
		$scope.edit=function(lineItem){
			 $rootScope.currentProposal = {};
			 $rootScope.currentProposal = $scope.proposalData;
			 $rootScope.lefNavActive = $scope.subSelectedTab;
			 var val = "propID-"+ $routeParams.id + "-li-"+lineItem.id;
			 var encodedString = Base64.encode(val);
			 $location.path('/proposal/proposal-detail-'+$routeParams.id+"/"+encodedString);
			 //$location.path('/proposal/create-line-item/'+ encodedString);
			 isEditLineItem=true;
		 };
	
		 $scope.view=function(lineItem){
			 $rootScope.currentProposal = {};
			 $rootScope.currentProposal = $scope.proposalData;
			 $rootScope.lefNavActive = $scope.subSelectedTab;
			 var val = "propID-"+ $routeParams.id + "-li-"+lineItem.id;
			 var encodedString = Base64.encode(val);
			 $location.path('/proposal/proposal-detail-'+$routeParams.id+"/lineitem-detail/"+encodedString);
		 };
		 
	 // saving a line item
	 $scope.addLineItem = function(id) {
		  $rootScope.currentProposal = $scope.proposalData;
		  $rootScope.lefNavActive = $scope.subSelectedTab;
		  var val = "propID-"+id + "-li-"+ 0;
		  var encodedString = Base64.encode(val);
		  $location.path('/proposal/proposal-detail-'+id+"/"+encodedString);
	   }
	 
	 
	 
	// target list elements
	$scope.targetListElements=[];
	$scope.isedittableItem=false;
	var editableItemIndex;
	
	// add target list element
	$scope.addElement=function(){
	var newElement={};
	
	newElement.targetTypeOption=$scope.targetTypeOption;
	newElement.element=$scope.element;
	newElement.targettingString=$scope.targettingString;
	if($scope.isedittableItem==false){
	$scope.targetListElements.push(newElement);
	}else{
		$scope.targetListElements.splice(editableItemIndex,1);
		$scope.targetListElements.splice(1,editableItemIndex,newElement);
		$scope.isedittableItem=false;
	}
	};
	
	// edit target list element
	$scope.editTargetListItem=function(targetListElement){
		$scope.targetTypeOption=targetListElement.targetTypeOption;
		$scope.element=targetListElement.element;
		$scope.targettingString=targetListElement.targettingString;
		$scope.isedittableItem=true;
		};
		
	// delete target list item
	$scope.deleteTargetListitem=function(targetListElement){
		editableItemIndex = $scope.targetListElements.indexOf(targetListElement);
		//alert("delete "+editableItemIndex);
		$scope.targetListElements.splice(editableItemIndex,1);
		
	};
	$scope.showActionOptions = false; 
	
	function nextStatus(current){
		var statusList = [];
		switch(current){
		case 'Pending':
			if($rootScope.roleName=='ADMIN' || ($rootScope.roleName=='PLANNER' && $scope.proposalData.user.clientId==$rootScope.userId)){
				statusList.push({'name':'Propose','action':'success','shortName':'Pr'});
			}
		break;
		case 'Proposed':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Reject','action':'fail','shortName':'Rj'});
				statusList.push({'name':'Review','action':'success','shortName':'Re'});
			}
		break;
		case 'Rejected':
			if($rootScope.roleName=='ADMIN' || ($rootScope.roleName=='PLANNER' && $scope.proposalData.user.userId==$rootScope.userId)){
				statusList.push({'name':'Pending','action':'success','shortName':'Pe'});
			}
		break;
		case 'Review':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Pending','action':'fail','shortName':'Pe'});
				statusList.push({'name':'Sold','action':'success','shortName':'So'});
			}
		break;
		case 'Sold':
			if($rootScope.roleName=='ADMIN'){
				statusList.push({'name':'Signed','action':'success','shortName':'Si'});
			}
		break;
		}
		return statusList;
	}
	
	$scope.cloneProposal = function(id) {
		var msg = 'Do you want to clone this proposal ?';
		var ModalTemplate = warnigAlertBox(msg);
		ModalService.showModal({
			template: ModalTemplate,
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {
		    	if (result === 'yes') {
		    		Data.post('proposals/'+id+'/clone',{}).success( function(result) {
		    			$scope.editPropsal(result.id);
		        	}).error( function(result) {
		        		//console.log(result);
		        	});
		    	}
		    });
		  });
	}
	
	$scope.changeStatus = function(id,action)
	{
		//$scope.showStatusWarning(id,action);
		if ($scope.totalNoOfItems > 0) {
			$scope.open(id,action,'plugins/proposal/partials/changeStatusWarning.html');
		}
		else{
			var msg = 'Please add at least one Line Item before changing the status.';
			var ModalTemplate = warnigAlertBoxForStatus(msg);
			ModalService.showModal({
				template: ModalTemplate,
			    controller: "ModalController"
			  }).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {
			    });
			  });
		}
	}
	/*
	$scope.showStatusWarning = function(id,action) {
		ModalService.showModal({
	  	templateUrl: 'changeStatusWarning.html',
	    controller: "ModalController"
	  }).then(function(modal){
	    modal.element.modal();
	    modal.close.then(function(result) {
	    	if (result === 'Yes') {
	    		if ($scope.totalItems > 0) {
	    			$http({method:'PATCH',url:'http://10.193.66.132:9090/mp/proposals/'+id+'/'+action}).success(function(data,status){
		    		//$scope.showActionOptions=! $scope.showActionOptions;
		    		$scope.proposalData.status = data.status;
		    		$scope.proposalData.nextStatus = nextStatus(data.status);
		    		data.status = 'success';
		    		data.message = $scope.propertyMessage.statusChanged;
		    		Data.toast(data);
		    		}).error(function(data,status){});
	    		}
	    		else{
	    			var msg = 'Please add at least one Line Item before changing the status.';
	    			var ModalTemplate = warnigAlertBoxForStatus(msg);
	    			ModalService.showModal({
	    				template: ModalTemplate,
	    			    controller: "ModalController"
	    			  }).then(function(modal) {
	    			    modal.element.modal();
	    			    modal.close.then(function(result) {
	    			    });
	    			  });
	    		}
	    		
	      }
	    });
	   });
	 };
	*/
	 
	 $scope.open = function (id,action,modalTemplate) {
			var modalInstance;
			$scope.actionStatus = action;
			modalInstance = $modal.open({
			      templateUrl: modalTemplate,
			      controller: 'proposalLineItemCtrl',
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
	 
	function alertBox(msg){
		var modalBody = '<div class="modal fade proposal">'+
							'<div class="modal-dialog dialog-size-position">'+
								' <div class="modal-content">'+
								'  <div class="modal-header dialog-header-warnig">'+
								'    <button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
								'  <span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
								'<span class="modal_title">Warning'+
								'</span>'+
								'</div>'+
								'<div class="modal-body">'+
								'   <p>'+msg+'</p>'+
									'</div>'+
									'<div class="modal-footer modal-cuntom-footer">'+
								'   <button type="button" ng-click="close(\'editModal\')" class="btn btn-primary" data-dismiss="modal">Ok</button>'+
								'</div>'+
								'</div>'+
								'</div>'+
								'</div>'	;
		return modalBody;
	}
	
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
	
	
	$scope.showEditModal = function(msg) { 
		var ModalTemplate = alertBox(msg);
		ModalService.showModal({
	  	template: ModalTemplate,
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	
	    });
	   });
	 };
	 
	 
	 function warnigAlertBoxForStatus(msg){
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
									'   <button type="button" ng-click="close(\'ok\')" class="btn btn-primary" data-dismiss="modal">OK</button>'+
									
									'</div>'+
									'</div>'+
									'</div>'+
									'</div>'	;
			return modalBody;
		}
	 
	 // To close model popup
	 $scope.close = function () {
		 $scope.$close();
	 };
	 
	
	
	 // Selected reason array
	 $scope.selectedReason = [];
     
	 // Selected reason will be pushed in selectedReason array
     $scope.toggleSelection = function toggleSelection(reason) {
    	    var idx = $scope.selectedReason.indexOf(reason);
    	    // is currently selected
    	    if (idx > -1) {
    	      $scope.selectedReason.splice(idx, 1);
    	    }

    	    // is newly selected
    	    else {
    	    	$scope.selectedReason.push({"id":reason});
    	      //$scope.selectedReason.push(reason);
    	    }
    	    
    	  };
    // Chane status with reason	  
    $scope.changeStatusWithReason = function() {
    	
//    	if($scope.proposalModel.otherReason)
//    		$scope.selectedReason.push($scope.proposalModel.otherReason);
//    	var reasonStr = $scope.selectedReason.map(function(obj){return obj;}).join('\n'); // returns the expected output.
    	
    	    $scope.insertComment = {
				proposal: {"id": proposal_id},
				reasons: $scope.selectedReason,
				action: $scope.actionStatus,
				commentText: $scope.proposalModel.otherReason
		    };
    	   
    	    if ($scope.actionStatus === 'fail' && $scope.proposalData.currentStatus === 'Proposed') {
	    	    Data.post('reasoncommets', $scope.insertComment).success(function(results){
	    	        Data.patch('proposals/'+proposal_id+'/'+$scope.actionStatus).success(function(data,status){
	     	       //$http({method:'PATCH',url:window.serviceBaseURL+'proposals/'+proposal_id+'/'+$scope.actionStatus}).success(function(data,status){
	     	    		$scope.proposalData.status = data.status;
	     	    		$scope.proposalData.nextStatus = nextStatus(data.status);
	     	    		data.status = 'success';
	     	    		data.message = $scope.propertyMessage.statusChanged;
	     	    		Data.toast(data);
	     	    		$scope.$close();
	     	    		$route.reload();
	 	    		}).error(function(data,status){
	 	    			
	 	    		});
	     	        
	 		    }).error(function(results){
	 		    	results.status = 'error';
	 		    	results.message = $scope.propertyMessage.rendomError;
	     	        Data.toast(results);
	 		    }); 
    	    }else{
    	    	Data.patch('proposals/'+proposal_id+'/'+$scope.actionStatus).success(function(data,status){
    	    	//$http({method:'PATCH',url:window.serviceBaseURL+'proposals/'+proposal_id+'/'+$scope.actionStatus}).success(function(data,status){
     	    		$scope.proposalData.status = data.status;
     	    		$scope.proposalData.nextStatus = nextStatus(data.status);
     	    		data.status = 'success';
     	    		data.message = $scope.propertyMessage.statusChanged;
     	    		Data.toast(data);
     	    		$scope.$close();
     	    		$route.reload();
 	    		}).error(function(data,status){
 	    			
 	    		});
    	    }
    	
    	}
    $scope.viewPropsal = function(proposal_id) { 
	    $location.path('/proposal/proposal-detail-'+proposal_id+"/view");
	};
	$scope.moveToRatecard=function(path){
		 $location.path(path);
	};
	$scope.moveToAllProposal=function(){
		 $location.path("proposal");
	};
});