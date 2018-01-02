app.filter('startProposalFrom', function() {
	return function(input, start) {
		if (input && Object.keys(input).length > 0) {
			start = +start; // parse to int
			return input.slice(start);
		}
		return [];
	}
});

app.controller('dashBoardCtrl', function ($scope, $rootScope, $location, Data, cssInjector, $http) { 
	cssInjector.add("plugins/dashboard/css/dashboard-style.css");
	$http.get('plugins/dashboard/js/dashboard-properties.js').then(function (response) {
		var property = {};
		$scope.property = response.data;
    });
	
	$rootScope.isActive = function(viewLocation) { 
        if(viewLocation.indexOf('dashboard') > -1){
        	return true; 
        }
    };
    
    $scope.isActive = function (viewLocation) { 
        if(viewLocation.indexOf('dashboard/bar') > -1){
        	return true;
        }
    };
    
    var currentUserId = null;
    var currentRoleName = null;
    var AheadPendingCounter = 0;
    var BehindPendingCounter = 0;
    
    var AheadProposedCounter = 0;
    var BehindProposedCounter = 0;
    
    var AheadReviewCounter = 0;
    var BehindReviewCounter = 0;
    
    var AheadRejectCounter = 0;
    var BehindRejectCounter = 0;
    
    var AheadSoldCounter = 0;
    var BehindSoldCounter = 0;
    
    var AheadSignedCounter = 0;
    var BehindSignedCounter = 0;
    
    var chartProposalsList = {};
    var currentDateTime = new Date().getTime();
    
    $scope.recordPerPage = ['5','20','30'];
    
    $scope.selectedStatus = 'Pending';
    
    $scope.setDashBoardGridParam = function (currentRecordPerPage){
    	$scope.selectedNumber = currentRecordPerPage; 
        $scope.maxNoPageSize = 5;
        $scope.currentPage = 1;
        $scope.entryLimit = $scope.selectedNumber;
        $scope.name = '' ;
		$scope.type = '';
		$scope.order = 'desc'
		$scope.sortBy = 'id';
    }
    
    $scope.setDashBoardGridParam($scope.recordPerPage[0]);
    
    Data.get('auth').success( function (results) {
    	if(results.clientId) {
             currentUserId = results.clientId;
             currentRoleName = results.roles[0].role.split('_')['1'];
             if(currentRoleName=='ADMIN') {
            	 //$scope.getProposal('proposals?');
            	 $scope.getProposal('proposals/data');
             } else {
            	 //$scope.getProposal('proposals?userId='+currentUserId);
            	 $scope.clientId = currentUserId;
            	 $scope.getProposal('proposals/data?userId='+currentUserId);
             }
    	}
    }); 
    
    
    var chart1 = {};
    chart1.type = "ColumnChart";
    chart1.cssStyle = "width:100%;";
    chart1.options = {
			            "title": "All Prososals",
			            "isStacked": "true",
			            "legend": {"position": "right"},
			            "height": 300,
			            "fill": 20,
			            "displayExactValues": true,
			            "vAxis": {
			                "title": "Numbers", "gridlines": {"count": 6}
			            },
			            "hAxis": {
			                "title": "Status"
			            },
			            "chartArea": {"left":80,"top": 40,"width":'60%',"height":'75%'}
        			};

    chart1.formatters = {};
    
    $scope.getProposal = function (url) {
    	Data.get(url).then( function(data) {
    		//chartProposalsList= data.data.content;
    		chartProposalsList= data.data;
    		if(chartProposalsList.length > -1) {
                chartProposalsList.forEach( function(value, i) {
                chartProposalsList[i].linkPath = '#/proposal/proposal-detail-'+value.id;
                switch(value.status) {
                	case 'Pending':
                		(value.dueOn > currentDateTime) ? AheadPendingCounter++ : BehindPendingCounter++;
                	break;
                	case 'Proposed':
                		(value.dueOn > currentDateTime) ? AheadProposedCounter++ : BehindProposedCounter++;
                	break;
                	case 'Rejected':
                		(value.dueOn > currentDateTime) ? AheadRejectCounter++ : BehindRejectCounter++;
                	break;
                	case 'Review':
                		(value.dueOn > currentDateTime) ? AheadReviewCounter++ : BehindReviewCounter++;
                	break;
                	case 'Sold':
                		(value.dueOn > currentDateTime) ? AheadSoldCounter++ : BehindSoldCounter++;
                	break;
                	case 'Signed':
                		(value.dueOn > currentDateTime) ? AheadSignedCounter++ : BehindSignedCounter++;
                	break;
                }
                var dueDate = new Date(value.dueOn);
                chartProposalsList[i].dueOn = dueDate.getDate() + '/' + (dueDate.getMonth()+1) + '/' + dueDate.getFullYear();
                var requestedDate = new Date(value.requestedOn);
                chartProposalsList[i].requestedOn = requestedDate.getDate() + '/' + (requestedDate.getMonth()+1) + '/' + requestedDate.getFullYear();
                
                });
                
                
                chart1.data = {"cols": [
                    {id: "status", label: "Status", type: "string"},
                    {id: "a-id", label: "On Schedule", type: "number"},
                    {id: "b-id", label: "Behind Schedule", type: "number"}
                ], "rows": [
                    {c: [
                        {v: "Pending"},
                        {v: AheadPendingCounter, f: " "+AheadPendingCounter+" "},
                        {v: BehindPendingCounter, f: " "+BehindPendingCounter+" "}
                    ]},
                    {c: [
                        {v: "Proposed"},
                        {v: AheadProposedCounter, f: " "+AheadProposedCounter+" "},
                        {v: BehindProposedCounter, f: " "+BehindProposedCounter+" "}
                    ]},
                    {c: [
                        {v: "Review"},
                        {v: AheadReviewCounter, f: " "+AheadReviewCounter+" "},
                        {v: BehindReviewCounter, f: " "+BehindReviewCounter+" "}
                    ]},
                    {c: [
                         {v: "Sold"},
                         {v: AheadSoldCounter, f: " "+AheadSoldCounter+" "},
                         {v: BehindSoldCounter, f: " "+BehindSoldCounter+" "}
                     ]},
                     {c: [
                          {v: "Signed"},
                          {v: AheadSignedCounter, f: " "+AheadSignedCounter+" "},
                          {v: BehindSignedCounter, f: " "+BehindSignedCounter+" "}
                      ]},
                      {c: [
                           {v: "Rejected"},
                           {v: AheadRejectCounter, f: " "+AheadRejectCounter+" "},
                           {v: BehindRejectCounter, f: " "+BehindRejectCounter+" "}
                       ]}
                ]};

                $scope.chart = chart1;
                  
            }
    		$scope.getProposalData("Pending"); 
        });
    }
    
    $scope.seriesSelected = function(selectedItem) {
        var col = selectedItem == undefined ? -1 : selectedItem.column;
        var row = selectedItem == undefined ? -1 : selectedItem.row;
        $scope.proposals = [];
        var selectedRow = 'Pending';
        switch(row){
        	case 0:
        		selectedRow='Pending';
        	break;
        	case 1:
        		selectedRow='Proposed';
        	break;
        	case 2:
        		selectedRow='Review';
        	break;
        	case 3:
        		selectedRow='Sold';
        	break;
        	case 4:
        		selectedRow='Signed';
        	break;
        	case 5:
        		selectedRow='Rejected';
        	break;
        	default:
        		selectedRow='Pending';
        }
        
        $scope.selectedStatus = selectedRow;
        $scope.getProposalData();
        
    };
      
    $scope.getProposalData = function () {
    	var url = 'proposals?status='+ $scope.selectedStatus +'&sortBy=' + $scope.sortBy + '&order=' + $scope.order + '&pageNo=' + ($scope.currentPage -1) + '&pagesize=' + $scope.selectedNumber;
    	if($scope.clientId != undefined && $scope.clientId != '' ){
    		url = url + '&userId=' + $scope.clientId;
		}
      	Data.get(url).then ( function (data) {
      		data.data.content.forEach(function(value,i){
      			value.linkPath = '#/proposal/proposal-detail-'+value.id;
      			var dueDate = new Date(value.dueOn);
      			if(!isNaN(dueDate)){
      				value.dueOn = dueDate.getDate() + '/' + (dueDate.getMonth()+1) + '/' + dueDate.getFullYear();
      			}
                var requestedDate = new Date(value.requestedOn);
                value.requestedOn = requestedDate.getDate() + '/' + (requestedDate.getMonth()+1) + '/' + requestedDate.getFullYear();
      		});
      		
      		$scope.proposals = data.data.content;
      	    $scope.totalNoOfItems = data.data.totalElements;
      	});
    };
      
      
    $scope.setPage = function(page){
      	$scope.currentPage = page;
  		$scope.getProposalData();
    };
      
    $scope.setRecordPerPage= function () {
  		$scope.setDashBoardGridParam($scope.selectedNumber);
  		$scope.getProposalData();
    }
      
    $scope.refreshDashProposalGrid = function () {
  		$scope.setDashBoardGridParam($scope.recordPerPage[0]);
  		$scope.getProposalData();
    }
  	
    $scope.sort_by = function (predicate) {
		$scope.reverse = !$scope.reverse;
		$scope.order = $scope.order == 'desc' ? 'asc' : 'desc' ;
		$scope.sortBy = predicate;
		$scope.getProposalData();
    };
});