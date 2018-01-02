app.factory("Data", ['$http', '$rootScope', 'toaster', '$location', 'ModalService', 
    function ($http, $rootScope, toaster, $location, ModalService) {

        //var serviceBase = 'http://192.168.64.121:9090/mp/';
	    var serviceBase = 'http://10.193.66.132:9090/mp/';
	    //var serviceBase = 'http://10.193.67.75:9090/mp/'; // Navneet machine
	    
	    $http.defaults.headers.common.Authorization = $rootScope.auth;
        var obj = {};
       
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 5000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).success(function (results,status) {
            	if(status=='206')
            		inforToUser(status);
                else
                	return results.data;	
            }).error(function(results,status){
            	inforToUser(status);
            });
        }; 
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).success(function (results,status) {
            	return results.data;
            }).error(function(results,status){
            	if((status=='412') && ((q.indexOf("attributes") > -1)  ||(q.indexOf("salestargets") > -1)  || (q.indexOf("creatives") > -1)  || (q.indexOf("products") > -1 ))) {
            		//$scope.showEditModal("This attribute is already associated . Please choose a different attribute to associate");
            		return results;//status=='409'  ||
            	} else {
            		inforToUser(status);
            	}
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).success(function (results,status) {
                return results.data;
            }).error(function(result,status){
            	if((status=='412') && ((q.indexOf("attributes") > -1)  || (q.indexOf("salestargets") > -1)  ||  (q.indexOf("creatives") > -1)  || (q.indexOf("products") > -1 ))) {
            		return result;//status=='409'  ||
            	} else {
            		inforToUser(status);
            	}
            });
        };
        
        obj.patch = function (q) {
        	//$http({method:'PATCH',url:serviceBase + q}).success(function(results,status){ return results.data}).error(function(results,status){inforToUser(status);});
        	//$http({method:'PATCH',url:serviceBase+ q}).success(function(data,status){}).error(function(data,status){inforToUser(status);});
        	 return $http.patch(serviceBase + q).success(function (results,status) {
                 return results.data;
             }).error(function(results,status){
             	
             });
        };
        
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).success(function (results,status) {
                return results.data;
            }).error(function(results,status){
            	if((status=='412') && ((q.indexOf("attributes") > -1)  ||(q.indexOf("salestargets") > -1)  || (q.indexOf("creatives") > -1)  || (q.indexOf("products") > -1 ))) {
            		//$scope.showEditModal("This attribute is already associated . Please choose a different attribute to associate");
            		return results;//status=='409'  || 
            	} else {
            		inforToUser(status);
            	}
            });
        };
        
        obj.login = function (q, object) {
        	var username = object.customer.username;
        	var password = object.customer.password;
        	
        	//return $http.post(serviceBase + q, "username=" + username + "&password=" + password, {
        	return $http.post(serviceBase + q, "client_id=" + username + "&client_secret=" + password+ "&grant_type=client_credentials", {
        		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        		}).success(function(results,status,headers,config) {
        			$rootScope.access_token =  results.access_token;
        			$rootScope.Authorization =  results.token_type;
        			return true;
        			
        		}).error(function(results,status,headers,config) {
        			return results;
        			//showApiWarningMsg("Incorrect Email or Password.");
        		});
       };
        
		 obj.submit = function (q,data,type) {
	    	   var  url;
	    	   if(type == 'HTML'){
	    		   
	    		   var lineItemId = ($location.$$path==='/campaigns/asset-template-list') ? '' : data.lineItem.id;
	    		   var formData = new FormData();
					 formData.append("name", data.name);
					 formData.append("height", data.htmlHeight);
					 formData.append("width", data.htmlWidth);
					 formData.append("lineItemId", lineItemId);
					 formData.append("clickThruUrl", data.clickThroughUrl);
					 formData.append("thirdPartyUrl", data.thirdPartyUrl);
					 formData.append("html", data.htmlData);
	    	   }else{
	    		   
 	    		   	 var lineItemId = ($location.$$path==='/campaigns/asset-template-list') ? '' : data.lineItem.id;
		    		 var formData = new FormData();
					 formData.append("name", data.name);
					 formData.append("lineItemId", lineItemId);
					 formData.append("clickThruUrl", data.clickThruUrl);
					 formData.append("thirdPartyUrl", data.thirdPartyUrl);
					 formData.append("alt", data.altText);
					 formData.append("file", data.file);
	    	   }
	    	   
	    	   return $http(
						{
							method : 'POST',
							url : serviceBase + q,
							headers : {
								'Content-Type': undefined
							},
							data : formData,
							transformRequest : function(data,
									headersGetterFunction) {
								return data;
							}
						}).success(function(result, status, headers, config) {
							return result.data;
						}).error(function(result){
							
						});
	    	  
	    	  
	      };
	       
	      obj.onDelete = function (q) {
	            return $http.delete(serviceBase + q).success(function (results,status) {
	                return results.data;
	            }).error(function(result,status){
	            	inforToUser(status);
	            });
	        };
		 
	        function alertBox(msg){
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
	       
	       function showApiWarningMsg(msg) {
				var ModalTemplate = alertBox(msg);
				ModalService.showModal({
			  	template: ModalTemplate,
			    controller: "ModalController"
			  }).then(function(modal) {
			    modal.element.modal();
			    modal.close.then(function(result) {

			    });
			   });
			 };   
	        
	     function inforToUser(status)
		 {
			 if(status=='409')
				 showApiWarningMsg("This element is in use and cannot be deleted.");
			 
			 if(status=='412')
				 showApiWarningMsg("Name already in use. Please enter a different name");
			 
			 if(status=='404' || status=='204'){//status=='500' || 
				 $rootScope.pageStatus = status; 
				 $location.path('error');
			 }
		 }
       
        return obj;
}]);
