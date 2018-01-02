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

app.controller('productCtrl', function($scope, $modal, $rootScope, $location, Data, $http, cssInjector) {
	cssInjector.add("plugins/admin/css/admin-style.css");
	
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
		
		
	Data.get('salestargets').then(function(data) {
		$scope.salesTargets=data.data;	
	});
	
	Data.get('creatives').then(function(data) {
		$scope.creativesList=data.data;
	});
	
	$scope.products = {};
	$scope.rowClicked = false;
	
	
	// What does this code do? Manjeert
	$(document).ready(function(){
		 $('#productTable').on('click', 'tbody tr', function(event) {
		    $(this).addClass('selectedRow').siblings().removeClass('selectedRow');
		});
	 })
	// What does this code do? Manjeert
	 
	 /*
	  * Removes current row from product table
	  */
	  function removeCurrentProduct(product){
		  var index =$scope.products.indexOf(product); 
		  $scope.products.splice(index,1);
	  };
	
	  
	  /*
		 * Retrieves product data from backend and dispalys on screen
		 */
	Data.get('products').then(function(data) {
		$scope.products = data.data;
		$scope.totalItems = $scope.products.length;
		$scope.currentPage = 1; // current page

		$scope.entryLimit = 10; // max no of items to display in a page
		$scope.filteredItems = $scope.products.length;
		// Initially for no filter
		$scope.sort_by('id');
		$scope.productAtrributes=$scope.products[0].attributes;
		$scope.filteredAttributeItems = $scope.products[0].attributes.length;
	});

	$scope.sort_by = function(predicate) {
		$scope.predicate = predicate;
		$scope.reverse = !$scope.reverse;
	};

	// update Attribute
	$scope.saveProduct = function(data, product) {
		// $scope.Attribute not updated yet
// alert("n "+data.data.name);
		angular.extend(data, {
			id : product.id
		});
		/* alert(data.basePrice+" dasd"); */
		if ((data.name=="") || (data.basePrice=="") || (data.type=="") || (data.classs=="")) {
		alert("Please fill in all required fields.");
		productform.$show();
			/* $scope.products.splice($scope.products.length-1, 1); */
		}else{
			Data.post('products', data).then(function(result){
          	  var index =$scope.products.indexOf(product); 
                $scope.products[index].id = result.data.id; 
          });
		  
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
		Data.delete('products/'+variable.product.id).then(function(result){
			  removeCurrentProduct(variable.product);
		})
	};
	
	// add Product
	$scope.addProduct = function() {
		$scope.inserted = {
			id: -1,
			name : '',
			displayName : '',
			description : '',
			note : '',
			type : '',
			classs : '',
			custom1 : '',
			custom2 : ''
		};
		$scope.currentPage = 1;
		$scope.products.push($scope.inserted);
		$scope.totalItems = $scope.products.length;
		$scope.filteredItems = $scope.products.length;
		$scope.filteredAttributeItems = $scope.products[0].attributes.length;

	};
	
// cancel insertion
	$scope.cancel=function(product,index,productform){
		if (product.name==="") {
			$scope.products.splice($scope.products.length-1, 1);
		}else {
			productform.$cancel()
		}
	};
	
	/*
	 * Methods for attributes accossiated with current product
	 */
	  
	  
	  
	  /*
		 * Get attributes accossiated with current product
		 */
	  $scope.selectedProduct = {};
	  $scope.attributeGrid = {};
	  $scope.attributeGrid.attributes = [];
	  $scope.attributeAssociate = true;
	  var attributeContainer;
	  $scope.fetchAttributes = function(self){
		  $scope.rowClicked = true;
		  $scope.selectedProduct = self.product;
		  Data.get('products/'+self.product.id).then(function(result){
			    $scope.products.forEach(function(data,i){
			    	data.showAttributes = false;
			    })
			  	$scope.selectedProduct.showAttributes = true;
			    /* alert("sdas "+ self.product.showAttributes); */
				$scope.attributeGrid.attributes = result.data.attributes;
				$scope.totalAttributeItems = $scope.attributeGrid.attributes.length;
				$scope.attributeCurrentPage = 1; // current page
				$scope.attributeEntryLimit = 5; // max no of items to display in
												// a page
				$scope.attributeFilteredItems = $scope.attributeGrid.attributes.length; 
				$scope.sortAttribute_by('id');
				
		  });
	  }
	  
	  /*
		 * Removes current row from attribute table
		 */
	  function removeCurrentAttribute(attribute){
		  var index =$scope.attributeGrid.attributes.indexOf(attribute); 
		  $scope.attributeGrid.attributes.splice(index,1);
	  };
	  
	  $scope.sortAttribute_by = function(predicate) {
		  $scope.attributePredicate = predicate;
		  $scope.reverseAttribute = !$scope.reverseAttribute;
	  };
	  
	  /*
		 * Saves or Updates attribute for creative
		 */
	  $scope.saveAttribute = function(data, attribute) {
		  $scope.selectedProduct.attributes.push({"id":attribute.id});
		  var postData = $scope.selectedProduct;
		  if(data.name == ""){
			  alert('required fields missing');
			  removeCurrentAttribute(data);
		  }
		  else{
			  Data.put('products', postData).then(function(result){
				  console.log('result ',result);
				  var index =$scope.attributeGrid.attributes.indexOf(attribute); 
				  $scope.attributeGrid.attributes[index].name = attribute.name.name; 
				  
				  $scope.inserted = {
							id:-1,
						  name: '',
						  // type: '',
						  description: '',
						  value: ''
				  };
			  });
		  }
	  };
	  
	  /*
		 * Delete Attribute from attribute table
		 */
		  $scope.removeAttribute = function(self) {
			  removeCurrentAttribute(self.attribute);
			  self.$parent.product.attributes = $scope.attributeGrid.attributes;
			  var jsonString = self.$parent.product;
			  Data.put('products' , jsonString ).then(function(result){
				 console.log(result);
			  })
		  };
		  
		 Data.get('attributes').then(function(result){
			 $scope.attributeList1=[];
			  $scope.attributeList1 = result.data;
		  });
		  
		  $scope.attributeList=[];
		  /*
		   * Insert Blank row on the top of Attribute Table
		   */
		  $scope.addAttribute = function() {
				  if(!$scope.attributeGrid.attributes){
					  $scope.attributeGrid.attributes = [];
				  }
					$scope.attributeEdit = false;
			  		$scope.attributeAssociate = true;
			  		$scope.attributeList = [];
				  angular.forEach($scope.attributeList1, function(list){
					  if (list.type==="Product") {
							$scope.attributeList.push(list);
						}
				  });
				  
//			  $scope.attributeList;
				  $scope.inserted = {
						  name: '',
//						  type: '',
						  description: '',
						  value: ''
				  };
				 	$scope.attributeGrid.attributes.push($scope.inserted);
				    $scope.attributeCurrentPage = 1; //current page
					$scope.attributeFilteredItems = $scope.attributeGrid.attributes.length; 
			 
		  };
		  
		  /*
			 * To select and populate attribute in attribute table in order to
			 * assocciate it with selected product
			 */
		  $scope.selectAttribute = function(self){
			  var index = $scope.attributeGrid.attributes.indexOf(self.$parent.attribute); 
			  // $scope.attributes[index].type = self.$data.type;
			  $scope.attributeGrid.attributes[index].description = self.$data.description;
			  $scope.attributeGrid.attributes[index].value = self.$data.value;
			  $scope.attributeGrid.attributes[index].id = self.$data.id;
		  }
		  
		  /*
			 * Cancel Editing Row in Attribute Table
			 */
		  $scope.cancelAttributeEdit = function(self){
			  var currentRow = self.attribute;
			  if(currentRow.name == "" || currentRow.type == ""){
				  removeCurrentAttribute(currentRow);
			  }
		  	};
		  	
		  	
		  	/*
			 * Edit attribute Form
			 */
		  	$scope.editAttributeForm = function(self){
		  		$scope.attributeEdit = true;
		  		$scope.attributeAssociate = false;
		  	}
			
			/*for hiding the inner grid*/
		  	
		  	$scope.hide=function(self){
		  		self.product.showAttributes = false;
		  	}

});
