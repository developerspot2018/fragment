app.directive("leftNav", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/left-nav.html"
	  };
});

app.directive("ordersListing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/orders-listing.html"
	  };
});

app.directive("assetsTab", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/assets-tab.html"
	  };
});
app.directive("campaignsListing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/campaigns-listing.html"
	  };
});
app.directive("detailForm", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/detail-form.html"
	  };
});
app.directive("campaignForm", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/campaign-form.html"
	  };
});
app.directive("orderForm", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/campaigns/partials/order-form.html"
	  };
});