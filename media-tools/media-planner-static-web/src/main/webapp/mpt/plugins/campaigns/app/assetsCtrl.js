var _URL = window.URL || window.webkitURL;
app.controller('assetsCtrl', function ($route, $routeParams,$scope,$modalInstance,$rootScope, $location, $modal, Data,assetData, $http,$q, cssInjector, $location,fileReader, ModalService, Validation,template,lineItemService,creativeService)
{
	cssInjector.add("plugins/campaigns/css/campaigns-style.css");
	$http.get('plugins/campaigns/js/campaigns-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
      });
	
	$http.get('plugins/campaigns/js/campaigns-message-properties.js').then(function (response) {
		var propertyMessage = {};
		$scope.propertyMessage = response.data;
      });
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('campaigns') > -1){
        	return true; 
        }
		return false;
    };
 
	$scope.showExistingGrid = function(){
		  $scope.chooseFromExisting = true;
	}
	
	$scope.selectedCreativeId = '';
	$scope.creativeImageNameValidation = false;
	$scope.creativeURLValidation = false;
	$scope.creativeSizeValidation=false;
	
	$scope.creativeHtmlNameValidation=false;
	$scope.creativeHtmlSizeValidation=false;
	$scope.creativeHtmlCodeValidation=false;
	$scope.upladButtonDivErrorFlag = false;
	$scope.assetModel  = {};
	$scope.assetModel.creativeSize=[];
	$scope.creativeSize;


	if(lineItemService.getLineItemData() && lineItemService.getLineItemData().id !='' && $location.$$path !='/campaigns/asset-template-list'){
		Data.get('line-items/'+lineItemService.getLineItemData().id).then(function(data){
			$scope.response = data.data;
				if($scope.response && $scope.response.product && $scope.response.product.creative){
					$scope.assetModel.creativeSize=[{value:$scope.response.product.creative.width1+'*'+$scope.response.product.creative.height1,label:$scope.response.product.creative.width1+'*'+$scope.response.product.creative.height1}];
					$scope.assetModel.selectedImageOption=$scope.response.product.creative.width1+'*'+$scope.response.product.creative.height1;
					$scope.assetModel.selectedHTMLOption=$scope.response.product.creative.height1+'*'+$scope.response.product.creative.width1;
				}
				$scope.populateData();
		    	});
	}else{
		Data.get('creatives').then(function(data){
			var creativeList= data.data;
			var heghtAndWidth = [];
			 		for(var i =0; i< creativeList.length; i++){
						//heghtAndWidth[i]=  creativeList[i].width1+'*'+creativeList[i].height1;
			 			heghtAndWidth.push({value: creativeList[i].width1+'*'+creativeList[i].height1, label:creativeList[i].width1+'*'+creativeList[i].height1});
			 		}
					$scope.assetModel.creativeSize=heghtAndWidth;
					$scope.assetModel.selectedImageOption=assetData.imageWidth+'*'+assetData.imageHeight;
					$scope.assetModel.selectedHTMLOption=assetData.htmlHeight+'*'+assetData.htmlWidth;
					$scope.populateData();
		    	});
	}
	
	$scope.showApiWarningMsg =function(msg) {
		var ModalTemplate = $scope.alertBox(msg);
		ModalService.showModal({
	  	template: ModalTemplate,
	    controller: "ModalController"
	  }).then(function(modal) {
	    modal.element.modal();
	    modal.close.then(function(result) {

	    });
	   });
	 };
	 
	 $scope.alertBox = function(msg){
			var modalBody = '<div class="modal fade">'+
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
	 
	//HTML viewer dialog code function
	$scope.previewCode=function(){
		  var text1 = $scope.assetModel.htmlText;
		  //var text2 = "";
		  //text2 = HTMLtoXML(text1);
		  if(text1==''){
			  $scope.htmlErrorClass = false;
			  $scope.creativeHtmlCodeValidation=true;
			  $scope.creativeHtmlCodeValidationMsg='Enter Html Code';
			  $('textarea').css('border-color','#a94442');
			  window.myFrame.document.body.innerHTML="";
		  }
		  else if(validateHTML(text1)){
			  window.myFrame.document.body.innerHTML=$scope.assetModel.htmlText;			  
			  $scope.htmlErrorClass = false;
			  $scope.creativeHtmlCodeValidation=false;
			  //$('.htmlErrorClass').css('border','none');
			  $('textarea').css('border-color','#3c763d');
		  }
		  else{
			  $('.htmlErrorClass').css('border','1px solid red');	
			  $scope.htmlErrorClass = true;
			  $scope.creativeHtmlCodeValidation=false;
			  window.myFrame.document.body.innerHTML="";
		  }
	}
	
	// end of HTML viewer dialog code function
	
	$scope.populateData =function(){
		if((assetData && assetData.id > 0) && template == 'plugins/campaigns/partials/emtImageModalContent.html'){
			Data.get('asset/'+assetData.id+'/media').then(function(data){
				$scope.imageSrc = data.data;
				$scope.imagePreview = true;
		    	});
			$scope.assetModel.creativeImageName = assetData.name;		
			$scope.assetModel.creativeAltTag = assetData.altText;
			$scope.assetModel.creativeImageDestinationURL = assetData.url;
			$scope.assetModel.selectedCreativeId = assetData.id;
			$scope.assetModel.creativeThirdPartyUrl=assetData.thirdPartyUrl;
			$scope.assetModel.creativeImageDestinationURL=assetData.clickThruUrl;
			$scope.assetModel.mediaType=assetData.type;
			
			setTimeout(function(){$scope.previewCode();},1000);
		}else if((assetData && assetData != null) && template == 'plugins/campaigns/partials/emtHtmlModalContent.html'){
			$scope.selectedCreativeId = assetData;
			$scope.assetModel.creativeHTMLName = assetData.name;				
			$scope.assetModel.htmlText = assetData.htmlData;
			$scope.assetModel.selectedCreativeId = assetData.id;
			setTimeout(function(){$scope.previewCode();},1000);
		}
		
	};
	
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
		};
		
	
		
	$('.chooseImage').css('display','none');
	$scope.imagePreview = false;
	var deferred = $q.defer();
	
	$scope.validateHtmlModel =  function (){
		if($scope.assetModel.creativeHTMLName == '' || $scope.assetModel.creativeHTMLName == undefined){
			$scope.creativeHtmlNameValidation = true;
			$scope.creativeHtmlNameValidationMsg = "Name Should not be empty.";
			$('input[type=text]:first').css('border-color','#a94442');
		}else{
			$scope.creativeHtmlNameValidation=false;
			$('input[type=text]').css('border-color','#3c763d');
		}
		
		if($scope.assetModel.selectedHTMLOption == '' || $scope.assetModel.selectedHTMLOption == undefined){
			$scope.creativeHtmlSizeValidation = true;
			$scope.creativeHtmlSizeValidationMsg = "Size should not be empty.";
			$('select').css('border-color','#a94442');
		}else{
			$scope.creativeHtmlSizeValidation = false;
			$('select').css('border-color','#3c763d');
		}
		
		if($scope.assetModel.htmlText=='' || $scope.assetModel.htmlText==undefined){
			$scope.creativeHtmlCodeValidation = true;
			$scope.creativeHtmlCodeValidationMsg = "Enter Html code.";
			$('textarea').css('border-color','#a94442');				
		}else{
			$scope.creativeHtmlCodeValidation = false;
			$('textarea').css('border-color','#3c763d');
		}
		
	};
	
	$scope.validateImageModel = function(){
		if($scope.assetModel.creativeImageName == '' || $scope.assetModel.creativeImageName == undefined){
			$scope.creativeImageNameValidation = true;
			$scope.creativeImageNameValidationMsg = "Name Should not be empty.";
			$('input[type=text]:first').css('border-color','#a94442');
		}else{
			$scope.creativeImageNameValidation = false;
			$('input[type=text]:first').css('border-color','#3c763d');
		}
		
		if($scope.assetModel.creativeImageDestinationURL == '' || $scope.assetModel.creativeImageDestinationURL == undefined){
			$scope.creativeURLValidation = true;
			$scope.creativeURLValidationMsg = "URL should not be empty.";
			$('input[type=url]').css('border-color','#a94442');
		}else{
			if($scope.assetModel.creativeImageDestinationURL != ""){
				var urlexp = new RegExp( '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?[//]?' );
				if($scope.assetModel.creativeImageDestinationURL.match(urlexp) == null) {
					$scope.creativeURLValidation = true;
					$scope.creativeURLValidationMsg = "Invalid URL.";
					$('input[type=url]').css('border-color','#a94442');
				} else {
					$scope.creativeURLValidation = false;
					$('input[type=url]').css('border-color','#3c763d');	
				}
			} 
		}
		
		if($scope.assetModel.creativeThirdPartyUrl == '' || $scope.assetModel.creativeThirdPartyUrl == undefined){
			$scope.creativeThirdPartyURLValidation = true;
			$scope.creativeThirdPartyURLValidationMsg = "Third Party URL Should not be empty.";
			$('input[type=url]').css('border-color','#a94442');
		}else{
			if($scope.assetModel.creativeThirdPartyUrl != ''){
				var urlexp = new RegExp( '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?[//]?' );
				if($scope.assetModel.creativeThirdPartyUrl.match(urlexp) == null) {
					$scope.creativeThirdPartyURLValidation = true;
					$scope.creativeThirdPartyURLValidationMsg = "Invalid URL.";
					$('input[type=url]').css('border-color','#a94442');
				} else {
					$scope.creativeThirdPartyURLValidation = false;
					$('input[type=url]').css('border-color','#3c763d');	
				}
				
			}
			
		}
		
		if($scope.assetModel.selectedImageOption == '' || $scope.assetModel.selectedImageOption == undefined){
			$scope.creativeSizeValidation = true;
			$scope.creativeSizeValidationMsg = "Size Should not be empty.";
			$('select').css('border-color','#a94442');
		}else{
			$scope.creativeSizeValidation = false;
			$('select').css('border-color','#3c763d');
		}
		
		if($scope.imagePreview == false){
			$('#upladButtonDiv').css('border-color','#a94442');
			$scope.upladButtonDivErrorFlag = true;
			$scope.upladButtonDivErrorMsg = "Please select image first";
		}else{
			$('#upladButtonDiv').css('border-color','#999');
			$scope.upladButtonDivErrorFlag = false;				
		}
		
		
		
	};
	
	$scope.okImage = function () {
		$scope.validateImageModel();
			if($scope.creativeSizeValidation || $scope.creativeURLValidation ||   $scope.creativeThirdPartyURLValidation || $scope.creativeImageNameValidation || !($scope.imagePreview)){
				return;
			}			
			
			if($scope.assetModel.creativeImageName != '' && $scope.assetModel.creativeImageName != undefined){
				$scope.imagePreviewDataObject.name = $scope.assetModel.creativeImageName;
				$('input[type=text]').css('border-color','#3c763d');
				if($scope.assetModel.creativeImageDestinationURL != '' && $scope.assetModel.creativeImageDestinationURL != undefined){					
					$scope.imagePreviewDataObject.clickThru = $scope.assetModel.creativeImageDestinationURL;
					$scope.imagePreviewDataObject.alt = $scope.assetModel.creativeAltTag;
					$('input[type=url]').css('border-color','#3c763d');
					if($scope.imageSrc != '' && $scope.imageSrc != undefined){
						var method = '';
						var lineItemData = lineItemService.getLineItemData();
						var lineItemObject;
						if(lineItemData  && lineItemData.id !=''){
							lineItemObject ={"id":lineItemData.id};
						}
						var lineItemId = ($location.$$path==='/campaigns/asset-template-list') ? null : lineItemObject;
						var data = {
								"id":$scope.selectedCreativeId,
								"name": $scope.assetModel.creativeImageName,
						        "clickThruUrl": $scope.assetModel.creativeImageDestinationURL,
						        "thirdPartyUrl": $scope.assetModel.creativeThirdPartyUrl,
						        "lineItem" : lineItemId,
						        "altText" : $scope.assetModel.creativeAltTag,
						        "file" : document.getElementById("assetImgFile").files[0]
						};
						if($scope.assetModel.selectedCreativeId != '' && $scope.assetModel.selectedCreativeId != undefined){
							data.id = $scope.assetModel.selectedCreativeId;
							Data.put('asset',data).success(function(result){
								$modalInstance.dismiss();
								$route.reload();
								$scope.showApiWarningMsg($scope.propertyMessage.assetHasBeenSaved);
							}).error(function(result){
								$scope.showApiWarningMsg(result.error[0].message);
							});
						}else{			
							Data.submit('asset',data,'IMAGE').success(function(data){
								if(angular.isObject(data)){
									$scope.createdData = data;
									creativeService.setCreativeData(data.data);
									$rootScope.$broadcast('getCreatedData',data);
									$route.reload();
									$scope.showApiWarningMsg($scope.propertyMessage.assetHasBeenSaved);
								}
								$modalInstance.dismiss();
				    		}).error(function(result){
				    			
				    		});
						}
						
					}else{
						$scope.showApiWarningMsg($scope.propertyMessage.pleaseSelectTheTmage);
					}
				}else{
					$('input[type=url]').css('border-color','#a94442');
				}
			}else{
				$('input[type=text]:first').css('border-color','#a94442');
			}	 		
	};
	
	$scope.okHtml = function () {
		$scope.validateHtmlModel();
			if($scope.assetModel.selectedHTMLOption != '' && $scope.assetModel.selectedHTMLOption != undefined){
				if($scope.assetModel.creativeHTMLName != '' && $scope.assetModel.creativeHTMLName != undefined){
					$('input[type=text]').css('border-color','#3c763d');				
					if($scope.assetModel.htmlText != ''){
						$('textarea').css('border-color','#3c763d');
						if(window.myFrame.document.body.innerHTML != ''){
							var dimension = ($scope.assetModel.selectedHTMLOption.label == undefined ? $scope.assetModel.selectedHTMLOption.split("*") : $scope.assetModel.selectedHTMLOption.label.split("*"));
							var lineItemData = lineItemService.getLineItemData();
							var lineItemObject;
							if(lineItemData  && lineItemData.id !=''){
								lineItemObject ={"id":lineItemData.id};
							}
							var lineItemId = ($location.$$path==='/campaigns/asset-template-list') ? null : lineItemObject;
							var data = {
									"id":$scope.selectedCreativeId,
									"name": $scope.assetModel.creativeHTMLName,
							        "htmlData": $scope.assetModel.htmlText,
							        "clickThroughUrl": "",
							        "thirdPartyUrl": "",
							        "htmlHeight":dimension[0],
							        "htmlWidth":dimension[1],
							        "lineItem" : lineItemId,
							};
							
							
							var dialogObj={};
							if($scope.assetModel.selectedCreativeId != ''  && $scope.assetModel.selectedCreativeId != undefined){ 
								data.id = $scope.assetModel.selectedCreativeId;
								Data.put('asset',data).success(function(result){
									$modalInstance.dismiss();
									$route.reload();
									$scope.showApiWarningMsg($scope.propertyMessage.assetHasBeenSaved);
								}).error(function(result){
									
								});
							}else{			
								Data.submit('asset',data,'HTML').then(function(data) {
									if(angular.isObject(data)){
										$scope.createdData = data;
										creativeService.setCreativeData(data.data);
										$rootScope.$broadcast('getCreatedData',data);
										$route.reload();
										$scope.showApiWarningMsg($scope.propertyMessage.assetHasBeenSaved);
									}
									$modalInstance.dismiss();
					    		});
							}
						}else{
							$scope.showApiWarningMsg($scope.propertyMessage.assetHTMLCompilationError);
						}
					}else{
						$('textarea').css('border-color','#a94442');
					}
				}else{
					$('input[type=text]').css('border-color','#a94442');
				}
			}else{
				$('select').css('border-color','#a94442');
			} 		
	};
	
	$scope.imageSelected = function(id){
		$("img").css('border','none');
		$('#img'+id).css('border','2px solid red');	
		$scope.selectedImageId = id;
	};
	
	$scope.imageSelectDone = function(){		
		for(var key in $scope.imageList){
			if($scope.imageList[key].id === $scope.selectedImageId){
				$scope.imagePreview = true;
				$scope.upladButtonDivErrorFlag = false;
				$('#upladButtonDiv').css('border-color','#999');
				$scope.imageSrc = $scope.imageList[key].imageBean.imgData;				
				$scope.imagePreviewDataObject = {
                      "creativeType": "image",       
                      "altText": $scope.assetModel.creativeAltTag,
                      "height": $scope.imageList[key].height,
                      "weight": $scope.imageList[key].weight,
                      "clickThru": $scope.imageList[key].clickThru
                      
                  };
			}
		}
		$('.chooseImage').css('display','none');
		$('.addImage').show();	
	};
	
	$scope.chooseImageModal = function(){
		$('.addImage').hide();
		$('.chooseImage').show();
	};
	
	$scope.addImageModal = function(){
		$('.chooseImage').css('display','none');
		$('.addImage').show();		
	};
	
	
	
	$scope.imagePreviewDataObject = '';
	$scope.getFile = function () {     
	  var dimension = $scope.assetModel.selectedImageOption.label.split("*");
      fileReader.readAsDataUrl($scope.assetModel.file, $scope)
                    .then(function(result) {
                  	  $scope.imagePreview = true;
                  	  $scope.upladButtonDivErrorFlag = false;
                  	  $('#upladButtonDiv').css('border-color','#999');
                        $scope.imageSrc = result;
                        var data = {
                            "creativeType": "image",       
                            "altText": "altText",
                            "height": dimension[1],                            
                            "weight": dimension[0]                                  
                        }
                        
                        $scope.imagePreviewDataObject = data;
                    });
   }
	
	$scope.class1 = 'disabled';
	$scope.imageSizeSelect = function(){
		if($scope.assetModel.selectedImageOption != '' && $scope.assetModel.selectedImageOption != undefined){
			$scope.class1 = '';
		}
		if($scope.imagePreview == true){
			$scope.imagePreview = false;
		}
	};
	
	
	  $scope.deleteAssetLineItem = function(assetId){
		  Data.onDelete('line-items/'+assetId).then(function(data){
			  $scope.showApiWarningMsg($scope.propertyMessage.selectedAssetHasBeenDeleted);
			  $scope.creativeLst='';
		  });
	  };
	  
	  $scope.imageSizeChanged = function(){
		  $scope.imagePreview=false;
	  }
});


app.directive("ngFileSelect",function(){
	return {
		link: function($scope,el){	
			el.on('click',function(){				
				this.value = '';
			});
	      el.bind("change", function(e){	      
	        $scope.assetModel.file = (e.srcElement || e.target).files[0];
	        
	        var allowed = ["jpeg", "png", "gif", "jpg"];
	        var found = false;
	        var img;
	        img = new Image();
	        allowed.forEach(function(extension) {
	  	          if ($scope.assetModel.file.type.match('image/'+extension)) {
	  	            found = true;
	  	          }
	  	        });
	        if(!found){
	        	$scope.showApiWarningMsg('file type should be .jpeg, .png, .jpg, .gif');
	        	return;
	        }
	        img.onload = function(){
	        	var dimension = '';
	        	if($scope.assetModel.selectedImageOption.label){
	        		dimension = $scope.assetModel.selectedImageOption.label.split("*");
	        		if(dimension[0] == this.width && dimension[1] == this.height){
			            allowed.forEach(function(extension) {
			  	          if ($scope.assetModel.file.type.match('image/'+extension)) {
			  	            found = true;
			  	          }
			  	        });
			  	        
			  	        
			  	        if(found){
			  	        	if($scope.assetModel.file.size <= 1048576){
			  	        		$scope.getFile();
			  	        	}else{
			  	        		$scope.showApiWarningMsg($scope.propertyMessage.fileSizeShouldNotBeGraterThen1Mb);
			  	        	}
			  	        }else{
			  	        	$scope.showApiWarningMsg($scope.propertyMessage.fileTypeShouldBeJpegPngJpgGif);
			  	        }
		  	        }else{
		  	        	$scope.showApiWarningMsg($scope.propertyMessage.selectedImageDimensionIsNotEqualToSizeDropDown);
		  	        }
	        	}
	        	else
	        	{
	        		$scope.showApiWarningMsg($scope.propertyMessage.pleaseSelectASizeFirst);
	        	}
	        };
	        
	        img.src = _URL.createObjectURL($scope.assetModel.file);	        
	        
	      });	      
	    }
	    
	  };
	  
	  $scope.openChooseExistinView = function(type){
		  var lineItemData = lineItemService.getLineItemData();
		  $location.path('/campaigns/proposal-line-item/'+lineItemData.id);
	  };
	 
	  
});