app.filter('startCreativeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.splice(start);
	 }
	 return [];
	 }
});

app.filter('startAttributeFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; //parse to int
	 return input.splice(start);
	 }
	 return [];
	 }
});


app.controller('creativeCtrl', function ($scope, $rootScope, $location, $modal, Data, $http, cssInjector,$filter) { 
	cssInjector.add("plugins/admin/css/admin-style.css");
	$scope.creatives = {};
	$scope.rowClicked = false;
	
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
	
	// What does this code do?  
    $(document).ready(function(){
		 $('#creativeTable').on('click', 'tbody tr', function(event) {
		    $(this).addClass('selectedRow').siblings().removeClass('selectedRow');
		});
	 })
	// What does this code do? 
	 
	/*
	 * Removes current row from creative table
	 */
	function removeCurrentCreative(creative){
		 var index =$scope.creatives.indexOf(creative); 
		  $scope.creatives.splice(index,1);
	};
	
	/*
	 * Retrieves creatives data from backend and dispalys on screen
	 */
    Data.get('creatives').then(function(data){
        $scope.creatives = data.data;
        $scope.totalItems = $scope.creatives.length;
        $scope.currentPage = 1; //current page
        
        $scope.entryLimit = 10; //max no of items to display in a page
        $scope.filteredItems = $scope.creatives.length; 
        //Initially for no filter
        $scope.sort_by('id');
        //$scope.reverse = true;
    });
    
    $scope.sort_by = function(predicate) {
		 $scope.predicate = predicate;
		 $scope.reverse = !$scope.reverse;
	};
	
    // insert or update Creative
    $scope.saveCreative = function(data, creative) {
        //$scope.Creative not updated yet
        angular.extend(data, {id: creative.id});
        if(data.name == "" || data.type == ""|| data.height1 == ""|| data.width1 == ""){
        	alert('Please fill in all required fields.');
        	creativeform.$show();
        }
        else{
        	Data.post('creatives', data).then(function(result){
            	  console.log('result ',result);
            	  var index =$scope.creatives.indexOf(creative); 
                  $scope.creatives[index].id = result.data.id; 
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
	  $scope.removeCreative = function(self) {
		  Data.delete('creatives/' + self.creative.id).then(function(result){
			  removeCurrentCreative(self.creative);
		  })
	  };
	
	  // add Creative
	  $scope.addCreative = function() {
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
	  };
	  
	  // cancel editing or adding new creative
	  $scope.cancelCreativeEdit = function(self){
		  var currentRow = self.creative;
		  if(currentRow.name == "" || currentRow.type == ""|| currentRow.height1 == ""|| currentRow.width1 == ""){
			  removeCurrentCreative(currentRow);
		  }
	  }
	  
	  
	  /*
	   * Methods for attributes accossiated with current creative
	   */
	  
	  
	  
	  /*
	   * Get attributes accossiated with current creative
	   */
	  $scope.selectedCreative = {};
	  var attributeContainer;
	  $scope.fetchAttributes = function(self){
		  $scope.rowClicked = true;
		  $scope.selectedCreative = self.creative;	 
		  $scope.selectedCreative.attributeGrid = {};
		  $scope.selectedCreative.attributeGrid.attributes = [];

		  Data.get('creatives/'+self.creative.id).then(function(result){
			    $scope.creatives.forEach(function(data,i){
			    	data.showAttributes = false;
			    })
			    $scope.selectedCreative.attributeEdit = false;
		  		$scope.selectedCreative.attributeAssociate = true;
			  	$scope.selectedCreative.showAttributes = true;
			    $scope.selectedCreative.attributeGrid={};
				$scope.selectedCreative.attributeGrid.attributes = result.data.attributes;
				$scope.selectedCreative.totalAttributeItems = $scope.selectedCreative.attributeGrid.attributes.length;
				$scope.selectedCreative.attributeCurrentPage = 1; //current page
				$scope.selectedCreative.attributeEntryLimit = 5; //max no of items to display in a page
				$scope.selectedCreative.attributeFilteredItems = $scope.selectedCreative.attributeGrid.attributes; 
				$scope.sortAttribute_by('id');
		  });
	  }
	  
	  /*
	   *  Removes current row from attribute table
	   */
	  function removeCurrentAttribute(attribute){
		  var index =$scope.selectedCreative.attributeGrid.attributes.indexOf(attribute); 
		  $scope.selectedCreative.attributeGrid.attributes.splice(index,1);
	  };
	  
	  $scope.sortAttribute_by = function(predicate) {
		  $scope.attributePredicate = predicate;
		  $scope.reverseAttribute = !$scope.reverseAttribute;
	  };
		
		/*
		 * Saves or Updates attribute for creative
		 */
	  $scope.saveAttribute = function(data, attribute,self) {
		  if(!$scope.selectedCreative.attributes){
			  $scope.selectedCreative.attributes = [];
		  }
		  $scope.selectedCreative.attributes.push({"id":attribute.id});
		  var postData = prepareJSON($scope.selectedCreative);
		  if(data.name == ""){
			  alert('Required fields are missing');
			  removeCurrentAttribute(data);
		  }
		  else{
			  if($scope.selectedCreative.attributeEdit){
				  Data.put('attributes', self.attribute).then(function(result){
					  //console.log(result);
				  })
			  }
			  else{
				  Data.put('creatives', postData).then(function(result){
					  //console.log('result ',result);
					  var index =$scope.selectedCreative.attributeGrid.attributes.indexOf(attribute); 
					  $scope.selectedCreative.attributeGrid.attributes[index].name = attribute.name.name; 
				  });
			  }
			  
			  $scope.inserted = {
					  name: '',
//					  type: '',
					  description: '',
					  value: ''
			  };
		  }
	  };
		  
	  
	 /*
	  * Delete Attribute from attribute table
	  */
	  $scope.removeAttribute = function(self) {
		  removeCurrentAttribute(self.attribute);
		  self.$parent.creative.attributes = $scope.selectedCreative.attributeGrid.attributes;
		  var jsonString = prepareJSON(self.$parent.creative);
		  Data.put('creatives' , jsonString ).then(function(result){
			 //console.log(result);
		  })
	  };
	  
	  Data.get('attributes').then(function(result){
		  $scope.attributeList1 = [];
		  $scope.attributeList1 = result.data;
	  });
	  
	  $scope.selectedCreative.attributeList=[];
	  /*
	   * Insert Blank row on the top of Attribute Table
	   */
	  $scope.addAttribute = function() {
			  if(!$scope.selectedCreative.attributeGrid.attributes){
				  $scope.selectedCreative.attributeGrid.attributes = [];
			  }
				$scope.selectedCreative.attributeEdit = false;
		  		$scope.selectedCreative.attributeAssociate = true;
		  		$scope.selectedCreative.attributeList=[];
			  angular.forEach($scope.attributeList1, function(list){
				  if (list.type==="Creative") {
						$scope.selectedCreative.attributeList.push(list);
					}
			  });
			  
//		  $scope.selectedCreative.attributeList;
			  $scope.selectedCreative.inserted = {
					  name: '',
//					  type: '',
					  description: '',
					  value: '',
					  id:''
			  };
			 	$scope.selectedCreative.attributeGrid.attributes.push($scope.selectedCreative.inserted);
			    $scope.selectedCreative.attributeCurrentPage = 1; //current page
				$scope.selectedCreative.attributeFilteredItems = $scope.selectedCreative.attributeGrid.attributes; 
		 
	  };
	  
	  /*
	   * To select and populate attribute in attribute table
	   * in order to assocciate it with selected creative
	   */
	  $scope.selectAttribute = function(self){
		  var index = $scope.selectedCreative.attributeGrid.attributes.indexOf(self.$parent.$parent.attribute); 
		  if($scope.selectedCreative.attributeGrid.attributes[index] == undefined)
			  $scope.selectedCreative.attributeGrid.attributes[index]={};
		  $scope.selectedCreative.attributeGrid.attributes[index].description = self.$data.description;
		  $scope.selectedCreative.attributeGrid.attributes[index].value = self.$data.value;
		  $scope.selectedCreative.attributeGrid.attributes[index].id = self.$data.id;
		  $scope.selectedCreative.attributeGrid.attributes[index].name = self.$data.name;
	  }
		  
	  /*
	   * Cancel Editing Row in Attribute Table
	   */
	  $scope.cancelAttributeEdit = function(self){
		  var currentRow = self.attribute;
		  if(currentRow.name == "" || currentRow.type == "" || $scope.selectedCreative.attributeAssociate){
			  removeCurrentAttribute(currentRow);
		  }
	  	};
	  	
	  	
	  	/*
	  	 * Edit attribute Form
	  	 */
	  	$scope.editAttributeForm = function(self){
	  		$scope.selectedCreative.attributeEdit = true;
	  		$scope.selectedCreative.attributeAssociate = false;
	  	}
		
		/*for hiding the inner grid*/
		  	
		  	$scope.hide=function(self){
		  		self.creative.showAttributes = false;
		  	}
		  	
		  	
		/*
		 * Prepare Attribute JSON
		 */
		function prepareJSON (creative){
			var tempJSON = {};
			tempJSON.id= creative.id;
			tempJSON.name = creative.name;
			tempJSON.type = creative.type;
			tempJSON.width1 = creative.width1;
			tempJSON.width2 = creative.width2;
			tempJSON.height1 = creative.height1;
			tempJSON.height2 = creative.height2;
			tempJSON.description = creative.description;
			tempJSON.attributes = creative.attributes;
			return tempJSON; 
		}
	  	
});
