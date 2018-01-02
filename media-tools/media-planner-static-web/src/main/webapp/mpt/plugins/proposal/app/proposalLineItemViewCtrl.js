app.controller('proposalLineItemViewCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) { 
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
     });
	$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
     });

	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
    };

    //OPEN ACCORDIAN IN VIEW MODE
    $rootScope.isSubMenueActive = function(path){
    	var flag = false;
    	if($scope.selectedTab=='Proposal' && $scope.subSelectedTab==path)
    		flag = true;
    	return flag;
    }

    $scope.isOpen = function(val)
	{ 
		var flag = false;
		if(val=='proposal')
			flag = true;

		return flag;
	};
		
	/*var proposal_id = $routeParams.id;
	$scope.isActive = function (viewLocation) { 
       return viewLocation === $location.path();
    };*/
	
	/*$scope.proposalData = {};
	$scope.lineItems=[];
	var isEditLineItem=false;
	
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
		$scope.currentPage = 1; // current page
       $scope.entryLimit = 10; // max no of items to display in a page
        $scope.sort_by('id');
   	});
	};
	
	$scope.sort_by = function(predicate) {
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
	
	
	if(proposal_id > 0){
		$scope.getProposal(proposal_id);
	} else {
		
	}
	$scope.editPropsal = function(proposal_id) {
		 $location.path('/proposal/create-proposal/'+proposal_id);
	};
*/
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var valArr = Base64.decode($routeParams.lid).split('-');
	$scope.proposalId = valArr[1];
	$scope.lineItemlId = valArr[3];
   
	$scope.targetListElements=[];
	$scope.newLineItem = {};
	$scope.salesTargetList=[];
   // display line item information in case of update/edit line item
	$scope.getLineItemData = function(id) {
		Data.get('line-items/'+id).then(function(result){
			Data.get('line-items/'+$scope.lineItemlId+"/salestargets").then(function(data){
		    	$scope.selectedTarget = data.data;
			});
			// returns selected product id of line item
			   Data.get('line-items/'+$scope.lineItemlId+"/products").then(function(data){
					$scope.selectedProductId = data.data.id;
	    	$scope.lineItemData  = result.data;
	    	$scope.newLineItem.selectedProductVal = $scope.selectedProductId;
	    	$scope.newLineItem.startDate=String(new Date($scope.lineItemData.startDate)).substring(0,21);
	    	$scope.newLineItem.endDate=String(new Date($scope.lineItemData.endDate)).substring(0,21);
			 $scope.newLineItem.price=$scope.lineItemData.price;
			 $scope.newLineItem.offeredQuantity=$scope.lineItemData.offeredQuantity;
			 $scope.newLineItem.basePrice=$scope.lineItemData.basePrice;
			 $scope.newLineItem.custom2=$scope.lineItemData.custom2;
			 $scope.newLineItem.id=$scope.lineItemData.id;
			 $scope.newLineItem.product=data.data.name;
			 $scope.newLineItem.paymentModel=$scope.lineItemData.paymentModel;
			 $scope.newLineItem.specTypeOption=$scope.lineItemData.custom3;
			 $scope.newLineItem.deliveryPriority=$scope.lineItemData.deliveryPriority;
			 $scope.newLineItem.deliveryStatus=$scope.lineItemData.deliveryStatus;
			 $scope.newLineItem.placeHolder=$scope.lineItemData.placeHolder;
			 $scope.newLineItem.investment=$scope.lineItemData.investment;
			 Data.get('line-items/'+id+"/products/"+$scope.selectedProductId+"/salestargets").then(function(data){
					var salesTargetList = data.data;
					var selectedSalesTarget = $scope.selectedTarget;
					selectedSalesTarget.forEach(function(selectedValue,i){
						salesTargetList.forEach(function(value,j){
							if(selectedValue.id == value.id){
								value.ticked = true;
								$scope.salesTargetList.push(value.name);
								/*$scope.newLineItem.salesTargetList = $scope.newLineItem.salesTargetList+","+value.name;*/
							}
						})
						selectedValue.ticked = true;
					})
					/*var temp=$scope.newLineItem.salesTargetList;
					 $scope.newLineItem.salesTargetList= temp.replace("undefined,"," ");*/
				});
			 
			 var tempTargetList = [];
			 Data.get('line-items/'+id+"/targets").then( function(resultData) {
				 $scope.selElmnList=resultData.data;
				 //$scope.targetListElements.length = 0;
				 resultData.data.forEach(function(value,i){
					var flag = true;
					 $scope.targetListElements.forEach(function(targetValue,j){
						 if(value.category.id == targetValue.categoryId){
							 flag = false;
							 targetValue.targetElements.push({"targetElementsId":value.id,"targetElementsValue":value.value});	
						 }
					 });
					 
					 if($scope.targetListElements.length == 0 || flag) {
						 var targetElements = [];
						 targetElements.push({"targetElementsId":value.id,"targetElementsValue":value.value});
						 $scope.targetListElements.push({"categoryId": value.category.id, "categoryName": value.category.name ,"targetElements":targetElements});
					 } 
				 });
			 })
			 $scope.newLineItem.custom4=$scope.lineItemData.custom4;
	   });});
	};
	if (isNaN($scope.proposalId)  || isNaN($scope.lineItemlId)  || $scope.proposalId  <= 0 || $scope.lineItemlId < 0 )  {
		 $location.path('/proposal');
	} else if($scope.lineItemlId > 0){
		$scope.getLineItemData($scope.lineItemlId);
	}
});
