/**
 *  campaignsCtrl is a controller for order listing functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */

var _URL = window.URL || window.webkitURL;
app.controller('campaignsCtrl', function ($scope, $location, $rootScope, Data, cssInjector,$filter,$http,$modal,$routeParams) { 
	
	// Add required css file
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	
	// Add campaigns property file to load static data.
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	$scope.assetModel  = {};
	
	// Make campaigns tab selected
	$rootScope.isActive = function(viewLocation) { 
        //return viewLocation === $location.path();
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
    
    $scope.selectedTab = '';
	$scope.subSelectedTab = 'all';
    $scope.recordPerPage = ['5','10','20'];
    $scope.selectedProposalStatus = 'All';
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

    	  /*if(!$(".campaigns .panel-group .panel:first .panel-collapse.collapse").hasClass("in"))
	         {
	            $(".campaigns .panel-group .panel:first .panel-heading + div:first").addClass("in");
	            $(".campaigns .panel-group .panel:first .panel-heading + div:first").css("height", "auto");
	            alert("open");
	         }else{
	             
	            $(".campaigns .panel-group .panel:first .panel-heading + div:first").removeClass("in");
	            $(".campaigns .panel-group .panel:first .panel-heading + div:first").css("height", "0");
	            alert("close");
	         }
*/
        /* setTimeout(function(){

	 	     

	     }, 3000);
*/
    	  //CODE TO OPEN ACCORDIAN
    	  $(".panel-group .panel").each(function(){
             
		        console.log("===INDEX====");
		        //alert("INDEX");
		    /*  if(!$(".panel-group .panel:first .panel-collapse.collapse").hasClass("in"))
		        {
		            $(".panel-heading + div:first").addClass("in");
		            $(".panel-heading + div:first").css("height", "auto");
		            console.log("VAALL"+val);
		        }else{
		             
		            $(".panel-heading + div:first").removeClass("in");
		            $(".panel-heading + div:first").css("height", "0");
		            console.log("VAAL-COLLAPSE"+val);
		        }*/
		    });
    });
		
    
    // Sorting options on the drop down
	$scope.proposalSortByOptions = [
       { value: 'advertiserName', label: 'Advertiser'},
       { value: 'user.firstName', label: 'Assigned To'},
       { value: 'budget', label: 'Budget'},
       { value: 'endDate', label: 'End Date'},
       { value: 'proposalName', label: 'Name'},
       { value: 'id', label: 'Order ID'},
       { value: 'startDate', label: 'Start Date'},
       { value: 'salesCategory', label: 'Sales Category'}
   ];
	
	// Sorting options by asc and desc
	$scope.proposalOrderByOptions = [
       { value: 'asc', label: 'Asc'},
       { value: 'desc', label: 'Desc'}
      ];
	
	// Filters by Targeting
	$scope.contentTargetingFilterOptions = [
	    { value: 'FacebookHomepage', label: 'Facebook Homepage'},
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
	
	
	// make lef navigation heading selected
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
	
	
	
//	$scope.proposalSortBy = $scope.proposalSortByOptions[0];
//	$scope.proposalOrderBy = $scope.proposalOrderByOptions[0];
	$scope.noOfProposalsPerPage = 10;
	
	/**
	 * Set all grid parameters   
	 * @param - page number 
	 * @output –  NA 
	 */
    $scope.setOrderGridParam = function (currentRecordPerPage){
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
	
	
	$scope.proposals = {};
	$scope.proposalsBackup = {};
	
	
//	// loads orders on the page
//	Data.get('proposals?status=Signed').then(function(data){
//        $scope.proposalsBackup = data.data.content;
//        $scope.sortProposal();
//       
//    });
//    
	
	
	
	
	// get Orders  by status
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
		 
		$scope.applyFilter(status);
		$scope.selectedProposalStatus =status;
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
		$scope.sortBy = $scope.proposalSortBy.value;
		$scope.order = $scope.proposalOrderBy.value;
		$scope.applyFilter($scope.subSelectedTab);
	}
	
//	$scope.setPage = function(page){
//		var currentPage = page -1; 
//		var startVal = currentPage*$scope.noOfProposalsPerPage;
//		var endVal = startVal + $scope.noOfProposalsPerPage;
//		$scope.newProposals = $scope.newProposalsBackup.slice(startVal, endVal);;
//	};
	
	
	$scope.filterByProposalID = function(){
		if($scope.proposalId != '' && $scope.proposalId != undefined ){
			$scope.propId = $scope.proposalId
		}
		$scope.getProposalByIDWithStatusSigned($scope.propId);
	};
	
	$scope.getProposalByIDWithStatusSigned = function(id){
		$scope.newProposals.length = 0;
		$scope.newProposals = [];
		Data.get('proposals/'+id).then (function (data) {
			//if(data.data!="" && data.data.status=='Signed'){
			if(data.data!="" && data.data.deliveryStatus==$scope.selectedProposalStatus){
				data.data.startDate = String(new Date(data.data.startDate)).substring(0,21);
				data.data.endDate = String(new Date(data.data.endDate)).substring(0,21);
				data.data.linkPath = $scope.getPath($rootScope.roleName,data.data.status,data.data.id);
				$scope.newProposals.push(data.data);
			}else if(data.data!="" && $scope.selectedProposalStatus=='Signed'){
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
	// fech records by filter conditions
	$scope.getProposalByID = function(id){
		$scope.newProposals.length = 0;
		$scope.newProposals = [];
		Data.get('proposals/'+id).then (function (data) {
			data.data.startDate = String(new Date(data.data.startDate)).substring(0,21);
			data.data.endDate = String(new Date(data.data.endDate)).substring(0,21);
			data.data.linkPath = $scope.getPath($rootScope.roleName,data.data.status,data.data.id);
			$scope.newProposals.push(data.data);
		});
	};
	
	
	
	// fech records by filter conditions
	$scope.applyFilter = function(status){
		$scope.status = '';
		$scope.clientId = '';
		if(angular.uppercase(status) == 'MYORDERS' || angular.uppercase(status) == 'MY') {
			$scope.clientId = $rootScope.userId;
		} else if (angular.uppercase(status) == 'SIGNED'|| angular.uppercase(status) == 'ALL') {
			$scope.status = '';
		}else {
			$scope.status = status;
		}	
		
		parm = 'status=Signed&sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber
		if($scope.proposalNameFilter != '' && $scope.proposalNameFilter != undefined ){
			parm = '&proposalName=' + $scope.proposalNameFilter
		}
		if($scope.statusFilterOption != undefined && $scope.statusFilterOption.value != undefined ){
		  	$scope.status = $scope.statusFilterOption.value;
		}
		if($scope.status != undefined && $scope.status != '' ){
			parm = parm + '&deliveryStatus=' + $scope.status;
		}
		
		
		if($scope.startDateFilter != '' && $scope.startDateFilter != undefined){
			parm = parm + '&startDate=' +  $scope.startDateFilter;
		}
		if($scope.endDateFilter != '' && $scope.endDateFilter != undefined){
			parm = parm + '&endDate=' + $scope.endDateFilter;
		}
		    
		if($scope.proposalId != '' && $scope.proposalId != undefined ){
			parm = parm + '&id=' + $scope.proposalId
		}
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
		
		if($scope.proposalBudget != '' && $scope.proposalBudget != undefined ){
			parm = parm + '&budget=' + $scope.proposalBudget
		}
			
		$scope.url = parm;
			
		$scope.getProposals();
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
		$scope.proposalBudget='';
		$scope.applyFilter($scope.subSelectedTab);
	}
	

	
	$scope.getPath = function(roleName,status,id){
		var linkPath = '#/orders/orders-detail-'+id;
		return linkPath;
	}
	
	 $scope.isOpen = function(val){


	 


	 	   /*setTimeout(function(){
	 	   	if(!$(".panel-heading + div:first").hasClass("in"))
	 	   	{
	 	   		$(".panel-heading + div:first").addClass("in");
		        $(".panel-heading + div:first").css("height", "auto");
                console.log("VAALL"+val);
	 	   	}else{
                 
                $(".panel-heading + div:first").removeClass("in");
		        $(".panel-heading + div:first").css("height", "0");
                console.log("VAAL-COLLAPSE"+val);

	 	   	}
           
		 },3000);*/
         
            
           

			var path = $location.path();
			var flag = false;
			if(path=='/orders/create-order'&& val=='Order'){
				flag = true;
				$scope.subSelectedTab = '';
			}
			if(path=='/orders' && val=='Order')
				flag = true;
			if(path=='/campaigns' && val=='Campaigns')
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
		
		
		//create order
		
		
		$scope.getCampaignsMessageProperties = function (){
			$http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
				var propertyMessage = {};
				$scope.propertyMessage = response.data;
		      });
		};
		
		// call message property file.
		$scope.getCampaignsMessageProperties();
		
		
		var order_id = $routeParams.id;
		
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
				$('#requestedOn').datetimepicker("setDate", new Date() );
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
		
		$scope.cancelOrder = function() {
			  if(order_id > 0){
				  $location.path('/orders/orders-detail-'+order_id);
			  } else {
				  $location.path('/orders');
			  }
			
		  }
		
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
		
		
		
		 $scope.createOrder = function() {
			  $scope.isStartDateLessThnReuestedOn = false;
			  $scope.isEndDateLessThnStartDate = false;
			  $scope.isDueOnGreaterThnEndDate = false;
			  $scope.isDueOnLessThnRequestedOn = false;
			  $scope.isDueOnGreaterThnStartDate = false;
			  $scope.isReuestedOnInFuture = false;
			  $scope.isAdvertiserNameOrAgencyName = false;
			  $scope.checkErrors = true;
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
			 }
				
				
			  $scope.dueOn=$scope.dueOn;
			  if($scope.dueOn != null && $scope.dueOn != ""){
				  $scope.dueOn = new Date($scope.dueOn).getTime();
		        }
			var order_id = $routeParams.id;
		    $scope.inserted = {
		      id:  order_id,
		      proposalName:  $scope.proposalName,
		      compaignName:  $scope.compaignName,
		      advertiserName: $scope.advertiserName,
		      accountManager:  $scope.accountManager,
		      agencyMargin:  $scope.agencyMargin,
		      agencyName:  $scope.agencyName,
		      salesCategory:  $scope.salesCategory,
		      requestedOn: new Date($scope.requestedOn).getTime(),
		      dueOn: $scope.dueOn,
		      startDate: new Date($scope.startDate).getTime(),
			  endDate: new Date($scope.endDate).getTime(),
			  lastProposedDate: new Date($scope.lastProposedDate).getTime(),
			  proposalCurrency:  $scope.proposalCurrency,
			  grossorNet:  $scope.grossorNet,
			  budget:  $scope.budget,
		      priority:  $scope.priority,
		      conversionRate:  $scope.conversionRate,
			  custom1:  $scope.custom1,
		      /*status: 'inhouse',*/
		    };
			  if(order_id > 0){
				  Data.put('proposals',$scope.inserted).success(function(results){
					results.status = 'success';
	    	        results.message = $scope.propertyMessage.proposalSaved;
	    	        Data.toast(results);
					$location.path('/orders/orders-detail-'+order_id);
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
	    	        $location.path('/orders/orders-detail-'+results.id);
			    	//$location.path('/proposal/proposal-detail-'+results.data.id);
			    }).error(function(results){
			    	results.status = 'error';
			    	results.message = $scope.propertyMessage.rendomError;
	    	        Data.toast(results);
			    });
			  }
		  };
	
});
