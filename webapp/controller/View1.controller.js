

    sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(Controller, MessageToast, MessageBox) {
    "use strict";
    
    return Controller.extend("gateentry.controller.View1", {
        
        onInit: function() {
            var oData = {
                GateEntryNo: "",
                Location: "",
                Date: new Date(),
                OfficerID: "",
                GateNumber: "",
                MovementType: 0
            };
            this.getView().setModel(new sap.ui.model.json.JSONModel(oData));
        },
        
       onNext: function() {
    let oRadioGroup = this.byId("movementtype");
    let iIndex = oRadioGroup.getSelectedIndex();
    let sMovementType;

    if (iIndex === 0) {
        sMovementType = "INWARD";
    } else if (iIndex === 1) {
        sMovementType = "INTERNAL";
    } else if (iIndex === 2) {
        sMovementType = "OUTWARD";
    }

    var gateNo = this.byId("gateentrynumber").getValue();
    var loc = this.byId("plant").getValue();
    var officer = this.byId("securityoff").getValue();
    var gateNum = this.byId("gatenumber").getValue();
    var companycode = this.byId("companycode").getValue();

    if (loc && officer) {
        var oSharedModel = this.getOwnerComponent().getModel("sharedModel");
        var aEntries = oSharedModel.getProperty("/GateEntries") || [];

        // Create one entry object
        var oEntry = {
            GateEntryNo: gateNo,
            Location: loc,
            CompanyCode: companycode,
            OfficerID: officer,
            GateNumber: gateNum,
            MovementType: sMovementType,
            POLineSet: [],      // keep empty for now, will fill in View2
            InboundItems: [],
            ManualItems: []
        };

        // Check if already exists
        var iIndexExisting = aEntries.findIndex(e => e.GateEntryNo === gateNo);
        if (iIndexExisting >= 0) {
            aEntries[iIndexExisting] = oEntry;  // overwrite
        } else {
            aEntries.push(oEntry);
        }

        oSharedModel.setProperty("/GateEntries", aEntries);

        this.getOwnerComponent().getRouter().navTo("RouteView2", {
            movementType: sMovementType,
            gateNo: gateNo        // pass as parameter
        });
    } else {
        MessageBox.error("Please Enter Necessary Details");
    }
}

    });
});

        
    