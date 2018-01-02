app.factory("Data", ['$http', 'toaster', '$location',
    function ($http, toaster, $location) {

        var serviceBase = 'http://10.193.66.132:9090/mp/';
        
        var obj = {};

        obj.toast = function (data) { 
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).success(function (results,status) {
                return results.data;
            	alert(status);
            }).error(function(result,status){
            	
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).success(function (results) {
                return results.data;
            	//alert("success");
            }).error(function(result){
            	//alert("failed");
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).success(function (results) {
                return results.data;
            	//alert("success");
            }).error(function(result){
            	//alert("failed");
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).success(function (results) {
                return results.data;
            	//alert("success");
            }).error(function(result){
            	//alert("failed");
            });
        };
        
        obj.login = function (q, object) {
        	var username = object.customer.username;
        	var password = object.customer.password;
        	
        	var request = $http({
                method: "post",
                url: serviceBase + q,
                param: {
                	username: username,
                 	password: password
                }
            });

            return(request.success(function (results) {
                return results.data;
            	alert("success");
            }).error(function(result){
            	alert("failed");
            }));                    	
        };
        
        return obj;
}]);
