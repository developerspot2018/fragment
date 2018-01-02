/**
 * orderViewCtrl is a controller for Show proposal Details who's status is sold.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */

app.controller('orderViewCtrl', function ($scope, $location, $rootScope, $routeParams, Data, cssInjector,$http) { 
	
cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	
	// Add campaigns property file to load static data.
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
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