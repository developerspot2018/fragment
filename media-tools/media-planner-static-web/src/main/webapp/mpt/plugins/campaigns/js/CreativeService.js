app.service('creativeService',function(){
	var creativeData={};
	  
	this.setCreativeData = function(obj){
		this.creativeData = obj;
	};
	this.getCreativeData = function() {
		return this.creativeData;
	};
	 
});