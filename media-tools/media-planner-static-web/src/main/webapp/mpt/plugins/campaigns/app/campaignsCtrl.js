var _URL = window.URL || window.webkitURL;
app.controller('campaignsCtrl', function ($scope, $location, $rootScope, Data, cssInjector,$filter,$http,$modal) { 
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	$scope.assetModel  = {};
	$rootScope.isActive = function(viewLocation) { 
        return viewLocation === $location.path();
    };
    
    $rootScope.isSubMenueActive = function(path)
    {
    	var flag = false;
    	if($scope.selectedTab=='Order' && $scope.subSelectedTab==path)
    		flag = true;
    	    	
    	return flag;
    }
   
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
	                   { value: 'user.firstName', label: 'Assigned To'},
	                  /* { value: 'budget', label: 'Budget'},*/
	                   { value: 'endDatetime', label: 'End Date'},
	                   { value: 'proposalName', label: 'Name'},
	                   { value: 'id', label: 'Order ID'},
	                   { value: 'startDatetime', label: 'Start Date'},
	                   { value: 'salesCategory', label: 'Sales Category'},
	                   { value: 'lineItemList.deliveryStatus', label: 'Status'}
	                  ];
	
	$scope.proposalOrderByOptions = [
	         	                   { value: 'false', label: 'Asc'},
	         	                   { value: 'true', label: 'Desc'}
	         	                  ];
	
	$scope.adUnitFilterOptions = [{ value: 'Leaderboard', label: 'Leaderboard'},
	                              { value: 'Rectangle', label: 'Rectangle'}
	                             ];
	
	
	$scope.contentTargetingFilterOptions = [{ value: 'FacebookHomepage', label: 'Facebook Homepage'},
	                                        { value: 'AmazonHomepage', label: 'Amazon Homepage'}
	                                       ];
	
	$scope.statusFilterOptions = [
									{ value: 'Pending', label: 'Pending'},
									{ value: 'Proposed', label: 'Proposed'},
									{ value: 'Rejected', label: 'Rejected'},
									{ value: 'Review', label: 'Review'},
									{ value: 'Signed', label: 'Signed'},
									{ value: 'Sold', label: 'Sold'}

								 ];
	
	$scope.salesCategoryFilterOptions = [{ value: 'Books', label: 'Books'},
	                                        { value: 'Fashion', label: 'Fashion'}
    									];
	
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
	
	$scope.proposalSortBy = $scope.proposalSortByOptions[0];
	$scope.proposalOrderBy = $scope.proposalOrderByOptions[0];
	$scope.noOfProposalsPerPage = 10;
	$scope.proposals = {};
	$scope.proposalsBackup = {};
	$scope.selectedTab = '';
		
	Data.get('proposals?status=Signed').then(function(data){
        $scope.proposalsBackup = data.data;
        $scope.sortProposal();
        //$scope.selectedTab = 'Order';
        //$scope.subSelectedTab = 'all';
    });
    
	
	
	$scope.subSelectedTab = 'all';
	
	$scope.setOrderStatus = function(status){
		$scope.selectedTab = 'Order';
		switch(status)
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
		
		if(status=='Signed'){
			Data.get('proposals?status=Signed').then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}else if(status=='MyOrders'){
			Data.get('proposals?status=Signed&userId='+$rootScope.userId).then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}
		else{
			Data.get('proposals?status=Signed&deliveryStatus='+status).then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}
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
	
	
	$scope.newProposals=[];
	$scope.newProposalsBackup = [];
	$scope.sortProposal = function() {
		var tempData = angular.copy($scope.proposalsBackup);
		tempData.forEach(function(value,i){
			$scope.proposalsBackup[i].startDatetime = isNaN(value.startDate)? $scope.proposalsBackup[i].startDatetime : value.startDate;
			$scope.proposalsBackup[i].startDate = String(new Date(value.startDate)).substring(0,21);
			$scope.proposalsBackup[i].endDatetime = isNaN(value.endDate)? $scope.proposalsBackup[i].endDatetime : value.endDate;
			$scope.proposalsBackup[i].endDate = String(new Date(value.endDate)).substring(0,21);
			$scope.proposalsBackup[i].linkPath = $scope.getPath($rootScope.roleName,value.status,value.id);
		});
		$scope.newProposalsBackup = $filter('orderBy')($scope.proposalsBackup, $scope.proposalSortBy.value, $scope.proposalOrderBy.value);
		$scope.newProposals = $scope.newProposalsBackup.slice(0, $scope.noOfProposalsPerPage);;
		$scope.totalProposal = $scope.newProposals.length;
	    $scope.currentPage = 1;
	    $scope.entryLimit = $scope.noOfProposalsPerPage;
	    $scope.filteredItems = $scope.proposalsBackup.length;
	};
	
	$scope.setPage = function(page){
		var currentPage = page -1; 
		var startVal = currentPage*$scope.noOfProposalsPerPage;
		var endVal = startVal + $scope.noOfProposalsPerPage;
		$scope.newProposals = $scope.newProposalsBackup.slice(startVal, endVal);;
	};
	
	$scope.applyFilter = function(){
		var parm = ''
			if($scope.statusFilterOption != undefined && $scope.statusFilterOption.value != undefined ){
				parm = 'status=' + $scope.statusFilterOption.value
			}
			if($scope.startDateFilter != '' && $scope.startDateFilter != undefined){
				if(parm != ''){
					parm = parm + '&';
				}
				parm = parm + 'startDate=' +  $scope.startDateFilter;
			}
			if($scope.endDateFilter != '' && $scope.endDateFilter != undefined){
				if(parm != ''){
					parm = parm + '&';
				}
				parm = parm + 'endDate=' + $scope.endDateFilter;
			}
			
		if(parm==''){
			$scope.resetFilter();
		}
		else{
			var url = 'proposals?'+parm; 
			
			Data.get(url).then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });	
			
		}
		
	};
	
	$scope.resetFilter = function(){
		$scope.statusFilterOption='';
		$scope.startDateFilter='';
		$scope.endDateFilter='';
		Data.get('proposals').then(function(data){
	        $scope.proposalsBackup = data.data;
	        $scope.sortProposal();
	    });
		
	}
	
	$scope.getMyProposals = function(self){
		if($scope.fetchMyProposal){
			Data.get('proposals?status=Signed').then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}
		else{
			Data.get('proposals?status=Signed&userId='+$rootScope.userId).then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}
	}
	
	$scope.getPath = function(roleName,status,id)
	{
		var linkPath = '#/campaigns/proposal-line-item/'+id;
		if(roleName=='PLANNER'){
			if(status!='Pending' && status!='Review')
				linkPath = '#/campaigns/proposal-line-item-view/'+id;
		}
		
		return linkPath;
				
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
	
	$scope.open = function (size,modalTemplate,id) {
			$('.chooseImage').css('display','none');
			var obj = [];
			var modalInstance;
			if(id == ""){
			    modalInstance = $modal.open({
			      templateUrl: modalTemplate,
			      controller: 'assetsCtrl',
			      size: size,
			      closable: false,
			      resolve: {
			        template: function () {
			          return modalTemplate;
			        },
			        assetData: function(){
			        	return obj;
			        }
			      }
			    });
			    
			    modalInstance.result.then(function () {}, function () {
			    });
			}else if(id != ""){
				obj =  $scope.creativeLst;
				modalInstance = $modal.open({
				      templateUrl: modalTemplate,
				      controller: 'assetsCtrl',
				      size: size,
				      closable: false,
				      resolve: {
				        template: function () {
				          return modalTemplate;
				        },
				        assetData: function(){
				        	return obj;
				        }
				      }
				    });
				}
		};
	
});
