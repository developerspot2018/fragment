app.filter('startProductFrom', function() {
	return function(input, start) {
		if (input  && Object.keys(input).length>0) {
			start = +start; // parse to int
			return input.slice(start);
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

app.controller('productCtrl', function($scope, $modal, $rootScope, $location, Data, $http, cssInjector, ModalService, Validation,  $location) {
	cssInjector.add("plugins/admin/css/admin-style.css");
	
	$http.get('plugins/admin/js/products-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;    
      });
	
	$scope.products = {};
	$scope.rowClicked = false;
	
	$scope.productFlag = true;
	$scope.productAttributeFlag  = true;
	
	$scope.types = [
	                {value: 'Expandable', text: 'Expandable'},
                    {value: 'Image', text: 'Image'},
	                {value: 'Rich Media', text: 'Rich Media'},
	                {value: 'Video', text: 'Video'},
                    {value: 'Video Interstitial', text: 'Video Interstitial'}
                ]; 
	
	$scope.classes = [
	                {value: 'Display Cross Platform', text: 'Display Cross Platform'},
	                {value: 'Email', text: 'Email'},
	                {value: 'Mobile', text: 'Mobile'},
	                {value: 'Programmatic', text: 'Programmatic'},
	                {value: 'Tablet', text: 'Tablet'},
	                {value: 'Web', text: 'Web'}                    
                ];
	
	$scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/admin/product') > -1){
        	return true;
        } 
		
    };
    
    $rootScope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };

// make a row selected
	$(document).ready(function(){
		 $('#productTable').on('click', 'tbody tr', function(event) {
		    $(this).addClass('selectedRow').siblings().removeClass('selectedRow');
		});
	 })	
	 
	 /*
	  * Removes current row from product table
	  */
	  function removeCurrentProduct(product){
		  var index =$scope.products.indexOf(product); 
		  $scope.products.splice(index,1);
	  };
		
	Data.get('salestargets/list').then(function(data) {
		$scope.salesTargets=data.data;	
	});
	
	Data.get('creatives').then(function(data) {
		$scope.creativesList = data.data.content;
	});
	
	$scope.recordPerPage = ['10','20','30'];
	    
	$scope.filterProductLst = [{value:'id', label: '-- select --'}, {value:'name', label: 'Name'},{value:'type', label: 'Type'}];
	    
	$scope.setProductGridParam = function (currentRecordPerPage){
	 	$scope.selectedNumber = currentRecordPerPage; 
	    $scope.maxNoPageSize = 5;
	    $scope.currentPage = 1;
	    $scope.entryLimit = $scope.selectedNumber;
	    $scope.selectedFilterProduct =  $scope.filterProductLst[0];
	    $scope.name = '' ;
	    $scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
		$scope.filterProduct = "";
	}
	    

    
    $scope.setProductGridParam($scope.recordPerPage[0]);
    
    $scope.getProducts = function () {
    	var url = 'products?name='+ $scope.name + '&type=' + $scope.type + '&sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber ;
    	Data.get(url).then ( function (data) {
    		data.data.content.forEach( function(data,i) {
				data.showAttributes = false;
				//var tempSTLData = angular.extend({},tempData[i]);
				data.salesTargetList = [];
				data.salesTargetData = [];
				var isSalesTarget = true;
				var isCreative = true;
				Data.get('products/'+ data.id + '/salestargets').then(function(stData) {
					for(var j=0;j<stData.data.length;j++){
						data.salesTargetList.push({'id' :stData.data[j].id});
						data.salesTargetData.push(stData.data[j]);
					}
					isSalesTarget = false;
				});
				
				Data.get('products/'+ data.id + '/creatives').then(function(creativeData) {
					data.creative = creativeData.data;
					isCreative = false;
				});
				
				$scope.callTimeTimeout( isSalesTarget, isCreative);
				
			});
    		$scope.products = data.data.content;
    	    $scope.totalNoOfItems = data.data.totalElements;
    	});
    };

    $scope.getProducts();
    
    $scope.callTimeTimeout = function ( isSalesTarget, isCreative) {
    	setTimeout(function(){
    		if(isSalesTarget == true ||  isCreative == true) {
    			$scope.callTimeTimeout( isSalesTarget, isCreative);
    		}
    	}, 50);
    }
	
    $scope.setPage = function(page){
    	$scope.currentPage = page;
		$scope.getProducts();
	};
    
	$scope.setRecordPerPage= function () {
		$scope.setProductGridParam($scope.selectedNumber);
		$scope.getProducts();
	}
	
	$scope.refreshProducteGrid = function () {
		$scope.setProductGridParam($scope.recordPerPage[0]);
		$scope.getProducts();
	}
	
	$scope.sort_by = function (predicate) {
		if ($scope.productFlag) {
			$scope.reverse = !$scope.reverse;
			$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
			$scope.sortBy = predicate;
			$scope.getProducts();
		} 
	};

	$scope.getFilterProduct = function () {
		if($scope.filterProduct != '' && $scope.selectedFilterProduct.label != '-- select --') {
			$scope.name = $scope.selectedFilterProduct.label == 'Name' ? $scope.filterProduct : ''  ;
			$scope.type = $scope.selectedFilterProduct.label == 'Type' ? $scope.filterProduct : ''  ;
			$scope.getProducts();
		}	
	}
    
    
    
	$scope.showSalesTargetName = function(product) {
		    var selected = [];
		    angular.forEach(product.salesTargetData, function(s) { 
		        selected.push(s.name);
		    });
		    return selected.length ? selected.join(', ') : '';
	  };
  
	$scope.reverse = false;

	$scope.sort_by_id = function(predicate) {
		$scope.predicate = predicate;
		$scope.reverse = true;
	};
	
	// update Attribute
	$scope.saveProduct = function(data, product) {
		angular.extend(data, {id : product.id});
		
		
		var creativeId = data.creative;
		 var validationResult = Validation.validationCheck("products",data);
		if (validationResult.value) {
			$scope.showWarnigModal(validationResult.error);
			productform.$show();
			/* $scope.products.splice($scope.products.length-1, 1); */
		}else{
			var tempSalesTarget = [];
			for(var index  in data.salesTargetList){
				if(data.salesTargetList[index].id != undefined){
					tempSalesTarget.push({"id": data.salesTargetList[index].id});
				}
				else {
					tempSalesTarget.push({"id": data.salesTargetList[index]});
				}
			}
			data.salesTargetList.length = 0;
			data.salesTargetList  = tempSalesTarget;

			data.creative = {"id":data.creative};
			
			if (product.id>0&&product.id!=undefined) {
				data.attributes = [];
				Data.get('products/'+product.id+'/attributes').then(function(data) {
					data.attributes = data.data.content;
				});
				for(var index  in product.attributes){
					data.attributes.push({'id': product.attributes[index].id});
				}
				Data.put('products', data).success(function(result){
		          	  var index =$scope.products.indexOf(product); 
		                $scope.products[index].id = result.id; 
		               $scope.creativesList.forEach(function(value,i){
		            	  if(value.id == creativeId) {
		            		  $scope.products[index].creative = value;
		            		  data.creative = value;
		            	  }
		               });
		               $scope.getProducts();
		               $scope.productFlag = true;
		          }).error(function(result){
		        	  $scope.getProducts();
		        	  $scope.productFlag = true;
		        	  if(result.errorCode=='412') {
		          		$scope.showWarnigModal("Name already in use. Please enter a different name");
					  }
		          });
			}else{
				Data.post('products', data).success(function(result){
		          	  var index =$scope.products.indexOf(product); 
		                $scope.products[index].id = result.id; 
		               $scope.creativesList.forEach(function(value,i){
		            	  if(value.id == creativeId) {
		            		  $scope.products[index].creative = value;
		            		  data.creative = value;
		            	  }
		               });
		               $scope.getProducts();
		               $scope.productFlag = true;
		          }).error(function(result){
		        	  $scope.getProducts();
		        	  $scope.productFlag = true;
		        	  if(result.errorCode=='412') {
		          		$scope.showWarnigModal("Name already in use. Please enter a different name");
					  }
		          });
			}
			
		  
		  
		  $scope.inserted = {
			id:-1,
			name : '',
			displayName : '',
			description : '',
			note : '',
			type : '',
			classs : '',
			custom1 : '',
			custom2 : ''
		};
		}
		
	};

	// delete Product
	$scope.removeProduct = function(variable) {
		$scope.productDeleteWarnigModal(variable);
	};
	
	// add Product
	$scope.addProduct = function() {
		if( $scope.productFlag){
			$scope.sort_by_id('id');
			$scope.inserted = {
					name : '',
					displayName : '',
					description : '',
					note : '',
					type : '',
					classs : '',
					custom1 : '',
					custom2 : '',
					salesTargetList:[],
					creative:'',
					basePrice:'',
				};
				$scope.currentPage = 1;
				$scope.products.push($scope.inserted);
				$scope.totalItems = $scope.products.length;
				$scope.productFlag = false;
		}
	};
	
// cancel insertion or editing
	$scope.cancelProductEdit=function(self){
		 var currentRow = self.product;
		  if(currentRow.name == ""){
			  removeCurrentProduct(currentRow);
		  }
		  $scope.productFlag = true;
	};

	$scope.productDeleteWarnigModal = function(variable) {
		ModalService.showModal({
	  	templateUrl: 'modal.html',
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	    	if (result === 'Yes') {
	    		Data.delete('products/'+variable.product.id).success(function(result){
		  			  removeCurrentProduct(variable.product);
		  		}).error( function (result) {
			    	 if(result.errorCode=='409')
			    		 $scope.showWarnigModal("This element is in use and cannot be deleted.");
			    });
	    	}
	    });
	   });
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
		}
		 $scope.showWarnigModal = function(msg) {
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

			/*
			 * Get attributes accossiated with current creative
			 */
			$scope.selectedProduct = {};
			$scope.attributeGrid = {};
			$scope.attributeGrid.attributes = [];
			$scope.attributeAssociate = true;
			$scope.fetchAttributes = function (product_id) {
				$scope.rowClicked = true;
				 for(var productDataIndex in $scope.products){
					 if($scope.products[productDataIndex].id == product_id) {
						// $scope.selectedCreative = $scope.creatives[cretiveDataIndex];
						angular.copy($scope.products[productDataIndex], $scope.selectedProduct);
					 }
					 
				 }
				 Data.get('products/'+ product_id+'/attributes').then( function(result) {
					$scope.products.forEach( function(data,i) {
						if(data.id == product_id){
							data.showAttributes = true;
						} else {
							data.showAttributes = false;
						}
					});
					$scope.selectedProduct.showAttributes = true;
					$scope.attributeGrid.attributes = result.data ? result.data : [];
					$scope.totalAttributeItems = $scope.attributeGrid.attributes ? $scope.attributeGrid.attributes.length : -1;
					$scope.attributeCurrentPage = 1; // current page
					$scope.attributeEntryLimit = 100; // max no of items to display in
														// a page
					$scope.attributeFilteredItems = $scope.attributeGrid.attributes ? $scope.attributeGrid.attributes.length : -1; 
					$scope.sortAttribute_by('id');
				});
				$scope.productsAttributeFlag  = true;
			}
			
			$scope.sortAttribute_by = function(predicate) {
				if ($scope.productsAttributeFlag) {
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
				if ($scope.productsAttributeFlag) {
					$scope.sortAttribute_by_id('id');
					if(!$scope.attributeGrid.attributes){
						$scope.attributeGrid.attributes = [];
					}
					
					$scope.attributeEdit = false;
					$scope.attributeAssociate = true;
					$scope.attributeList=[];
					
					Data.get('attributes').then(function(result){
						angular.forEach(result.data.content, function(list){
							if (list.type==="Product") {
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
					$scope.productsAttributeFlag = false;
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
				 $scope.postData.id= $scope.selectedProduct.id;
				 $scope.postData.name = $scope.selectedProduct.name;
				 $scope.postData.type = $scope.selectedProduct.type;
				 $scope.postData.description = $scope.selectedProduct.description;
				 $scope.postData.attributes = $scope.selectedProduct.attributes;
				 $scope.postData.salesTargetList = $scope.selectedProduct.salesTargetList;
				 $scope.postData.classs = $scope.selectedProduct.classs;
				 $scope.postData.basePrice = $scope.selectedProduct.basePrice;
				 
				 $scope.postData.creative = {"id":$scope.selectedProduct.creative.id};
			}
			 
			/*
			 * Saves or Updates attribute for creative
			 */
			$scope.attrSet = [];
			$scope.saveAttribute = function(data, attribute,self) {
				 $scope.selectAttribute(data.name);
				 if(!$scope.selectedProduct.attributes){
					 $scope.selectedProduct.attributes = [];
				 }
				  
				 var productData = self.$parent.product;
				 productData.attributes = [];
		  		
				 for(var creAttIndex in $scope.attributeGrid.attributes){
		  			if($scope.attributeGrid.attributes[creAttIndex].id != undefined && $scope.attributeGrid.attributes[creAttIndex].name != "") {
		  				productData.attributes.push({"id":$scope.attributeGrid.attributes[creAttIndex].id});
		  			}
				 }
				 
				 $scope.setPostData();
				 $scope.postData.attributes =  productData.attributes;
				 var validationResult = Validation.validationCheck("attribute",data.id ? data : data.name);
				    
				 if(validationResult.value){
					  $scope.showEditModal(validationResult.error);
				        attributeform.$show();
				 } else {
					 if($scope.attributeEdit){
						 Data.put('attributes', self.attribute).then(function(result){
						 });
					 } else {
						 Data.post('products', $scope.postData).success(function(result){
								$scope.fetchAttributes($scope.selectedProduct.id);
								$scope.productsAttributeFlag = true;
							}).error(function(result){
								var currentRow = self.attribute;
								removeCurrentAttribute(currentRow);
								$scope.productsAttributeFlag = true;
								 angular.copy($scope.attrSet, $scope.selectedProduct.attributes);
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
				    		var productData = self.$parent.product;
				    		productData.attributes = [];
				    		
				    		for(var creAttIndex in $scope.attributeGrid.attributes){
				    			if($scope.attributeGrid.attributes[creAttIndex].id != undefined && $scope.attributeGrid.attributes[creAttIndex].name != "") {
				    				productData.attributes.push({"id":$scope.attributeGrid.attributes[creAttIndex].id});
				    			}
				    		}
					    		
				    		$scope.setPostData();
				   		 	$scope.postData.attributes =  productData.attributes;
				    		
			   		 		$scope.updateProduct = {
				   		 		attributes: productData.attributes,
				   		 		basePrice: productData.basePrice,
				   		 		classs: productData.classs,
				   		 		creative: productData.creative,
				   		 		id: productData.id,
				   		 		name: productData.name,
				   		 		description: productData.description,
				   		 		salesTargetList: productData.salesTargetList,
				   		 		targets: productData.targets,
				   		 		type: productData.type
				 		    };
				  		  	Data.put('products' , $scope.updateProduct ).then(function(result){
					  		  		// console.log(result);
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
				$scope.productsAttributeFlag = true;
		  	};
			
			/* for hiding the inner grid */
			$scope.hide=function(self){
				self.product.showAttributes = false;
				$scope.productsAttributeFlag  = true;
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
					/*var modalTemplate = alertBox(msg);*/
						ModalService.showModal({
						template: modalTemplate,
						controller: "ModalController"
					}).then(function(modal) {
						modal.element.modal();
						modal.close.then(function(result) {

						});
					});
			 };
				
			$scope.bindTextAreaAuto = function(){
				$(".editable-textarea").find("textarea").on("keydown", function(){
					$scope.textAreaAdjust(this);
				});
				$scope.productFlag = false;
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

			$scope.getProductsFlag = function () {
				return $scope.productFlag;
			}
			
			$scope.getFilterAttribute = function () {
				/*if($scope.filterAttribute != '' && $scope.selectedFilterAttribute.label != '') {
					$scope.name = $scope.selectedFilterAttribute.label == 'Name' ? $scope.filterAttribute : ''  ;
					$scope.type = $scope.selectedFilterAttribute.label == 'Type' ? $scope.filterAttribute : ''  ;
					//$scope.getAttributes();
				}*/	
			}
			
			$scope.getProductFlag = function() {
				return $scope.productFlag;
			}
			
			$scope.createProduct = function() {
				 $location.path('/admin/product/create');
			};
});
