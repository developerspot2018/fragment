/**
 * campaignsLineItemCtrl is a controller for proposal detail page functionality.
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

app.controller('campaignsLineItemCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) { 
	
	// Add required css file
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	
	// Add campaigns property file to load static data.
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	// Add campaigns message property file to load static messages
	$http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	
	// Make campaigns tab selected
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('orders') > -1){
        	return true; 
        }
		return false;
    };

    // Make left menu selected
    $rootScope.isSubMenueActive = function(path){
    	var flag = false;
    	if($scope.selectedTab=='Order' && $scope.subSelectedTab==path)
    		flag = true;
    	return flag;
    }
    
    $scope.subSelectedTab = $rootScope.lefNavActive;
    $scope.selectedTab = '';
    
    $scope.isOpen = function(val){
		var flag = false;
		if(val=='Order')
			flag = true;
		return flag;
	};

    var proposal_id = $routeParams.id;
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
    	    //});
    	
    	//Data.get('proposals/'+proposal_id+'/line-items').then(function(data){
    	//	$scope.lineItems= data.data.content;
    	//	$scope.totalItems = $scope.lineItems.length;
    		$scope.totalBookedImpressions=0;
    		$scope.totalInvestment=0;
    		for(var index in $scope.lineItems){
    			$scope.lineItems[index].startDate = String(new Date($scope.lineItems[index].startDate)).substring(0,21);
    			$scope.lineItems[index].endDate = String(new Date($scope.lineItems[index].endDate)).substring(0,21);
    			$scope.totalBookedImpressions = $scope.totalBookedImpressions+$scope.lineItems[index].offeredQuantity;
    			$scope.totalInvestment = $scope.totalInvestment+$scope.lineItems[index].investment;
    		}
    		$scope.remainingBudget=($scope.proposalData.budget-$scope.totalInvestment);
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
    
    
    
    
    
	this.tab = 1;
    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
	
    };
    
    // encode and decode Base64 function
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
	
    //loads orders details by orders id in the page
	$scope.proposalData = {};
	$scope.lineItems=[];
	var isEditLineItem=false;
	$scope.getProposal = function(proposal_id) {
    	Data.get('proposals/'+proposal_id).then(function(data){
    	$scope.proposalData  = data.data;
    	var tempData = angular.copy(data.data);
    	
    	var dueDate= tempData.dueOn;
        if(dueDate != null && dueDate != ""){
        	$scope.proposalData.dueOn = String(new Date(dueDate)).substring(0,21);
        }else{
        	$scope.proposalData.dueOn="";
        }
        
    	$scope.proposalData.startDate = String(new Date(tempData.startDate)).substring(0,21);
    	$scope.proposalData.endDate  = String(new Date(tempData.endDate)).substring(0,21);
    	$scope.proposalData.requestedOn  = String(new Date(tempData.requestedOn)).substring(0,21);
    	$scope.proposalData.dueOn  = $scope.proposalData.dueOn;
    	
    	$scope.getLineItems();

//		$scope.currentPage = 1; // current page
//        $scope.entryLimit = 5; // max no of items to display in a page
 //        $scope.sort_by('id');
         
    	});
    	
	};
	
//	// sorting functionality in  LineItems grid
//	$scope.sort_by = function(predicate) {
//    	// console.log(predicate);
//		 $scope.predicate = predicate;
//		 $scope.reverse = !$scope.reverse;
//	};
	
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
		
		/*
		 * Removes current row from lineItem table
		 */
		  function removeCurrentLineItem(lineItem){
			  var index =$scope.lineItems.indexOf(lineItem);
			  $scope.lineItems.splice(index,1);
		  };
	
	if(proposal_id > 0){
		$scope.getProposal(proposal_id);
		 //alert("13");
	} else {
		
	}
	
	$scope.editPropsal = function(proposal_id) {
		 $location.path('/campaigns/create-proposal/'+proposal_id);
	};
	
	   $scope.editPropsal = function(proposal_id) {
		 $location.path('/campaigns/create-proposal/'+proposal_id);
	};
	
	// alert before deleting the values
	$scope.show = function(variable) {
			ModalService.showModal({
		  	templateUrl: 'modal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    	if (result === 'Yes') {
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
			 var val = "propID-"+ $routeParams.id + "-li-"+lineItem.id;
			 var encodedString = Base64.encode(val);
			 $location.path('/orders/orders-detail-'+$routeParams.id+'/'+ encodedString);
			 isEditLineItem=true;
		 };
	
	// for saving a line edited item
	 // $scope.propId = 0;
	   $scope.addLineItem = function(id) {
		   var val = "propID-"+id + "-li-"+ 0;
		   $rootScope.currentProposal = $scope.proposalData;
		   var encodedString = Base64.encode(val);
		   //alert('/orders/orders-detail-'+id+"/"+encodedString);
		   $location.path('/orders/orders-detail-'+id+"/"+encodedString);
		   //$location.path('/proposal/proposal-detail-'+id+"/"+encodedString);
	  }	 
	 
	// target list elements
	
	$scope.targetListElements=[];
	$scope.isedittableItem=false;
	var editableItemIndex;
	
	// add target list element
	$scope.addElement=function(){
	alert("addelement "+$scope.targetTypeOption.label);
	
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
	$scope.nextStatus = function(current){
		$scope.statusList = [];

		if(current=="Pending")
		{
			if($rootScope.roleName=='ADMIN' || $rootScope.roleName=='PLANNER'){
				$scope.statusList.push({'name':'Propose','action':'success'});
				$scope.flag = true;
			}
		}
		if(current=="Proposed")
		{
			if($rootScope.roleName=='ADMIN'){
				$scope.statusList.push({'name':'Reject','action':'fail'});
				$scope.statusList.push({'name':'Review','action':'success'});
				$scope.flag = true;
			}
		}
		
		if(current=="Rejected")
		{
			if($rootScope.roleName=='ADMIN'){
				$scope.statusList.push({'name':'Pending','action':'success'});
				$scope.flag = true;
			}
		}
		if(current=="Review")
		{
			if($rootScope.roleName=='ADMIN'){
				$scope.statusList.push({'name':'Pending','action':'fail'});
				$scope.statusList.push({'name':'Sold','action':'success'});
				$scope.flag = true;
			}
		}
		if(current=="Sold")
		{
			if($rootScope.roleName=='ADMIN'){
				$scope.statusList.push({'name':'Signed','action':'success'});
				$scope.flag = true;
			}
		}

	}
	
	$scope.isarrow = function(status){
		var flag=false;
		if($rootScope.roleName=='PLANNER' && status=='Pending')
			flag = true;
		if($rootScope.roleName=='ADMIN')
			flag = true;
		
		return flag;
	}
	
	$scope.changeStatus = function(id,action)
	{
		$scope.showStatusWarning(id,action);
	}
	
	$scope.showStatusWarning = function(id,action) {
		ModalService.showModal({
	  	templateUrl: 'changeStatusWarning.html',
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	    	/*
	    	if (result === 'Yes') {
	    		$http({method:'PATCH',url:'http://10.193.66.132:9090/mp/proposals/'+id+'/'+action}).success(function(data,status){
	    			$scope.showActionOptions=! $scope.showActionOptions;
	    			$scope.proposalData.status = data.status;
	    		}).error(function(data,status){});
	      }
	    	*/
	    	if (result === 'Yes') {
	    		Data.patch('proposals/'+id+'/'+action).success(function(data,status){
	    		//$http({method:'PATCH',url:window.serviceBaseURL+'proposals/'+id+'/'+action}).success(function(data,status){
	    			$scope.showActionOptions=! $scope.showActionOptions;
	    			$scope.proposalData.status = data.status;
	    		}).error(function(data,status){});
	      }
	    });
	   });
	 };
	
	function alertBox(msg){
		var modalBody = '<div class="modal fade">'+
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
	 $scope.viewPropsal = function(proposal_id) {
		    $location.path('/orders/orders-detail-'+proposal_id+"/view");
		};
});
