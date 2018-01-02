/**
 * rateCardCtrl is a controller for all rate related functionality including new discound rule implementation.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */
app.controller('rateCardCtrl', function ($scope, $location, $rootScope, Data, cssInjector,$filter,$http) { 
	
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
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
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
		if(val=='proposal/ratecard')
			flag = true;
		return flag;
	};
    
    $scope.subSelectedTab = 'rates';
    $scope.selectedTab = '';
    
    // returning all product list
    $scope.productList = [];
    Data.get('products').success(function(data){
    	$scope.productList = data.content;
    }).error(function(data){
    	
    })
    
    // returns sales targets on product drop down change
    $scope.rate = {};
    $scope.rate.product;
    $scope.rate.budget;
    $scope.va1;
	$scope.getSalestargets = function () {
    	var id = $scope.rate.product;
		Data.get('products/'+id+'/salestargets').success(function(data) {
			$scope.salesTargetList = data;
			$scope.sortByKey($scope.salesTargetList,'' ,'Asc');
			
		});
	};
	
	// sorting function
	$scope.sortByKey = function(array, key, order) {
	    return array.sort(function(a, b) {
	        var x = angular.lowercase(a.name);
	        var y = angular.lowercase(b.name);
	        if(order == 'Desc'){
	        	return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	        } else {
	        	 return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	        }
	       
	    });
	};
	
	
	// Calender code
	$scope.seasonalDiscountList = [{
				    					budget:'',
				    					startDate: new Date(''),
				    					endDate: new Date(''),
				    					startDateOpen:false,
				    					endDateOpen:false,
				    					discount:''
			  						}
			  					];
		  
		 
		  
		  // Disable weekend selection
		  $scope.disabled = function(date, mode) {
		    return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
		  };

		  $scope.dateOptions = {
		    showWeeks: false,
		    startingDay: 1
		  };
		  
		  $scope.timeOptions = {
		    readonlyInput: true,
		    showMeridian: false
		  };
		  
		  $scope.openStartCalendar = function(e, index) {
		      e.preventDefault();
		      e.stopPropagation();
		      
		      $scope.seasonalDiscountList[index].startDateOpen = true;
		  };
		  
		  $scope.openEndCalendar = function(e, index) {
		      e.preventDefault();
		      e.stopPropagation();
		      
		      $scope.seasonalDiscountList[index].endDateOpen = true;
		  };
		  
		  $scope.addDiscount = function(){
			  $scope.seasonalDiscountList.push({
													budget:'',
													startDate: new Date(''),
													endDate: new Date(''),
													startDateOpen:false,
													endDateOpen:false,
													discount:''
												});
		  }
		  
		  $scope.removeDiscount = function($index){
			  $scope.seasonalDiscountList.pop($index);
		  }
		  
		  // watch date4 and date5 to calculate difference
		  /*$scope.$watch(function() {
		    return $scope.seasonalDiscountList;
		  }, function() {
		    if ($scope.dates.date4 && $scope.dates.date5) {
		      var diff = $scope.dates.date4.getTime() - $scope.dates.date5.getTime();
		      $scope.dayRange = Math.round(Math.abs(diff/(1000*60*60*24)))
		    } else {
		      $scope.dayRange = 'n/a';
		    }
		  }, true);*/
		  
		  // Get all target category
		  Data.get('targetcategory').then(function(result){
		      	$scope.targetTypeOptions=result.data;
		  });
		  
		  $scope.getElements=function(){
		   		 Data.get('targetcategory/'+ $scope.targetTypeOption.id).then(function(result){
		   		    	//$scope.elementArray = result.data.values;
		   		    	
						$scope.elemntLst = result.data.values;
						$scope.selectedList = $scope.selElmnList;
						$scope.selectedList.forEach(function(selectedValue,i){
							$scope.elemntLst.forEach(function(value,j){
								if(selectedValue.id == value.id){
									value.ticked = true;
								}
							})
							selectedValue.ticked = true;
						})
		   		    	

		   		    	 if($scope.targetTypeOption.name != 'Income' ){
		   		    	  		 $scope.elemntLst.sort(function(a, b) {
		   		    		        var x = angular.lowercase(a.value); 
		   		    		        var y = angular.lowercase(b.value);
		   		    		        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		   		    		        		    		       
		   		    		    });
		   		    	 }
		   		    	 $scope.element='undefined';
		   		 });
		   	 };
		   	$scope.moveToAllProposal=function(){
				 $location.path("proposal");
			};
	
});

