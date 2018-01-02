/**
 * proposalViewCtrl is a controller for Show proposal Details who's status is sold.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */

app.controller('proposalViewCtrl', function ($scope, $location, $rootScope, $routeParams, Data, cssInjector,$http) { 
	
	// Add required css file
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	
	// Add proposal property file to load static data.
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });

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
	
	// Add proposals message property file to load static messages
	$scope.getProposalMessageProperties = function (){
		$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
			var propertyMessage = {};
			$scope.propertyMessage = response.data;
	      });
	};
	
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
    };
	
	// call message property file.
	$scope.getProposalMessageProperties();
	//View proposal populating data
	  var proposal_id = $routeParams.id;
	  if(proposal_id > 0){
		  Data.get('proposals/'+proposal_id).then(function(data){
		        $scope.proposalData = data.data;
		        var dueDate= $scope.proposalData.dueOn
		        if(dueDate != null && dueDate != ""){
		        	$scope.proposalData.dueOn = new Date(dueDate);
		        }else{
		        	$scope.proposalData.dueOn="";
		        }
				$scope.proposalId=$scope.proposalData.id;
		        $scope.proposalName=$scope.proposalData.proposalName;
		        $scope.compaignName=$scope.proposalData.compaignName;
		        $scope.advertiserName=$scope.proposalData.advertiserName;
		        $scope.accountManager=$scope.proposalData.accountManager;
		        $scope.selectedAccountManager=$scope.proposalData.accountManager;
		        $scope.agencyMargin=$scope.proposalData.agencyMargin;
		        $scope.agencyName=$scope.proposalData.agencyName;
		        $scope.salesCategory=$scope.proposalData.salesCategory;
		        $scope.startDate = String(new Date($scope.proposalData.startDate)).substring(0,21);
		    	$scope.endDate  = String(new Date($scope.proposalData.endDate)).substring(0,21);
		    	$scope.requestedOn  = String(new Date($scope.proposalData.requestedOn)).substring(0,21);
		    	$scope.dueOn  = String(new Date($scope.proposalData.dueOn)).substring(0,21);
		        $scope.proposalCurrency=$scope.proposalData.proposalCurrency;
		        $scope.grossorNet=$scope.proposalData.grossorNet;
		        $scope.budget=$scope.proposalData.budget;
		        $scope.priority=$scope.proposalData.priority;
		        $scope.conversionRate=$scope.proposalData.conversionRate;
		        $scope.status=$scope.proposalData.status;
				$scope.custom1=$scope.proposalData.custom1;
		    });
	  }
});