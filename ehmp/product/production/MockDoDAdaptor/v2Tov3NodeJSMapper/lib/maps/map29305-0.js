// orders meds

var maputil = require('./maputil.js');

var map = function (v2JSON) {
    var statusListStatus;
    var statusComplete = false;

    if (v2JSON.queryComplete === "true") {
        for (var i = 0; i < v2JSON.statusList.length; i++) {
            if (v2JSON.statusList[i].SiteStatus === "COMPLETE");
            statusListStatus = v2JSON.statusList[i];
            statusComplete = true;
        }
    }
    if (!statusComplete) {
        return {
            "dataList": [

            ]
        }
    }

    var v3JSON = {
        "queryComplete": "true",
        "statusList": [
            statusListStatus
        ]
    }

    var v3DataList = [];

    for (var i = 0; i < v2JSON.dataList.length; i++) {
        var v2DataRecord = v2JSON.dataList[i].dataRecord;

        var v3DataRecord = mapMedicationDataRecord(v2DataRecord);

        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 22
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

// maps the v2 Medication order from the v2DataRecord into the v3DataRecord
var mapMedicationDataRecord = function (v2DataRecord) {
    var v3DataRecord = maputil.baseTransform(v2DataRecord);

    v3DataRecord.orderable = [
        {
            "display": maputil.nullInsteadOfEmptyString(v2DataRecord.Description),
            "code": maputil.nullInsteadOfEmptyString(v2DataRecord.Ncid),
            "system": "2.16.840.1.113883.3.42.126.100001.16"
        }
    ];
    v3DataRecord.date = maputil.nullInsteadOfEmptyString(v2DataRecord.OrderDate);
    v3DataRecord.orderNumber = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.OrderId, "id");
    v3DataRecord.orderingProvider = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.OrderingProvider, "name");
    v3DataRecord.status = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Status, "display");


    var v2MedicationOrder = v2DataRecord.MedicationOrders[0];
    v3DataRecord.actionCode = maputil.nullInsteadOfEmptyString(v2MedicationOrder.ActionCode);
    v3DataRecord.childResistant = (v2MedicationOrder.ChildResistant === 'true');
    v3DataRecord.deliveryLocation = maputil.nullInsteadOfEmptyOneElementObject(v2MedicationOrder.DeliverToLocationName, "name");
    v3DataRecord.dispensingLocation = maputil.nullInsteadOfEmptyOneElementObject(v2MedicationOrder.DispensingLocationName, "name");
    v3DataRecord.alternateDrugText = maputil.nullInsteadOfEmptyString(v2MedicationOrder.DrugAlternateText);
    v3DataRecord.duration = maputil.nullInsteadOfEmptyString(v2MedicationOrder.Duration);
    v3DataRecord.endDate = maputil.nullInsteadOfEmptyString(v2MedicationOrder.EndDate);
    v3DataRecord.enteringLocation = maputil.nullInsteadOfEmptyOneElementObject(v2MedicationOrder.EnteringLocationName, "name");
    v3DataRecord.facility = maputil.nullInsteadOfEmptyOneElementObject(v2MedicationOrder.FacilityName, "name");
    v3DataRecord.giveAmount = maputil.nullInsteadOfEmptyString(v2MedicationOrder.GiveAmount);
    v3DataRecord.giveFormDescription = maputil.nullInsteadOfEmptyString(v2MedicationOrder.GiveFormDescription);
    v3DataRecord.giveUnits = maputil.nullInsteadOfEmptyOneElementObjectArray(v2MedicationOrder.GiveUnits, "display");
    v3DataRecord.intervalPattern = maputil.nullInsteadOfEmptyString(v2MedicationOrder.IntervalRepeatPattern);
    v3DataRecord.interval = maputil.nullInsteadOfEmptyString(v2MedicationOrder.IntervalTimeInterval);
    v3DataRecord.numberOfRefills = maputil.nullInsteadOfEmptyString(v2MedicationOrder.NumberOfRefills);
    v3DataRecord.comments = maputil.nullInsteadOfEmptyString(v2MedicationOrder.OrderComment);
    v3DataRecord.priorOrderNumber = maputil.nullInsteadOfEmptyOneElementObject(v2MedicationOrder.PriorOrderNumber, "id");
    v3DataRecord.priority = maputil.nullInsteadOfEmptyString(v2MedicationOrder.Priority);
    v3DataRecord.quantity = maputil.nullInsteadOfEmptyString(v2MedicationOrder.Quantity);
    v3DataRecord.requestedDispenseAmount = maputil.nullInsteadOfEmptyString(v2MedicationOrder.RequestedDispenseAmount);
    v3DataRecord.requestedGiveTimeUnit = maputil.nullInsteadOfEmptyString(v2MedicationOrder.RequestedGiveTimeUnit);
    v3DataRecord.routeDescription = maputil.nullInsteadOfEmptyString(v2MedicationOrder.RouteDescription);
    v3DataRecord.sig = maputil.nullInsteadOfEmptyString(v2MedicationOrder.Sig);
    v3DataRecord.startDate = maputil.nullInsteadOfEmptyString(v2MedicationOrder.StartDate);
    v3DataRecord.verifiedBy = maputil.nullInsteadOfEmptyOneElementObject(v2MedicationOrder.VerifiedByName, "name");

    return v3DataRecord;

}


module.exports.map = map;
module.exports.mapMedicationDataRecord = mapMedicationDataRecord;