// meds

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

        v3DataRecord.active = (v2DataRecord.Active === true);
        v3DataRecord.comments = v2DataRecord.Comments;
        v3DataRecord.dispensingPharmacy = {};
        v3DataRecord.dispensingPharmacy.name = v2DataRecord.DispensingPharmacy;
        //v3DataRecord.recordId.id = v2DataRecord.EventId;
        v3DataRecord.recordId.id = v2DataRecord.RxId;
        v3DataRecord.fillCost = v2DataRecord.FillCost === "" ? null : v2DataRecord.FillCost;
        v3DataRecord.fillExpirationDate = v2DataRecord.FillExpirationDate;
        v3DataRecord.issueDate = v2DataRecord.IssueDate;
        v3DataRecord.lastFillDate = v2DataRecord.LastFillledDate;

        if (v2DataRecord.MedicationFillDates instanceof  Array) {
            v3DataRecord.fillInfo = v2DataRecord.MedicationFillDates.map(function (medFillDate) {
                var medFillInfo = {};

                medFillInfo.action = [{
                    "display": medFillDate.Action
                }];
                medFillInfo.dispensingPharmacy = {};
                medFillInfo.dispensingPharmacy.name = medFillDate.DispensingPharmacy;
                medFillInfo.enteredBy = {};
                medFillInfo.enteredBy.name = medFillDate.EnteredBy;
                medFillInfo.location = {};
                medFillInfo.location.name = medFillDate.Facility;
                medFillInfo.fillCost = medFillDate.FillCost === "" ? null : medFillDate.FillCost;
                medFillInfo.fillDate = medFillDate.FillDate;
                medFillInfo.fillNumber = medFillDate.FillNumber;
                medFillInfo.quantity = medFillDate.Quantity;
                medFillInfo.units = [{
                    "display": medFillDate.Units
                }];

                return medFillInfo;
            });
        }

        v3DataRecord.drug = [{
            "display": v2DataRecord.MedicationName,
            "code": v2DataRecord.OtherIdentifier,
            "system": "2.16.840.1.113883.3.42.126.100001.16"
        }];
        v3DataRecord.numberOfFills = Number(v2DataRecord.NumberOfRefills);
        v3DataRecord.provider = {};
        v3DataRecord.provider.name = v2DataRecord.OrderingProvider;
        v3DataRecord.quantity = v2DataRecord.Quantity;
        v3DataRecord.refillsRemaining = Number(v2DataRecord.RefillsRemaining);
        v3DataRecord.rxNumber = {};
        v3DataRecord.rxNumber.id = v2DataRecord.RxNumber;
        v3DataRecord.sig = v2DataRecord.Sig;
        v3DataRecord.status = [{
            "display": v2DataRecord.Status
        }];
        v3DataRecord.daysSupply = Number(v2DataRecord.SupplyDays);
        v3DataRecord.units = [{
            "display": v2DataRecord.Units
        }];

        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 2
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;