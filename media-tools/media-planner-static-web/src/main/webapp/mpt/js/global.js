/**** Global JS File for Application****/


/**** Sticky Navigation Header ****/

//window.serviceBaseURL = 'http://192.168.64.121:9090/mp/';
//window.serviceBaseURL = 'http://10.193.66.132:9090/mp/';
var navOffset = jQuery(".tool-pannel nav").offset().top;
var distance = $('.app-top-nav').offset().top,
$window = $(window);
$window.scroll(function() {
    if ( $window.scrollTop() >= distance ) {

        $('.tool-pannel nav').addClass("navbar-fixed-top");
        $(".Dashboard .left-naviation-menu, .proposal .pp-filter-panel, .cpm-filter-nav, .admin-filter-nav, .cpm-create-nav").addClass("affix");
        $(".Dashboard .main-container, .proposal .pp-dashboard-panel, .dashboard-calendar, .dashboard-campaign, .cpm-listing-container, .admin-listing-container, .admin-prd-listing, .pp-rc-form, .cpm-create-form, .change-pwd .cpwd-outer,.manage-user-outer .muser-outer-wrapper, .mpt-create-user .create-user-outer, .update-user-wrapper").addClass("fixed-mode");

    }else if($window.scrollTop() <= 50){

        $('.tool-pannel nav').removeClass("navbar-fixed-top");
        $(".Dashboard .left-naviation-menu, .proposal .pp-filter-panel, .cpm-filter-nav, .admin-filter-nav, .cpm-create-nav").removeClass("affix");
        $(".Dashboard .main-container, .proposal .pp-dashboard-panel, .dashboard-calendar, .dashboard-campaign, .cpm-listing-container, .admin-listing-container, .admin-prd-listing, .pp-rc-form, .cpm-create-form, .change-pwd .cpwd-outer, .manage-user-outer .muser-outer-wrapper, .mpt-create-user .create-user-outer, .update-user-wrapper").removeClass("fixed-mode");
    }
});


$(document).ready(function(){

      $(".panel-group .panel").each(function(){
             
        console.log("INDEX");
       /*if(!$(".panel-group .panel").hasClass("in"))
        {
            $(".panel-heading + div:first").addClass("in");
            $(".panel-heading + div:first").css("height", "auto");
            console.log("VAALL"+val);
        }else{
             
            $(".panel-heading + div:first").removeClass("in");
            $(".panel-heading + div:first").css("height", "0");
            console.log("VAAL-COLLAPSE"+val);
        }*/
    });


 console.log($(".panel-group .panel-heading").length);
 $(".panel-group .panel-heading").on("click", function(){

   //alert("");

 });


});

$(window).load(function(){

  console.log("LOAD"+$(".panel-group .panel-collapse").length);

});


$(".graph-label-wrapper").css("background-color", "red"); 


(function(window, document, $, undefined){

    /**** GLOBAL FUNCTION TO RECOGNISE USER AGENT ****/

	var userAgent = window.navigator.userAgent;
	function getUserAgent()
	{
	   var browsers = {chrome: /chrome/i, safari: /safari/i, moz: /firefox/i, ie: /internet explorer/i};
       for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }else{return "ie";}
        };
	}
    $("body").addClass(getUserAgent());
    window.userAgent = getUserAgent();

    function getOffset(){

        //GET GRAPH OFFSET
        var baseOffset = "";
        var navOffset = "";
        if($(".app-top-nav li:nth-child(3)") != undefined && $(".app-top-nav li:nth-child(3)").length != 0)
        var baseOffset = $(".app-top-nav li:nth-child(3)").offset().left;
        
        if($(".dashboard-wrapper") != undefined && $(".dashboard-wrapper").length != 0)
        var navOffset  = $(".dashboard-wrapper").offset().left;
         var netOffset = baseOffset-navOffset;
         console.log(netOffset);
        $(".graph-label-wrapper").css("margin-left", 1293);
        $(".graph-label-wrapper").css("background-color", "red");
    }
    getOffset();
   window.getOffset = getOffset();
})(window, document, jQuery);




