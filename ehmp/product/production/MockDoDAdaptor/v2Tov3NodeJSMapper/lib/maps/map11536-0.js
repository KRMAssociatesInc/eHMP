// notes

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

        v3DataRecord.complexDataUrl = maputil.nullInsteadOfEmptyString(v2DataRecord.ComplexDataUrl);

        if (!v2DataRecord.ComplexDataUrl) {
            v3DataRecord.content = maputil.nullInsteadOfEmptyString(v2DataRecord.CompleteNote);
        }

        v3DataRecord.contentType = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.NoteFormat, "code");
        v3DataRecord.title = maputil.nullInsteadOfEmptyString(v2DataRecord.NoteTitle);
        v3DataRecord.type = [
            {
                "code": maputil.nullInsteadOfEmptyString(v2DataRecord.NoteTypeCode),
                "display": maputil.nullInsteadOfEmptyString(v2DataRecord.NoteTypeName),
                "system": "2.16.840.1.113883.3.42.126.100001.16"
            }
        ];
        v3DataRecord.status = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Status, "display");
        v3DataRecord.verifiedBy = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.VerifiedBy, "name");
        v3DataRecord.verifiedDate = maputil.nullInsteadOfEmptyString(v2DataRecord.VerifiedDate);





        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 12
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;