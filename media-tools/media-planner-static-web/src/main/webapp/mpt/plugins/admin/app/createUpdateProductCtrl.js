app.controller('createUpdateProductCtrl', function($scope, $modal, $rootScope, $location, Data, $http, cssInjector, ModalService, Validation,$routeParams) {
	cssInjector.add("plugins/admin/css/admin-style.css");
	$http.get('plugins/admin/js/products-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;    
      });
	 
	$scope.targetListElements=[];
	$scope.selectedElements=[];
	$scope.selectedList=[];
	$scope.targets = [];
	$scope.selElmnList=[];
	$scope.selectedSalesTarget = '';
	var productID=$routeParams.id;
	$scope.isedittableItem==false;
	var selectedElementId;
	$scope.typesOptions = [
	                {value: 'Expandable', text: 'Expandable'},
                    {value: 'Image', text: 'Image'},
	                {value: 'Rich Media', text: 'Rich Media'},
	                {value: 'Video', text: 'Video'},
                    {value: 'Video Interstitial', text: 'Video Interstitial'}
                ]; 
	
	$scope.classeOptions = [
	                {value: 'Display Cross Platform', text: 'Display Cross Platform'},
	                {value: 'Email', text: 'Email'},
	                {value: 'Mobile', text: 'Mobile'},
	                {value: 'Programmatic', text: 'Programmatic'},
	                {value: 'Tablet', text: 'Tablet'},
	                {value: 'Web', text: 'Web'}                    
                ];
	
	Data.get('creatives').then(function(data) {
		$scope.creativesList = data.data.content;
	});
	
	Data.get('salestargets?').then(function(data) {
		$scope.salesTargets=data.data.content;	
	});
	
	Data.get('targetcategory').then(function(result){
      	$scope.targetTypeOptions=result.data;
    });
	$scope.targetListElements.forEach(function(value,id){
		$scope.targets.push({"id":value.targetElements.targetElementsId});
	})
	
	
//	$scope.$watch("selectedElements", function(newVal, oldVal) {
//		var elementName = "";
//		if($scope.selectedElements !=null && $scope.selectedElements != ""){
//			//console.log($scope.selectedElements);
//			for(var st in $scope.selectedElements){
//				elementName = elementName + (elementName != "" ? ",": '');
//				elementName = elementName + $scope.selectedElements[st].value;
//			}
//		}
//		$scope.elementName= elementName;
//	});
	
	$scope.attributes = [];
	if(productID > 0 && productID!=undefined){
		Data.get("products/"+productID).then ( function (data) {
			$scope.productData = data.data;
			$scope.productName=$scope.productData.name;
			$scope.type=$scope.productData.type;
			$scope.classs=$scope.productData.classs;
			$scope.basePrice=$scope.productData.basePrice;
			$scope.description=$scope.productData.description;
			Data.get('products/'+ productID + '/creatives').then(function(creativeData) {
				 $scope.creative = creativeData.data.id;
			});
			
			Data.get('products/'+productID + '/salestargets').then(function(stData) {
				$scope.salesTargetList = $scope.salesTargets;
				$scope.selectedSalesTarget = stData.data;
				$scope.selectedSalesTarget.forEach(function(selectedValue,i){
					$scope.salesTargetList.forEach(function(value,j){
						if(selectedValue.id == value.id){
							value.ticked = true;
						}
					})
					selectedValue.ticked = true;
				})
			});
			 Data.get('products/'+ productID+'/attributes').then( function(result) {
				 $scope.attributeList=result.data;
				 $scope.attributeList.forEach(function(value,i){
					 $scope.attributes.push({id: value.id});
				 })
			 });
			 
			 Data.get('products/'+ productID+'/targets').then( function(resultData) {
				 $scope.selElmnList=resultData.data;
				 //$scope.targetListElements.length = 0;
				 resultData.data.forEach(function(value,i){
					var flag = true;
					 $scope.targetListElements.forEach(function(targetValue,j){
						 if(value.category.id == targetValue.categoryId){
							 flag = false;
							 targetValue.targetElements.push({"targetElementsId":value.id,"targetElementsValue":value.value});	
						 }
					 });
					 
					 if($scope.targetListElements.length == 0 || flag) {
						 var targetElements = [];
						 targetElements.push({"targetElementsId":value.id,"targetElementsValue":value.value});
						 $scope.targetListElements.push({"categoryId": value.category.id, "categoryName": value.category.name ,"targetElements":targetElements});
					 } 
				 });
			 })
		});
	}
	
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
	
	 $scope.checkErrors= false;
	 $scope.saveProductInformation = function() {
		 $scope.checkErrors = true;
		 $scope.isSalesTargetListCheckErrors  = false;
		 var flag = false;
		 if($scope.createUpdateProduct.$error.required != undefined && $scope.createUpdateProduct.$error.required.length > 0){
			 flag = true;
			 angular.element(".product-form-wrapper div.form-group").addClass("has-error");
		 } 			
		 if ($scope.createUpdateProduct.$invalid ){ 
			 flag = true;
		 }
		 $scope.salesTarget =[];
		 for(var val in $scope.selectedSalesTarget){
			 $scope.salesTarget.push({id: $scope.selectedSalesTarget[val].id});
		 }
		 if($scope.salesTarget == undefined ||$scope.salesTarget.length == 0){
				$scope.isSalesTargetListCheckErrors  = true;
				flag = true;
		 }
		 if(flag) {
			 return; 
		 }
		
		 $scope.targetListElements.forEach(function(value,id){
			    value.targetElements.forEach(function(elementVal,idx){
			    	$scope.targets.push({"id":elementVal.targetElementsId});
			    	//console.log("test"+$scope.targets)
			   })
			})
		
  	    $scope.inserted = {
  	      id: productID,
  	      name:  $scope.productName,
  	      type: $scope.type,
  	      classs: $scope.classs,
  	      basePrice: $scope.basePrice,
  	      description: $scope.description,
  	      salesTargetList:$scope.salesTarget,
  	      creative:{"id":$scope.creative},
  	      attributes: $scope.attributes,
  	      targets:$scope.targets
  	    };
	  	    
	  if(productID > 0){
		  Data.put('products',$scope.inserted).success(function(results){
			results.status = 'success';
  	        results.message = "Saved"//$scope.propertyMessage.proposalSaved;
  	        Data.toast(results);
			$location.path('/admin/product');
	    }).error(function(results){
  	        results.status = 'error';
	    	results.message = "Error not saved"//$scope.propertyMessage.rendomError;
  	        Data.toast(results);
	    });
		  
	  }else{
	    Data.post('products', $scope.inserted).success(function(results){
	    	results.status = 'success';
  	        results.message = "Saved"//$scope.propertyMessage.proposalSaved;
  	        Data.toast(results);
  	        $location.path('/admin/product');
	    }).error(function(results){
	    	results.status = 'error';
	    	results.message = "Error not saved"//$scope.propertyMessage.rendomError;
  	        Data.toast(results);
	    });
	  }
  };
	  	$scope.cancelProduct = function() {
	  		$location.path('/admin/product');
		}
	    	
	  	$scope.getElements=function(){
	   		 Data.get('targetcategory/'+ $scope.targetTypeOption.id).then(function(result){
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
	   		 });
	   	};
	 //targetValue.targetElements  	 
	//add target list element
	$scope.addTargetElement=function(){
		 var zipId= "999"; //Static zipcode element ID
		 var targetElements = [];
		 if($scope.targetTypeOption.name==="Zip Code"){
			 targetElements.push({"targetElementsId": zipId,"targetElementsValue":$scope.zipcode});
		 }else{
			 $scope.selectedElements.forEach(function(value,k){
				 targetElements.push({"targetElementsId":value.id,"targetElementsValue":value.value});
			 })
		 }
		 
		 
	
		 var flag = true;
		 $scope.targetListElements.forEach(function(targetValue,j){
			 if($scope.targetTypeOption.id == targetValue.categoryId){
				 flag = false;
				 targetValue.targetElements = targetElements;
			 }
		 });
		 
		 if($scope.targetListElements.length == 0 || flag) {
			 $scope.targetListElements.push({"categoryId": $scope.targetTypeOption.id, "categoryName": $scope.targetTypeOption.name ,"targetElements":targetElements});
		 } 
		 
	
	}
	
	
	
	
	
	
	
	
	
	
	
	/**var newElement={};

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
	//CODE TO ADD SCROLLER IN TARGET TABLE
	if($scope.targetListElements.length>5){
		$(".proposal .pp-target-table").css("overflow-y","scroll");
	}
	
};*/
	//delete target list item	
	$scope.deleteTargetListitem=function(targetListElement){
		var editableItemIndex = $scope.targetListElements.indexOf(targetListElement);
		$scope.targetListElements.splice(editableItemIndex,1);
		$scope.targets.splice(editableItemIndex,1);														// to be implemented
		
	};
	   		
	   	//edit target list element
   		$scope.editTargetListItem=function(targetListElement){
   			$scope.targetTypeOption=targetListElement.name;
   			$scope.element=targetListElement.value;
   			selectedElementId=targetListElement.id;
   			$scope.isedittableItem=true;
   			};
	//validate number fields
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
   		
			
			
});
