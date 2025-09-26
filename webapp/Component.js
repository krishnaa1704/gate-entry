sap.ui.define([
    "sap/ui/core/UIComponent",
    "gateentry/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("gateentry.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            var oSharedData ={
                GateEntryNo : "",
                Location :"",
                CompanyCode:"",
                OfficerID :"",
                GateNumber:""
            }
           var oSharedModel = new sap.ui.model.json.JSONModel({
                GateEntries: []   // stores all gate entries
            });
            this.setModel(oSharedModel, "sharedModel");

            // enable routing
            this.getRouter().initialize();
        }
    });
});