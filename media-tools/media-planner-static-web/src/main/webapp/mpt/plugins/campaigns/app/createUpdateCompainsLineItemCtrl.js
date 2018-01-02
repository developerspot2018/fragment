app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.filter('startAssetLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('createUpdateCompainsLineItemCtrl', function ($route, $routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, ModalService, Validation,lineItemService) {
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$scope.chooseFromExisting = false;
	$scope.entryLimit=10;
	$scope.lineItemId = '';
	  $scope.deleteAssetLineItem = function(assetId){
		  
		  ModalService.showModal({
				templateUrl: 'modal.html',
			    controller: "ModalController"
			  }).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {
			    	if (result === 'Yes') {
			    		$http({method:'PATCH',url:'http://10.193.66.132:9090/mp/asset/'+assetId}).success(function(){
			  			  /*
			    			var lineItemData = lineItemService.getLineItemData();
			  		    	if(lineItemData){
			  		    	Data.get('line-items/'+lineItemData.id+'/asset').then(function(data) {
			  		    		$scope.creativeLst = data.data;
			  		    		$scope.lineItemId = lineItemData.id;
			  		    		$scope.lineItemData  = lineItemData;
			  				});
			  		    	}
			  		    	*/
			  		    	$route.reload();
			  	  		}).error(function(data,status){
			  	  			
			  	  		});
			    	}
			    });
			  });
		  
		  
		  /*
		  Data.onDelete('asset/'+assetId).then(function(data){
			  var lineItemData = lineItemService.getLineItemData();
		    	if(lineItemData){
		    	Data.get('line-items/'+lineItemData.id+'/asset').then(function(data) {
		    		$scope.creativeLst = data.data;
		    		$scope.lineItemId = lineItemData.id;
		    		$scope.lineItemData  = lineItemData;
				});
		    	}
		  });
		  */	
	  };
	$scope.showExistingGrid = function(){
		$scope.chooseFromExisting = true;
		Data.get("line-items/"+$scope.lineItemId+"/assets").then(function(data) {
    		$scope.existingAssetList=data.data;
		});
	};
	
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.creativeLst='';
		$scope.lineItemId='';
		$scope.lineItemData='';
		$scope.property = response.data;
      });
	$http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	  
	  
	this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
    if(setTab == 2){
    	$scope.isAssetExist = false;
    	var lineItemData = lineItemService.getLineItemData();
    	$scope.chooseFromExisting=false;
    	if(lineItemData){
    	Data.get('line-items/'+lineItemData.id+'/asset').then(function(data) {
    		$scope.creativeLst = data.data;
    		if($scope.creativeLst == "") {
    			$scope.isAssetExist = true;
    		}
    		$scope.lineItemId = lineItemData.id;
    		$scope.lineItemData  = lineItemData;
		});
    	}
    }
      this.tab = setTab;
	
    };
	
	
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
    $scope.newLineItem = {};
    
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var valArr = Base64.decode($routeParams.id).split('-');
	$scope.proposalId = valArr[1];
	$scope.lineItemlId = valArr[3];
	setTimeout(function(){
		
		$('#lineItemStartDate').datetimepicker({
			changeMonth: true,
			changeYear: true/*,
			timeFormat: "hh:mm tt"*/
		});
		
		$('#lineItemEndDate').datetimepicker({
			changeMonth: true,
		    changeYear: true/*,
		    timeFormat: "hh:mm tt"*/
		});

	},100);
		
	setTimeout( function() {
		$('#lineItemStartDate').datetimepicker("option","minDate", new Date($rootScope.currentProposal.startDate));
		$('#lineItemStartDate').datetimepicker("option","maxDate", new Date($rootScope.currentProposal.endDate));
		
		$('#lineItemEndDate').datetimepicker("option","minDate", new Date($rootScope.currentProposal.startDate));
		$('#lineItemEndDate').datetimepicker("option","maxDate", new Date($rootScope.currentProposal.endDate));
			
	}, 200) 
   /*});*/
	
	if($scope.lineItemlId == 0 ) {
		setTimeout( function() {
			$('#lineItemStartDate').datetimepicker("setDate", new Date($rootScope.currentProposal.startDate) );
			$('#lineItemEndDate').datetimepicker("setDate", new Date($rootScope.currentProposal.endDate) );
		}, 300);
	}
	
	$scope.targetTypeOptions = [
	                            { value: 'country', label: 'Country'},
	                            { value: 'age', label: 'Age'},
	                            { value: 'zipcodes', label: 'Zip Codes'}
	                           ];
	                  	
	                  	$scope.specTypeOptions = [
	                          { value: 'rich-media', label: 'Rich Media'},
	                          { value: 'html-5', label: 'HTML 5'},
	                          { value: 'standard', label: 'Standard'},
	                          { value: 'text', label: 'Text'},
	                          { value: 'video', label: 'Video'}
	                         ];
	                  	
	                  	$scope.priceTypeOptions = [
	                  	      { value: 'cpm', label: 'CPM'},
	                          { value: 'cpc', label: 'CPC'},
	                          { value: 'cpa', label: 'CPA'},
	                          { value: 'cpd', label: 'CPD'}
	                         ];
	
	                  	$scope.priorityTypeOptions = [
 	                  	      { value: 'standarad', label: 'Standarad'},
                              { value: 'preemptible', label: 'Preemptible'},
                              { value: 'exclusive', label: 'Exclusive'}
                         ];
	                  	$scope.statusTypeOptions = [
 	                  	     
                              { value: 'active', label: 'Active'},
                              { value: 'delivering', label: 'Delivering'},
                              { value: 'completed', label: 'Completed'},
                              { value: 'ready', label: 'Ready'},
                         ];
      	$scope.product = 'eq';
    	$scope.selectedProductVal = 'neq';
    	$scope.salesTarget = 'eq';
    	$scope.selectedSalesTarget = '';
    	$scope.newLineItem = {};
    	
    	$scope.getSalestargets = function () {
    		var id = $scope.newLineItem.product;
    		Data.get('products/'+id).then(function(data) {
    			$scope.salesTargetList = data.data.salesTargetList;
    		});
    	};
    	
    	$scope.getBasePrice = function () {
    		var id = $scope.newLineItem.product;
    		Data.get('products/'+id).then(function(data) {
    			$scope.newLineItem.basePrice = data.data.basePrice;
    		});
    	};
    	$scope.productList = [];
    	
    	  Data.get('products').then(function(data) {
    		  $scope.productList = data.data;
    	  });
    	  
    	  if (isNaN($scope.proposalId) || isNaN($scope.lineItemlId) || $scope.proposalId <= 0 || $scope.lineItemlId < 0) {
    		  $location.path('/campaigns');
    	  } else {
	    	  Data.get('proposals/'+$scope.proposalId).then(function(data) {
	    		  $scope.salesCategory = data.data.salesCategory;
	    	  });
    	  }
    	/*  
    	  $scope.getPlacementName = function () {
    			var id = $scope.newLineItem.product;
    			Data.get('products/'+id).then(function(data) {
    				$scope.newLineItem.placeHolder = data.data.name+" in "+$scope.salesCategory;
    				
    			});
    		};*/
    	  
    	  $scope.cancelLineItem = function() {
			  $location.path('/campaigns/proposal-line-item/'+$scope.proposalId );
   };
	  
	$scope.getLineItemData = function(id) {
		Data.get('line-items/'+id).then(function(data){
	    	$scope.lineItemData  = data.data;
	    	$scope.newLineItem.selectedProductVal = $scope.lineItemData.product.id;
	    	var tempStartDate = new Date($scope.lineItemData.startDate);
	    	var tempEndDate = new Date($scope.lineItemData.endDate);
	    	$('#lineItemStartDate').datetimepicker("setDate", tempStartDate);
	    	$('#lineItemEndDate').datetimepicker("setDate", tempEndDate);
			 $scope.newLineItem.price=$scope.lineItemData.price;
			 $scope.newLineItem.offeredQuantity=$scope.lineItemData.offeredQuantity;
			 $scope.newLineItem.basePrice=$scope.lineItemData.basePrice;
			 $scope.newLineItem.custom2=$scope.lineItemData.custom2;
			 $scope.newLineItem.id=$scope.lineItemData.id;
			 $scope.newLineItem.product=$scope.lineItemData.product.id;
			 $scope.newLineItem.paymentModel=$scope.lineItemData.paymentModel;
			 $scope.newLineItem.specTypeOption=$scope.lineItemData.custom3;
			 $scope.newLineItem.deliveryPriority=$scope.lineItemData.deliveryPriority;
			 $scope.newLineItem.deliveryStatus=$scope.lineItemData.deliveryStatus;
			 $scope.newLineItem.placeHolder=$scope.lineItemData.placeHolder;
			 $scope.newLineItem.investment=$scope.lineItemData.investment;
			 lineItemService.setLineItemData(data.data);
			 Data.get('products/'+ $scope.newLineItem.product).then(function(data) {
					$scope.salesTargetList = data.data.salesTargetList;
					$scope.selectedSalesTarget = $scope.lineItemData.salesTargets;
					$scope.selectedSalesTarget.forEach(function(selectedValue,i){
						$scope.salesTargetList.forEach(function(value,j){
							if(selectedValue.id == value.id){
								value.ticked = true;
							}
						})
						selectedValue.ticked = true;
					})
					
				});
			 $scope.newLineItem.custom4=$scope.lineItemData.custom4;
			 var tempTargetList = [];
			 $scope.lineItemData.targets.forEach(function(value,i){
				 $scope.targetListElements.push({"name":{"id":value.category.id,"name":value.category.name},"value":{"id":value.id,"value":value.value}});
			 })
	   });
	} 
	if (isNaN($scope.proposalId) || isNaN($scope.lineItemlId) || $scope.proposalId <= 0 || $scope.lineItemlId < 0) {
		  $location.path('/campaigns');
	} else if($scope.lineItemlId > 0){
		$scope.getLineItemData($scope.lineItemlId);
	} 
	$scope.targetListElements=[];
	$scope.isedittableItem=false;
	var selectedElementId;
	
	if (isNaN($scope.proposalId) || isNaN($scope.lineItemlId) || $scope.proposalId <= 0 || $scope.lineItemlId < 0) {
		  $location.path('/campaigns');
	} else {
			Data.get('proposals/'+$scope.proposalId).then(function(data) {
				$scope.proposal = data.data;
				$scope.proposalStartDate=$scope.proposal.startDate;
				$scope.proposalEndDate=$scope.proposal.endDate;
				$rootScope.currentProposal = data.data;
			});
	}
	$scope.getInvestment = function () {
		 $scope.isOfferedPriceLess = false; 
		var quentity=parseInt($scope.newLineItem.offeredQuantity);
		 var offeredPrice= $scope.newLineItem.price
		 if (quentity>0 &&  offeredPrice>0){
			 $scope.newLineItem.investment = ((quentity*offeredPrice)/1000);
	     }	else{
	    	 
	     }
			
		};
	
	
		$scope.$watch("selectedSalesTarget", function(newVal, oldVal) {
			$scope.isSalesTargetListCheckErrors  = false;
			var segmentName = "";
			if($scope.selectedSalesTarget !=null && $scope.selectedSalesTarget != ""){
				//console.log($scope.selectedSalesTarget);
				for(var st in $scope.selectedSalesTarget){
					//console.log($scope.selectedSalesTarget[st]);
					segmentName = segmentName + (segmentName != "" ? "-": '');
					segmentName = segmentName + $scope.selectedSalesTarget[st].name;
				}
			}
			if(segmentName != "") {
				var productName = "";
				for(var prodIndex in $scope.productList){
					if($scope.newLineItem.product == $scope.productList[prodIndex].id) {
						productName = $scope.productList[prodIndex].name;
					}
				}
				if(productName != "" ) { 
					$scope.newLineItem.placeHolder  = productName + ' in ' + segmentName;
				}
			} else {
				$scope.newLineItem.placeHolder = "";
				//$scope.isSalesTargetListCheckErrors  = true;
			}
		});
		
		
	$scope.checkErrors = false;
	$scope.saveEdittedLineItem = function(){
		if (isNaN($scope.proposalId) || isNaN($scope.lineItemlId) || $scope.proposalId <= 0 || $scope.lineItemlId < 0) {
			  $location.path('/campaigns');
		} else {
		
		$scope.showDateError = false;
		$scope.showDateFlightError = false;  
		$scope.checkErrors = true;
		  $scope.$broadcast('show-errors-check-validity');
		  $scope.isSalesTargetListCheckErrors  = false;
		  var flag = false;
		  $scope.isOfferedQuantityLessThanZero = false;
		  $scope.isOfferedQuantityEmpty = false;
		  
		  if($scope.newLineItem.offeredQuantity == undefined || $scope.newLineItem.offeredQuantity == "") {
			  $scope.isOfferedQuantityEmpty = true;
			  flag = true;
		  } else if (parseInt($scope.newLineItem.offeredQuantity) == 0 ){ 
			  flag = true;
			  $scope.isOfferedQuantityLessThanZero = true;
		  }	
		  if($scope.lineItemForm.$error.required != undefined && $scope.lineItemForm.$error.required.length > 0){
			  flag = true;
		  } 			
		  if ($scope.lineItemForm.$invalid ){ 
			  flag = true;
		  }	
		  if(new Date($scope.newLineItem.startDate).getTime() > new Date($scope.newLineItem.endDate).getTime()){
			  $scope.showDateError = true;
			  flag = true;
		  }
		  if (!$scope.showDateError
					&& ((new Date($scope.newLineItem.startDate).getTime() < new Date($rootScope.currentProposal.startDate).getTime()) 
							|| (new Date($scope.newLineItem.endDate).getTime() > new Date($rootScope.currentProposal.endDate).getTime()))){
			$scope.showDateFlightError = true;
			flag = true;
			}	
		  $scope.isOfferedPriceLess = false;
		  if(($scope.newLineItem.basePrice != undefined || $scope.newLineItem.basePrice != "") && $scope.newLineItem.basePrice >= 0) {
			  if ($scope.newLineItem.price == undefined || $scope.newLineItem.basePrice > $scope.newLineItem.price){ 
				  $scope.isOfferedPriceLess = true;
				  flag = true;
			  }
		  }
		  
		 var lineitemID=$scope.id;
		 $scope.salesTarget =[];
		 for(var val in $scope.selectedSalesTarget){
			 $scope.salesTarget.push({id: $scope.selectedSalesTarget[val].id});
		 }
		 if($scope.salesTarget == undefined || $scope.salesTarget.length == 0){
			$scope.isSalesTargetListCheckErrors  = true;
			flag = true;
		}
		  
		  
		if(flag){
		  return; 
		}
		
		
		var targets = []
		$scope.targetListElements.forEach(function(value,id){
			targets.push({"id":value.value.id});
		})
		var startDate1=new Date($scope.proposalStartDate).getTime();
		var endDate1=new Date($scope.proposalEndDate).getTime();
		$scope.inserted = {
				id:  $scope.newLineItem.id, 
				product:{"id": parseInt($scope.newLineItem.product)},
				proposal: {"id": parseInt($scope.proposalId)},
				startDate: new Date($scope.newLineItem.startDate).getTime(),
				endDate: new Date($scope.newLineItem.endDate).getTime(),
			    paymentModel:  $scope.newLineItem.paymentModel,
			    basePrice:  $scope.newLineItem.basePrice,
			    price:  $scope.newLineItem.price,
			    offeredQuantity:  parseInt($scope.newLineItem.offeredQuantity),
			    custom2:  $scope.newLineItem.custom2,
			    targets:targets,														// to be implemented
			    salesTargets:$scope.salesTarget,										// working
			    custom3: $scope.newLineItem.specTypeOption,
			    custom1:  $scope.targettingString,
			    deliveryPriority: $scope.newLineItem.deliveryPriority,
			    deliveryStatus: $scope.newLineItem.deliveryStatus,
			    placeHolder: $scope.newLineItem.placeHolder,
				custom4: $scope.newLineItem.custom4,
				investment: $scope.newLineItem.investment
		    };
		if($scope.newLineItem.id > 0){
			Data.put('line-items', $scope.inserted).then(function(result){
		      	//console.log('result ',result);
				$location.path('/campaigns/proposal-line-item/'+$scope.proposalId);
		    },function(result, status){
		      	//console.log('result ',result);
		    	$scope.showlineitemAlertModal(results.data.error[0].message);
		    });
			
		}else{
			 Data.post('line-items', $scope.inserted).then(function(result){
			    	$location.path('/campaigns/proposal-line-item/'+$scope.proposalId);
			   },function(result, status){
			      	//console.log('result ',result);
				   $scope.showlineitemAlertModal(results.data.error[0].message);
			    });
		}
	}
	};
	
	function lineitemAlertBox(msg){
		var modalBody = '<div class="modal fade campaigns">'+
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
	
	$scope.showlineitemAlertModal = function(msg) { 
		var ModalTemplate = lineitemAlertBox(msg);
		ModalService.showModal({
	  	template: ModalTemplate,
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {
	
	    });
	   });
	 };
	
	// target list elements
	$scope.countries=[];
	
	Data.get('targetcategory').then(function(result){
      	$scope.targetTypeOptions=result.data;
    });
	
	 $scope.getElements=function(){
		 Data.get('targetcategory/'+ $scope.targetTypeOption.id).then(function(result){
		     //console.log(result.data); 	
		    	 $scope.elementArray=result.data.values;
		    	 $scope.element='undefined';
		 });
	 };
	
	 $scope.addElement=function(){
			
			var newElement={};
				newElement.value={};
				newElement.name=$scope.targetTypeOption;
				if($scope.targetTypeOption.name==="Zip Code"){
					newElement.value.id=$scope.targetListElements.length+1;
					newElement.value.value=$scope.zipcode;
				}else{
					newElement.value=$scope.element;
				}

				//for adding new list element
				if($scope.isedittableItem==false){
					newElement.id=$scope.targetTypeOption.id;
					$scope.targetListElements.push(newElement);
				}
				// to save the editted element
				else{
					var index = -1;
					angular.forEach($scope.targetListElements, function(targetListElement, i) { 
					  index++;
					  if (selectedElementId === targetListElement.id) {
						index = i ;
					  }
					});
					$scope.targetListElements[index] = newElement;

					$scope.isedittableItem=false;
				}
				if($scope.targetTypeOption.name==="Zip Code"){
					
					$scope.zipcode="";
					$scope.element={};
				}else{
					$scope.element={};
				}
				$scope.targetTypeOption={};
			};
			//edit target list element
			$scope.editTargetListItem=function(targetListElement){
				$scope.targetTypeOption=targetListElement.name;
				$scope.element=targetListElement.value;
				selectedElementId=targetListElement.id;
				$scope.isedittableItem=true;
				};
				
			//delete target list item	
			$scope.deleteTargetListitem=function(targetListElement){
				var editableItemIndex = $scope.targetListElements.indexOf(targetListElement);
				$scope.targetListElements.splice(editableItemIndex,1);
				$scope.targets.splice(editableItemIndex,1);														// to be implemented
				
			};
			
			/*
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
				        data123: function(){
				        	return obj;
				        }
				      }
				    });
				    
				    modalInstance.result.then(function () {}, function () {
				    });
				}else if(id != ""){//for edit
					}
			};
			*/
			
			$scope.successDialog = function(modalTemplate){
				var obj = [];
				var modalInstance123 = $modal.open({
				      templateUrl: modalTemplate,
				      controller: 'assetsCtrl',
				      size: 'lg',
				      closable: false,
				      resolve: {
				        template: function () {
				          return modalTemplate;
				        },data123: function(){
				        	return obj;
				        }
				      }
				    });
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
				$scope.creativeLst = data.data;
				$scope.chooseFromExisting = false;
			});		
	
});

app.directive('numbersOnly', function(){
	   return {
	     require: 'ngModel',
	     link: function(scope, element, attrs, modelCtrl) {
	       modelCtrl.$parsers.push(function (inputValue) {
	           // this next if is necessary for when using ng-required on your input. 
	           // In such cases, when a letter is typed first, this parser will be called
	           // again, and the 2nd time, the value will be undefined
	           if (inputValue == undefined) return '' 
	           if (transformedInput === 0) {
	        	   transformedInput = 1;
	           }
	           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
	           if (transformedInput!=inputValue) {
	              modelCtrl.$setViewValue(transformedInput);
	              modelCtrl.$render();
	           }  
	           
	           return transformedInput;         
	       });
	     }
	   };
	});


app.directive('validDecimalNumber', function() {
 return {
   require: '?ngModel',
   link: function(scope, element, attrs, ngModelCtrl) {
     if(!ngModelCtrl) {
       return; 
     }

     ngModelCtrl.$parsers.push(function(val) {
       if (angular.isUndefined(val)) {
           var val = '';
       }
       var clean = val.replace(/[^0-9\.]/g, '');
       var decimalCheck = clean.split('.');

       if(!angular.isUndefined(decimalCheck[1])) {
           decimalCheck[1] = decimalCheck[1].slice(0,2);
           clean =decimalCheck[0] + '.' + decimalCheck[1];
       }

       if (val !== clean) {
         ngModelCtrl.$setViewValue(clean);
         ngModelCtrl.$render();
       }
       return clean;
     });

     element.bind('keypress', function(event) {
       if(event.keyCode === 32) {
         event.preventDefault();
       }
     });
   }
 };
});
