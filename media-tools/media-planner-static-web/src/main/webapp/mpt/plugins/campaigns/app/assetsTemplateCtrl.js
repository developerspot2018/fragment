// filter functionality
app.filter('startAssetFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});
app.controller('assetsTemplateCtrl', function ($routeParams,$scope,$rootScope, $location, $modal, Data, $http,$q, cssInjector, $location,fileReader, ModalService, Validation,lineItemService,creativeService,$window)
{
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('orders') > -1){
        	return true; 
        }
		return false;
    };
    $http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
    
    $http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
    
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
	
    };
    
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
    
    $scope.isOpen = function(val)
	{
		
    	var path = $location.path();
		var flag = false;
		if(path=='/orders' && val=='Order')
			flag = true;
		if(path=='/campaigns' && val=='Campaigns')
			flag = true;
		if(path=='/campaigns/asset-template-list' && val=='Assets')
			flag = true;
		return flag;
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

	$scope.subSelectedTab = 'assets';
	
	$scope.assetList =  [];
	$scope.assetTemplateList = {};
	
	
	
	$scope.recordPerPage = ['10','20','30'];
    /**
	 * Set all grid parameters   
	 * @param - page number 
	 * @output �  NA 
	 */
    $scope.setAssetsGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.order = 'desc'
    	$scope.sortBy = 'id';
        $scope.assetName = "";
    }
    
    $scope.setAssetsGridParam($scope.recordPerPage[0]);
    
    
    $scope.getAssets = function () {
    	var url = 'assets?name='+ $scope.assetName +'&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber ;
    	Data.get(url).then ( function (data) {
    			$scope.assetTemplateList = data.data.content;
    	        $scope.totalNoOfItems = data.data.totalElements;
    	        for(var index in $scope.assetTemplateList){
        			$scope.assetTemplateList[index].assetType = ($scope.assetTemplateList[index].type).split('/')[0];
        			if($scope.assetTemplateList[index].assetType== 'video') {
        				$scope.assetTemplateList[index].imageWidth=$scope.assetTemplateList[index].videoResolution.split('X')[0];
        				$scope.assetTemplateList[index].imageHeight=$scope.assetTemplateList[index].videoResolution.split('X')[1];
        			}
        		}
    	    });
    };
	
    
//    Data.get("assets").then(function(data) {
//		$scope.assetTemplateList = data.data.content;
//		 $scope.totalItems = $scope.assetTemplateList.length;
//	        $scope.currentPage = 1; // current page
//            
//	        $scope.entryLimit = 10; // max no of items to display in a page
//	        $scope.filteredItems = $scope.assetTemplateList.length;
//	        // Initially for no filter
//			/* $scope.predicate='id'; */
//	         $scope.sort_by('id');
//	});
//    
    $scope.getAssets();
	

	
	/**
	 * Set page number of grid and get all the attribute based on grid parameters  
	 * @param - page number 
	 * @output � array of attribute 
	 */
    $scope.setPage = function(page){
    	$scope.currentPage = page;
		$scope.getAssets();
	};
    
    /**
	 * Set number of records per page of grid and get all the attribute based on grid parameters  
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.setRecordPerPage= function () {
		$scope.setAssetsGridParam($scope.selectedNumber);
		$scope.getAssets();
	}
	
    /**
	 * Reset all the grid parameters and get all the attribute based on grid parameters 
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.refreshAssetsGrid = function () {
		$scope.setAssetsGridParam($scope.recordPerPage[0]);
		$scope.getAssets();
	}
	
    /**
	 * Set grid sort by and order by parameters and get all the attribute based on grid parameters 
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.sort_by = function (predicate) {
			$scope.reverse = !$scope.reverse;
			$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
			$scope.sortBy = predicate;
			$scope.getAssets();
	};

	
	/**
	 * Set filter value and get all the attribute based on grid parameters 
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.getFilterAssets = function () {
		if($scope.filterAssets != '') {
			$scope.assetName = $scope.filterAssets;
			$scope.getAssets();
		}	
	}
	
	$scope.sort_by_id = function (predicate) {
			 $scope.predicate = predicate;
			 $scope.reverse = true;
	};
	
	
	
	
	
//	$scope.sort_by = function (predicate) {
//    	// console.log(predicate);
//			$scope.predicate = predicate;
//			$scope.reverse = !$scope.reverse;
//    	
//	};
	
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
				Data.get('assets/'+id).then(function(data){
					$scope.creativeLst = data.data;	
					$scope.creativeLst.assetType = (data.data.type).split('/')[0];
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
		Data.get("assets").then(function(data) {
			$scope.assetTemplateList = data.data.content;
			 $scope.totalItems = $scope.assetTemplateList.length;
		        $scope.currentPage = 1; // current page
		        $scope.entryLimit = 10; // max no of items to display in a page
		        $scope.filteredItems = $scope.assetTemplateList.length;
		        // Initially for no filter
				 $scope.predicate='id'; 
		         $scope.sort_by('id');
		});
	});		
	
  //delete assets
	function removeCurrentAttribute(attribute) {
		var index =$scope.assetTemplateList.indexOf(attribute);
		$scope.assetTemplateList.splice(index,1);
	};
	
   $scope.removeAssets= function(variable){
	   //alert($scope.propertyMessage.assetDeleteSuccessMessage);
	   $scope.show(variable);
   };
   $scope.show = function(variable) { 
		ModalService.showModal({ 
			templateUrl: 'modal.html',
			controller: "ModalController"
		}).then(function(modal) {
			modal.element.modal();
		  	modal.close.then(function(result) {
		  		if (result === 'Yes') {
		  			Data.delete('assets/'+variable.lineItem.id).success(function(result) {
		  				var result = {status: 'success',message:$scope.propertyMessage.assetDeleteSuccessMessage};
				        Data.toast(result);
				        removeCurrentAttribute(variable.lineItem);
		  			}).error( function (result) {
				    	 if(result.errorCode=='409')
				    		 $scope.showEditModal("This element is in use and cannot be deleted.");
				    	 else{
				    		 result.status = 'error';
						     result.message = $scope.propertyMessage.rendomError;
						     Data.toast(result);
				    	 }
				    });
		  		}
		  	});
		  });
	};
	/**
	 * Create template for alert box   
	 * @param - massage (which want to be displayed) 
	 * @output � template of modal box 
	 */
	function alertBox(msg) {
		var modalBody = '<div class="admin modal fade">'+
							'<div class="modal-dialog dialog-size-position">'+
								'<div class="modal-content">'+
									'<div class="modal-header dialog-header-warnig">'+
										'<button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
										'<span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
										'<span class="modal_title">Warning'+
										'</span>'+
									'</div>'+
									'<div class="modal-body">'+
										'<p>'+msg+'</p>'+
									'</div>'+
									'<div class="modal-footer modal-cuntom-footer">'+
										'<button type="button" ng-click="close(\'editModal\')" class="btn btn-primary" data-dismiss="modal">Ok</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'	;
				return modalBody;
	};
	
	/**
	 * Show alert box when required fields are missing   
	 * @param - massage (which want to be displayed) 
	 * @output � display alert box  
	 */
	$scope.showEditModal = function (msg) {
		/*var ModalTemplate = alertBox(msg);*/
		ModalService.showModal({
		  	template: ModalTemplate,
		    controller: "ModalController"
		}).then( function (modal) {
			modal.element.modal();
		    modal.close.then(function(result) {

		    });
		});
	};
});