// orders consults

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

        var v3DataRecord = mapConsultDataRecord(v2DataRecord);

        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 20
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

var mapConsultDataRecord = function (v2DataRecord) {
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
    v3DataRecord.status = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.Status, "display");

    v3DataRecord.description = maputil.nullInsteadOfEmptyString(v2DataRecord.Description);

    var v2ConsOrder = v2DataRecord.ConsultOrders[0];
    v3DataRecord.facility = maputil.nullInsteadOfEmptyOneElementObject(v2ConsOrder.FacilityName, "name");
    v3DataRecord.reason = maputil.nullInsteadOfEmptyString(v2ConsOrder.ReasonForRequest);
    v3DataRecord.receivingLocation = maputil.nullInsteadOfEmptyOneElementObject(v2ConsOrder.ReceivingClinincName, "name");
    v3DataRecord.referringLocation = maputil.nullInsteadOfEmptyOneElementObject(v2ConsOrder.ReferringClinicName, "name");


    return v3DataRecord;
}


module.exports.map = map;
module.exports.mapConsultDataRecord = mapConsultDataRecord;