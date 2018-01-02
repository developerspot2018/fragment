var app = angular.module('adTech', ['ngRoute', 'ui.bootstrap', 'toaster','xeditable','angular.css.injector']);

app.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
    when('/', {
        title: 'Welcome',
        templateUrl: 'plugins/authentication/partials/login.html',
        controller: 'authCtrl'
      })
      .when('/logout', {
	        title: 'Logout',
	        templateUrl: 'plugins/authentication/partials/login.html',
	        controller: 'logoutCtrl'
	    })
	  .when('/signup', {
	        title: 'Signup',
	        templateUrl: 'partials/signup.html',
	        controller: 'authCtrl'
	    })
	    
	    //Routing Rules For Proposal Module
		.when('/proposal', {
	        title: 'Proposal',
	        templateUrl: 'plugins/proposal/partials/proposal.html',
	        controller: 'proposalCtrl'
	    })
	    .when('/proposal/proposal-detail/:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-detail.html',
	        controller: 'proposalCtrl'
	    })
		
	    //Routing Rules For Pricing Module
	    .when('/pricing', {
	        title: 'Pricing',
	        templateUrl: 'plugins/pricing/partials/pricing.html',
	        controller: 'pricingCtrl'
	    })
	    
	    //Routing Rules For Admin Module
	    .when('/admin', {
	        title: 'Admin',
	        templateUrl: 'plugins/admin/partials/manage-attribute.html',
	        controller: 'attributeCtrl'
	    })
		.when('/admin/creative', {
	        title: 'Creative',
	        templateUrl: 'plugins/admin/partials/manage-creative.html',
	        controller: 'creativeCtrl'
	    })
	    .when('/admin/product', {
	        title: 'Product',
	        templateUrl: 'plugins/admin/partials/manage-product.html',
	        controller: 'productCtrl'
	    }).when('/admin/salestargets', {
	        title: 'Sales',
	        templateUrl: 'plugins/admin/partials/manage-salestargets.html',
	        controller: 'salesTargetsCtrl'
	    })
	    .when('/proposal/proposal-detail/:proposal_id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-detail.html',
	        controller: 'editProposalCtrl'
	    })
    .otherwise({
      redirectTo: '/'
    });;
}]);
/*
.run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.authenticated = false;

        Data.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
                $rootScope.activeUser = 'Logout';
            } else {
            	$rootScope.activeUser = 'Login';
            	$rootScope.uid=null;
            	var nextUrl = next.$$route.originalPath;
                if (nextUrl == '/signup' || nextUrl == '/login') {

                } else {
                    $location.path("/");
                }
            }
        });
        
    });
})
*/


app.run(function(editableOptions) {
	  editableOptions.theme = 'bs2';
});