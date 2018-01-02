app.controller('orderCampaignsCtrl', function ($scope, $location, $rootScope, Data, cssInjector, $filter, $http) { 
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	  
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
    
    $rootScope.isSubMenueActive = function(path)
    {
    	var flag = false;
    	if($scope.selectedTab=='Campaigns' && $scope.subSelectedTab==path)
    		flag = true;
    	    	
    	return flag;
    }
    
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    $scope.getExactPath = function(heading){
		if(heading=='Orders'){
			$location.path('/campaigns');
		}
		if(heading=='Campaigns'){
			$location.path('/list-campaigns');
		}
		if(heading=='Assets'){
			$location.path('/campaigns/asset-template-list');
		}
	}
    
    $scope.isOpen = function(val)
	{
		var path = $location.path();
		var flag = false;
		if(path=='/campaigns' && val=='Order')
			flag = true;
		if(path=='/list-campaigns' && val=='Campaigns')
			flag = true;
		if(path=='/campaigns/asset-template-list' && val=='Assets')
			flag = true;
		return flag;
	};
    
    $(document).ready(function () {
    	  $(function() {
    	    	setTimeout(function(){
    	    		$("#startDateFilter" ).datepicker({
    	    	        changeMonth: true,
    	    	        changeYear: true,
    	    	        dateFormat : 'mm/dd/yy',
    	    	        defaultDate: new Date()
    	    	    });
    	    		$("#endDateFilter" ).datepicker({
    	    	        changeMonth: true,
    	    	        changeYear: true,
    	    	        dateFormat : 'mm/dd/yy',
    	    	        defaultDate: new Date()
    	    	    });
    	    	},100);
    	   
    	  });
    	});
		
    
	$scope.proposalSortByOptions = [
	                   { value: 'advertiserName', label: 'Advertiser'},
	                   { value: 'user.firstName', label: 'Assign To'},
	                   /*{ value: 'lineItemEndDate', label: 'End Date'},*/
	                   { value: 'orderName', label: 'Order Name'},
	                   { value: 'propsalId', label: 'Order ID'},
	                  /* { value: 'lineItemStartDate', label: 'Start Date'},*/
	                   { value: 'salesCategory', label: 'Sales Category'},
	                   { value: 'lineItemList.deliveryStatus', label: 'Status'},
	                   { value: 'lineItemList.placeHolder', label: 'Campaign Name'},
	                   { value: 'lineItemList.deliveryPriority', label: 'Priority'},
	                   { value: 'lineItemStartDate', label: 'Flight Start Date'},
	                   { value: 'lineItemEndDate', label: 'Flight End Date'}
	                  ];
	
	$scope.proposalOrderByOptions = [
	         	                   { value: 'false', label: 'Asc'},
	         	                   { value: 'true', label: 'Desc'}
	         	                  ];
	
		
	$scope.proposalSortBy = $scope.proposalSortByOptions[0];
	$scope.proposalOrderBy = $scope.proposalOrderByOptions[0];
	$scope.noOfProposalsPerPage = 10;
	
	/*
	Data.get('proposals?status=Signed').then(function(data){
        $scope.proposalsBackup = data.data;
        $scope.sortProposal();
    });
    */
	$scope.newProposals=[];
	$scope.newProposalsBackup = [];
	$scope.proposalsBackup = [];
	$scope.selectedTab = '';
	$scope.subSelectedTab = '';
	
	Data.get('proposals?status=Signed').then(function(data){		
        var orderList = data.data;
        for (var i=0; i<orderList.length; i++){
        	   var orderId=orderList[i].id;
        		Data.get('proposals/'+orderId).success(function(data){
        			var orderData  = data;
        	    	var lineItemList = orderData.lineItems;
        	    	lineItemList.forEach(function(value,index){
        	    		 $scope.proposalsBackup.push({
        	    			    orderName:orderData.proposalName,
	        					status:orderData.status,
	        					propsalId:orderData.id,
	        					advertiserName:orderData.advertiserName,
	        					accountManager:orderData.accountManager,
	        					salesCategory:orderData.salesCategory,
	        					lineItemEndDate:value.endDate,
	        					lineItemStartDate:value.startDate,
	        					user:orderData.user,
	        					lineItemList:value
	        				});
	        			
	        			 });
        	    	$scope.sortProposal();
        		}).error(function(data){
        			// do nothing
        		});
        }
        
	});
	
	
	$scope.subSelectedTab = 'all'; 
	
	$scope.setCampainsStatus = function(lineItemdeliveryStatus){
		$scope.proposalsBackup.splice(0,$scope.proposalsBackup.length);
		
		$scope.selectedTab = 'Campaigns';
		switch(lineItemdeliveryStatus)
		{
		case 'Signed':
			$scope.subSelectedTab = 'all';
		break;
		case 'MyOrders':
			$scope.subSelectedTab = 'my';
		break;
		case 'Active':
			$scope.subSelectedTab = 'active';
		break;
		case 'Ready':
			$scope.subSelectedTab = 'ready';
		break;
		case 'Delivering':
			$scope.subSelectedTab = 'delivering';
		break;
		case 'Completed':
			$scope.subSelectedTab = 'completed';
		break;
		default:
			$scope.subSelectedTab = 'all';
		};
		
		if(lineItemdeliveryStatus=='Signed'){
			Data.get('proposals?status=Signed').then(function(data){		
		        var orderList = data.data;
		        for (var i=0; i<orderList.length; i++){
		        	   var orderId=orderList[i].id;
		        		Data.get('proposals/'+orderId).success(function(data){
		        			var orderData  = data;
		        	    	var lineItemList = orderData.lineItems;
		        	    	lineItemList.forEach(function(value,index){
		        	    		 $scope.proposalsBackup.push({
		        	    			    orderName:orderData.proposalName,
			        					status:orderData.status,
			        					propsalId:orderData.id,
			        					advertiserName:orderData.advertiserName,
			        					accountManager:orderData.accountManager,
			        					salesCategory:orderData.salesCategory,
			        					lineItemEndDate:value.endDate,
			        					lineItemStartDate:value.startDate,
			        					user:orderData.user,
			        					lineItemList:value
			        				});
			        			
			        			 });
		        	    	$scope.sortProposal();
		        		}).error(function(data){
		        			// do nothing
		        		});
		        }
		        
			});
		}else if(lineItemdeliveryStatus=='MyOrders'){
			Data.get('proposals?status=Signed&userId='+$rootScope.userId).then(function(data){		
		        var orderList = data.data;
		        for (var i=0; i<orderList.length; i++){
		        	   var orderId=orderList[i].id;
		        		Data.get('proposals/'+orderId).success(function(data){
		        			var orderData  = data;
		        	    	var lineItemList = orderData.lineItems;
		        	    	lineItemList.forEach(function(value,index){
		        	    		 $scope.proposalsBackup.push({
		        	    			    orderName:orderData.proposalName,
			        					status:orderData.status,
			        					propsalId:orderData.id,
			        					advertiserName:orderData.advertiserName,
			        					accountManager:orderData.accountManager,
			        					salesCategory:orderData.salesCategory,
			        					lineItemEndDate:value.endDate,
			        					lineItemStartDate:value.startDate,
			        					user:orderData.user,
			        					lineItemList:value
			        				});
			        			
			        			 });
		        	    	$scope.sortProposal();
		        		}).error(function(data){
		        			// do nothing
		        		});
		        }
		        
			});
		}
		
		else{
			        Data.get('proposals?status=Signed').then(function(data){	
			        var orderList = data.data;
			        for (var i=0; i<orderList.length; i++){
			        	   var orderId=orderList[i].id;
			        		Data.get('proposals/'+orderId).success(function(data){
			        			var orderData  = data;
			        	    	var lineItemList = orderData.lineItems;
			        	    	lineItemList.forEach(function(value,index){
			        	    		if(value.deliveryStatus==lineItemdeliveryStatus){
			        	    			$scope.proposalsBackup.push({
			        	    				orderName:orderData.proposalName,
				        					status:orderData.status,
				        					propsalId:orderData.id,
				        					advertiserName:orderData.advertiserName,
				        					accountManager:orderData.accountManager,
				        					salesCategory:orderData.salesCategory,
				        					lineItemEndDate:value.endDate,
				        					lineItemStartDate:value.startDate,
				        					user:orderData.user,
				        					lineItemList:value
				        				});
			        	    		}
			        	    		 
				        			
				        			 });
			        	    	$scope.sortProposal();
			        		}).error(function(data){
			        			// do nothing
			        		});
			        }
			        
				});
		}
	}
	
	$scope.sortProposal = function() {
		var tempData = angular.copy($scope.proposalsBackup);
		tempData.forEach(function(value,i){
			$scope.proposalsBackup[i].lineItemList.startDate = String(new Date(value.lineItemList.startDate)).substring(0,21);
			$scope.proposalsBackup[i].lineItemList.endDate = String(new Date(value.lineItemList.endDate)).substring(0,21);
			$scope.proposalsBackup[i].lineItemList.placeHolder = value.lineItemList.placeHolder;
			$scope.proposalsBackup[i].lineItemList.linkPath = $scope.getPath($rootScope.roleName,value.lineItemList.deliveryStatus,value.propsalId);
			$scope.proposalsBackup[i].lineItemList.linkCampaignPath = $scope.getCampaignPath($rootScope.roleName,value.lineItemList.deliveryStatus,value.propsalId,value.lineItemList.id);
		});
		$scope.newProposalsBackup = $filter('orderBy')($scope.proposalsBackup, $scope.proposalSortBy.value, $scope.proposalOrderBy.value);
		$scope.newProposals = $scope.newProposalsBackup.slice(0, $scope.noOfProposalsPerPage);;
		$scope.totalProposal = $scope.newProposals.length;
	    $scope.currentPage = 1;
	    $scope.entryLimit = $scope.noOfProposalsPerPage;
	    $scope.filteredItems = $scope.proposalsBackup.length;
	    
	};

	
    $scope.sortByKey = function(array, key, order) {
	    return array.sort(function(a, b) {
	        var x = angular.lowercase(a[key]); var y = angular.lowercase(b[key]);
	        if(order == 'Desc'){
	        	return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	        } else {
	        	 return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	        }
	       
	    });
	};

	
	$scope.setPage = function(page){
		var currentPage = page -1; 
		var startVal = currentPage*$scope.noOfProposalsPerPage;
		var endVal = startVal + $scope.noOfProposalsPerPage;
		$scope.newProposals = $scope.newProposalsBackup.slice(startVal, endVal);;
	};
	
	$scope.getPath = function(roleName,status,id)
	{
		var linkPath = '#/campaigns/proposal-line-item/'+id;
		if(roleName=='PLANNER'){
			if(status!='Pending' && status!='Review')
				linkPath = '#/campaigns/proposal-line-item-view/'+id;
		}
		
		return linkPath;
				
	}
	
	//create-line-item/propID-6-li-5
	$scope.getCampaignPath = function(roleName,status,propsalId,id)
	{
		var val = "propID-"+propsalId + "-li-"+ id;
		var encodedString = Base64.encode(val);
		var linkPath = '#/campaigns/create-line-item/'+encodedString;
		if(roleName=='PLANNER'){
			if(status!='Pending' && status!='Review')
				linkPath = '#/campaigns/create-line-item/'+encodedString;
		}
		
		return linkPath;
				
	}
	
});
