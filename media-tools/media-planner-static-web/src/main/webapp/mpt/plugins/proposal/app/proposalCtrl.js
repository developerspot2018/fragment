app.controller('proposalCtrl', function ($scope, $location, $rootScope, Data, cssInjector,$filter,$http) { 
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	$rootScope.isActive = function(viewLocation) { 
        return viewLocation === $location.path();
    };
    $scope.isCollapsed = false;
    
    
//    $scope.tab = 1;
//    
//    $scope.setTab = function (id) {
//    	$scope.tab = id;   
//    };
//    
//    $scope.isTab = function (id) {
//        return $scope.tab == id;
//    };
//    
//    $scope.section = 1;
//    
//    $scope.setSection = function (id) {
//    	$scope.section = id;   
//    };
//    
//    $scope.isSection = function (id) {
//        return $scope.section == id;
//    };
//    
    
    $rootScope.isSubMenueActive = function(path)
    {
    	var flag = false;
    	if($scope.selectedTab=='Proposal' && $scope.subSelectedTab==path)
    		flag = true;
    	    	
    	return flag;
    }
    $scope.subSelectedTab = 'all';
    $scope.selectedTab = '';
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
		if(status=='All'){
			Data.get('proposals').then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}else if(status=='MyOrders'){
			Data.get('proposals?userId='+$rootScope.userId).then(function(data){
				 $scope.proposalsBackup = data.data;
			     $scope.sortProposal();
		    });
		}
		else{
			Data.get('proposals?status='+status).then(function(data){
				 $scope.proposalsBackup = data.data;
			     $scope.sortProposal();
		    });
		}
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
    	    		/*$('#startDateFilter').datepicker("setDate", new Date());
    	    		$('#endDateFilter').datepicker("setDate", new Date());*/
    	    	},100);
    	   
    	  });
    	});
		
    
	$scope.proposalSortByOptions = [
	                   { value: 'advertiserName', label: 'Advertiser'},
	                   { value: 'firstName', label: 'Assigned To'},
	                   { value: 'budget', label: 'Budget'},
	                   { value: 'endDatetime', label: 'End Date'},
	                   { value: 'proposalName', label: 'Name'},
	                   { value: 'id', label: 'Proposal ID'},
	                   { value: 'startDatetime', label: 'Start Date'},
	                   { value: 'salesCategory', label: 'Sales Category'}
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
	
	$scope.proposalSortBy = $scope.proposalSortByOptions[0];
	$scope.proposalOrderBy = $scope.proposalOrderByOptions[0];
	$scope.noOfProposalsPerPage = 10;
	$scope.proposals = {};
	$scope.proposalsBackup = {};
	
	Data.get('proposals').then(function(data){
        $scope.proposalsBackup = data.data;
        $scope.sortProposal();
    });
    
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
		//var adUnit = ($scope.adUnitFilterOption == undefined) ? null : $scope.adUnitFilterOption.value;
		//var contentTarget =  ($scope.contentTargetingFilterOption == undefined) ? null : $scope.contentTargetingFilterOption.value;
		//var salesCat = ($scope.salesCategoryFilterOption == undefined) ? null : $scope.salesCategoryFilterOption.value;
		//var status =  ($scope.statusFilterOption== undefined) ? null : parm+'status='$scope.statusFilterOption.value;
		//var startDate = $scope.startDateFilter;
		//var endDate = $scope.endDateFilter;
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
			Data.get('proposals').then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}
		else{
			Data.get('proposals?userId='+$rootScope.userId).then(function(data){
		        $scope.proposalsBackup = data.data;
		        $scope.sortProposal();
		    });
		}
	}
	
	$scope.getPath = function(roleName,status,id)
	{
		var linkPath = '#/proposal/proposal-line-item/'+id;
		/*
		if(roleName=='PLANNER'){
			if(status=='Proposed' || status=='Review' || status=='Sold' || status=='Signed')
				linkPath = '#/proposal/proposal-line-item-view/'+id;
		}
		*/
		return linkPath;
				
	}
	
});
