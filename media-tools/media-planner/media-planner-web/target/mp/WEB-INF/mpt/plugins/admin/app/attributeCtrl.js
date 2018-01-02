app.filter('startaAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});
app.controller('attributeCtrl', function ($scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location) { 
	cssInjector.add("plugins/admin/css/admin-style.css");
	$scope.attributes = {};
	$scope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };
    
    $rootScope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };
    
    $scope.types = [
                       {value: 'Creative', text: 'Creative'},
                       {value: 'Product', text: 'Product'}
                   ]; 
    
    Data.get('attributes').then(function(data){
        $scope.attributes = data.data;
        $scope.totalItems = $scope.attributes.length;
        $scope.currentPage = 1; //current page
        
        $scope.entryLimit = 10; //max no of items to display in a page
        $scope.filteredItems = $scope.attributes.length; 
        //Initially for no filter
		/* $scope.predicate='id'; */
         $scope.sort_by('id');
        //$scope.reverse = true;
    });
    
    $scope.sort_by = function(predicate) {
    	//console.log(predicate);
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
    
    // update Attribute
    $scope.saveAttribute = function(data, attribute) { 
        //$scope.Attribute not updated yet
        angular.extend(data, {id: attribute.id});
		if((data.name=="")||(data.type=="")||(data.value=="")){
			alert("Please fill in all required fields");
			rowform.$show();
		}else{
		Data.post('attributes', data).then(function(result){
	      	  console.log('result ',result);
	      	var index =$scope.attributes.indexOf(attribute); 
	        $scope.attributes[index].id = result.data.id;
	    });
		
		$scope.inserted = {
	      id: -1,
	      name: '',
	      type: '',
	      value: '',
	      description: '' 
	    };
		}
      };
      
	  // remove Attribute
	  $scope.removeAttribute = function(variable) {
		  Data.delete('attributes/'+variable.attribute.id).then(function(result){
			  removeCurrentAttribute(variable.attribute);
		})
	  };
	  
	  // add Attribute
	  $scope.addAttribute = function() {
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
	  
//	  cancel insertion
		$scope.cancel=function(product,index,productform){
			if (product.name==="") {
				$scope.attributes.splice($scope.attributes.length-1, 1);
			}else {
				productform.$cancel()
			}
		};
		
		/*
		   *  Removes current row from attribute table
		   */
		  function removeCurrentAttribute(attribute){
			  var index =$scope.attributes.indexOf(attribute); 
			  $scope.attributes.splice(index,1);
		  };
	
		  /*
	  $scope.showType = function(attribute) {
		    var selected = [];
		    if(attribute.type) {
		      selected = $filter('filter')($scope.types, {value: attribute.type});
		    }
		    return selected.length ? selected[0].text : 'Not set';
	  };  
	  */
});