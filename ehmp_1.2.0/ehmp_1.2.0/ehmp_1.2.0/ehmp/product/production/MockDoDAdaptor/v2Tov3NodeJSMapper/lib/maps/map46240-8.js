// encounters

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


        v3DataRecord.date = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentDate);
        v3DataRecord.type = maputil.nullInsteadOfEmptyString(v2DataRecord.AppointmentType);
        v3DataRecord.location = {
            "name": v2DataRecord.Clinic
        };
        var v3Diagnoses = [];
        for (var diagnosisNum = 0; diagnosisNum < v2DataRecord.Diagnosis.length; diagnosisNum++) {
            var v2Diagnosis = v2DataRecord.Diagnosis[diagnosisNum];
            var diagnosis = {
                "enteredBy": maputil.nullInsteadOfEmptyOneElementObject(v2Diagnosis.EnteredBy, "name"),
                "enteredDate": maputil.nullInsteadOfEmptyString(v2Diagnosis.EnteredByDate),
                "location": maputil.nullInsteadOfEmptyOneElementObject(v2Diagnosis.Facility, "name"),
                "status": maputil.nullInsteadOfEmptyOneElementObjectArray(v2Diagnosis.Status, "display"),
                "diagnosis": [
                    {
                        "code": maputil.nullInsteadOfEmptyString(v2Diagnosis.Code),
                        "display": maputil.nullInsteadOfEmptyString(v2Diagnosis.Diagnosis)
                    }
                ]
            }

            v3Diagnoses.push(diagnosis);
        }
        v3DataRecord.diagnoses = v3Diagnoses;
        var v3Procedures = [];
        for (var procedureNum = 0; procedureNum < v2DataRecord.Procedures.length; procedureNum++) {
            var v2Procedure = v2DataRecord.Procedures[procedureNum];
            var procedure = {
                "enteredBy": maputil.nullInsteadOfEmptyOneElementObject(v2Procedure.EnteredBy, "name"),
                "enteredDate": maputil.nullInsteadOfEmptyString(v2Procedure.EnteredByDate),
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
        v3DataRecord.emCode = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.EvalManagementCode, "code");
        v3DataRecord.encounterNumber = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.EncounterNumber, "id");
        v3DataRecord.provider = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.Provider, "name");
        v3DataRecord.status = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Status, "display");
        v3DataRecord.reason = maputil.nullInsteadOfEmptyString(v2DataRecord.VisitReason);



        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 5
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;