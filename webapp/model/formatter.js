sap.ui.define([], function () {
	"use strict";
	
return {

    currencyFormateOne : function(value){
	
	var currency = value;
	var currencyCode = "";
	var finalCurrency =  currencyCode + " " + currency;
	return  finalCurrency;

}
};
});