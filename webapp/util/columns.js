sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	// Very simple page-context personalization
	// persistence service, not for productive use!
	var columns = {

		oData : {
			aColumns : [
				{
					id: "demoApp-employeetable-idcolprojectname",
					order: 0,
					text: "ProjectName",
					visible: true
				},
				{
					id: "demoApp-employeetable-idcolprojecttypr",
					order: 1,
					text: "ProjectType",
					visible: true
				},
				{
					id: "demoApp-employeetable-idcolskill",
					order: 2,
					text: "Skill",
					visible: true
				},
				{
					id: "demoApp-employeetable-idcolpastexp",
					order: 3,
					text: "PastExperience",
					visible: true
				},
				{
					id: "demoApp-employeetable-strttimecol",
					order: 4,
					text: "Start Time",
					visible: true
				},
				{
					id: "demoApp-employeetable-endtimecol",
					order: 5,
					text: "End Time",
					visible: true
				},
				{
					id: "demoApp-employeetable-lctioncol",
					order: 6,
					text: "Location",
					visible: true
				},
				{
					id: "demoApp-idtable-buldngcol",
					order: 7,
					text: "Building",
					visible: true
				},
				{
					id: "demoApp-idtable-roomcol",
					order: 8,
					text: "Conference Room",
					visible: true
				},
				{
					id: "demoApp-idtable-meetingidcol",
					order: 9,
					text: "Meeting Id",
					visible: false
				},
				{
					id: "demoApp-idtable-Descriptioncol",
					order: 10,
					text: "Description",
					visible: false
				}
				
			]
		},

		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			var oBundle = this._oBundle;
			oDeferred.resolve(oBundle);
			return oDeferred.promise();
		},

		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},

		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();
			var oInitialData = {
					aColumns : [
						{
							id: "demoApp-idtable-titlecol",
							order: 0,
							text: "Title",
							visible: true
						},
						{
							id: "demoApp-idtable-createddatecol",
							order: 1,
							text: "Created Date",
							visible: true
						},
						{
							id: "demoApp-idtable-startdatecol",
							order: 2,
							text: "Start Date",
							visible: true
						},
						{
							id: "demoApp-idtable-bookcol",
							order: 3,
							text: "End Date",
							visible: true
						},
						{
							id: "demoApp-idtable-strttimecol",
							order: 4,
							text: "Start Time",
							visible: true
						},
						{
							id: "demoApp-idtable-endtimecol",
							order: 5,
							text: "End Time",
							visible: true
						},
						{
							id: "demoApp-idtable-lctioncol",
							order: 6,
							text: "Location",
							visible: true
						},
						{
							id: "demoApp-idtable-buldngcol",
							order: 7,
							text: "Building",
							visible: true
						},
						{
							id: "demoApp-idtable-roomcol",
							order: 8,
							text: "Conference Room",
							visible: true
						},
						{
							id: "demoApp-idtable-meetingidcol",
							order: 9,
							text: "Meeting Id",
							visible: false
						},
						{
							id: "demoApp-idtable-Descriptioncol",
							order: 10,
							text: "Description",
							visible: false
						}
							]
			};

			//set personalization
			this._oBundle = oInitialData;

			//reset personalization, i.e. display table as defined
	//		this._oBundle = null;

			oDeferred.resolve();
			return oDeferred.promise();
		},

		//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
		//to 'Weight (Important!)', but will leave all other column names as they are.
		getCaption : function (oColumn) {
			if (oColumn.getHeader() && oColumn.getHeader().getText) {
				if (oColumn.getHeader().getText() === "Title") {
					return "Title (Important!)";
				}
			}
			return null;
		},

		getGroup : function(oColumn) {
			if ( oColumn.getId().indexOf('titlecol') != -1 || oColumn.getId().indexOf('createddatecol') != -1 || 
					oColumn.getId().indexOf('startdatecol') != -1 || oColumn.getId().indexOf('bookcol') != -1) {
				return "Primary Group";
			}
			return "Secondary Group";
		}
	};

	return columns;

}, /* bExport= */ true);