// appointments

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

        var v3DataRecord = maputil.baseTransform(v2DataRecord);


        v3DataRecord.checkInDate = maputil.nullInsteadOfEmptyString(v2DataRecord.CheckinTime);
        v3DataRecord.checkOutDate = maputil.nullInsteadOfEmptyString(v2DataRecord.CheckoutTime);
        v3DataRecord.classification = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentClassification);
        v3DataRecord.comments = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentComment);
        v3DataRecord.date = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentDateTime);
        v3DataRecord.dispositions = [maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Disposition, "display")];
        v3DataRecord.location = {
            "name": v2DataRecord.Clinic
        };
        v3DataRecord.provider = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.Provider, "name");
        v3DataRecord.reason = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentReason);
        v3DataRecord.status = maputil.nullInsteadOfEmptyString(v2DataRecord.Status);
        v3DataRecord.type = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentType);


        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 6
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;