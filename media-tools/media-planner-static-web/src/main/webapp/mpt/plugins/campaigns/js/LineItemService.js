app.service('lineItemService',function(){
	var lineItemData={};
	  
	this.setLineItemData = function(obj){
		this.lineItemData = obj;
	};
	this.getLineItemData = function() {
		return this.lineItemData;
	};
	 
});