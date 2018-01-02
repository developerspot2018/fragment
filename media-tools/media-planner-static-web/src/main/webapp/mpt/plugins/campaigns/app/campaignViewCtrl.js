/**
 * campaignViewCtrl is a controller for for view campain details.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */


app.controller('campaignViewCtrl', function ($route, $routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, ModalService, Validation,lineItemService) {
	
	// Add required css file
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$scope.chooseFromExisting = false;
	$scope.entryLimit=10;
	$scope.lineItemId = '';
	
	// Add campaigns property file to load static data.
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.creativeLst='';
		$scope.lineItemId='';
		$scope.lineItemData='';
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
    
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var valArr = Base64.decode($routeParams.cid).split('-');
	$scope.proposalId = valArr[1];
	$scope.lineItemlId = valArr[3];
	
	$scope.newLineItem = {};
	$scope.targetListElements=[];
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
			$scope.newLineItem.product=$scope.newLineItem.selectedProductVal;
			$scope.newLineItem.paymentModel=$scope.lineItemData.paymentModel;
			$scope.newLineItem.specTypeOption=$scope.lineItemData.custom3;
			$scope.newLineItem.deliveryPriority=$scope.lineItemData.deliveryPriority;
			$scope.newLineItem.deliveryStatus=$scope.lineItemData.deliveryStatus;
			$scope.newLineItem.placeHolder=$scope.lineItemData.placeHolder;
			$scope.newLineItem.investment=$scope.lineItemData.investment;
			lineItemService.setLineItemData(result.data);
			 Data.get('line-items/'+id+"/products/"+$scope.selectedProductId+"/salestargets").then(function(data){
					var salesTargetLists = data.data;
					var selectedSalesTarget = $scope.selectedTarget;
					selectedSalesTarget.forEach(function(selectedValue,i){
						salesTargetLists.forEach(function(value,j){
							if(selectedValue.id == value.id){
								value.ticked = true;
								$scope.newLineItem.salesTargetList = $scope.newLineItem.salesTargetList+","+value.name;
							}
						})
						selectedValue.ticked = true;
					})
					var temp=$scope.newLineItem.salesTargetList;
					 $scope.newLineItem.salesTargetList= temp.replace("undefined,"," ");
				});
			 
			 $scope.newLineItem.custom4=$scope.lineItemData.custom4;
			 var tempTargetList = [];
			 Data.get('line-items/'+id+"/targets").then(function(data){
				 data.data.forEach(function(value,i){
				 $scope.targetListElements.push({"name":{"id":value.category.id,"name":value.category.name},"value":{"id":value.id,"value":value.value}});
				 })
			 });
	   });});
	} 
	if (isNaN($scope.proposalId) || isNaN($scope.lineItemlId) || $scope.proposalId <= 0 || $scope.lineItemlId < 0) {
		  $location.path('/orders');
	} else if($scope.lineItemlId > 0){
		$scope.getLineItemData($scope.lineItemlId);
	}
	
});