app.filter('startCreativeFrom', function() {
	 return function(input, start) {
		 if(input && Object.keys(input).length>0) {
			 start = +start; // parse to int
			 return input.splice(start);
		 }
		 return [];
	 }
});

app.filter('startAttributeFrom', function() {
	 return function(input, start) {
		 if(input && Object.keys(input).length>0) {
			 start = +start; // parse to int
			 return input.splice(start);
		 }
		 return [];
	 }
});


app.controller('creativeCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector,$filter, ModalService, Validation) {
	cssInjector.add("plugins/admin/css/admin-style.css");
	$http.get('plugins/admin/js/creative-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;    
	});
	
	$scope.creatives = {};
	$scope.rowClicked = false;
	
	$scope.creativesFlag = true;
	$scope.creativesAttributeFlag  = true;
	
	
	$scope.types = [
	                {value: 'Expandable', text: 'Expandable'},
                    {value: 'Image', text: 'Image'},
	                {value: 'Rich Media', text: 'Rich Media'},
	                {value: 'Video', text: 'Video'},
                    {value: 'Video Interstitial', text: 'Video Interstitial'}
                ]; 
	
	$scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/admin/creative') > -1){
        	return true;
        }
    };
    
    $rootScope.isActive = function (viewLocation) { 
    	if(viewLocation === '/admin'){
    		return true;
        } 
    };
	
    $(document).ready(function () {
    	$('#creativeTable').on('click', 'tbody tr', function(event) {
    		$(this).addClass('selectedRow').siblings().removeClass('selectedRow');
		});
	 });
	
    $scope.recordPerPage = ['10','20','30'];
    
    $scope.filterCreativeLst = [{value:'id', label: '-- select --'}, {value:'name', label: 'Name'},{value:'type', label: 'Type'}];
    
    $scope.setCreativeGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.selectedFilterCreative =  $scope.filterCreativeLst[0];
        $scope.name = '' ;
		$scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
		$scope.filterCreative = "";
    }
    
    
    $scope.setCreativeGridParam($scope.recordPerPage[0]);
    
    $scope.getCreatives = function () {
    	var url = '/creatives?name='+ $scope.name + '&type=' + $scope.type + '&sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber ;
    	Data.get(url).then ( function (data) {
    		data.data.content.forEach( function(data,i) {
				data.showAttributes = false;
			});
    		$scope.creatives = data.data.content;
    	    $scope.totalNoOfItems = data.data.totalElements;
    	});
    };

    $scope.getCreatives();
    
    $scope.setPage = function(page){
    	$scope.currentPage = page;
		$scope.getCreatives();
	};
    
	$scope.setRecordPerPage= function () {
		$scope.setCreativeGridParam($scope.selectedNumber);
		$scope.getCreatives();
	}
	
	$scope.refreshCreativeGrid = function () {
		$scope.setCreativeGridParam($scope.recordPerPage[0]);
		$scope.getCreatives();
	}
	
	$scope.sort_by = function (predicate) {
		if ($scope.creativesFlag) {
			$scope.reverse = !$scope.reverse;
			$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
			$scope.sortBy = predicate;
			$scope.getCreatives();
		} 
	};

	$scope.getFilterCreative = function () {
		if($scope.filterCreative != '' && $scope.selectedFilterCreative.label != '-- select --') {
			$scope.name = $scope.selectedFilterCreative.label == 'Name' ? $scope.filterCreative : ''  ;
			$scope.type = $scope.selectedFilterCreative.label == 'Type' ? $scope.filterCreative : ''  ;
			$scope.getCreatives();
		}	
	}
    
    /*
	 * Removes current row from creative table
	 */
	function removeCurrentCreative (creative) {
		 var index = $scope.creatives.indexOf(creative); 
		  $scope.creatives.splice(index, 1);
	};
	
    $scope.sort_by_id = function (predicate) {
    	$scope.predicate = predicate;
		$scope.reverse = true;
	};
	
    // insert or update Creative
    $scope.saveCreative = function (data, creative) {
    	var index;
        angular.extend(data, {id: creative.id});
        data.attributes = creative.attributes ? creative.attributes : [];
        var validationResult = Validation.validationCheck("creatives", data);
        if(validationResult.value){
        	$scope.showEditModal(validationResult.error);
        	creativeform.$show();
        } else {
        	Data.post('creatives', data).success( function(result) {
        		$scope.getCreatives();
        		$scope.creativesFlag = true;
            }).error( function(result) {
            	$scope.getCreatives();
            	$scope.creativesFlag = true;
            	if(result.errorCode=='412') {
              		$scope.showEditModal("Name already in use. Please enter a different name");
    			}
    	    });
			
			$scope.inserted = {
			  id:-1,
		      name: '',
		      type: '',
		      width1: '',
		      width2: '', 
		      height1: '', 
		      height2: '',
		      description: '',
		    };
        }
		
    };

    // delete Creative
	$scope.removeCreative = function (self) {
		  $scope.show(self)
	};
	
	// add Creative
	$scope.addCreative = function () {
		if($scope.creativesFlag){
			$scope.sort_by_id('id');
			$scope.inserted = {
					name: '',
					type: '',
					width1: '',
					width2: '', 
					height1: '', 
					height2: '',
					description: '',
		    	};
		    $scope.currentPage = 1;
		    $scope.creatives.push($scope.inserted);
		    $scope.totalItems = $scope.creatives.length;
		    $scope.filteredItems = $scope.creatives.length;
		    $scope.creativesFlag = false;
		}
	};
	  
	// cancel editing or adding new creative
	$scope.cancelCreativeEdit = function (self) {
		var currentRow = self.creative;
		if(currentRow.name == "" || currentRow.type == "" || currentRow.height1 == "" || currentRow.width1 == ""){
			removeCurrentCreative(currentRow);
		}
		$scope.creativesFlag = true;
	}
	
	$scope.show = function(self) {
		ModalService.showModal({
			templateUrl: 'modal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {
		    	if (result === 'Yes') {
		    		Data.delete('creatives/' + self.creative.id).success(function(result){
		    			removeCurrentCreative(self.creative);
		    		}).error( function (result) {
				    	 if(result.errorCode=='409')
				    		 $scope.showEditModal("This element is in use and cannot be deleted.");
				    });
		    	}
		    });
		  });
	};
	
	/*
	 * Get attributes accossiated with current creative
	 */
	$scope.selectedCreative = {};
	$scope.attributeGrid = {};
	$scope.attributeGrid.attributes = [];
	$scope.attributeAssociate = true;
	$scope.fetchAttributes = function (creative_id) {
		$scope.rowClicked = true;
		 for(var cretiveDataIndex in $scope.creatives){
			 if($scope.creatives[cretiveDataIndex].id == creative_id) {
				// $scope.selectedCreative = $scope.creatives[cretiveDataIndex];
				angular.copy($scope.creatives[cretiveDataIndex], $scope.selectedCreative);
			 }
			 
		 }
		 Data.get('creatives/'+ creative_id+'/attributes').then( function(result) {
			$scope.creatives.forEach( function(data,i) {
				if(data.id == creative_id){
					data.showAttributes = true;
				} else {
					data.showAttributes = false;
				}
			});
			$scope.selectedCreative.showAttributes = true;
			$scope.attributeGrid.attributes = result.data ? result.data : [];
			$scope.totalAttributeItems = $scope.attributeGrid.attributes ? $scope.attributeGrid.attributes.length : -1;
			$scope.attributeCurrentPage = 1; // current page
			$scope.attributeEntryLimit = 100; // max no of items to display in
												// a page
			$scope.attributeFilteredItems = $scope.attributeGrid.attributes ? $scope.attributeGrid.attributes.length : -1; 
			$scope.sortAttribute_by('id');
		});
		$scope.creativesAttributeFlag  = true;
	}
	
	$scope.sortAttribute_by = function(predicate) {
		if ($scope.creativesAttributeFlag) {
			$scope.attributePredicate = predicate;
			$scope.reverseAttribute = !$scope.reverseAttribute;
		}
	};
	
	$scope.sortAttribute_by_id = function(predicate) {
		$scope.attributePredicate = predicate;
		$scope.reverseAttribute = true;
	};
	  
	$scope.attributeList=[];

	/*
	 * Insert Blank row on the top of Attribute Table
	 */
	$scope.addAttribute = function() {
		if ($scope.creativesAttributeFlag) {
			$scope.sortAttribute_by_id('id');
			if(!$scope.attributeGrid.attributes){
				$scope.attributeGrid.attributes = [];
			}
			
			$scope.attributeEdit = false;
			$scope.attributeAssociate = true;
			$scope.attributeList=[];
			
			Data.get('attributes/list').then(function(result){
				angular.forEach(result.data, function(list){
					if (list.type==="Creative") {
						$scope.attributeList.push(list);
					}
				});
			});

			$scope.inserted = {
					name: '',
					// type: '',
					description: '',
					value: ''
			};
			$scope.attributeGrid.attributes.splice(0,0,$scope.inserted);
			$scope.attributeCurrentPage = 1; // current page
			$scope.attributeFilteredItems = $scope.attributeGrid.attributes.length; 
			$scope.creativesAttributeFlag = false;
		}
		
	};
	
	
	$scope.selectAttribute = function(attribute){
		 var index = 0; 
		 $scope.attributeGrid.attributes[index].type = attribute.type;
		 $scope.attributeGrid.attributes[index].description = attribute.description;
		 $scope.attributeGrid.attributes[index].value = attribute.value;
		 $scope.attributeGrid.attributes[index].id = attribute.id;
		 $scope.attributeGrid.attributes[index].name = attribute.name;
	}
	
	$scope.setPostData = function (){
		 $scope.postData = {};
		 $scope.postData.description=  $scope.selectedCreative.description;
		 $scope.postData.height1=  $scope.selectedCreative.height1;
		 $scope.postData.height2=  $scope.selectedCreative.height2;
		 $scope.postData.id=  $scope.selectedCreative.id;
		 $scope.postData.name=  $scope.selectedCreative.name;
		 $scope.postData.type=  $scope.selectedCreative.type;
		 $scope.postData.width1=  $scope.selectedCreative.width1;
		 $scope.postData.width2=  $scope.selectedCreative.width2;
	}
	 
	/*
	 * Saves or Updates attribute for creative
	 */
	$scope.attrSet = [];
	$scope.saveAttribute = function(data, attribute,self) {
		 $scope.selectAttribute(data.name);
		 if(!$scope.selectedCreative.attributes){
			 $scope.selectedCreative.attributes = [];
		 }
		  
		 var creativeData = self.$parent.creative;
		 creativeData.attributes = [];
  		
		 for(var creAttIndex in $scope.attributeGrid.attributes){
  			if($scope.attributeGrid.attributes[creAttIndex].id != undefined && $scope.attributeGrid.attributes[creAttIndex].name != "") {
  				creativeData.attributes.push({"id":$scope.attributeGrid.attributes[creAttIndex].id});
  			}
		 }
		 
		 $scope.setPostData();
		 $scope.postData.attributes =  creativeData.attributes;
		 
		 var validationResult = Validation.validationCheck("attribute",data.id ? data : data.name);
		    
		 if(validationResult.value){
			  $scope.showEditModal(validationResult.error);
		        attributeform.$show();
		 } else {
			 if($scope.attributeEdit){
				 Data.put('attributes', self.attribute).then(function(result){
				 });
			 } else {
				 Data.put('creatives', $scope.postData).success(function(result){
						$scope.fetchAttributes($scope.selectedCreative.id);
						$scope.creativesAttributeFlag = true;
					}).error(function(result){
						var currentRow = self.attribute;
						removeCurrentAttribute(currentRow);
						$scope.creativesAttributeFlag = true;
						 angular.copy($scope.attrSet, $scope.selectedCreative.attributes);
						if(result.errorCode=='412') {
				          		$scope.showEditModal("This attribute is already associated . Please choose a different attribute to associate");
						}
					});
				}
				  
				$scope.inserted = {
						  name: '',
						  // type: '',
						  description: '',
						  value: ''
				};
		}
	};
	
	
	/*
	 * Delete Attribute from attribute table
	 */
	$scope.removeAttribute = function(self) {
		$scope.deleteWarnigAttributeModal(self);
	};
	
	$scope.deleteWarnigAttributeModal = function(self) {
			ModalService.showModal({
		  	templateUrl: 'modal.html',
		    controller: "ModalController"
		  }).then(function(modal) {
		    modal.element.modal();
		    modal.close.then(function(result) {
		    	if (result === 'Yes') {
		    		removeCurrentAttribute(self.attribute);
		    		var creativeData = self.$parent.creative;
		    		creativeData.attributes = [];
		    		for(var creAttIndex in $scope.attributeGrid.attributes){
		    			if($scope.attributeGrid.attributes[creAttIndex].id != undefined && $scope.attributeGrid.attributes[creAttIndex].name != "") {
		    				creativeData.attributes.push({"id":$scope.attributeGrid.attributes[creAttIndex].id});
		    			}
		    		}
			    		
		    		$scope.setPostData();
		   		 	$scope.postData.attributes =  creativeData.attributes;
		   		 	
		   		 	$scope.updateCreative = {
		   		 		attributes: creativeData.attributes,
		   		 		description: creativeData.description,
		   		 		height1: creativeData.height1,
		   		 		height2: creativeData.height2,
		   		 		id: creativeData.id,
		   		 		name: creativeData.name,
		   		 		type: creativeData.type,
			   		 	width1: creativeData.width1,
			   		 	width2: creativeData.width2
		 		    };
		  		  	Data.put('creatives' , $scope.updateCreative ).then(function(result){
			  		  		// console.log(updateCreative);
		  		  	});
			      }
			    });
		   });
	};
	
	/*
	 * Removes current row from attribute table
	 */
	function removeCurrentAttribute (attribute) {
		var indexToDelete;
		$scope.attributeGrid.attributes.forEach(function(value,i){
			if(value.id == attribute.id){
				indexToDelete = i;  
			}
		})
		$scope.attributeGrid.attributes.splice(indexToDelete,1);
		$scope.attributeFilteredItems = $scope.attributeGrid.attributes.length;;
	};
	
	/*
	 * Cancel Editing Row in Attribute Table
	 */
	$scope.cancelAttributeEdit = function(self){
		var currentRow = self.attribute;
		if(currentRow.name == "" || currentRow.type == "" ||$scope.attributeAssociate){
			removeCurrentAttribute(currentRow);
		}
		$scope.creativesAttributeFlag = true;
  	};
	
	/* for hiding the inner grid */
	$scope.hide=function(self){
		self.creative.showAttributes = false;
		$scope.creativesAttributeFlag  = true;
	};
				 
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
		
	$scope.showEditModal = function(msg) {
			var modalTemplate = alertBox(msg);
				ModalService.showModal({
				template: modalTemplate,
				controller: "ModalController"
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {

				});
			});
	 };
		
	$scope.bindTextareaAuto = function(){
		$(".editable-textarea").find("textarea").on("keydown", function(){
			$scope.textAreaAdjust(this);
		});
		$scope.creativesFlag = false;
	};

	$scope.textAreaAdjust = function(o) {
	    o.style.height = (o.scrollHeight)+"px";
	};
			  
	/*
	 * Edit attribute Form
	 */
	$scope.editAttributeForm = function(self){
		$scope.attributeEdit = true;
  		$scope.attributeAssociate = false;
	}	

	$scope.getCreativesFlag = function () {
		return $scope.creativesFlag;
	}
	
	$scope.getFilterAttribute = function () {
		/*if($scope.filterAttribute != '' && $scope.selectedFilterAttribute.label != '') {
			$scope.name = $scope.selectedFilterAttribute.label == 'Name' ? $scope.filterAttribute : ''  ;
			$scope.type = $scope.selectedFilterAttribute.label == 'Type' ? $scope.filterAttribute : ''  ;
			//$scope.getAttributes();
		}*/	
	}
});
