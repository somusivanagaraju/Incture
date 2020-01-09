sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"com/displayMasterDetail1/model/formatter",
	"com/displayMasterDetail1/util/columns",
	"sap/m/TablePersoController"
], function(Controller,UIComponent,JSONModel,formatter,columns,TablePersoController) {
	"use strict";

	return Controller.extend("com.displayMasterDetail1.controller.detail", {
		formatter : formatter,
		
    onInit: function () {
       var that = this;
 	   sap.ui.core.UIComponent.getRouterFor(this).getRoute("EmployeeDetail").attachMatched(this._onRouteMatched,this);
 		//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);*/
		
		 that._Column = new sap.m.TablePersoController({
  			table: that.getView().byId("employeetable"),
  			componentName: "demoApp",
  			persoService: columns
  		}).activate();
 },

 _onRouteMatched : function (oEvent) {
 	        var that = this;
			var detailModel = new JSONModel();
			that.getView().setModel(detailModel, "EmployeeModel");
			var detailData = [];
			var EmployeeId = oEvent.getParameter("arguments").PSID;
			var mainModel = that.getOwnerComponent().getModel("jdata").getData().Invoices; 
			$.each(mainModel,function(i,e){
				if(e.PSID == EmployeeId){
					detailData.push(e);
					that.getView().getModel("EmployeeModel").setProperty("/EmployeeData",detailData);
				}
			});

 		},
 		
 		onPersoButtonPressed:function(oEvent){
this._Column.openDialog();
},

onTablePersoRefresh : function(oEvent) {
	columns.resetPersData();
	this._Column.refresh();
}

	});
});