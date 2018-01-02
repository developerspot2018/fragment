app.filter('startaAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('salesTargetsCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector) { 
	cssInjector.add("plugins/admin/css/admin-style.css");
	$scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('/admin/salestargets') > -1){
        	return true;
        }
		
    };
    $rootScope.isActive = function (viewLocation) { 
        if(viewLocation === '/admin'){
        	return true;
        } 
    };
	$scope.attributes = {};
    Data.get('salestargets').then(function(data){
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
        if ((data.name=="")) {
			alert("Please fill in all required fields");
			rowform.$show();
		}
		/* else if (data.url=="") {
			alert("Required fields are missing or check url format");
			rowform.$show();
		} */
		else{
			Data.post('salestargets', data).then(function(result){
		      	  console.log('result ',result);
		      	var index =$scope.attributes.indexOf(attribute); 
		        $scope.attributes[index].id = result.data.id;
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
      
	  // remove Attribute
	  $scope.removeAttribute = function(variable,index) {
			Data.delete('salestargets/'+variable.attribute.id).then(function(result){
				  removeCurrentAttribute(variable.attribute);
			  })
	  };
	  
//		cancel insertion
		$scope.cancel=function(product,index,productform){
			if (product.name==="") {
				$scope.attributes.splice($scope.attributes.length-1, 1);
			}else {
				productform.$cancel()
			}
		};
	
	  // add Attribute
	  $scope.addAttribute = function() {
	    $scope.inserted = {
	      name: '',
	      url: '',
	      description: '',
	      custom1: '',
	      custom2:''
	    };
	    $scope.currentPage = 1;
	    $scope.attributes.push($scope.inserted);
	    $scope.totalItems = $scope.attributes.length;
	    $scope.filteredItems = $scope.attributes.length;  
	   
	  };
	  
	  /*
	   *  Removes current row from attribute table
	   */
	  function removeCurrentAttribute(attribute){
		  var index =$scope.attributes.indexOf(attribute); 
		  $scope.attributes.splice(index,1);
	  };
});