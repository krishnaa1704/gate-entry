
    sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, Label, Input, DatePicker, MessageToast) {
    "use strict";

    return Controller.extend("gateentry.controller.View2", {

      onInit: function () {
        this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this._onObjectMatched, this);
        this.getView().setModel(new sap.ui.model.json.JSONModel({
        isPO: true,   // default
        isInbound: false,
    }));
    var oModel = new sap.ui.model.json.JSONModel(
        {
        "Suppliers": [
            { "SupplierNo": "1001", "SupplierName": "ABC Pvt Ltd" },
            { "SupplierNo": "1002", "SupplierName": "XYZ Enterprises" },
            { "SupplierNo": "1003", "SupplierName": "Global Traders" }
        ]
        }
    );
    this.getView().setModel(oModel,"localModel")

    var aModel = new sap.ui.model.json.JSONModel(
        {
  "Vehicles": [
    {
      "VehicleNo": "TN01AB1234",
      "VehicleType": "Truck",
      "TransporterName": "XYZ Logistics",
      "GSTNo": "22AAAAA0000A1Z5",
      "DriverName": "Ramesh",
      "DriverLicense": "DL123456",
      "LRNo": "LR7890",
      "LRDate": "2025-08-20",
      "ContractNo": "C98765",
      "NoOfPersons": "2"
    },
    {
      "VehicleNo": "TN02BA4321",
      "VehicleType": "Tempo",
      "TransporterName": "ABC Transport",
      "GSTNo": "29BBBBB1111B2Z6",
      "DriverName": "Suresh",
      "DriverLicense": "DL654321",
      "LRNo": "LR4567",
      "LRDate": "2025-08-18",
      "ContractNo": "C54321",
      "NoOfPersons": "3"
    }
  ]
}
)
this.getView().setModel(aModel,"transportModel")

var bModel = new sap.ui.model.json.JSONModel(
    {
  "POs": [
    {
      "PONumber": "4500001234",
      "Items": [
        { "PONumber":"4500001234","LineItem": "10", "Material": "MAT001", "Description": "Steel Rod", "POQty": "100", "GRNQty": "20","ReceivedQty":"50", "Remaining": "", "Plant": "1000", "StorageLoc": "S001", "WeightUnit": "KG", "GrossWeight": "200", "NetWeight": "198" },
        { "PONumber":"4500001234","LineItem": "20", "Material": "MAT002", "Description": "Cement Bag", "POQty": "50", "GRNQty": "10", "ReceivedQty":"30","Remaining": "", "Plant": "1000", "StorageLoc": "S002", "WeightUnit": "KG", "GrossWeight": "2500", "NetWeight": "2450" }
      ]
    },
    {
      "PONumber": "4500005678",
      "Items": [
        {  "PONumber":"4500001234","LineItem": "10", "Material": "MAT005", "Description": "Bricks", "POQty": "1000", "GRNQty": "500", "ReceivedQty":"100","Remaining": "500", "Plant": "2000", "StorageLoc": "S010", "WeightUnit": "TON", "GrossWeight": "10", "NetWeight": "9.8" }
      ]
    }
  ]
}

)
this.getView().setModel(bModel,"poModel");
var inbModel = new sap.ui.model.json.JSONModel({
    "InboundDeliveries": [  
        {
            "DeliveryNumber": "8000000123",
            "Items": [
                { "indeliverynumber": "8000000123", "inbLineItem": "10", "inbMaterial": "MAT456", "inbMaterialDesc": "Inbound Item A", "inbDeliveryQty": "100", "inbGRQty": "30", "inbReceivedQty": "20", "inbRemainingQty": "50", "inbPlant": "2000", "inbStorageLoc": "S020", "inbWeightUnit": "KG", "inbGrossWeight": "150", "inbNetWeight": "148" }
            ]
        },
        {
            "DeliveryNumber": "8000000456",
            "Items": [
                { "indeliverynumber": "8000000456", "inbLineItem": "20", "inbMaterial": "MAT789", "inbMaterialDesc": "Inbound Item B", "inbDeliveryQty": "200", "inbGRQty": "50", "inbReceivedQty": "40", "inbRemainingQty": "110", "inbPlant": "3000", "inbStorageLoc": "S030", "inbWeightUnit": "TON", "inbGrossWeight": "20", "inbNetWeight": "19.5" }
            ]
        }
    ]
});
this.getView().setModel(inbModel, "inbModel");
var oManualModel = new sap.ui.model.json.JSONModel({
    ManualItems: []
});
this.getView().setModel(oManualModel, "manualModel");


},

_onObjectMatched: function (oEvent) {
      let sMovementType = oEvent.getParameter("arguments").movementType;
    let sGateNo = oEvent.getParameter("arguments").gateNo;

    // Get sharedModel
    let oSharedModel = this.getOwnerComponent().getModel("sharedModel");
    let aEntries = oSharedModel.getProperty("/GateEntries") || [];

    let oEntry = aEntries.find(e => e.GateEntryNo === sGateNo);
    if (oEntry) {
        // Bind header + items
        let oLocalModel = new sap.ui.model.json.JSONModel(oEntry);
        this.getView().setModel(oLocalModel, "currentEntry");

        // Example: bind table
        this.byId("polineTable").setModel(oLocalModel, "currentEntry");
        this.byId("polineTable").bindItems({
            path: "currentEntry>/POLineSet",
            template: this.byId("polineTable").getBindingInfo("items").template.clone()
        });
    } else {
       // MessageToast.show("No data found for GateEntryNo " + sGateNo);
    }

    // Hide all first
    this.byId("vendorTab").setVisible(false);
    this.byId("transporterTab").setVisible(false);
    this.byId("weighbridgeTab").setVisible(false);
    this.byId("dockTab").setVisible(false);
    this.byId("unloadingTab").setVisible(false);
    this.byId("statusTab").setVisible(false);

    if (sMovementType === "INWARD") {
        this.byId("vendorTab").setVisible(true);
        this.byId("transporterTab").setVisible(true);
        this.byId("statusTab").setVisible(true);
        this.byId("dockTab").setVisible(true);
        this.byId("inward").setVisible(false);
        // this.byId("startgateentry").setVisible(true);
        // this.byId("exitgateentry").setVisible(false);
        this.byId("grdocument").setVisible(false); 

         this.byId("gateEntryBox").setVisible(true);
        this.byId("gateExitBox").setVisible(false);
        //bottom buttons
        this.byId("gateentry").setVisible(true);
        this.byId("postgr").setVisible(false);
        this.byId("gateexit").setVisible(false);
    } else if (sMovementType === "INTERNAL") {
        // Example: Show only some tabs
        this.byId("vendorTab").setVisible(true);
        this.byId("transporterTab").setVisible(true);
        this.byId("weighbridgeTab").setVisible(true);
        this.byId("dockTab").setVisible(true);
        this.byId("unloadingTab").setVisible(true);
        this.byId("statusTab").setVisible(true);
        this.byId("inward").setVisible(true);
        this.byId("grdocument").setVisible(true); 


        this.byId("gateEntryBox").setVisible(true);
        this.byId("gateExitBox").setVisible(false);

        //bottom buttons
        this.byId("postgr").setVisible(true);
        this.byId("gateentry").setVisible(false);
        this.byId("gateexit").setVisible(false);
    } else if (sMovementType === "OUTWARD") {
        this.byId("vendorTab").setVisible(true);
        this.byId("transporterTab").setVisible(true);
        this.byId("statusTab").setVisible(true);
        // this.byId("exitgateentry").setVisible(true);
        // this.byId("startgateentry").setVisible(false);
        this.byId("grdocument").setVisible(true); 

        this.byId("gateEntryBox").setVisible(false);
        this.byId("gateExitBox").setVisible(true);
        //bottom buttons
        this.byId("gateexit").setVisible(true);
         this.byId("postgr").setVisible(false);
        this.byId("gateentry").setVisible(false);

    }
},

onDocTypeChange: function (oEvent) {
    let sType = oEvent.getSource().getSelectedKey();
    if (sType === "INB") {
        this.byId("inbSection").setVisible(true);
        this.byId("poSection").setVisible(false);
        this.byId("manualentry").setVisible(false);
       
    } else if(sType === "PO") {
        this.byId("poSection").setVisible(true);
        this.byId("inbSection").setVisible(false);
        this.byId("manualentry").setVisible(false);
       
    } else if(sType === "ME"){
        this.byId("poSection").setVisible(false);
        this.byId("inbSection").setVisible(false);
        this.byId("manualentry").setVisible(true);
       
    }
},

// onCheckPO: function (oEvent) {
//     let sPONumber = oEvent.getSource().getValue();
//     if (!sPONumber) return;

//     // Simulate backend call
//     let oData = this._fetchPOData(sPONumber);

//     if (oData.exists) {
//         MessageToast.show("PO Found. Populating data...");
//         this._fillPOForm(oData);
//         this._setPOEditable(false);
//     } else {
//         MessageToast.show("PO not found. Enable manual entry.");
//         this._setPOEditable(true);
//     }
// },

// onCheckInbound: function (oEvent) {
//     let sDeliveryNo = oEvent.getSource().getValue();
//     if (!sDeliveryNo) return;

//     // Simulate backend call
//     let oData = this._fetchInboundData(sDeliveryNo);

//     if (oData.exists) {
//         MessageToast.show("Inbound Found. Populating data...");
//         this._fillInboundForm(oData);
//         this._setInboundEditable(false);
//     } else {
//         MessageToast.show("Inbound not found. Enable manual entry.");
//         this._setInboundEditable(true);
//     }
// },

// // Dummy Backend Call Simulation
// _fetchPOData: function (sPONumber) {
//     // Replace with real OData call
//     if (sPONumber === "4500000010") {
//         return {
//             exists: true,
//             PurchasingDocument: sPONumber,
//             LineItem: "10",
//             DocumentDate: new Date(),
//             CreatedBy: "TESTUSER",
//             Material: "MAT123",
//             MaterialDescription: "Test Material",
//             POQty: 100,
//             GRQty: 80,
//             ReceivedQty: 10,
//             RemainingQty: 10,
//             NetPrice: 50,
//             Per: "EA",
//             OrderUoM: "EA",
//             NetValue: 5000,
//             GrossValue: 5200,
//             Plant: "1000",
//             StorageLocation: "0001",
//             NetWeight: 10,
//             GrossWeight: 12,
//             WeightUnit: "KG"
//         };
//     }
//     return { exists: false };
// },

// _fetchInboundData: function (sDeliveryNo) {
//     if (sDeliveryNo === "8000000123") {
//         return {
//             exists: true,
//             DeliveryDocument: sDeliveryNo,
//             LineItem: "20",
//             DocumentDate: new Date(),
//             CreatedBy: "INBUSER",
//             Material: "MAT456",
//             ItemDescription: "Inbound Item",
//             DeliveryQty: 50,
//             ReceivedQty: 20,
//             NetPrice: 100,
//             UoM: "EA",
//             NetValue: 5000,
//             Plant: "2000",
//             StorageLocation: "0002",
//             GrossWeight: 15,
//             NetWeight: 14,
//             WeightUnit: "KG"
//         };
//     }
//     return { exists: false };
// },

// // Fill Forms
// _fillPOForm: function (oData) {
//     for (let key in oData) {
//         if (this.byId("po" + key)) {
//             this.byId("po" + key).setValue(oData[key]);
//         }
//     }
// },
// _fillInboundForm: function (oData) {
//     for (let key in oData) {
//         if (this.byId("inb" + key)) {
//             this.byId("inb" + key).setValue(oData[key]);
//         }
//     }
// },

// // Editable Toggle
// _setPOEditable: function (bEdit) {
//     let aEditable = ["poReceivedQty", "poRemainingQty"];
//     this.byId("poForm").getContent().forEach(c => {
//         if (c instanceof sap.m.Input || c instanceof sap.m.DatePicker) {
//             let bEnable = bEdit || aEditable.includes(c.getId().split("--").pop());
//             c.setEditable(bEnable);
//         }
//     });
// },
// _setInboundEditable: function (bEdit) {
//     let aEditable = ["inbReceivedQty"];
//     this.byId("inbForm").getContent().forEach(c => {
//         if (c instanceof sap.m.Input || c instanceof sap.m.DatePicker) {
//             let bEnable = bEdit || aEditable.includes(c.getId().split("--").pop());
//             c.setEditable(bEnable);
//         }
//     });
// },
onVehicleTypeChange: function (oEvent) {
    var sSelectedKey = oEvent.getSource().getSelectedKey();
    var oOtherInput = this.byId("otherVehicleInput");

    if (sSelectedKey === "Others") {
        oOtherInput.setVisible(true);
        oOtherInput.setValue("");
    } else {
        oOtherInput.setVisible(false);
    }
},
suppliercheck(){
    var oModel = this.getView().getModel("localModel");
    var aSuppliers = oModel.getProperty("/Suppliers");
    var supplier = this.byId("suppnum").getValue();
    var match = aSuppliers.find(obj=>obj.SupplierNo == supplier);
    if(match){
        this.byId("suppname").setValue(match.SupplierName)
    }else{
        this.byId("suppname").setValue("")
    }
    
},
vehiclenumber(){
    var oModel = this.getView().getModel("transportModel");
    var aVehicles = oModel.getProperty("/Vehicles");

    var sVehicleNo = this.byId("vehiclenumber").getValue().toUpperCase();
    var oMatch = aVehicles.find(obj => obj.VehicleNo === sVehicleNo);

    if (oMatch) {
        this.byId("vehicleTypeCombo").setValue(oMatch.VehicleType);
        this.byId("transporter").setValue(oMatch.TransporterName);
        this.byId("gst").setValue(oMatch.GSTNo);
        this.byId("driver").setValue(oMatch.DriverName);
        this.byId("license").setValue(oMatch.DriverLicense);
        this.byId("lrno").setValue(oMatch.LRNo);
        this.byId("lrdate").setValue(oMatch.LRDate);  
        this.byId("contract").setValue(oMatch.ContractNo);
        this.byId("persons").setValue(oMatch.NoOfPersons);

        sap.m.MessageBox.success("Vehicle details found and filled");
    } else {
        this.byId("vehicleTypeCombo").setValue("");
        this.byId("transporter").setValue("");
        this.byId("gst").setValue("");
        this.byId("driver").setValue("");
        this.byId("license").setValue("");
        this.byId("lrno").setValue("");
        this.byId("lrdate").setValue("");
        this.byId("contract").setValue("");
        this.byId("persons").setValue("");

        sap.m.MessageBox.warning("Vehicle not found. Please enter details manually.");
    }
},
onstartgateentry(){
    var oDate = new Date();

   
    var sDate = oDate.getDate().toString().padStart(2, '0') + "/" + 
                (oDate.getMonth() + 1).toString().padStart(2, '0') + "/" + 
                oDate.getFullYear();

    
    var sTime = oDate.getHours().toString().padStart(2, '0') + ":" + 
                oDate.getMinutes().toString().padStart(2, '0') + ":" + 
                oDate.getSeconds().toString().padStart(2, '0');

    
    this.byId("gateentrydate").setValue(sDate);
    this.byId("gateentrytime").setValue(sTime);
    this.byId("gateExitBox").setVisible(false);
     this.byId("gateEntryBox").setVisible(true);
    
    sap.m.MessageToast.show("System Date & Time fetched");
},
ongateexit(){
    var oDate = new Date();

   
    var sDate = oDate.getDate().toString().padStart(2, '0') + "/" + 
                (oDate.getMonth() + 1).toString().padStart(2, '0') + "/" + 
                oDate.getFullYear();

    
    var sTime = oDate.getHours().toString().padStart(2, '0') + ":" + 
                oDate.getMinutes().toString().padStart(2, '0') + ":" + 
                oDate.getSeconds().toString().padStart(2, '0');

    
    this.byId("gateexitdate").setValue(sDate);
    this.byId("gateexittime").setValue(sTime);
    this.byId("gateExitBox").setVisible(true);
    this.byId("gateEntryBox").setVisible(false);
    
    sap.m.MessageToast.show("System Date & Time fetched");
},
onChange(){
    var oStart = this.byId("startunload").getDateValue();
    var oEnd = this.byId("endunload").getDateValue();

    if (oStart && oEnd) {
        var diffMs = oEnd - oStart;  // difference in milliseconds
        if (diffMs < 0) {
            sap.m.MessageToast.show("End time must be after Start time");
            this.byId("duration").setValue("");
            return;
        }

        var diffMins = Math.floor(diffMs / 60000); // total minutes
        var hours = Math.floor(diffMins / 60);
        var minutes = diffMins % 60;

        var durationStr = hours + " hr " + minutes + " min";
        this.byId("duration").setValue(durationStr);
    }
},
onWeightchange(){
        var gross = parseFloat(this.byId("grossweight").getValue());
    var tare = parseFloat(this.byId("tareweight").getValue());

    if (!isNaN(gross) && !isNaN(tare)) {
        var net = gross - tare;
        if (net < 0) {
            sap.m.MessageToast.show("Tare weight cannot be greater than Gross weight");
            this.byId("netWeight").setValue("");
            return;
        }
        this.byId("netweight").setValue(net);
    } else {
        this.byId("netweight").setValue("");
    }
},
checkPO(){
     var oMainModel = this.getView().getModel("poModel");
    var aPOs = oMainModel.getProperty("/POs");

    var sPONumber = this.byId("poNumber").getValue();
    var oMatch = aPOs.find(obj => obj.PONumber === sPONumber);

    if (oMatch) {
        // Create a new JSON model only for table items
        var oTableModel = new sap.ui.model.json.JSONModel();
        oTableModel.setProperty("/POItems", oMatch.Items);

        // Bind the model to table
        this.byId("polineTable").setModel(oTableModel);
        this.byId("polineTable").bindItems({
            path: "/POItems",
            template: this.byId("polineTable").getBindingInfo("items").template
        });

        sap.m.MessageBox.success("PO found and items loaded");
    } else {
        // Clear the table
        var oEmptyModel = new sap.ui.model.json.JSONModel({ POItems: [] });
        this.byId("polineTable").setModel(oEmptyModel);

        sap.m.MessageBox.error("PO not found. Please enter manually.");
    }
},
checkInbound: function () {
    var oMainModel = this.getView().getModel("inbModel");
    var aINBs = oMainModel.getProperty("/InboundDeliveries");

    var sDeliveryNumber = this.byId("inbNumber").getValue();
    var oMatch = aINBs.find(obj => obj.DeliveryNumber === sDeliveryNumber);

    if (oMatch) {
        var oTableModel = new sap.ui.model.json.JSONModel();
        oTableModel.setProperty("/InboundItems", oMatch.Items);

        this.byId("inboundDetailsTable").setModel(oTableModel);
        this.byId("inboundDetailsTable").bindItems({
            path: "/InboundItems",
            template: this.byId("inboundDetailsTable").getBindingInfo("items").template
        });

        sap.m.MessageBox.success("Inbound Delivery found and items loaded");
    } else {
        var oEmptyModel = new sap.ui.model.json.JSONModel({ InboundItems: [] });
        this.byId("inboundDetailsTable").setModel(oEmptyModel);

        sap.m.MessageBox.error("Inbound Delivery not found. Please enter manually.");
    }
},
onAddManualRow: function () {
    var oModel = this.getView().getModel("manualModel");
    var aItems = oModel.getProperty("/ManualItems");

    aItems.push({
        LineItem: (aItems.length + 1) * 10, // auto-generate like 10,20,30
        Material: "",
        Description: "",
        Quantity: "",
        Plant: "",
        StorageLoc: "",
        WeightUnit: "",
        GrossWeight: "",
        NetWeight: ""
    });

    oModel.refresh();
},

//radio buttons functionality
onRadioSelect(){
   var oDate = this.byId("gateentrydate");
   var oTime = this.byId("gateentrytime");
    var now = new Date();
        oDate.setDateValue(now);
        oTime.setDateValue(now);

},
onRadioSelect1(){
   var oDate = this.byId("gateexitdate");
   var oTime = this.byId("gateexittime");
    var now = new Date();
        oDate.setDateValue(now);
        oTime.setDateValue(now);

},
onweighbridgein(){
    
   var oTime = this.byId("weighintime");
    var now = new Date();
        oTime.setDateValue(now);
},
onweighbridgeout(){
    
   var oTime = this.byId("weighouttime");
    var now = new Date();
        oTime.setDateValue(now);
},
ondockin(){
     
   var oTime = this.byId("dockintime");
    var now = new Date();
        oTime.setDateValue(now);
},
ondockout(){
     
   var oTime = this.byId("dockouttime");
    var now = new Date();
        oTime.setDateValue(now);
},
onunloadstart: function () {
    var oTime = this.byId("startunload");
    var now = new Date();
    oTime.setDateValue(now);

    // trigger change event manually
    oTime.fireChange({
        value: oTime.getValue(),
        valid: true
    });
},

onunloadend: function () {
    var oTime = this.byId("endunload");
    var now = new Date();
    oTime.setDateValue(now);

    // trigger change event manually
    oTime.fireChange({
        value: oTime.getValue(),
        valid: true
    });
},


//remaining quantity automation
onporeceived: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var iReceived = parseInt(sValue, 10) || 0;

            // Get the row context
            var oContext = oInput.getBindingContext();
            var oRow = oContext.getObject();

            var iPO = parseInt(oRow.POQty, 10) || 0;
            var iGRN = parseInt(oRow.GRNQty, 10) || 0;

            // Formula: Remaining = PO - GRN - Received
            var iRemaining = iPO - iGRN - iReceived;

            if (iRemaining < 0) {
                iRemaining = 0; // avoid negative remaining qty
                MessageToast.show(" Quantity Limit Exceeded ");
            }

            // Update model
            oRow.ReceivedQty = iReceived.toString();
            oRow.Remaining = iRemaining.toString();

            oContext.getModel().refresh(true);
        },

oninboundreceived:function(oEvent){
     var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var iReceived = parseInt(sValue, 10) || 0;

            // Get the row context
            var oContext = oInput.getBindingContext();
            var oRow = oContext.getObject();

            var iPO = parseInt(oRow.inbDeliveryQty, 10) || 0;
            var iGRN = parseInt(oRow.inbGRQty, 10) || 0;

            // Formula: Remaining = PO - GRN - Received
            var iRemaining = iPO - iGRN - iReceived;

            if (iRemaining < 0) {
                iRemaining = 0; // avoid negative remaining qty
                MessageToast.show("Quantity Limit Exceeded ");
            }

            // Update model
             oRow.inbReceivedQty = iReceived.toString();
             oRow.inbRemainingQty = iRemaining.toString();

            oContext.getModel().refresh(true);
     
},



onCreateGateEntry(){
   var main = this.getOwnerComponent().getModel("sharedModel");
    var oData = main.getData();

    var aPayloadItems = [];

    // ✅ Collect selected PO rows
    var oPOTable = this.byId("polineTable");
    if (oPOTable.getVisible()) {
        var aPOSelected = oPOTable.getSelectedItems();
        aPOSelected.forEach(function (oItem) {
            var oCtx = oItem.getBindingContext();
            if (oCtx) {
                aPayloadItems.push(oCtx.getObject());
            }
        });
    }

    // ✅ Collect selected Inbound rows
    var oInbTable = this.byId("inboundDetailsTable");
    if (oInbTable.getVisible()) {
        var aINBSelected = oInbTable.getSelectedItems();
        aINBSelected.forEach(function (oItem) {
            var oCtx = oItem.getBindingContext();
            if (oCtx) {
                aPayloadItems.push(oCtx.getObject());
            }
        });
    }

    // ✅ Collect Manual Entry rows
        var oManualTable = this.byId("manualTable");
        if (oManualTable.getVisible()) {
            var aManualSelected = oManualTable.getSelectedItems();
            aManualSelected.forEach(function (oItem) {
                var oCtx = oItem.getBindingContext("manualModel");
                if (oCtx) {
                    aPayloadItems.push(oCtx.getObject());
                }
            });
        }

    var FinalPayload = 
        {
            "MainScreen":oData,
            "VendorDetails":{
               "SupplierNumber":this.byId("suppnum").getValue(),
                "SupplierName":this.byId("suppname").getValue(),
                "DeliveryNote":this.byId("dnote").getValue(),
                "InvoiceNumber":this.byId("invoiceno").getValue(),
                "InvoiceDate":this.byId("invoicedate").getValue(),
                
            },
            "TranporterDetails":{
                "VehicleType":this.byId("vehicleTypeCombo").getValue(),
                "VehicleNumber":this.byId("vehiclenumber").getValue(),
                "TransporterName":this.byId("transporter").getValue(),
                "GSTRegistrationNo":this.byId("gst").getValue(),
                "DriverName":this.byId("driver").getValue(),
                "DriverLicense":this.byId("license").getValue(),
                "LRno":this.byId("lrno").getValue(),
                "LRdate":this.byId("lrdate").getValue(),
                "ContractNumber":this.byId("contract").getValue(),
                "NoOfPersons":this.byId("persons").getValue(),
                
            },
            "DockDetails":{
                "DockLocation":this.byId("docklocation").getValue(),
                "AssignedTimeSlot":this.byId("assignedtime").getValue()
            },
            "StausAndPosting":{
                "GateEntryDate":this.byId("gateentrydate").getValue(),
                "GateEntryTime":this.byId("gateentrytime").getValue(),
                "Document_date":this.byId("gateentrydate").getValue(),
                "Document_time":this.byId("gateentrytime").getValue(),
                "Entry_Created_By":"Ramesh"
            },
            "LineItem":aPayloadItems
        }
    
    console.log(FinalPayload);
},
onPostGR(){
     var main = this.getOwnerComponent().getModel("sharedModel");
    var oData = main.getData();

    var aPayloadItems = [];

    // ✅ Collect selected PO rows
    var oPOTable = this.byId("polineTable");
    if (oPOTable.getVisible()) {
        var aPOSelected = oPOTable.getSelectedItems();
        aPOSelected.forEach(function (oItem) {
            var oCtx = oItem.getBindingContext();
            if (oCtx) {
                aPayloadItems.push(oCtx.getObject());
            }
        });
    }

    // ✅ Collect selected Inbound rows
    var oInbTable = this.byId("inboundDetailsTable");
    if (oInbTable.getVisible()) {
        var aINBSelected = oInbTable.getSelectedItems();
        aINBSelected.forEach(function (oItem) {
            var oCtx = oItem.getBindingContext();
            if (oCtx) {
                aPayloadItems.push(oCtx.getObject());
            }
        });
    }

    // ✅ Collect Manual Entry rows
        var oManualTable = this.byId("manualTable");
        if (oManualTable.getVisible()) {
            var aManualSelected = oManualTable.getSelectedItems();
            aManualSelected.forEach(function (oItem) {
                var oCtx = oItem.getBindingContext("manualModel");
                if (oCtx) {
                    aPayloadItems.push(oCtx.getObject());
                }
            });
        }

    var FinalPayload = 
        {
            // "MainScreen":oData,
            // "VendorDetails":{
            //    "SupplierNumber":this.byId("suppnum").getValue(),
            //     "SupplierName":this.byId("suppname").getValue(),
            //     "DeliveryNote":this.byId("dnote").getValue(),
            //     "InvoiceNumber":this.byId("invoiceno").getValue(),
            //     "InvoiceDate":this.byId("invoicedate").getValue(),
                
            // },
            // "TranporterDetails":{
            //     "VehicleType":this.byId("vehicleTypeCombo").getValue(),
            //     "VehicleNumber":this.byId("vehiclenumber").getValue(),
            //     "TransporterName":this.byId("transporter").getValue(),
            //     "GSTRegistrationNo":this.byId("gst").getValue(),
            //     "DriverName":this.byId("driver").getValue(),
            //     "DriverLicense":this.byId("license").getValue(),
            //     "LRno":this.byId("lrno").getValue(),
            //     "LRdate":this.byId("lrdate").getValue(),
            //     "ContractNumber":this.byId("contract").getValue(),
            //     "NoOfPersons":this.byId("persons").getValue(),
                
            // },
            // "DockDetails":{
            //     "DockLocation":this.byId("docklocation").getValue(),
            //     "AssignedTimeSlot":this.byId("assignedtime").getValue()
            // },
            // "StausAndPosting":{
            //     "GateEntryDate":this.byId("gateentrydate").getValue(),
            //     "GateEntryTime":this.byId("gateentrytime").getValue(),
            //     "Document_date":this.byId("gateentrydate").getValue(),
            //     "Document_time":this.byId("gateentrytime").getValue(),
            //     "Entry_Created_By":"Ramesh"
            // },
            // "Unloading Details":{
            //     "UnloadingStartTime":this.byId("starttime").getValue(),
            //     "UnloadingEndTime":this.byId("endtime").getValue(),
            //     "UnloadingDuration":this.byId("duration").getValue(),
            //     "UnloadingPersonsTeam":this.byId("unloadingteam").getValue(),
            //     "NoOfPersons":this.byId("noofpersons").getValue(),
            //     "UnloadingRemarks":this.byId("unloadingremarks").getValue()
            //  },
            //  "Weighbridge":{
            //    "GrossWeight":this.byId("grossweight").getValue(),
            //    "In-time":this.byId("intime").getValue(),
            //    "TareWeight":this.byId("tareweight").getValue(),
            //    "Out-time":this.byId("outtime").getValue(),
            //    "WeighbridgeLocation":this.byId("weighbridgelocation").getValue()
            //  },
            "LineItem":aPayloadItems
        }
        console.log(FinalPayload);
    
     
},
onGateExit(){
         var main = this.getOwnerComponent().getModel("sharedModel");
    var oData = main.getData();

    var aPayloadItems = [];

    // ✅ Collect selected PO rows
    var oPOTable = this.byId("polineTable");
    if (oPOTable.getVisible()) {
        var aPOSelected = oPOTable.getSelectedItems();
        aPOSelected.forEach(function (oItem) {
            var oCtx = oItem.getBindingContext();
            if (oCtx) {
                aPayloadItems.push(oCtx.getObject());
            }
        });
    }

    // ✅ Collect selected Inbound rows
    var oInbTable = this.byId("inboundDetailsTable");
    if (oInbTable.getVisible()) {
        var aINBSelected = oInbTable.getSelectedItems();
        aINBSelected.forEach(function (oItem) {
            var oCtx = oItem.getBindingContext();
            if (oCtx) {
                aPayloadItems.push(oCtx.getObject());
            }
        });
    }

    // ✅ Collect Manual Entry rows
        var oManualTable = this.byId("manualTable");
        if (oManualTable.getVisible()) {
            var aManualSelected = oManualTable.getSelectedItems();
            aManualSelected.forEach(function (oItem) {
                var oCtx = oItem.getBindingContext("manualModel");
                if (oCtx) {
                    aPayloadItems.push(oCtx.getObject());
                }
            });
        }

    var FinalPayload = 
        {
            "MainScreen":oData,
            "VendorDetails":{
               "SupplierNumber":this.byId("suppnum").getValue(),
                "SupplierName":this.byId("suppname").getValue(),
                "DeliveryNote":this.byId("dnote").getValue(),
                "InvoiceNumber":this.byId("invoiceno").getValue(),
                "InvoiceDate":this.byId("invoicedate").getValue(),
                
            },
            "TranporterDetails":{
                "VehicleType":this.byId("vehicleTypeCombo").getValue(),
                "VehicleNumber":this.byId("vehiclenumber").getValue(),
                "TransporterName":this.byId("transporter").getValue(),
                "GSTRegistrationNo":this.byId("gst").getValue(),
                "DriverName":this.byId("driver").getValue(),
                "DriverLicense":this.byId("license").getValue(),
                "LRno":this.byId("lrno").getValue(),
                "LRdate":this.byId("lrdate").getValue(),
                "ContractNumber":this.byId("contract").getValue(),
                "NoOfPersons":this.byId("persons").getValue(),
                
            },
            "StausAndPosting":{
                "GateExitDate":this.byId("gateexitdate").getValue(),
                "GateExitTime":this.byId("gateexittime").getValue(),
                "Document_date":this.byId("gateexitdate").getValue(),
                "Document_time":this.byId("gateexittime").getValue(),
                "Last_Changed_By":"Ramesh"
            },
            "DockDetails":{
               "DockLocation":this.byId("docklocation").getValue(),
                "AssignedTimeSlot":this.byId("assignedtime").getValue()
            },
            "Unloading Details":{
                "UnloadingStartTime":this.byId("startunload").getValue(),
                "UnloadingEndTime":this.byId("endunload").getValue(),
                "UnloadingDuration":this.byId("duration").getValue(),
                "UnloadingPersonsTeam":this.byId("unloadingteam").getValue(),
                "NoOfPersons":this.byId("noofpersons").getValue(),
                "UnloadingRemarks":this.byId("unloadingremarks").getValue()
             },
             "Weighbridge":{
               "GrossWeight":this.byId("grossweight").getValue(),
               "In-time":this.byId("weighintime").getValue(),
               "TareWeight":this.byId("tareweight").getValue(),
               "Out-time":this.byId("weighouttime").getValue(),
                "Net-Weight" : this.byId("netweight").getValue(),
               "WeighbridgeLocation":this.byId("weighbridgelocation").getValue()
             },
            "LineItem":aPayloadItems
        }
        console.log(FinalPayload);
}
    });
})
