app.filter('startaSegmentFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
		 start = +start; // parse to int
		 return input.slice(start);
	 }
	 return [];
	 }
});

/*
 * 
 * */
app.controller('salesTargetsCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector, ModalService, Validation) { 
	
	cssInjector.add("plugins/admin/css/admin-style.css");
	
	/*
	 * 
	 * */
	$http.get('plugins/admin/js/sales-targets-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;    
    });
	
	$scope.salestargetFlag = true;
	
	/*
	 * 
	 * */
	$scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/admin/salestargets') > -1){
        	return true;
        }
    };

    /*
     * 
     * */
    $rootScope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };
    
    $scope.recordPerPage = ['10','20','30'];
    
    $scope.filterSegmentsLst = [{value:'id', label: '-- select --'}, {value:'name', label: 'Name'}];
    
    /*
     * 
     * */
    $scope.setSegmentGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.selectedFilterSegments =  $scope.filterSegmentsLst[0];
        $scope.name = '' ;
		$scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
		$scope.filterSegments = "";
    }
    
    $scope.setSegmentGridParam($scope.recordPerPage[0]);
    
	$scope.segments = {};
    
	/*
     * 
     * */
	$scope.getSegments = function () {
    	var url = '/salestargets?name='+ $scope.name + '&type=' + $scope.type + '&sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber ;
    	Data.get(url).then ( function (data) {
    	        $scope.segments = data.data.content;
    	        $scope.totalNoOfItems = data.data.totalElements;
    	    });  
    };
    
    $scope.getSegments();
    
    /*
     * 
     * */
    $scope.setPage = function(page){
    	$scope.currentPage = page;
		$scope.getSegments();
	};
    
	 /*
     * 
     * */
	$scope.setRecordPerPage = function () {
		$scope.setSegmentGridParam($scope.selectedNumber);
		$scope.getSegments();
	}
	
	 /*
     * 
     * */
	$scope.refreshSegmentGrid = function () {
		$scope.setSegmentGridParam($scope.recordPerPage[0]);
		$scope.getSegments();
	}
	
	 /*
     * 
     * */
	$scope.sort_by = function (predicate) {
		if ($scope.salestargetFlag) {
			$scope.reverse = !$scope.reverse;
			$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
			$scope.sortBy = predicate;
			$scope.getSegments();
		} 
	};
	
	 /*
     * 
     * */
    $scope.getFilterSegments = function () {
		if($scope.filterSegments != '' && $scope.selectedFilterSegments.label != '-- select --') {
			$scope.name = $scope.selectedFilterSegments.label == 'Name' ? $scope.filterSegments : ''  ;
			$scope.type = $scope.selectedFilterSegments.label == 'Type' ? $scope.filterSegments : ''  ;
			$scope.getSegments();
		}	
	}
	
    /*
     * 
     * */
	$scope.sort_by_id = function(predicate) {
			 $scope.predicate = predicate;
			 $scope.reverse = true;
	};
    
	/*
     * 
     * */
    $scope.saveSegment = function(data, segment) {
        angular.extend(data, {id: segment.id});
        var validationResult = Validation.validationCheck("salesTargets",data);
        if(validationResult.value){
        	$scope.salesTargetsWarnigModal(validationResult.error);
        	rowform.$show();
        }
		else{
			Data.post('salestargets', data).success(function(result){
		      	var index =$scope.segments.indexOf(segment); 
		        $scope.segments[index] = result;
		        $scope.salestargetFlag = true;
		        $scope.getSegments(0);
		        result.status = 'success';
		        result.message = $scope.property.segmentSaved;
		        Data.toast(result);
			}).error(function(result){
				$scope.getSegments(0);
				$scope.salestargetFlag = true;
				if(result.errorCode=='412') {
              		$scope.salesTargetsWarnigModal("Name already in use. Please enter a different name");
    			}else{
		    		result.status = 'error';
			        result.message = $scope.property.rendomError;
			        Data.toast(result);
		    	}
			});
			
			
			$scope.inserted = {
		    		id:-1,
		      name: '',
		      url: '',
		      description: '',
		      custom1: '',
		      custom2:''
		    };
			}
    };
    
    /*
     * 
     * */
	$scope.removeSegment = function(variable,index) {
		  $scope.salesTargetsDeleteWarnigModal(variable);
	};
	
	/*
     * 
     * */
	$scope.cancel=function(segment,index,productform){
			if (segment.name==="") {
				$scope.segments.splice($scope.segments.length-1, 1);
			}else {
				productform.$cancel()
			}
			$scope.salestargetFlag = true;
	};
	
	/*
     * 
     * */
	$scope.addSegments = function() {
		if($scope.salestargetFlag){
	    	$scope.sort_by_id('id');
	    	$scope.inserted = {
	    		      name: '',
	    		      url: '',
	    		      description: '',
	    		      custom1: '',
	    		      custom2:''
	    		    };
	    		    $scope.currentPage = 1;
	    		    $scope.segments.push($scope.inserted);
	    		    $scope.totalItems = $scope.segments.length;
	    		    $scope.filteredItems = $scope.segments.length; 
	    		    $scope.salestargetFlag = false;
	    }
	   
	};
	
	/*
	 * 
	 * 
	 * */  
	function removeCurrentSegments(segments){
		var index =$scope.segments.indexOf(segments); 
			$scope.segments.splice(index,1);
	};
	
	/*
	 * 
	 * */
	$scope.salesTargetsDeleteWarnigModal = function(variable) {
		ModalService.showModal({
			templateUrl: 'modal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {
		    	if (result === 'Yes') {
		    		Data.delete('salestargets/'+variable.segment.id).success(function(result){
		    			removeCurrentSegments(variable.segment);
					}).error( function (result) {
						if(result.errorCode=='409')
							$scope.salesTargetsWarnigModal("This element is in use and cannot be deleted.");
					    });
		    	}
		    });
		 });
	};

	/*
	 * 
	 * */
	function alertBox(msg){
			var modalBody = '<div class="admin modal fade">'+
								'<div class="modal-dialog dialog-size-position">'+
									' <div class="modal-content">'+
									'  <div class="modal-header dialog-header-warnig">'+
									'    <button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
									'  <span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
									'<span class="modal_title">Warning'+
									'</span>'+
									'</div>'+
									'<div class="modal-body">'+
									'   <p>'+msg+'</p>'+
										'</div>'+
										'<div class="modal-footer modal-cuntom-footer">'+
									'   <button type="button" ng-click="close(\'editModal\')" class="btn btn-primary" data-dismiss="modal">Ok</button>'+
									'</div>'+
									'</div>'+
									'</div>'+
									'</div>'	;
			return modalBody;
	};
	
	/*
	 * 
	 * */
	$scope.salesTargetsWarnigModal = function(msg) {
		var modalTemplate = alertBox(msg);
			ModalService.showModal({
		  	template : modalTemplate,
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {

		    });
		   });
	};
	
	/*
	 * 
	 * 
	 * */
	$scope.bindTextareaAuto = function(){
		$(".editable-textarea").find("textarea").on("keydown", function(){
			$scope.textAreaAdjust(this);
		});
		$scope.salestargetFlag = false;
	}
	
	/*
	 * 
	 * */
	$scope.textAreaAdjust = function(o) {
		o.style.height = (o.scrollHeight)+"px";
	}
	
	/*
	 * 
	 * */
	$scope.getSalestargetFlag  = function() {
		return $scope.salestargetFlag;
	}
			
});
