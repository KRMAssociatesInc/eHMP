// procedures

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


        var v3Procedures = [];
        for (var procedureNum = 0; procedureNum < v2DataRecord.Procedures.length; procedureNum++) {
            var v2Procedure = v2DataRecord.Procedures[procedureNum];
            var procedure = {
                //"location": maputil.nullInsteadOfEmptyOneElementObject(v2Procedure.Facility, "name"),
                "status": maputil.nullInsteadOfEmptyOneElementObjectArray(v2Procedure.Status, "display"),
                "procedure": [
                    {
                        "code": maputil.nullInsteadOfEmptyString(v2Procedure.Code),
                        "display": maputil.nullInsteadOfEmptyString(v2Procedure.Procedure)
                    }
                ],
                "date": maputil.nullInsteadOfEmptyString(v2Procedure.ProcedureDate),
                "recordedId": maputil.nullInsteadOfEmptyOneElementObject(v2Procedure.ProcedureId, "id")


            }

            v3Procedures.push(procedure);
        }
        v3DataRecord.procedure = v3Procedures;

        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 6
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;