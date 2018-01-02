app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('campaignsLineItemViewCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) { 
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	$http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
	
	this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
	/*  Data.get('proposals/'+proposal_id).then(function(data){
    	$scope.proposalData  = data.data;
		$scope.lineItems= data.data.lineItems;
		$scope.totalItems = $scope.lineItems.length;
		 $scope.editableLineItem=$scope.lineItems[0]; 
		$scope.currentPage = 1; // current page

        $scope.entryLimit = 10; // max no of items to display in a page
        // Initially for no filter
		 $scope.predicate='id'; 
         $scope.sort_by('id');
    	});*/
    };
	
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var proposal_id = $routeParams.id;
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
	
	$scope.proposalData = {};
	$scope.lineItems=[];
	var isEditLineItem=false;
	/* $scope.editableLineItem={}; */
	/* $scope.name="klljfklsdf"; */
	
	$scope.getProposal = function(proposal_id) {
    	Data.get('proposals/'+proposal_id).then(function(data){
    	$scope.proposalData  = data.data;
    	var tempData = angular.copy(data.data);
    	$scope.proposalData.startDate = String(new Date(tempData.startDate)).substring(0,21);
    	$scope.proposalData.endDate  = String(new Date(tempData.endDate)).substring(0,21);
    	$scope.proposalData.requestedOn  = String(new Date(tempData.requestedOn)).substring(0,21);
    	$scope.proposalData.dueOn  = String(new Date(tempData.dueOn)).substring(0,21);
		$scope.lineItems= data.data.lineItems;
		$scope.totalItems = $scope.lineItems.length;
		/* $scope.editableLineItem=$scope.lineItems[0]; */
		$scope.currentPage = 1; // current page

        $scope.entryLimit = 10; // max no of items to display in a page
        // Initially for no filter
		/* $scope.predicate='id'; */
         $scope.sort_by('id');
    	});
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
	$scope.sort_by = function(predicate) {
    	// console.log(predicate);
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
	
	// update Line items
   
	  
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
			 $location.path('/campaigns/create-line-item/'+ encodedString);
			 isEditLineItem=true;
		 };
	
	// for saving a line edited item
	 // $scope.propId = 0;
	   $scope.addLineItem = function(id) {
		   var val = "propID-"+id + "-li-"+ 0;
		   var encodedString = Base64.encode(val);
		  $location.path('/campaigns/create-line-item/'+encodedString);
		  $rootScope.currentProposal = $scope.proposalData;
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
	    	if (result === 'Yes') {
	    		Data.patch('proposals/'+id+'/'+action).success(function(){
	    		//$http({method:'PATCH',url:window.serviceBaseURL+'proposals/'+id+'/'+action}).success(function(data,status){
	    			$scope.showActionOptions=! $scope.showActionOptions;
	    			$scope.proposalData.status = data.status;
	    		}).error(function(data,status){});
	         	//Data.patch('proposal/'+id+'/'+action).then(function(result){
	      	  	//removeCurrentAttribute(variable.attribute);
	       	//});
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
});
