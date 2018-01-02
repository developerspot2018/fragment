app.controller('orderCampaignsCtrl', function ($scope, $location, $rootScope, Data, cssInjector, $filter, $http,$q) { 
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	  
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
			$location.path('/orders');
		}
		if(heading=='Campaigns'){
			$location.path('/campaigns');
		}
		if(heading=='Assets'){
			$location.path('/campaigns/asset-template-list');
		}
	}
    
    $scope.isOpen = function(val)
	{
		var path = $location.path();
		var flag = false;
		if(path=='/orders' && val=='Order')
			flag = true;
		if(path=='/campaigns' && val=='Campaigns')
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
	                   { value: 'user.firstName', label: 'Assign To'},
	                   { value: 'orderName', label: 'Order Name'},
	                   { value: 'id', label: 'Campaign ID'},
	                   { value: 'deliveryStatus', label: 'Status'},
	                   { value: 'placeHolder', label: 'Campaign Name'},
	                   { value: 'deliveryPriority', label: 'Priority'},
	                   { value: 'startDate', label: 'Start Date'},
	                   { value: 'endDate', label: 'Flight End Date'}
	                  ];
	
	// Sorting options by asc and desc
	$scope.proposalOrderByOptions = [
	         	                   { value: 'asc', label: 'Asc'},
	         	                   { value: 'desc', label: 'Desc'}
	         	                  ];

	$scope.newProposals=[];
	$scope.newProposalsBackup = [];
	$scope.proposalsBackup = [];
	$scope.selectedTab = '';
	$scope.subSelectedTab = '';
	$scope.recordPerPage = ['5','10','20'];
	$scope.selectedProposalStatus = 'Signed';
	$scope.setOrderGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.name = '' ;
		$scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
		$scope.proposalSortBy = $scope.proposalSortByOptions[2];
		$scope.proposalOrderBy = $scope.proposalOrderByOptions[1];
    }
    
    
    
    $scope.setOrderGridParam($scope.recordPerPage[0]);
    
    /**
	 * Set page number of grid and get all the proposal based on grid parameters  
	 * @param - page number 
	 * @output – array of proposal 
	 */
    $scope.setPage = function(page){
    	$scope.currentPage = page;
    	$scope.applyFilter($scope.subSelectedTab)
	};
    
    /**
	 * Set number of records per page of grid and get all the proposal based on grid parameters  
	 * @param - NA 
	 * @output – array of proposal 
	 */
	$scope.setRecordPerPage= function () {
		$scope.setOrderGridParam($scope.selectedNumber);
		$scope.applyFilter($scope.subSelectedTab)
	}
	
    /**
	 * Reset all the grid parameters and get all the proposal based on grid parameters 
	 * @param - NA 
	 * @output – array of proposal 
	 */
	$scope.refreshOrderGrid = function () {
		
		$scope.proposalNameFilter="";
		$scope.startDateFilter="";
		$scope.endDateFilter="";
		$scope.proposalId="";
		$scope.advertiserName="";
		$scope.proposalBudget="";
		$scope.salesCategoryListOption=$scope.salesCategoryListOptions[-1];
		$scope.assignedToOption=$scope.assignedToOptions[-1];
		
		$scope.setOrderGridParam($scope.recordPerPage[0]);
		$scope.applyFilter($scope.subSelectedTab)
	}
	
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
		
		$scope.applyFilter(lineItemdeliveryStatus);
		$scope.selectedProposalStatus =lineItemdeliveryStatus;
	}
	
	
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
		$scope.sortProposal = function() {
			$scope.sortBy = $scope.proposalSortBy.value;
			$scope.order = $scope.proposalOrderBy.value;
			$scope.applyFilter($scope.subSelectedTab);
		}
	
	// fech records by filter conditions
	$scope.applyFilter = function(status){
		$scope.status = '';
		$scope.clientId = '';
		if(angular.uppercase(status) == 'MYORDERS' || angular.uppercase(status) == 'MY') {
			$scope.clientId = $rootScope.userId;
		}else if (angular.uppercase(status) == 'SIGNED'|| angular.uppercase(status) == 'ALL') {
			$scope.status = '';
		}else {
			$scope.status = status;
		}	
		
		parm = 'sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber
		if($scope.status != undefined && $scope.status != '' ){
			parm = parm + '&deliveryStatus=' + $scope.status;
		}
		if($scope.clientId != undefined && $scope.clientId != '' ){
			parm = parm + '&userId=' + $scope.clientId;
		}
		if($scope.campaignNameFilter != '' && $scope.campaignNameFilter != undefined ){
			parm = '&placeHolder=' + $scope.campaignNameFilter
		}
		
		if($scope.startDateFilter != '' && $scope.startDateFilter != undefined){
			parm = parm + '&startDate=' +  $scope.startDateFilter;
		}
		if($scope.endDateFilter != '' && $scope.endDateFilter != undefined){
			parm = parm + '&endDate=' + $scope.endDateFilter;
		}
		$scope.url = parm;
		$scope.getProposals();
	};
	
	/**
	 * Get all the campaigns based on grid parameters   
	 * @param - NA 
	 * @output – array of proposal 
	 */
	$scope.getProposals = function () {
		Data.get('proposals/lineitems?'+$scope.url).then ( function (data) {
			data.data.content.forEach(function(value,i){
					value.startDatetime = isNaN(value.startDate)? value.startDatetime : value.startDate;
					value.startDate = String(new Date(value.startDate)).substring(0,21);
					value.endDatetime = isNaN(value.endDate)? value.endDatetime : value.endDate;
					value.endDate = String(new Date(value.endDate)).substring(0,21);
					Data.get('line-items/'+value.id+'/proposals').then (function (result) {
						value.linkCampaignPath = $scope.getCampaignPath(value.id, result.data.id);
					});
			});
			
    	    $scope.newProposals = data.data.content;
    	    $scope.totalNoOfItems = data.data.totalElements;
		});
    };
	
	 $scope.applyFilter('');

	// reset filter fields and load proposals
	$scope.resetFilter = function(){
		$scope.campaignNameFilter='';
		$scope.startDateFilter='';
		$scope.endDateFilter='';
		$scope.campaignId='';
		$scope.applyFilter($scope.subSelectedTab);
	}
	
	$scope.getPath = function(roleName,status,id){
		var linkPath = '#/orders/orders-detail-'+id;
		return linkPath;
	}
	
	$scope.getCampaignPath = function(id,propsalId){
		var val = "propID-"+propsalId + "-li-"+ id;
		var encodedString = Base64.encode(val);
		var linkPath = '#/orders/orders-detail-'+propsalId+"/"+encodedString;
		return linkPath;
	}
	
	// fech records by proposalID
	$scope.filterByCampaignsId = function(){
		if($scope.campaignId != '' && $scope.campaignId != undefined ){
			$scope.campaignsId = $scope.campaignId
		}
		$scope.getCampaignsID($scope.campaignsId);
	};

	// fech records by filter conditions
	$scope.getCampaignsID = function(id){
		$scope.newProposals.length = 0;
		$scope.newProposals = [];
		Data.get('line-items/'+id).then(function(result){
			//if(result.data.id!="" && result.data.id!=undefined){
			if(result.data.id!="" && result.data.id!=undefined && result.data.deliveryStatus==$scope.selectedProposalStatus){
				Data.get('line-items/'+result.data.id+'/proposals').then (function (data) {
					result.data.startDate = String(new Date(result.data.startDate)).substring(0,21);
					result.data.endDate = String(new Date(result.data.endDate)).substring(0,21);
					result.data.linkCampaignPath = $scope.getCampaignPath(result.data.id, data.data.id);
					$scope.newProposals.push(result.data);
				});
			}else if(result.data.id!="" && result.data.id!=undefined && $scope.selectedProposalStatus=='Signed'){
				Data.get('line-items/'+result.data.id+'/proposals').then (function (data) {
					result.data.startDate = String(new Date(result.data.startDate)).substring(0,21);
					result.data.endDate = String(new Date(result.data.endDate)).substring(0,21);
					result.data.linkCampaignPath = $scope.getCampaignPath(result.data.id, data.data.id);
					$scope.newProposals.push(result.data);
				});
			}else if(result.data.id!="" && result.data.id!=undefined && $scope.selectedProposalStatus=='MyOrders' && result.data.user.clientId==$rootScope.userId){
				Data.get('line-items/'+result.data.id+'/proposals').then (function (data) {
					result.data.startDate = String(new Date(result.data.startDate)).substring(0,21);
					result.data.endDate = String(new Date(result.data.endDate)).substring(0,21);
					result.data.linkCampaignPath = $scope.getCampaignPath(result.data.id, data.data.id);
					$scope.newProposals.push(result.data);
				});
			}
			
		});
		
	};
	
});
