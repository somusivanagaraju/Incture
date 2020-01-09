sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/displayMasterDetail1/model/formatter",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageStrip"
], function(Controller, Device, Filter, FilterOperator, formatter, Sorter, JSONModel, MessageStrip) {
	"use strict";

	return Controller.extend("com.displayMasterDetail1.controller.master", {
		formatter: formatter,

		onInit: function() {
			var that = this;
			that._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var masterModel = new JSONModel();
			that._data = this.getOwnerComponent().getModel("jdata").getData().Invoices;
			that.getView().setModel(masterModel, "MasterModel");
			that._EmployeeList("empty");

			var array = [{
				"title": "Select Skill"
			}, {
				"title": "Quality Management"
			}, {
				"title": "Delivery management"
			}, {
				"title": "SAPUI5"
			}, {
				"title": "SAP ABAP"
			}, {
				"title": "SAP BI"
			}];
			var oModelskill = new sap.ui.model.json.JSONModel();
			oModelskill.setData(array);
			this.getView().setModel(oModelskill, "localSkillModel");
			/*array.unshift({"title":"Select Skill"});*/

		},
		onBeforeRendering: function(oEvt) {
			this._skillDialogMethod();
		},
		_skillDialogMethod: function() {
			var that = this;
			that.getView().getModel("MasterModel").setProperty("/Employee", that._data);

			if (!that._oDialog) {
				that._oDialog = new sap.ui.xmlfragment("com.displayMasterDetail1.fragment.skillDialog", that);
			}
			that._oDialog.setModel(that.getView().getModel("MasterModel"));
			that._oDialog.open();
		},
		_EmployeeList: function(val) {
			var that = this;
			var skillArray = [];
			var employeeID = '';
			var l = 0;
			var listData = that.getView().getModel("MasterModel").getProperty("/Employee");
			if (val !== "empty") {
				$.each(val, function(index, element) {
					$.each(listData, function(i, e) {
						if (e.Skill === element.getTitle()) {
							skillArray.push(e);
							if (l == 0) {
								employeeID = e.PSID;
								l++;
							}
						}
					});

				});
				that.getView().getModel("MasterModel").setProperty("/Employee", skillArray);
				that.getView().getModel("MasterModel").refresh(true);
			}
			setTimeout(function() {
				var listItems = that.getView().byId("EmployeeMasterList").getItems();
				if (window.location.href.indexOf("EmployeeData") !== -1) {
					var index = '';
					if (val === "empty") {
						employeeID = window.location.href.split("/EmployeeData/")[1];
					}
					$.each(listItems, function(i, e) {
						if (e.getNumber().trim() === employeeID) {
							index = i;
						}
					});
					that.getView().byId("EmployeeMasterList").setSelectedItem(listItems[index], true);
					that._oRouter.navTo("EmployeeDetail", {
						PSID: employeeID
					});
				} else {
					that.getView().byId("EmployeeMasterList").setSelectedItem(listItems[0], true);
					that._oRouter.navTo("EmployeeDetail", {
						PSID: listItems[0].getNumber().trim()
					});
				}
			});
		},
		onCheckListSelected: function(oEvt) {
			var listData = sap.ui.getCore().byId("ProductList").getItems();
			if (oEvt.getSource().getSelectedItem() !== null) {
				$.each(listData, function(i, e) {
					sap.ui.getCore().byId("ProductList").setSelectedItem(listData[i], true);
				});
			} else {
				$.each(listData, function(i, e) {
					sap.ui.getCore().byId("ProductList").setSelectedItem(listData[i], false);
				});
			}
		},
		onDialogBtnPressed: function(oEvt) {
			var that = this;
			sap.ui.getCore().byId("errorMessageId").destroyItems();
			var errorStrip = new MessageStrip({
				type: sap.ui.core.MessageType.Error,
				enableFormattedText: true,
				showIcon: true
			});
			var selectedSkill = sap.ui.getCore().byId("ProductList").getSelectedItems();
			if (selectedSkill.length === 0) {
				errorStrip.setText("Select Atleast on Item from list");
				sap.ui.getCore().byId("errorMessageId").addItem(errorStrip);
				return false;
			} else {
				sap.ui.getCore().byId("errorMessageId").destroyItems();
			}
			that._oDialog.close();
			that._EmployeeList(selectedSkill);
		},
		onskillSelect: function(oEvent) {
			var listId = this.getView().byId("EmployeeMasterList");
			var locationSelectedKey = oEvent.getSource().getSelectedKey();
			var trimValue = locationSelectedKey.trim();
			var filterArr = [];
			var items = listId.getBinding("items");
			var filter1 = new sap.ui.model.Filter("Skill", sap.ui.model.FilterOperator.Contains, trimValue);

			filterArr = [filter1];

			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});
			items.filter(finalFilter);

		},

		showDetails: function(evt) {
			var that = this;
			var selectedID = evt.getSource().getSelectedItem().getNumber().trim();
			that._oRouter.navTo("EmployeeDetail", {
				PSID: selectedID
			});
		},

		handleChangeSearch: function(oEvent) {
			var listId = this.getView().byId("EmployeeMasterList");
			var inputValue = oEvent.getParameter("query");
			var trimValue = inputValue.trim();
			var filterArr = [];
			var items = listId.getBinding("items");
			var filter1 = new sap.ui.model.Filter("PSID", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter2 = new sap.ui.model.Filter("Skill", sap.ui.model.FilterOperator.Contains, trimValue);
			var filter3 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, trimValue);

			filterArr = [filter1, filter2, filter3];

			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});
			items.filter(finalFilter);
		},

		handleChangeskillSearch: function(oEvent) {
			var listId = sap.ui.getCore().byId("ProductList");
			var inputValue = oEvent.getParameter("query");
			var trimValue = inputValue.trim();
			var filterArr = [];
			var items = listId.getBinding("items");
			var filter1 = new sap.ui.model.Filter("Skill", sap.ui.model.FilterOperator.Contains, trimValue);

			filterArr = [filter1];

			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});
			items.filter(finalFilter);
		},
		onPresssort: function(oEvent) {

			if (!this._osDialog) {
				this._osDialog = sap.ui.xmlfragment("com.displayMasterDetail1.fragment.sort", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._osDialog.open();
		},

		handleConfirm: function(oEvent) {

			var oView = this.getView();
			var oList = oView.byId("EmployeeMasterList");

			var mParams = oEvent.getParameters();
			var oBinding = oList.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;

			var aSorters = [];
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

		},

		onSemanticSelectGroup: function(oEvent) {

			var oView = this.getView();
			var oList = oView.byId("EmployeeMasterList");

			var mParams = oEvent.getParameters();
			var oBinding = oList.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending = false;
			var vGroup;
			var aSorters = [];

			sPath = oEvent.getSource().getSelectedItem().getKey();
			bDescending = mParams.groupDescending;
			vGroup = this.mGroupFunctions[sPath];
			aSorters.push(new Sorter(sPath, bDescending, vGroup));

			sPath = oEvent.getSource().getSelectedItem().getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

		}

		// 		/* <!~~~~~~~~~~~~~~~~~~~~~~~~~~  Object Attribute ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>    */
		// 		/*	handleFeedbacklinkPressed: function(oEvent) {
		//               Open a dilog box		
		// 	}*/

		// 		// <~~~~~~~~~~~~~~~~~Search Bar Filter Code  ~~~~~~~~~~~~~~~~~~~~~~~~>

		// 		onFilterProducts: function(oEvent) {

		// 			// build filter array
		// 			var aFilter = [],

		// 				sQuery = oEvent.getParameter("query"),
		// 				// retrieve list control
		// 				oList = this.getView().byId("List1"),
		// 				// get binding for aggregation 'items'
		// 				oBinding = oList.getBinding("items");

		// 			if (sQuery) {
		// 				aFilter.push(new Filter("PSID", FilterOperator.Contains, sQuery));
		// 			}
		// 			// apply filter. an empty filter array simply removes the filter
		// 			// which will make all entries visible again
		// 			oBinding.filter(aFilter);
		// 		},

		// 		// <~~~~~~~~~~~~~~~~~~~~~Open Dialog 2~~~~~~~~~~~~~~~~~~~~~~~~~~>
		// 		openDialog: function(oEvent) {
		// 			if (!this._oDialog) {
		// 				this._oDialog = sap.ui.xmlfragment("com.itcresourcemanagement.view.Dialog2", this);
		// 			}
		// 			// toggle compact style
		// 			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		// 			this._oDialog.open();
		// 		},

		// 		// <~~~~~~~~~~~~~~~~~ Apply Sorting in the MasterDetail View Using Dialog 2  ~~~~~~~~~~~~~~~~~~~~~~~~>

		// 		handleConfirm: function(oEvent) {

		// 			var oView = this.getView();
		// 			var oList = oView.byId("List1");

		// 			var mParams = oEvent.getParameters();
		// 			var oBinding = oList.getBinding("items");

		// 			// apply sorter to binding
		// 			// (grouping comes before sorting)
		// 			var sPath;
		// 			var bDescending;

		// 			var aSorters = [];
		// 			sPath = mParams.sortItem.getKey();
		// 			bDescending = mParams.sortDescending;
		// 			aSorters.push(new Sorter(sPath, bDescending));
		// 			oBinding.sort(aSorters);

		// 		},

		// 		// <~~~~~~~~~~~~~~~~~~Apply Filter by clicking <semantic:FilterSelect change="onSemanticSelectFilter">~~~~~~~~~~~~~~~~~~~~~>

		// 		onSemanticSelectFilter: function(oEvent) {

		// 			var oView = this.getView();
		// 			var oList = oView.byId("List1");
		// 			var oBinding = oList.getBinding("items");

		// 			// apply filters to binding
		// 			var aFilters = [];

		// 			var aSplit = oEvent.getSource().getSelectedItem().getKey().split("___");
		// 			var sPath = aSplit[0];
		// 			var sOperator = aSplit[1];
		// 			var sValue1 = aSplit[2];
		// 			var sValue2 = aSplit[3];
		// 			var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
		// 			aFilters.push(oFilter);

		// 			oBinding.filter(aFilters);

		// 		},

		// 		// <! ~~~~~~~~~~~~~~~~~~~~~Show data to detail View, on click of listItems ~~~~~~~~~~~~~~~~>
		// 		/* showDetails :  function(oEvent){
		//   var oModelContext = oEvent.getParameter("listItem").getBindingContext().getObject();

		//   var oArray = [];
		//   oArray.push(oModelContext);
		//   var dialogModel = new sap.ui.model.json.JSONModel();
		//   this.getView().setModel(dialogModel,"DialogModel");
		//   this.getView().getModel("DialogModel").setProperty("/EmployeeSelected", oArray);
		// 		},*/

		// 		//<~~~~~~~~~~~~~~~~~~~~~~~Apply Grouping ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>	

		// 		onSemanticSelectGroup: function(oEvent) {

		// 			var oView = this.getView();
		// 			var oList = oView.byId("List1");

		// 			var mParams = oEvent.getParameters();
		// 			var oBinding = oList.getBinding("items");

		// 			// apply sorter to binding
		// 			// (grouping comes before sorting)
		// 			var sPath;
		// 			var bDescending = false;
		// 			var vGroup;
		// 			var aSorters = [];

		// 			sPath = oEvent.getSource().getSelectedItem().getKey();
		// 			bDescending = mParams.groupDescending;
		// 			vGroup = this.mGroupFunctions[sPath];
		// 			aSorters.push(new Sorter(sPath, bDescending, vGroup));

		// 			sPath = oEvent.getSource().getSelectedItem().getKey();
		// 			bDescending = mParams.sortDescending;
		// 			aSorters.push(new Sorter(sPath, bDescending));
		// 			oBinding.sort(aSorters);

		// 		}

		// 		/*	onPress: function(oEvent) {
		// 	var oModelContext = oEvent.getParameter("listItem").getBindingContext().getObject();
		//   //sap.ui.getCore().getModel().setProperty("/ProductSelected", oModelContext.ProductID);
		//   var dialogModel = new sap.ui.model.json.JSONModel();
		//   var oData = [];
		//   oData.push(oModelContext);
		//   sap.ui.getCore().setModel(dialogModel,"DialogModel");
		//   sap.ui.getCore().getModel("DialogModel").setProperty("/dialogArray",oData);

		// }*/

		// 		/*onPress: function (evt) {
		// 		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 		 	var selectedProductId = evt.getSource().getBindingContext().getProperty("ProductID");
		// 			oRouter.navTo("detail", {
		// 				productId: selectedProductId
		// 			});
		// 		}*/

		// 		/*handleListItemPress: function (evt) {
		// 		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 		 	var selectedProductId = evt.getSource().getBindingContext().getProperty("ProductID");
		// 			oRouter.navTo("detail", {
		// 				ProductID: selectedProductId
		// 			});
		// 		}*/

	});
});