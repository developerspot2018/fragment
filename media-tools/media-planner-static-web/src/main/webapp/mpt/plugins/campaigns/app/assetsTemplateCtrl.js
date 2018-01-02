app.filter('startLineItemFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});
app.controller('assetsTemplateCtrl', function ($routeParams,$scope,$rootScope, $location, $modal, Data, $http,$q, cssInjector, $location,fileReader, ModalService, Validation,lineItemService,creativeService)
{
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
    
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
	
    };
    
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
    
	$scope.subSelectedTab = 'assets';
	
	$scope.assetList =  [];
	$scope.assetTemplateList = {};
	Data.get("asset").then(function(data) {
		$scope.assetTemplateList = data.data;
		
		 $scope.totalItems = $scope.assetTemplateList.length;
	        $scope.currentPage = 1; // current page

	        $scope.entryLimit = 10; // max no of items to display in a page
	        $scope.filteredItems = $scope.assetTemplateList.length;
	        // Initially for no filter
			/* $scope.predicate='id'; */
	         $scope.sort_by('id');
	});
	
	$scope.sort_by = function (predicate) {
    	// console.log(predicate);
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
    	
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
				Data.get('asset/'+id).then(function(data){
					$scope.creativeLst = data.data;	
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
				});
			}
	};
	
	$scope.$on("getCreatedData",function (event,data) {
		Data.get("asset").then(function(data) {
			$scope.assetTemplateList = data.data;
			 $scope.totalItems = $scope.assetTemplateList.length;
		        $scope.currentPage = 1; // current page

		        $scope.entryLimit = 10; // max no of items to display in a page
		        $scope.filteredItems = $scope.assetTemplateList.length;
		        // Initially for no filter
				 $scope.predicate='id'; 
		         $scope.sort_by('id');
		});
	});		

	
});