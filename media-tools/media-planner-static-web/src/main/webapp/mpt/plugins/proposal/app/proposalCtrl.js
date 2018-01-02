/**
 * proposalCtrl is a controller for listing page functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */
app.controller('proposalCtrl', function ($scope, $location, $rootScope, Data, cssInjector,$filter,$http) { 
	
	// Add required css file
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	
	// Add proposal property file to load static data.
	$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	// Make proposal tab selected
	$rootScope.isActive = function(viewLocation) { 
        return viewLocation === $location.path();
    };
    $scope.isCollapsed = false;
    
    // Make left menu selected
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
    
    $scope.subSelectedTab = 'all';
    $scope.selectedTab = '';
    
    $scope.selectedProposalStatus = 'All';
    $scope.recordPerPage = ['5','10','20'];
    

    // Sorting options on the drop down
	$scope.proposalSortByOptions = [
	                   { value: 'advertiserName', label: 'Advertiser'},
	                   { value: 'user.firstName', label: 'Assigned To'},
	                   { value: 'budget', label: 'Budget'},
	                   { value: 'endDate', label: 'End Date'},
	                   { value: 'proposalName', label: 'Name'},
	                   { value: 'id', label: 'Proposal ID'},
	                   { value: 'startDate', label: 'Start Date'},
	                   { value: 'salesCategory', label: 'Sales Category'}
	                  ];
	// Sorting options by asc and desc
	$scope.proposalOrderByOptions = [
	         	                   { value: 'asc', label: 'Asc'},
	         	                   { value: 'desc', label: 'Desc'}
	         	                  ];
	
	// Filters by Targeting
	$scope.contentTargetingFilterOptions = [{ value: 'FacebookHomepage', label: 'Facebook Homepage'},
	                                        { value: 'AmazonHomepage', label: 'Amazon Homepage'}
	                                       ];
	// Filters by status
	$scope.statusFilterOptions = [
									{ value: 'Pending', label: 'Pending'},
									{ value: 'Proposed', label: 'Proposed'},
									{ value: 'Rejected', label: 'Rejected'},
									{ value: 'Review', label: 'Review'},
									{ value: 'Signed', label: 'Signed'},
									{ value: 'Sold', label: 'Sold'}

								 ];

	
	// Meta data for sales category filter
	$scope.salesCategoryListOptions = [
	                            { value: 'Life Style', label: 'Life Style'},
	                            { value: 'Sports', label: 'Sports'},
	                            { value: 'Technology ', label: 'Technology '}
                       ];
	// Meta data for assigned To Filter
	$scope.assignedToOptions = [
	                            { value: 'admin@star.com', label: 'Mramalti Prab'},
	                            { value: 'mp1@star.com', label: 'Ethan Rovelstor'},
	                            { value: 'mp2@star.com', label: 'Loe Snaketzaie'}
       ];
    
    
    /**
	 * Set all grid parameters   
	 * @param - page number 
	 * @output –  NA 
	 */
    $scope.setProposalGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.name = '' ;
		$scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
		$scope.proposalSortBy = $scope.proposalSortByOptions[5];
		$scope.proposalOrderBy = $scope.proposalOrderByOptions[1];
    }
    
    //console.log("=========PAGE LOADED=========");
    $scope.openAccordian = function(){

    	
    }
    
    $scope.setProposalGridParam($scope.recordPerPage[0]);
    
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
		$scope.setProposalGridParam($scope.selectedNumber);
		$scope.applyFilter($scope.subSelectedTab)
	}
	
    /**
	 * Reset all the grid parameters and get all the proposal based on grid parameters 
	 * @param - NA 
	 * @output – array of proposal 
	 */
	$scope.refreshProposalGrid = function () {
		
		$scope.proposalNameFilter="";
		$scope.startDateFilter="";
		$scope.endDateFilter="";
		$scope.proposalId="";
		$scope.advertiserName="";
		$scope.budgetMin="";
		$scope.budgetMax="";
		$scope.salesCategoryListOption=$scope.salesCategoryListOptions[-1];
		$scope.assignedToOption=$scope.assignedToOptions[-1];
		
		$scope.setProposalGridParam($scope.recordPerPage[0]);
		$scope.applyFilter($scope.subSelectedTab);
		
		
	}
	
    
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
		 
		$scope.applyFilter(status);
		$scope.selectedProposalStatus =status;
	}
    	
    // Implement date picker 
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
		
    
	
	$scope.noOfProposalsPerPage = 10;
	$scope.proposals = {};
	$scope.proposalsBackup = {};
    
	// sort by keys 
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
		} else if (angular.uppercase(status) != 'ALL') {
			$scope.status = status;
		}	
		
		parm = 'sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber
		if($scope.proposalNameFilter != '' && $scope.proposalNameFilter != undefined ){
			parm = '&proposalName=' + $scope.proposalNameFilter
		}
		if($scope.statusFilterOption != undefined && $scope.statusFilterOption.value != undefined ){
		  	$scope.status = $scope.statusFilterOption.value;
		}
		if($scope.status != undefined && $scope.status != '' ){
			parm = parm + '&status=' + $scope.status;
		}
		
		
		if($scope.startDateFilter != '' && $scope.startDateFilter != undefined){
			parm = parm + '&startDate=' +  $scope.startDateFilter;
		}
		if($scope.endDateFilter != '' && $scope.endDateFilter != undefined){
			parm = parm + '&endDate=' + $scope.endDateFilter;
		}
		    
//		if($scope.proposalId != '' && $scope.proposalId != undefined ){
//			parm = parm + '&id=' + $scope.proposalId
//		}
		if($scope.advertiserName != '' && $scope.advertiserName != undefined ){
			parm = parm + '&advertiserName=' + $scope.advertiserName
		}
			
		if($scope.salesCategoryListOption != undefined && $scope.salesCategoryListOption.value != undefined ){
			parm = parm + '&salesCategory=' + $scope.salesCategoryListOption.value
		}
			
		if($scope.assignedToOption != undefined && $scope.assignedToOption.value != undefined ){
			$scope.clientId = $scope.assignedToOption.value
		}
		if($scope.clientId != undefined && $scope.clientId != '' ){
			parm = parm + '&userId=' + $scope.clientId;
		}
		
		if($scope.budgetMin != '' && $scope.budgetMin != undefined ){
			parm = parm + '&budgetMin=' + $scope.budgetMin
		}
		if($scope.budgetMax != '' && $scope.budgetMax != undefined ){
			parm = parm + '&budgetMax=' + $scope.budgetMax
		}
			
		$scope.url = parm;
			
		$scope.getProposals();
	};
	
	
	// fech records by proposalID
	$scope.filterByProposalID = function(){
		if($scope.proposalId != '' && $scope.proposalId != undefined ){
			$scope.propId = $scope.proposalId
		}
		$scope.getProposalByID($scope.propId);
	};
	
	
	// fech records by filter conditions
	$scope.getProposalByID = function(id){
		$scope.newProposals.length = 0;
		$scope.newProposals = [];
		Data.get('proposals/'+id).then (function (data) {
			if(data.data!="" && data.data.status==$scope.selectedProposalStatus){
				data.data.startDate = String(new Date(data.data.startDate)).substring(0,21);
				data.data.endDate = String(new Date(data.data.endDate)).substring(0,21);
				data.data.linkPath = $scope.getPath($rootScope.roleName,data.data.status,data.data.id);
				$scope.newProposals.push(data.data);
			}else if(data.data!="" && $scope.selectedProposalStatus=='All'){
				data.data.startDate = String(new Date(data.data.startDate)).substring(0,21);
				data.data.endDate = String(new Date(data.data.endDate)).substring(0,21);
				data.data.linkPath = $scope.getPath($rootScope.roleName,data.data.status,data.data.id);
				$scope.newProposals.push(data.data);
			}else if(data.data!="" && $scope.selectedProposalStatus=='MyOrders' && data.data.user.clientId==$rootScope.userId){
				data.data.startDate = String(new Date(data.data.startDate)).substring(0,21);
				data.data.endDate = String(new Date(data.data.endDate)).substring(0,21);
				data.data.linkPath = $scope.getPath($rootScope.roleName,data.data.status,data.data.id);
				$scope.newProposals.push(data.data);
			}
		});
	};
	
	
	
	/**
	 * Get all the proposal based on grid parameters   
	 * @param - NA 
	 * @output – array of proposal 
	 */
	$scope.getProposals = function () {
		Data.get('proposals?'+$scope.url).then ( function (data) {
			data.data.content.forEach(function(value,i){
				value.startDatetime = isNaN(value.startDate)? value.startDatetime : value.startDate;
    			value.startDate = String(new Date(value.startDate)).substring(0,21);
    			value.endDatetime = isNaN(value.endDate)? value.endDatetime : value.endDate;
    			value.endDate = String(new Date(value.endDate)).substring(0,21);
    			value.linkPath = $scope.getPath($rootScope.roleName,value.status,value.id);
    		});
    	    $scope.newProposals = data.data.content;
    	    $scope.totalNoOfItems = data.data.totalElements;
		});
    };

    $scope.applyFilter('');

	// reset filter fields and load proposals
	$scope.resetFilter = function(){
		$scope.proposalNameFilter='';
		$scope.statusFilterOption='';
		$scope.startDateFilter='';
		$scope.endDateFilter='';
		$scope.proposalId='';
		$scope.advertiserName='';
		$scope.salesCategoryListOption='';
		$scope.assignedToOption='';
		$scope.budgetMin='';
		$scope.budgetMax='';
		$scope.applyFilter($scope.subSelectedTab);
	}

	$scope.getPath = function(roleName,status,id){
		$rootScope.lefNavActive = $scope.subSelectedTab;
		var linkPath = '#/proposal/proposal-detail-'+id;
		return linkPath;
	}
	$scope.moveToRatecard=function(path){
		 $location.path(path);
	};
	$scope.moveToAllProposal=function(){
		 $location.path("proposal");
	};
});
