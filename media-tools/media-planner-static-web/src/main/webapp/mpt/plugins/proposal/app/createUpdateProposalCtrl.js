/**
 * createUpdateProposalCtrl is a controller for proposal's create and update functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */

app.controller('createUpdateProposalCtrl', function ($scope, $location, $rootScope, $routeParams, Data, cssInjector,$http) { 
	
	// Add required css file
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	
	// Add proposal property file to load static data.
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	// Add proposals message property file to load static messages
	$scope.getProposalMessageProperties = function (){
		$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
			var propertyMessage = {};
			$scope.propertyMessage = response.data;
	      });
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
	
	// call message property file.
	$scope.getProposalMessageProperties();
	
	// Implement date picker on requested on field
	$('#requestedOn').datetimepicker({
		changeMonth: true,
		changeYear: true/*,
		timeFormat: "hh:mm tt"*/
	});
	
	// Implement date picker on due on field
	$('#dueOn').datetimepicker({
		changeMonth: true,
	    changeYear: true/*,
	    timeFormat: "hh:mm tt"*/
	});
	
	// Implement date picker on start date field
	$('#startDate').datetimepicker({
		changeMonth: true,
	    changeYear: true/*,
	    timeFormat: "hh:mm tt"*/
	});
	
	// Implement date picker on end date field
	$('#endDate').datetimepicker({
		changeMonth: true,
	    changeYear: true/*,
	    timeFormat: "hh:mm tt"*/
	});
    
	// initialize default date and time to star date, requested on and due on in case on creating a new proposal.
	if($routeParams.id == 0 || $routeParams.id ==  undefined) {
		setTimeout( function() {
			var currentDate = new Date();
			var lastMinOfCurrentDate = currentDate.getMonth()+'/'+currentDate.getDate()+'/'+currentDate.getYear()+' 23:59';
			$('#startDate').datetimepicker("setDate", new Date() );
			$('#requestedOn').datetimepicker("setDate",new Date());
			$('#requestedOn').datetimepicker("option","minDate",new Date());
			
			//$('#dueOn').datetimepicker("setDate", new Date().addDays(1));
			$('#dueOn').datetimepicker("setDate", lastMinOfCurrentDate);
		}, 500);
	}
	
	// Meta data for account manager listing
	$scope.accountManagerList = [
       { value: 'jason holder', label: 'Jason Holder'},
       { value: 'ricky martin', label: 'Ricky Martin'},
       { value: 'tom carey', label: 'Tom Carey'}
    ];
	
	// Meta data for sales category listing
	$scope.salesCategoryList = [
        { value: 'Life Style', label: 'Life Style'},
        { value: 'Sports', label: 'Sports'},
        { value: 'Technology ', label: 'Technology '}
    ];
	
	// Meta data for proposal currency listing
	$scope.proposalCurrencyList = [
       	{ value: 'AUD', label: 'AUD'},
       	{ value: 'CAD', label: 'CAD'},
       	{ value: 'CHF', label: 'CHF'},
       	{ value: 'EUR', label: 'EUR'},
        { value: 'GBP', label: 'GBP'},
        { value: 'HKD', label: 'HKD'},
        { value: 'INR', label: 'INR'},
        { value: 'JPY', label: 'JPY'},
        { value: 'USD', label: 'USD'}
   ];
	
	// Make proposal tab selected
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
    };
	
    // Set calender's min and max date.
	$scope.$watch("requestedOn", function(newVal, oldVal) {
		if($scope.requestedOn !=null && $scope.requestedOn != ""){
			setTimeout(function(){
				if($scope.dueOn !=null && $scope.dueOn != ""){
					$('#dueOn').datetimepicker( "option", "minDate", new Date($scope.requestedOn));
				}
				//$('#startDate').datetimepicker( "option", "minDate", new Date($scope.requestedOn)); // don't remove 
			},100);
		}else{
			setTimeout(function(){$('#dueOn').datetimepicker( "option", "minDate", null)},100);
		}
	});
	
	// Set calender's min and max date.
	$scope.$watch("dueOn", function(newVal, oldVal) {
		if($scope.dueOn != null && $scope.dueOn != ""){
			//setTimeout(function(){$('#requestedOn').datetimepicker( "option", "maxDate", new Date($scope.dueOn))},100);
		}else{
			setTimeout(function(){$('#requestedOn').datetimepicker( "option", "maxDate", null)},100);
		}
	});
	
	// Set calender's min and max date.
	$scope.setEndDate = function(self) {
		$('#endDate').datetimepicker( "option", "minDate", new Date(self.startDate));
	};
	
	// Set calender's min and max date.
	$scope.setStartDate = function(self) {
		$('#startDate').datetimepicker( "option", "maxDate", new Date(self.endDate));
		if($scope.dueOn !=null && $scope.dueOn != ""){
			$('#dueOn').datetimepicker( "option", "maxDate", new Date(self.endDate));
		}
	};
	
	
	$scope.checkErrors= false;
	$scope.proposals = {};
	
	  // Save Proposal Button. Check validation in the Proposal form. 
	  //if all validation passes correctly save this proposal and return success message otherwise return error message 
	  $scope.createProposal = function() {
		  $scope.isStartDateLessThnReuestedOn = false;
		  $scope.isEndDateLessThnStartDate = false;
		  $scope.isDueOnGreaterThnEndDate = false;
		  $scope.isDueOnLessThnRequestedOn = false;
		  $scope.isDueOnGreaterThnStartDate = false;
		  $scope.isReuestedOnInFuture = false;
		  $scope.isAdvertiserNameOrAgencyName = false;
		  $scope.isAgencyMarginGreaterThanLimit = false;
		  $scope.isAgencyMarginLessThanZero = false;
		  $scope.checkErrors = true;
		  $scope.disableButton=false;
		  var flag = false;
		  $scope.$broadcast('show-errors-check-validity');
		 if($scope.createUpdateProposalorm.$error.required != undefined && $scope.createUpdateProposalorm.$error.required.length > 0){
			 flag = true;
		 } 			
		 if ($scope.createUpdateProposalorm.$invalid ){ 
			 flag = true;
		 }	
		 
		 if(new Date().getTime()  < new Date($scope.requestedOn).getTime() ){
			$scope.isReuestedOnInFuture = true;
			flag = true;
		 }
		 if(new Date($scope.startDate).getTime()  < new Date($scope.requestedOn).getTime() ){
			$scope.isStartDateLessThnReuestedOn = true;
			flag = true;
		 }
		 		  
		 if(!($scope.endDate == undefined || $scope.endDate == "") && (new Date($scope.endDate).getTime()  < new Date($scope.startDate).getTime()) ){
				$scope.isEndDateLessThnStartDate = true;
				flag = true;
		 }
		 
		 if(($scope.agencyName == undefined || $scope.agencyName == "") && ($scope.advertiserName == undefined || $scope.advertiserName == "") ){
			 $scope.isAdvertiserNameOrAgencyName = true;
				flag = true;
		 }
		 
		 if(!($scope.agencyMargin == undefined || $scope.agencyMargin == "")){
			 if($scope.agencyMargin<=0){
				$scope.isAgencyMarginLessThanZero = true;
				flag = true;
			 }else if($scope.agencyMargin>100){
				$scope.isAgencyMarginGreaterThanLimit = true;
				flag = true;
			 }
		 }
		 
		 if(!($scope.dueOn == "" || $scope.dueOn == undefined)) {
			 if(!($scope.endDate == undefined || $scope.endDate == "") && (new Date($scope.endDate).getTime() < new Date($scope.dueOn).getTime()) ) {
					$scope.isDueOnGreaterThnEndDate = true;
					flag = true;
			 } else if(new Date($scope.dueOn).getTime()  < new Date($scope.requestedOn).getTime()) {
				 $scope.isDueOnLessThnRequestedOn = true;
				flag = true;
			 } else if( new Date($scope.dueOn).getTime()  > new Date($scope.startDate).getTime()) {
				 $scope.isDueOnGreaterThnStartDate = true;
				 flag = true;
			 }
		 }
		
		
		 if(flag) {
			 return; 
		 }else{
			 $scope.disableButton=true;
		 }
			
			
//		  $scope.dueOn=$scope.dueOn;
//		  if($scope.dueOn != null && $scope.dueOn != ""){
//			  $scope.dueOn = new Date($scope.dueOn).getTime();
//	        }
		  var proposal_id = $routeParams.id;
	    $scope.inserted = {
	      id:  proposal_id,
	      proposalName:  $scope.proposalName,
	      compaignName:  $scope.compaignName,
	      advertiserName: $scope.advertiserName,
	      accountManager:  $scope.accountManager,
	      agencyMargin:  $scope.agencyMargin,
	      agencyName:  $scope.agencyName,
	      salesCategory:  $scope.salesCategory,
	      requestedOn: new Date($scope.requestedOn).getTime(),
	      dueOn: new Date($scope.dueOn).getTime(),
	      //dueOn: $scope.dueOn,
	      startDate: new Date($scope.startDate).getTime(),
		  endDate: new Date($scope.endDate).getTime(),
		  lastProposedDate: new Date($scope.lastProposedDate).getTime(),
		  proposalCurrency:  $scope.proposalCurrency,
		  grossorNet:  $scope.grossorNet,
		  budget:  $scope.budget,
	      priority:  $scope.priority,
	      conversionRate:  $scope.conversionRate,
		  custom1:  $scope.custom1,
	      //status: $scope.status,
	    };
	    
		  if(proposal_id > 0){
			  Data.put('proposals',$scope.inserted).success(function(results){
				results.status = 'success';
    	        results.message = $scope.propertyMessage.proposalSaved;
    	        Data.toast(results);
				$location.path('/proposal/proposal-detail-'+proposal_id);
		    }).error(function(results){
    	        results.status = 'error';
		    	results.message = $scope.propertyMessage.rendomError;
    	        Data.toast(results);
		    });
			  
		  }else{
		    Data.post('proposals', $scope.inserted).success(function(results){
		    	results.status = 'success';
    	        results.message = $scope.propertyMessage.proposalSaved;
    	        Data.toast(results);
    	        $location.path('/proposal/proposal-detail-'+results.id);
		    	//$location.path('/proposal/proposal-detail-'+results.data.id);
		    }).error(function(results){
		    	results.status = 'error';
		    	results.message = $scope.propertyMessage.rendomError;
    	        Data.toast(results);
		    });
		  }
	  };
	  
	  // Cancel Button. If you creating new proposal  then cancel button return proposal listing page. 
	  //if you updating any proposal then cancel button return proposal detail page
	  $scope.cancelProposal = function() {
		  if(proposal_id > 0){
			  $location.path('/proposal/proposal-detail-'+proposal_id);
		  } else {
			  $location.path('/proposal');
		  }
		
	  }
	 //Edit proposal populating data
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
		        $('#requestedOn').datetimepicker("setDate", new Date($scope.proposalData.requestedOn));
		        $('#dueOn').datetimepicker("setDate", $scope.proposalData.dueOn);
		        $('#startDate').datetimepicker("setDate", new Date($scope.proposalData.startDate) );
		        $('#endDate').datetimepicker("setDate", new Date($scope.proposalData.endDate) );
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
