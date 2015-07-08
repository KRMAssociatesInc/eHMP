// admissions

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

        v3DataRecord.date = maputil.nullInsteadOfEmptyString(v2DataRecord.AdmissionDate);
        v3DataRecord.recordId = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.AdmissionId, "id");
        v3DataRecord.type = maputil.nullInsteadOfEmptyString(v2DataRecord.AdmissionType);
        v3DataRecord.provider = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.AdmittingProvider, "name");
        v3DataRecord.dispositionDate = maputil.nullInsteadOfEmptyString(v2DataRecord.DispositionDate);
        v3DataRecord.dispositionType = maputil.nullInsteadOfEmptyString(v2DataRecord.DispositionType);
        v3DataRecord.division = maputil.nullInsteadOfEmptyString(v2DataRecord.Division);

        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 18
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;