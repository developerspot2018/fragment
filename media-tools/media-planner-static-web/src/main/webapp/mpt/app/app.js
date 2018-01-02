/**
 * This is most important file of the aplication.
 * It inisilase all required librearies and services and
 * responsible for all routing rule and check authentication on routh change,
 * If authentication failed user will be redirect to login page.
 *  @author: Tavant Technologies
 *  @copyright: 2015
 *  @package: root
 */

var app = angular.module('adTech', ['mwl.calendar', 'ngAnimate','ngRoute', 'ui.bootstrap','ui.bootstrap.datetimepicker','toaster','xeditable', 'angularModalService',
          'angular.css.injector','multi-select','googlechart', 'ngCookies', 'ui.router', 'uiBreadcrumbs']);


// Defining routing rule
app.config(function($routeProvider,$httpProvider,$stateProvider) {
	$routeProvider.
	
	when('/', {
        title: 'Welcome',
        templateUrl: 'plugins/authentication/partials/login.html',
        controller: 'authCtrl'
      })
      .when('/error', {
        title: 'Error',
        templateUrl: 'error.html',
        controller: 'errorCtrl',	
        permission:['ADMIN','TRAFFICKER','PLANNER']		
      })
      .when('/welcome', {
        title: 'Welcome',
        templateUrl: 'plugins/dashboard/partials/welcome.html',
        controller: 'campaignDashboardCtrl',
        permission:['ADMIN','TRAFFICKER']	
      })
      .when('/logout', {
	        title: 'Logout',
	        templateUrl: 'plugins/authentication/partials/login.html',
	        controller: 'logoutCtrl'
	    })
	    .when('/dashboard', {
	        title: 'Dashboard',
	        templateUrl: 'plugins/dashboard/partials/dashboard.html',
	        controller: 'dashBoardCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/dashboard/calendar', {
	        title: 'Dashboard',
	        templateUrl: 'plugins/dashboard/partials/calendarDashboard.html',
	        controller: 'calendarDashBoardCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    
	  //Routing Rules For Proposal Module
		.when('/proposal', {
	        title: 'Proposal',
	        templateUrl: 'plugins/proposal/partials/proposal.html',
	        controller: 'proposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/rate-card', {
	        title: 'Proposal',
	        templateUrl: 'plugins/proposal/partials/rate-card.html',
	        controller: 'proposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/rate-rules', {
	        title: 'Proposal',
	        templateUrl: 'plugins/proposal/partials/rate-rules.html',
	        controller: 'proposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/proposal-detail-:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-line-item.html',
	        controller: 'proposalLineItemCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/proposal-line-item-view/:id', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/proposal-line-item-view.html',
	        controller: 'proposalLineItemViewCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    
	     .when('/proposal/create-proposal', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/create-proposal.html',
	        controller: 'createUpdateProposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    .when('/proposal/proposal-detail-:id/edit', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/create-proposal.html',
	        controller: 'createUpdateProposalCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    //View proposals data
	    .when('/proposal/proposal-detail-:id/view', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/view-proposal.html',
	        controller: 'proposalViewCtrl',
	        permission:['ADMIN','PLANNER']
	        
	    })
	    .when('/proposal/proposal-detail-:id/:lid', {
	        title: 'Proposal Detail',
	        templateUrl: 'plugins/proposal/partials/add-lineitem.html',
	        controller: 'createUpdatelLineItemCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    // View Proposal LineItem Data
	     .when('/proposal/proposal-detail-:id/lineitem-detail/:lid', {
	        title: 'Proposal Detail View',
	        templateUrl: 'plugins/proposal/partials/view-lineitem-detail.html',
	        controller: 'proposalLineItemViewCtrl',
	        permission:['ADMIN','PLANNER']
	    })
	    
		//Routing Rules For campaigns Module
		.when('/orders', {
	        title: 'Campaigns',
	        templateUrl: 'plugins/campaigns/partials/orders.html',
	        controller: 'campaignsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    .when('/campaigns', {
	        title: 'Campaigns List',
	        templateUrl: 'plugins/campaigns/partials/campaigns.html',
	        controller: 'orderCampaignsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    .when('/orders/orders-detail-:id', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/order-details.html',
	        controller: 'campaignsLineItemCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    .when('/orders/orders-detail-:id/view', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/view-order.html',
	        controller: 'orderViewCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    .when('/orders/orders-detail-:id/:cid', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/create-campaign.html',
	        controller: 'createUpdateCompainsLineItemCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    //view campaign detail data
	    .when('/orders/orders-detail-:id/campaign-detail/:cid', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/view-campaign-details.html',
	        controller: 'campaignViewCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    
	    //create order
	     .when('/orders/create-order', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/create-order.html',
	        controller: 'campaignsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	     })
	    
	     .when('/campaigns/create-proposal/:id', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/create-campaign.html',
	        controller: 'createUpdateCompainsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	   
	     .when('/campaigns/create-proposal', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/update-order.html',
	        controller: 'createUpdateCompainsCtrl',
	        permission:['ADMIN','TRAFFICKER']
	    })
	    
	    .when('/campaigns/create-asset', {
	        title: 'Campaigns Detail',
	        templateUrl: 'plugins/campaigns/partials/assets-tab.html',
	        controller: 'assetsCtrl',
	        permission:['ADMIN','PLANNER']
	    }).when('/campaigns/asset-template-list', {
	        title: 'Asset Templates',
	        templateUrl: 'plugins/campaigns/partials/asset-template.html',
	        controller: 'assetsTemplateCtrl',
	        permission:['ADMIN','TRAFFICKER']
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
	        controller: 'attributeCtrl',
	        permission:['ADMIN']
	    })
		.when('/admin/creative', {
	        title: 'Creative',
	        templateUrl: 'plugins/admin/partials/manage-creative.html',
	        controller: 'creativeCtrl',
	        permission:['ADMIN']
	    })
	    .when('/admin/product', {
	        title: 'Product',
	        templateUrl: 'plugins/admin/partials/manage-product.html',
	        controller: 'productCtrl',
	        permission:['ADMIN']
	    })


	    /**.when('/admin/product/:id/edit', {
	        title: 'Update Product',
	        templateUrl: 'plugins/admin/partials/modal-product.html',
	        controller: 'createUpdateProductCtrl',
	        permission:['ADMIN']
	    })
	    .when('/admin/product/create', {
	        title: 'Create Product',
	        templateUrl: 'plugins/admin/partials/modal-product.html',
	        controller: 'createUpdateProductCtrl',
	        permission:['ADMIN']
	    })
      **/
	    
	    .when('/admin/salestargets', {
	        title: 'Sales',
	        templateUrl: 'plugins/admin/partials/manage-salestargets.html',
	        controller: 'salesTargetsCtrl',
	        permission:['ADMIN']
	    })
	    .when('/template', {
	        title: 'Template',
	        templateUrl: 'plugins/proposal/partials/template.html',
	        controller: 'salesTargetsCtrl',
	        permission:['ADMIN']
	    })
		.when('/admin/change-password', {
	        title: 'Change Password',
	        templateUrl: 'plugins/user/partials/change-password.html',
	        controller: 'changePassowrd',
	        permission:['ADMIN','TRAFFICKER','PLANNER']
	    })
	    .when('/admin/manage-users', {
	        title: 'Manage Users',
	        templateUrl: 'plugins/user/partials/mange-users.html',
	        controller: 'manageUsers',
	        permission:['ADMIN']
	    })
	    .when('/admin/create-user', {
	        title: 'Create User',
	        templateUrl: 'plugins/user/partials/create-update-user.html',
	        controller: 'createUpdateUser',
	        permission:['ADMIN']
	    })
	    .when('/admin/update/:userId', {
	        title: 'Create User',
	        templateUrl: 'plugins/user/partials/create-update-user.html',
	        controller: 'createUpdateUser',
	        permission:['ADMIN']
	    })
	    .when('/admin/update-user', {
	        title: 'Update User',
	        templateUrl: 'plugins/user/partials/update-user.html',
	        controller: 'updateUserDetail',
	        permission:['ADMIN','TRAFFICKER','PLANNER']
	    })
    .otherwise({
      redirectTo: '/'
    });
	
// Defining states for breadcrumb functionality.	
	
	$stateProvider	
	    //BreadCrumb For Proposal Module
	    .state('proposal', {
	      url: '/proposal',
	      data: {
	        displayName: 'Proposals',
	      }
	    })
	    
	    .state('proposal.details', {
	      url: '/proposal-detail-:id',
	      data: {
	        displayName: '{{ displayName}}'
	      },
	      resolve: {
	    	  displayName: function($stateParams, breadcrumbService) {
	          return breadcrumbService.getProposalName($stateParams.id)
	        }
	      }
	    })
	    
	    .state('proposal.details.view', {
	      url: '/view',
	      data: {
	        displayName: 'View'
	      }
	    })
	    
	    .state('proposal.details.lineitem-view', {
	      url: '/lineitem-detail/:lid',
	      data: {
	    	  displayName: '{{ displayName}}'
	      },
	      resolve: {
	    	  displayName: function($stateParams, breadcrumbService) {
	          return breadcrumbService.getLineitemName($stateParams.lid)
	        }
	      }
	    })
	    
	    .state('proposal.create', {
	      url: '/create-proposal',
	      data: {
	        displayName: 'Create Proposal'
	      }
	    })

	    .state('proposal.details.edit', {
	      url: '/edit',
	      data: {
	        displayName: 'Edit'
	      }
	    })
	
        .state('proposal.details.lineItemADDEdit', {
	      url: '/:lid',
	      data: {
	    	  displayName: '{{ displayName}}'
	      },
	      resolve: {
	    	  displayName: function($stateParams, breadcrumbService) {
	          return breadcrumbService.getLineitemName($stateParams.lid)
	        }
	      }
	    })
	    
	     //BreadCrumb For Campaigns Module
	    .state('orders', {
	      url: '/orders',
	      data: {
	        displayName: 'Orders',
	      }
	    })
	    
	    .state('campaigns', {
	      url: '/campaigns',
	      data: {
	        displayName: 'Campaigns',
	      }
	    })
	    
	    .state('orders.details', {
	      url: '/orders-detail-:id',
	      data: {
	        displayName: '{{ displayName}}'
	      },
	      resolve: {
	    	  displayName: function($stateParams, breadcrumbService) {
	          return breadcrumbService.getProposalName($stateParams.id)
	        }
	      }
	    })
	    
	    .state('orders.details.view', {
	      url: '/view',
	      data: {
	        displayName: 'View'
	      }
	    })
	    .state('orders.details.campaigns', {
	      url: '/:cid',
	      data: {
	    	  displayName: '{{ displayName}}'
	      },
	      resolve: {
	    	  displayName: function($stateParams, breadcrumbService) {
	          return breadcrumbService.getLineitemName($stateParams.cid)
	        }
	      }
	    })
	    
	    
	    
	   /** .state('products', {
	      url: '/admin/product',
	      data: {
	        displayName: 'Products',
	      }
	    })
	    .state('products.create', {
	      url: '/create',
	      data: {
	        displayName: 'Create Product',
	      }
	    })
	    .state('products.update', {
	      url: '/:id/edit',
	      data: {
	        displayName: '{{ displayName}}'
	      },
	      resolve: {
	    	  displayName: function($stateParams, breadcrumbService) {
	          return breadcrumbService.getProductName($stateParams.id)
	        }
	      }
	    })*/
	    
   
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	$httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.patch = {'Content-Type':'application/json;charset=utf-8'};
	$httpProvider.defaults.headers.submit = {'Content-Type':undefined};
})
.run(function ($rootScope, $location, Data, $http, $cookieStore) {
		$rootScope.isViewLoading = false;
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
        	$rootScope.isViewLoading = true;	
	        $rootScope.authenticated = false;
	        
		    $http.defaults.headers.common.Authorization = $cookieStore.get("userData");
		    Data.get('auth').success(function (results){
		    	if(results.clientId){
		    		$rootScope.authenticated = true;
		   	        $rootScope.userId = results.clientId;
		   	        $rootScope.name = results.firstName;
		   	        $rootScope.email = results.email;
		   	        $rootScope.roleName = results.roles[0].role.split('_')['1'];
			        if (next.$$route && next.$$route.permission) {
			        	var redirectToNext = false;
			            	for(var i=0;i<next.$$route.permission.length;i++){
			            		if($rootScope.roleName == next.$$route.permission[i]){
			            			redirectToNext = true;
			            		}
			            	 }
			        }
			        
			        if (redirectToNext) {
			        	return;
			        } else { 
			        	$location.path('dashboard');
			        }
		        } else {
		        	$location.path("/");
		        }
		    }).error(function (results){
		    	$rootScope.userId=null;
		        $location.path("/");
		    });
    });
    $rootScope.$on('$routeChangeSuccess', function() {
    	$rootScope.isViewLoading = false;
	});    
});


app.run(function(editableOptions,$state) {
	  editableOptions.theme = 'bs2';
});
