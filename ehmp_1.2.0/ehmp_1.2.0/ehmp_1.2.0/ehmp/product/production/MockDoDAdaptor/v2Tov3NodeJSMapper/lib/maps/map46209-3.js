// all orders

var maputil = require('./maputil.js');
var ordersmedMap = require('./map29305-0.js');
var ordersconMap = require('./map11487-6.js');
var orderslabMap = require('./map26436-6.js');
var ordersradMap = require('./map18726-0.js');

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
        var v3DataRecord, dataType;

        if (v2DataRecord.MedicationOrders) {
            v3DataRecord = ordersmedMap.mapMedicationDataRecord(v2DataRecord);
            dataType = 22;
        } else if (v2DataRecord.LabOrders) {
            v3DataRecord = orderslabMap.mapLabDataRecord(v2DataRecord);
            dataType = 21;
        } else if (v2DataRecord.LabOrders) {
            v3DataRecord = ordersconMap.mapConsultDataRecord(v2DataRecord);
            dataType = 20;
        } else if (v2DataRecord.LabOrders) {
            v3DataRecord = ordersradMap.mapRadDataRecord(v2DataRecord);
            dataType = 23;
        }

        if (v3DataRecord) {
            v3DataList.push({
                "dataRecord": v3DataRecord,
                "dataType": dataType
            });
        }
    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;