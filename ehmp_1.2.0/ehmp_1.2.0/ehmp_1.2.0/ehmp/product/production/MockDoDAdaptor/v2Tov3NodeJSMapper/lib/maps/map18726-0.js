// order rad

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

        var v3DataRecord = mapRadDataRecord(v2DataRecord);

        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType":23
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};


var mapRadDataRecord = function (v2DataRecord) {
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

    var v2RadOrder = v2DataRecord.RadiologyOrders[0];
    v3DataRecord.adminTimes = null;
    v3DataRecord.alternateSpecimenText = maputil.nullInsteadOfEmptyString(v2RadOrder.AlternateSpecimenText);
    v3DataRecord.collectionMethod = maputil.nullInsteadOfEmptyString(v2RadOrder.CollectionMethod);
    v3DataRecord.duration = maputil.nullInsteadOfEmptyString(v2RadOrder.Duration);
    v3DataRecord.endDate = maputil.nullInsteadOfEmptyString(v2RadOrder.EndDate);
    v3DataRecord.enteringLocation = maputil.nullInsteadOfEmptyOneElementObject(v2RadOrder.EnteringLocationName, "name");
    v3DataRecord.facility = maputil.nullInsteadOfEmptyOneElementObject(v2RadOrder.FacilityName, "name");
    v3DataRecord.frequency = maputil.nullInsteadOfEmptyString(v2DataRecord.Frequency);
    v3DataRecord.groupNumber = maputil.nullInsteadOfEmptyString(v2DataRecord.GroupNumber);
    v3DataRecord.signedDate = maputil.nullInsteadOfEmptyString(v2DataRecord.NurseSignatureDate);
    v3DataRecord.signedBy = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.NurseSignatureName, "name");
    v3DataRecord.intervalPattern = maputil.nullInsteadOfEmptyString(v2RadOrder.IntervalRepeatPattern);
    v3DataRecord.interval = maputil.nullInsteadOfEmptyString(v2RadOrder.IntervalTimeInterval);
    v3DataRecord.comments = maputil.nullInsteadOfEmptyString(v2RadOrder.OrderComment);
    v3DataRecord.priorOrderNumber = maputil.nullInsteadOfEmptyOneElementObject(v2RadOrder.PriorOrderNumber, "id");
    v3DataRecord.priority = maputil.nullInsteadOfEmptyString(v2RadOrder.Priority);
    v3DataRecord.processingPriority = maputil.nullInsteadOfEmptyString(v2RadOrder.ProcessingPriority);
    v3DataRecord.scheduleType = maputil.nullInsteadOfEmptyOneElementObjectArray(v2RadOrder.ScheduleTypeName, "display");
    v3DataRecord.specimenText = maputil.nullInsteadOfEmptyString(v2RadOrder.SpecimenText);
    v3DataRecord.startDate = maputil.nullInsteadOfEmptyString(v2RadOrder.StartDate);
    v3DataRecord.statusComments = maputil.nullInsteadOfEmptyString(v2RadOrder.StatusComments);
    v3DataRecord.verifiedBy = maputil.nullInsteadOfEmptyOneElementObject(v2RadOrder.VerifiedByName, "name");


    return v3DataRecord;
}

module.exports.map = map;
module.exports.mapRadDataRecord = mapRadDataRecord;