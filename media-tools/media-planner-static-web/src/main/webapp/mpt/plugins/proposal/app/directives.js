//includes left-navigation.html in the proposal pages
app.directive("leftNavigation", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/left-navigation.html"
	  };
});

//includes proposal-listing.html in the proposal page
app.directive("proposalListing", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/proposal-listing.html"
	  };
});

//includes add-lineitem.html in the line-item page
app.directive("addLineitem", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/add-lineitem.html"
	  };
});

//includes details-section.html in the proposal detail page
app.directive("detailsSection", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/details-section.html"
	  };
});

//includes proposal-form.html in the create proposal page
app.directive("proposalForm", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/proposal-form.html"
	  };
});

//includes lineitem-form.html in the create line item page
app.directive("lineitemForm", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/lineitem-form.html"
	  };
});

//includes lineitem-view.html in the proposal line item view page
app.directive("lineitemView", function() {
	  return {
	    restrict: 'E',
	    templateUrl: "plugins/proposal/partials/lineitem-view.html"
	  };
});