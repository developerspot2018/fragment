/**
 * createUpdatelLineItemCtrl is a controller for create and update line item functionality.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: proposal
 */

// Add filter 
app.filter('startLineItemsFrom', function() {
	 return function(input, start) {
	 if(input && Object.keys(input).length>0) {
	 start = +start; // parse to int
	 return input.slice(start);
	 }
	 return [];
	 }
});

app.controller('createUpdatelLineItemCtrl', function ($routeParams, $scope,$rootScope, $location, $modal, Data, $http, cssInjector, $location, ModalService, Validation) {
	
	// Add required css file
	cssInjector.add("plugins/proposal/css/proposal-style.css");
	
	// Add proposal property file to load static data.
	$http.get('plugins/proposal/js/proposal-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	// Add proposals message property file to load static messages
	$http.get('plugins/proposal/js/proposal-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	
	
	// Make proposal tab selected
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('proposal') > -1){
        	return true; 
        }
		return false;
    };
	
    
    
 // Make left menu selected
    $rootScope.isSubMenueActive = function(path){
    	var flag = false;
    	if($scope.selectedTab=='Proposal' && $scope.subSelectedTab==path)
    		flag = true;
    	return flag;
    }

     $scope.isOpen = function(val){
		var flag = false;
		if(val=='proposal')
			flag = true;
		return flag;
	};
	
    $scope.subSelectedTab = $rootScope.lefNavActive;
    $scope.selectedTab = '';
    
    // get proposals  by status
    $scope.setProposalStatus = function(status){
		$scope.selectedTab = 'Proposal';
		switch(status)
		{
		case 'All':
			$scope.subSelectedTab = 'all';
		break;
		case 'MyOrders':
			$scope.subSelectedTab = 'my';
		break;
		case 'Pending':
			$scope.subSelectedTab = 'pending';
		break;
		case 'Proposed':
			$scope.subSelectedTab = 'proposed';
		break;
		case 'Rejected':
			$scope.subSelectedTab = 'rejected';
		break;
		case 'Review':
			$scope.subSelectedTab = 'review';
		break;
		case 'Signed':
			$scope.subSelectedTab = 'signed';
		break;
		case 'Sold':
			$scope.subSelectedTab = 'sold';
		break;
		default:
			$scope.subSelectedTab = 'all';
		};
		
	}
	$scope.newLineItem = {};
	
	//Encode and decode url function
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	var valArr = Base64.decode($routeParams.lid).split('-');
	$scope.proposalId = valArr[1];
	$scope.lineItemlId = valArr[3];
	//alert($scope.lineItemlId+"proposalId"+$scope.proposalId);
	/*$(document).ready(function () {*/
	
	// adds date picker on start date and end date field
	setTimeout(function(){
		// Implement date picker on start date field
		$('#lineItemStartDate').datetimepicker({
			changeMonth: true,
			changeYear: true/*,
			timeFormat: "hh:mm tt"*/
		});
		
		// Implement date picker on end date field
		$('#lineItemEndDate').datetimepicker({
			changeMonth: true,
		    changeYear: true/*,
		    timeFormat: "hh:mm tt"*/
		});

	},100);
	
	// Set calender's min and max date on start date and end date
	setTimeout( function() {
		$('#lineItemStartDate').datetimepicker("option","minDate", new Date($rootScope.currentProposal.startDate));
		$('#lineItemStartDate').datetimepicker("option","maxDate", new Date($rootScope.currentProposal.endDate));
		
		$('#lineItemEndDate').datetimepicker("option","minDate", new Date($rootScope.currentProposal.startDate));
		$('#lineItemEndDate').datetimepicker("option","maxDate", new Date($rootScope.currentProposal.endDate));
	}, 200) 
   /*});*/
	// Initialize default date and time to start date and end date in case on creating a new line item.
	if($scope.lineItemlId == 0 ) {
		setTimeout( function() {
			$('#lineItemStartDate').datetimepicker("setDate", new Date($rootScope.currentProposal.startDate) );
			$('#lineItemEndDate').datetimepicker("setDate", new Date($rootScope.currentProposal.endDate) );
		}, 300);
	}
	
//	$scope.targetTypeOptions = [
//            { value: 'country', label: 'Country'},
//            { value: 'age', label: 'Age'},
//            { value: 'zipcodes', label: 'Zip Codes'}
//           ];
  	
	// Meta data for spec type options
	$scope.specTypeOptions = [
	      { value: 'rich-media', label: 'Rich Media'},
	      { value: 'html-5', label: 'HTML 5'},
	      { value: 'standard', label: 'Standard'},
	      { value: 'text', label: 'Text'},
	      { value: 'video', label: 'Video'}
	     ];
	  	
	// Meta data for price type options
	$scope.priceTypeOptions = [
	      { value: 'cpm', label: 'CPM'},
	      { value: 'cpc', label: 'CPC'},
	      { value: 'cpa', label: 'CPA'},
	      { value: 'cpd', label: 'CPD'}
	     ];
		
	// Meta data for priority type options
	$scope.priorityTypeOptions = [
	  	      { value: 'Standard', label: 'Standard'},
	          { value: 'preemptible', label: 'Preemptible'},
	          { value: 'exclusive', label: 'Exclusive'}
	     ];
	$scope.newLineItem.deliveryPriority = 'Standard';
	  	
	// Meta data for status type options
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
	//$scope.newLineItem = {};
	$scope.productCreativeDetails={};
	$scope.showCreativeIcon=false;
	// returns sales targets on product drop down change
	$scope.getSalestargets = function () {
		
		var id = $scope.newLineItem.product;
		Data.get('products/'+id+'/salestargets').then(function(data) {
			$scope.salesTargetList = data.data;
			$scope.sortByKey($scope.salesTargetList,'' ,'Asc');
		});
		$scope.getCreativeDetails(id);
	};
	
	$scope.getCreativeDetails=function(productId){
		Data.get('products/'+productId+'/creatives').then(function(data) {
			$scope.showCreativeIcon='show';
			$scope.productCreativeDetails.id=data.data.id;
			$scope.productCreativeDetails.attributes = data.data.attributes;
			$scope.productCreativeDetails.name=data.data.name;
			$scope.productCreativeDetails.type=data.data.type;
			$scope.productCreativeDetails.width1=data.data.width1;
			$scope.productCreativeDetails.width2=data.data.width2;
			$scope.productCreativeDetails.height1=data.data.height1;
			$scope.productCreativeDetails.height2=data.data.height2;
			$scope.productCreativeDetails.description=data.data.description;
			$scope.productCreativeDetails.custom1=data.data.custom1;
			$scope.productCreativeDetails.custom2=data.data.custom2;
		});
	}
	
	
	$scope.showCreativeDetails=function(val){
		if (val == 'true'){
			$scope.showCreative = true;
			$scope.showCreativeIcon='hide';
		}
		else{
			$scope.showCreative = false;
			$scope.showCreativeIcon='show';
		}
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
	
	// returns base price on product drop down change
	$scope.getBasePrice = function () {
		var id = $scope.newLineItem.product;
		Data.get('products/'+id).then(function(data) {
			$scope.newLineItem.basePrice = data.data.basePrice;
		});
		
	};
	
	// returns products list
	$scope.productList = [];
	  Data.get('products/list').then(function(data) {
		  $scope.productList = data.data;
	  });
	  
	  	
	  // returns sales category if proposal id exist
	  if (isNaN($scope.proposalId) || isNaN($scope.lineItemlId) || $scope.proposalId <= 0 || $scope.lineItemlId < 0) {
		  $location.path('/proposal');
	  } else {
		  Data.get('proposals/' + $scope.proposalId).then(
				function(data) {
						$scope.salesCategory = data.data.salesCategory;
	      });
	}
	  
/*	  $scope.getPlacementName = function () {
			var id = $scope.newLineItem.product;
			Data.get('products/'+id).then(function(data) {
				$scope.newLineItem.placeHolder = data.data.name+" in "+$scope.salesCategory;
				
			});
		};*/

	// on click of cancel button return on the proposal detail page
   $scope.cancelLineItem = function() {
		   $location.path('/proposal/proposal-detail-'+$scope.proposalId );
   };
   
  
   
    // display line item information in case of update/edit line item
	$scope.getLineItemData = function(id) {
		var productId='';
		Data.get('line-items/'+id).then(function(result){
			Data.get('line-items/'+$scope.lineItemlId+"/salestargets").then(function(data){
		    	$scope.selectedTarget = data.data;
			});
			// returns selected product id of line item
			Data.get('line-items/'+$scope.lineItemlId+"/products").then(function(data){
			$scope.getCreativeDetails(data.data.id);
			$scope.selectedProductId = data.data.id;
	    	$scope.lineItemData  = result.data;
	    	$scope.newLineItem.selectedProductVal = $scope.selectedProductId;
	    	var tempStartDate = new Date($scope.lineItemData.startDate);
	    	var tempEndDate = new Date($scope.lineItemData.endDate);
	    	$('#lineItemStartDate').datetimepicker("setDate", tempStartDate);
	    	$('#lineItemEndDate').datetimepicker("setDate", tempEndDate);
			 $scope.newLineItem.price=$scope.lineItemData.price;
			 $scope.newLineItem.offeredQuantity=$scope.lineItemData.offeredQuantity;
			 $scope.newLineItem.basePrice=$scope.lineItemData.basePrice;
			 $scope.newLineItem.custom2=$scope.lineItemData.custom2;
			 $scope.newLineItem.id=$scope.lineItemData.id;
			 $scope.newLineItem.product=$scope.selectedProductId;
			 productId=$scope.selectedProductId;
			 $scope.newLineItem.paymentModel=$scope.lineItemData.paymentModel;
			 $scope.newLineItem.specTypeOption=$scope.lineItemData.custom3;
			 $scope.newLineItem.deliveryPriority=$scope.lineItemData.deliveryPriority;
			 $scope.newLineItem.deliveryStatus=$scope.lineItemData.deliveryStatus;
			 $scope.newLineItem.placeHolder=$scope.lineItemData.placeHolder;
			 $scope.newLineItem.investment=$scope.lineItemData.investment;
			 Data.get('line-items/'+id+"/products/"+$scope.selectedProductId+"/salestargets").then(function(data){
			 //Data.get('products/'+ $scope.newLineItem.product).then(function(data) {
					$scope.salesTargetList = data.data;
					$scope.selectedSalesTarget = $scope.selectedTarget;
					$scope.selectedSalesTarget.forEach(function(selectedValue,i){
						$scope.salesTargetList.forEach(function(value,j){
							if(selectedValue.id == value.id){
								value.ticked = true;
							}
						})
						selectedValue.ticked = true;
					})
					
				});
			 
			 Data.get('line-items/'+id+"/targets").then( function(resultData) {
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
			 $scope.newLineItem.custom4=$scope.lineItemData.custom4;
	   });});
		
		
	} 
	
	
	if (isNaN($scope.proposalId)  || isNaN($scope.lineItemlId)  || $scope.proposalId  <= 0 || $scope.lineItemlId < 0 )  {
		 $location.path('/proposal');
	} else if($scope.lineItemlId > 0){
		$scope.getLineItemData($scope.lineItemlId);
	} 
	
	
	$scope.targetListElements=[];
	$scope.isedittableItem=false;
	var selectedElementId;
	
	if (isNaN($scope.proposalId)  || isNaN($scope.lineItemlId)  || $scope.proposalId  <= 0 || $scope.lineItemlId < 0 )  {
		 $location.path('/proposal');
	} else {
		Data.get('proposals/'+$scope.proposalId).then(function(data) {
			$scope.proposal = data.data;
			$scope.proposalStartDate=$scope.proposal.startDate;
			$scope.proposalEndDate=$scope.proposal.endDate;
			$rootScope.currentProposal = data.data;
			
		});
	}
	
	
	$scope.getInvestment = function () {
		 var quentity=parseInt($scope.newLineItem.offeredQuantity);
		 var offeredPrice= parseInt($scope.newLineItem.price);
		 if (quentity>0 &&  offeredPrice>0){
			 $scope.isInvestment = true;
			 $scope.newLineItem.investment = ((quentity*offeredPrice)/1000);
	     }	else{
	    	 
	     }
			
		};
		
		
	
	
//	// calculates investment in the line item
//	 $scope.isInvestment = false;
//	 $scope.isOfferedQuantity = false;
//	 $scope.isOfferedPrice = false;
//	 $scope.getInvestment = function () {
//		 var quentity=parseInt($scope.newLineItem.offeredQuantity);
//		 var offeredPrice= parseInt($scope.newLineItem.price);
//		 if (quentity>0 &&  offeredPrice>0 && $scope.isOfferedPrice==false && $scope.isOfferedQuantity==false){
//			 $scope.isInvestment = true;
//			 $scope.newLineItem.investment = ((quentity*offeredPrice)/1000);
//	     }	else{
//	    	 
//	     }
//			
//		};
//		
//		// calculates OfferedQuantity in the line item
//		$scope.getOfferedQuantity = function () {
//			var investment=parseInt($scope.newLineItem.investment);
//			var offeredPrice= parseInt($scope.newLineItem.price);
//			 if (offeredPrice > 0 &&  investment > 0 && $scope.isInvestment==false && $scope.isOfferedPrice==false){
//				 $scope.isOfferedQuantity = true;
//				 $scope.newLineItem.offeredQuantity = ((1000*investment)/offeredPrice);
//		     }
//		};
//		
//		// calculates OfferedPrice in the line item
//		$scope.getOfferedPrice = function () {
//			var investment=parseInt($scope.newLineItem.investment);
//			var quentity=parseInt($scope.newLineItem.offeredQuantity);
//		 if (quentity>0 &&  investment > 0 && $scope.isInvestment==false && $scope.isOfferedQuantity==false){
//			 $scope.isOfferedPrice = true;
//			 $scope.newLineItem.price = ((1000*investment)/quentity);
//	     }
//		};
		
		 $scope.price_options = [{ description: 'Offered Price'}, {	description: 'Booked Impressions' }];
		 $scope.selected_price_option = $scope.price_options[0];
		
		
		$scope.getDynamicField= function () {
			$scope.open('plugins/proposal/partials/calculateDynamicWarning.html');
		};
		
		 $scope.open = function (modalTemplate) {
				var modalInstance;
				modalInstance = $modal.open({
				      templateUrl: modalTemplate,
				      controller: 'proposalLineItemCtrl',
				      size: 'lg',
				      scope: $scope,
				      closable: false,
				      resolve: {
				        template: function () {
				          return modalTemplate;
				        }
				      }
				    });
				    
				    modalInstance.result.then(function () {}, function () {
				    });
			};
			
			
	$scope.calculatedValue = function(field) {
    	if (field.description=='Offered Price'){
			var investment=parseInt($scope.newLineItem.investment);
			var quentity=parseInt($scope.newLineItem.offeredQuantity);
    		 if (quentity>0 &&  investment > 0){
    			 $scope.newLineItem.price = ((1000*investment)/quentity);
    	     }
    	}
    	else if (field.description=='Booked Impressions'){
			var investment=parseInt($scope.newLineItem.investment);
			var offeredPrice= parseInt($scope.newLineItem.price);
			 if (offeredPrice > 0 &&  investment > 0){
				 $scope.newLineItem.offeredQuantity = ((1000*investment)/offeredPrice);
		     }
    	}
		
    }
			
	// To close model popup
	 $scope.close = function () {
		 $scope.$close();
	 };		
			
			
			
		
	// returns the placement name in  line item	form
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
	
	// alert message popup
	function lineitemAlertBox(msg){
		var modalBody = '<div class="modal fade proposal">'+
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
	
	// alert message popup model controller
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
	 $scope.selectedList = [];
	 $scope.targets = [];
	 $scope.selectedElements=[];
	 $scope.selElmnList=[];
	// validate required fields and save edited and new line item
	$scope.checkErrors = false;
	$scope.saveEdittedLineItem = function(){
		if (isNaN($scope.proposalId)  || isNaN($scope.lineItemlId)  || $scope.proposalId  <= 0 || $scope.lineItemlId < 0 )  {
			 $location.path('/proposal');
		} else {
		$scope.showDateError = false;
		$scope.showDateFlightError = false;  
		$scope.checkErrors = true;
		$scope.disableButton=false;
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
		  if(($scope.newLineItem.basePrice != undefined || $scope.newLineItem.basePrice != "") && $scope.newLineItem.basePrice >= 0){
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
		 if($scope.salesTarget == undefined ||$scope.salesTarget.length == 0){
			$scope.isSalesTargetListCheckErrors  = true;
			flag = true;
		}
		  
		  
		if(flag){
		  return; 
		}else{
			 $scope.disableButton=true;
		 }
		
		$scope.targetListElements.forEach(function(value,id){
		    value.targetElements.forEach(function(elementVal,idx){
		    	$scope.targets.push({"id":elementVal.targetElementsId});
		    	//console.log("test"+$scope.targets)
		   })
		})
		
//		$scope.targetListElements.forEach(function(value,id){
//			targets.push({"id":value.value.id});
//		})
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
			    targets:$scope.targets,														// to be implemented
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
				result.status = 'success';
				result.message = $scope.propertyMessage.lineItemSaveMsg;
    	        Data.toast(result);
				$location.path('/proposal/proposal-detail-'+$scope.proposalId);
		    }, function (results,status) {
		      //$log.info('Modal dismissed at: ' + results.data.error[0].message);
		    	$scope.showlineitemAlertModal(results.data.error[0].message);
		    });
			
		}else{
			 Data.post('line-items', $scope.inserted).then(function(result){
				    result.status = 'success';
					result.message = $scope.propertyMessage.lineItemSaveMsg;
	    	        Data.toast(result);
			    	$location.path('/proposal/proposal-detail-'+$scope.proposalId);
			   }, function (results,status) {
				      //$log.info('Modal dismissed at: ' + results.data.error[0].message);
				   $scope.showlineitemAlertModal(results.data.error[0].message);
			    });
		}
		}
	};
	
	
	
	// target list elements
	$scope.countries=[];
	
	Data.get('targetcategory').then(function(result){
      	$scope.targetTypeOptions=result.data;
    });
	
	/** $scope.getElements=function(){
		 Data.get('targetcategory/'+ $scope.targetTypeOption.id).then(function(result){
		    	 $scope.elementArray=result.data.values;
		    	 if($scope.targetTypeOption.name != 'Income' ){
		    	  		 $scope.elementArray.sort(function(a, b) {
		    		        var x = angular.lowercase(a.value); 
		    		        var y = angular.lowercase(b.value);
		    		        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		    		        		    		       
		    		    });
		    	 }
		    	 $scope.element='undefined';
		 });
	 };*/
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

	$scope.openAccordian = function(){

      

	}
	 
	 
	// add target list element
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
		//CODE TO ADD SCROLLER IN TARGET TABLE
		if($scope.targetListElements.length>5){
			$(".proposal .pp-target-table").css("overflow-y","scroll");
		}
		
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
	    var msg = $scope.propertyMessage.confirmDeleteMsg;
		var ModalTemplate = warnigAlertBox(msg);
		ModalService.showModal({
			template: ModalTemplate,
			controller: "ModalController"
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
			    	if (result === 'yes') {
						var editableItemIndex = $scope.targetListElements.indexOf(targetListElement);
						$scope.targetListElements.splice(editableItemIndex,1);
						$scope.targets.splice(editableItemIndex,1);	
			    	}else{
			    	}
			 });
		});
		
	};
	$scope.moveToRatecard=function(path){
		 $location.path(path);
	};
	$scope.moveToAllProposal=function(){
		 $location.path("proposal");
	};
	
	 function warnigAlertBox(msg){
			var modalBody = '<div class="modal fade proposal">'+
			'<div class="modal-dialog dialog-size-position">'+
				' <div class="modal-content">'+
				'  <div class="modal-header dialog-header-warnig">'+
				'    <button type="button" class="close" ng-click="close(\'Cancel\')" data-dismiss="modal" aria-hidden="true">&times;</button>'+
				'  <span><img alt="" src="plugins/admin/images/warning.png" class="header-img-margin"></span>&nbsp;'+
				'<span class="modal_title">Confirmation'+
				'</span>'+
				'</div>'+
				'<div class="modal-body">'+
				'   <p>'+msg+'</p>'+
					'</div>'+
					'<div class="modal-footer modal-cuntom-footer">'+
				'<button type="button" ng-click="close(\'yes\')" class="btn btn-default" data-dismiss="modal">Yes</button>'+
				'<button type="button" ng-click="close(\'no\')" class="btn btn-primary" data-dismiss="modal">No</button>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'	;
			return modalBody;
		}
	$scope.offerImpressionLable="Booked impressions";
	$scope.changeOfferImpLable=function(){
		var priceTypeVale=$scope.newLineItem.paymentModel;
		if(priceTypeVale=='CPC'){
			$scope.offerImpressionLable="Offered Clicks";
		}else{
			$scope.offerImpressionLable="Booked impressions";
		}
	}
});

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

//validate dacimal numbers
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

//PROPOSAL ACCORDIAN CODE
$(".proposal-list-header a.proposal-heading").on("click", function(){

	alert("pP");
})