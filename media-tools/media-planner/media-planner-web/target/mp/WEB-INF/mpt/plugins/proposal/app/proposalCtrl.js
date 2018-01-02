app.controller('proposalCtrl', function ($scope, $location, $rootScope, Data, cssInjector) { 
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	$rootScope.isActive = function(viewLocation) { 
        return viewLocation === $location.path();
    };
	$scope.proposalSortByOptions = [
	                   { value: 'proposalName', label: 'Name'},
	                   { value: 'id', label: 'Proposal Id'}
	                  ];
	
	$scope.proposalOrderByOptions = [
	         	                   { value: 'Asc', label: 'Asc'},
	         	                   { value: 'Desc', label: 'Desc'}
	         	                  ];
	
	$scope.adUnitFilterOptions = [{ value: 'Leaderboard', label: 'Leaderboard'},
	                              { value: 'Rectangle', label: 'Rectangle'}
	                             ];
	
	
	$scope.contentTargetingFilterOptions = [{ value: 'FacebookHomepage', label: 'Facebook Homepage'},
	                                        { value: 'AmazonHomepage', label: 'Amazon Homepage'}
	                                       ];
	
	$scope.statusFilterOptions = [{ value: 'Sold', label: 'Sold'},
                                  { value: 'Proposed', label: 'Proposed'}
								 ];
	
	$scope.salesCategoryFilterOptions = [{ value: 'Books', label: 'Books'},
	                                        { value: 'Fashion', label: 'Fashion'}
    									];
	
	
	$scope.noOfProposalsPerPage = 5;
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
	
	$scope.sortProposal = function() {
		 $scope.sortByKey($scope.proposalsBackup, $scope.proposalSortBy.value, $scope.proposalOrderBy.value);
		 $scope.proposals = $scope.proposalsBackup.slice(0, $scope.noOfProposalsPerPage);;
	     $scope.totalProposal = $scope.proposals.length;
	     $scope.currentPage = 1;
	     $scope.entryLimit = $scope.noOfProposalsPerPage;
	     $scope.filteredItems = $scope.proposalsBackup.length;
	};
	
	$scope.setPage = function(page){
		var currentPage = page -1; 
		var startVal = currentPage*$scope.noOfProposalsPerPage;
		var endVal = startVal + $scope.noOfProposalsPerPage;
		$scope.proposals = $scope.proposalsBackup.slice(startVal, endVal);;
	};
	
	$scope.applyFilter = function(){
		var adUnit = $scope.adUnitFilterOption.value;
		var contentTarget = $scope.contentTargetingFilterOption.value;
		var salesCat = $scope.salesCategoryFilterOption.value;
		var status = $scope.statusFilterOption.value;
		var startDate = $scope.startDate;
		var endDate = $scope.endDate;
		startDate = '12/12/14';
		endDate = '12/12/15';
		var url = 'proposals?adUnit='+ adUnit + '&contentTarget=' + contentTarget + '&salesCat=' + salesCat + "&status=" + status + "&startDate=" + startDate +"&endDate="+endDate;
		
		Data.get(url).then(function(data){
	        $scope.proposalsBackup = data.data;
	        $scope.sortProposal();
	    });
	};
	
	$scope.proposals = {};
	 // add Proposal
	  $scope.addProposal = function() {
		  console.log($scope.proposals);
		  //alert("test");
	    $scope.inserted = {
	      advertiserName: $scope.advertiserName,
	      newAdvertiserName: $scope.newAdvertiserName,
	      
	      compaignName:  $scope.compaignName,
	      assignedBy:  $scope.assignedBy,
	      
	      compaignObjective:  $scope.compaignObjective,
	      proposalCurrency:  $scope.proposalCurrency,
	      agencyMargin:  $scope.agencyMargin,
	      
	      reservationEmails:  $scope.reservationEmails,
	      agencyName:  $scope.agencyName,
	      grossorNet:  $scope.grossorNet,
	      proposalName:  $scope.proposalName,
	      priority:  $scope.priority,
	      accountManager:  $scope.accountManager,
	      clonedFrom:  $scope.clonedFrom,
	      conversionRate:  $scope.conversionRate,
	      budget:  $scope.budget,
	      custom1:  $scope.custom1,
	      custom2:  $scope.custom2,
	      custom3:  $scope.custom3,
	      custom4:  $scope.custom4,
	      
	    };
	    Data.post('proposals', $scope.inserted);
		$scope.clearProposalFields();
	  };
	  
	  $scope.clearProposalFields = function() {
		   $scope.advertiserName='';
		   $scope.newAdvertiserName='';
		   $scope.compaignName='';
		   $scope.assignedBy='';
		  $scope.compaignObjective='';
		  $scope.proposalCurrency='';
		  $scope.agencyMargin='';
		  $scope.reservationEmails='';
		  $scope.agencyName='';
		  $scope.grossorNet='';
		  $scope.proposalName='';
		  $scope.priority='';
		  $scope.accountManager='';
		  $scope.clonedFrom='';
		  $scope.conversionRate='';
		  $scope.budget='';
		  $scope.custom1='';
		  $scope.custom2='';
		  $scope.custom3='';
		  $scope.custom4='';
	  };
	
	
});
