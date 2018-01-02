/**
 *  attributeCtrl is a used for create, update and delete an attribute. besides of this 
 *  perform sorting, pagination and searching functionality in a grid 
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: admin
 */

app.filter('startaAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
		 start = +start; // parse to int
		 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('attributeCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector, ModalService, Validation) {
	
	cssInjector.add("plugins/admin/css/admin-style.css");
	
	/**
	 * Set property object   
	 * @param - url of js file 
	 * @output � return array of property 
	*/
	$http.get('plugins/admin/js/attribute-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
    });

	$scope.attributeFlag = true;
	
	/**
	 * Show confirmation modal box When delete an attribute   
	 * @param - attribute object 
	 * @output � show success massage when delete successfully otherwise show error massage. 
	 */
	$scope.show = function(variable) { 
		ModalService.showModal({ 
			templateUrl: 'modal.html',
			controller: "ModalController"
		}).then(function(modal) {
			modal.element.modal();
		  	modal.close.then(function(result) {
		  		if (result === 'Yes') {
		  			Data.delete('attributes/'+variable.attribute.id).success(function(result) {
		  				var result = {status: 'success',message:$scope.property.attributeDeleted};
				        Data.toast(result);
				        removeCurrentAttribute(variable.attribute);
		  			}).error( function (result) {
				    	 if(result.errorCode=='409')
				    		 $scope.showEditModal("This element is in use and cannot be deleted.");
				    	 else{
				    		 result.status = 'error';
						     result.message = $scope.property.rendomError;
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
		var ModalTemplate = alertBox(msg);
		ModalService.showModal({
		  	template: ModalTemplate,
		    controller: "ModalController"
		}).then( function (modal) {
			modal.element.modal();
		    modal.close.then(function(result) {

		    });
		});
	};

	$scope.attributes = {};
	
	/**
	 * Show alert box when required fields are missing   
	 * @param - massage (which want to be displayed) 
	 * @output � display alert box  
	 */
	$scope.isActive = function (viewLocation) {
        if(viewLocation === '/admin') {
        	return true;
        }
    };

    /**
	 * Show admin tab as active 
	 * @param - location value 
	 * @output � true or false  
	 */
    $rootScope.isActive = function (viewLocation) {
        if(viewLocation === '/admin') {
        	return true;
        }
    };

    $scope.types = [
                       {value: 'Creative', text: 'Creative'},
                       {value: 'Product', text: 'Product'}
                   ];

    $scope.recordPerPage = ['10','20','30'];
    
    $scope.filterLst = [{value:'id', label: '-- select --'}, {value:'name', label: 'Name'},{value:'type', label: 'Type'}];
    
    /**
	 * Set all grid parameters   
	 * @param - page number 
	 * @output �  NA 
	 */
    $scope.setAttributeGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.selectedFilterAttribute =  $scope.filterLst[0];
        $scope.name = '' ;
		$scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
		$scope.filterAttribute = "";
    }
    
    $scope.setAttributeGridParam($scope.recordPerPage[0]);
    
    /**
	 * Get all the attribute based on grid parameters   
	 * @param - NA 
	 * @output � array of attribute 
	 */
    $scope.getAttributes = function () {
    	var url = '/attributes?name='+ $scope.name + '&type=' + $scope.type + '&sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber ;
    	Data.get(url).then ( function (data) {
    	        $scope.attributes = data.data.content;
    	        $scope.totalNoOfItems = data.data.totalElements;
    	    });
    };

    $scope.getAttributes();
    
    /**
	 * Set page number of grid and get all the attribute based on grid parameters  
	 * @param - page number 
	 * @output � array of attribute 
	 */
    $scope.setPage = function(page){
    	$scope.currentPage = page;
		$scope.getAttributes();
	};
    
    /**
	 * Set number of records per page of grid and get all the attribute based on grid parameters  
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.setRecordPerPage= function () {
		$scope.setAttributeGridParam($scope.selectedNumber);
		$scope.getAttributes();
	}
	
    /**
	 * Reset all the grid parameters and get all the attribute based on grid parameters 
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.refreshAttributeGrid = function () {
		$scope.setAttributeGridParam($scope.recordPerPage[0]);
		$scope.getAttributes();
	}
	
    /**
	 * Set grid sort by and order by parameters and get all the attribute based on grid parameters 
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.sort_by = function (predicate) {
		if ($scope.attributeFlag) {
			$scope.reverse = !$scope.reverse;
			$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
			$scope.sortBy = predicate;
			$scope.getAttributes();
		} 
	};

    /**
	 * Set filter value and get all the attribute based on grid parameters 
	 * @param - NA 
	 * @output � array of attribute 
	 */
	$scope.getFilterAttribute = function () {
		if($scope.filterAttribute != '' && $scope.selectedFilterAttribute.label != '-- select --') {
			$scope.name = $scope.selectedFilterAttribute.label == 'Name' ? $scope.filterAttribute : ''  ;
			$scope.type = $scope.selectedFilterAttribute.label == 'Type' ? $scope.filterAttribute : ''  ;
			$scope.getAttributes();
		}	
	}
	
	$scope.sort_by_id = function (predicate) {
			 $scope.predicate = predicate;
			 $scope.reverse = true;
	};

    /**
	 * Save the attribute data after validating.
	 * @param - data (attribute data), attribute (attribute data)
	 * @output � attribute object and show error or success message. 
	 */
    $scope.saveAttribute = function (data, attribute) {
    	// $scope.Attribute not updated yet
        angular.extend(data, {id: attribute.id});
        var validationResult = Validation.validationCheck("attribute",data);
        if (validationResult.value){
        	$scope.showEditModal(validationResult.error);
        	rowform.$show();
        } else { 
			Data.post('attributes', data).success( function (result) {
				var index =$scope.attributes.indexOf(attribute);
		        $scope.attributes[index] = result;
		        $scope.getAttributes(0);
		        result.status = 'success';
		        result.message = $scope.property.attributeSaved;
		        Data.toast(result);
		    }).error( function (result) {
		    	$scope.getAttributes();
		    	if(result.errorCode=='412') {
              		$scope.showEditModal("Name already in use. Please enter a different name");
    			}
		    	else{
		    		result.status = 'error';
			        result.message = $scope.property.rendomError;
			        Data.toast(result);
		    	}
		    });
			
			$scope.inserted = {
		      id: -1,
		      name: '',
		      type: '',
		      value: '',
		      description: ''
		    };
			$scope.attributeFlag = true;
		}
    };

    /**
	 * Remove the attribute data and show modal dialog
	 * @param - variable (attribute object)
	 * @output � show error or success message. 
	 */
	$scope.removeAttribute = function (variable) {
		$scope.show(variable);
	};

    /**
	 * Add attribute data in $scope.attributes array and set flag value
	 * @param - NA
	 * @output � NA 
	 */
	$scope.addAttribute = function() {
		if( $scope.attributeFlag) {
			$scope.sort_by_id('id');
			$scope.inserted = {
				      name: '',
				      type: '',
				      value: '',
				      description: ''
				    };
					$scope.currentPage = 1;
				    $scope.attributes.push($scope.inserted);
				    $scope.totalItems = $scope.attributes.length;
				    $scope.filteredItems = $scope.attributes.length; 
	   		};
	   		$scope.attributeFlag = false;
	};

	/**
	 * Remove newly added attribute from $scope.attributes array or cancel the in-line edit form and set flag value
	 * @param - product, index, productform
	 * @output � NA 
	 */
	$scope.cancel= function (product, index, productform) {
	  if (product.name==="") {
		$scope.attributes.splice($scope.attributes.length-1, 1);
	  }else {
		productform.$cancel()
	  }
		$scope.attributeFlag = true;
	};
	
	/**
	 * Removes current attribute from grid
	 * @param - NA
	 * @output � NA 
	 */
	function removeCurrentAttribute(attribute) {
		var index =$scope.attributes.indexOf(attribute);
		$scope.attributes.splice(index,1);
	};

	/**
	 * Set text area size
	 * @param - NA
	 * @output � NA 
	 */	  
	$scope.bindTextareaAuto = function() {
		if($scope.attributeFlag){
			$(".editable-textarea").find("textarea").on("keydown", function() {
				$scope.textAreaAdjust(this);
			});
			$scope.attributeFlag = false;
		}
	}

	/**
	 * Set attribute flag
	 * @param - NA
	 * @output � true or false 
	 */
	$scope.getAttributeFlag = function () {
			  setTimeout(function(){ 
				  $scope.textAreaAdjust($(".editable-controls").find("textarea")[0]);
			  }, 500);
			  return $scope.attributeFlag;
	}
	
	/**
	 * Set text area height
	 * @param - o (element id)
	 * @output � NA 
	 */
	$scope.textAreaAdjust = function(o) {
		o.style.height = (o.scrollHeight)+"px";
	}
});