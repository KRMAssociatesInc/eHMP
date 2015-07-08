// demographics

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

        v3DataRecord.address = [{
            "type": maputil.nullInsteadOfEmptyString(v2DataRecord.AddressType),
            "city": maputil.nullInsteadOfEmptyString(v2DataRecord.City),
            "country": maputil.nullInsteadOfEmptyString(v2DataRecord.Country),
            "county": maputil.nullInsteadOfEmptyString(v2DataRecord.County),
            "postalCode": maputil.nullInsteadOfEmptyString(v2DataRecord.PostCode),
            "state": maputil.nullInsteadOfEmptyString(v2DataRecord.State),
            "street": [v2DataRecord.Street]
        }];
        if (v2DataRecord.Street2) {
            v3DataRecord.address.street.push(v2DataRecord.Street2);
        }
        v3DataRecord.phone = [{
            "area": maputil.nullInsteadOfEmptyString(v2DataRecord.AreaCode),
            "country": maputil.nullInsteadOfEmptyString(v2DataRecord.CountryCode),
            "local": maputil.nullInsteadOfEmptyString(v2DataRecord.LocalNumber)
        }];
        v3DataRecord.branch = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.BranchOfService, "display");
        v3DataRecord.birthDate = v2DataRecord.DateOfBirth;
        v3DataRecord.deersEligibility = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.DeersEligibility, "display");
        v3DataRecord.patientId = [{
           "id": v2DataRecord.EdiPn
        }];
        v3DataRecord.email = maputil.nullInsteadOfEmptyString(v2DataRecord.Email);
        v3DataRecord.enrollmentLocation = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.EnrollmentFacility, "name");
        v3DataRecord.name = {};
        v3DataRecord.name.first = v2DataRecord.FirstName;
        v3DataRecord.name.middle = maputil.nullInsteadOfEmptyString(v2DataRecord.MiddleName);
        v3DataRecord.name.last = v2DataRecord.LastName;
        v3DataRecord.name.suffix = maputil.nullInsteadOfEmptyString(v2DataRecord.Suffix);
        v3DataRecord.fmp = maputil.nullInsteadOfEmptyString(v2DataRecord.Fmp);
        v3DataRecord.maritalStatus = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.MaritalStatus, "display");
        v3DataRecord.patientCategory = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.PatientCategory, "display");
        v3DataRecord.race =maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Race, "display");
        v3DataRecord.rank = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Rank, "display");
        v3DataRecord.religion = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.Religion, "display");
        v3DataRecord.sex = v2DataRecord.Sex;
        v3DataRecord.sponsor = {};
        v3DataRecord.sponsor.branch = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.SponsorBranchOfService, "display");
        v3DataRecord.sponsor.rank = maputil.nullInsteadOfEmptyOneElementObjectArray(v2DataRecord.SponsorRank, "display");
        v3DataRecord.sponsor.ssn = maputil.nullInsteadOfEmptyString(v2DataRecord.SponsorSsn);
        v3DataRecord.sponsor.assignedUnit = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.SponsorUic, "name");
        v3DataRecord.assignedUnit = maputil.nullInsteadOfEmptyOneElementObject(v2DataRecord.Uic, "name");


        v3DataList.push({
            "dataRecord": v3DataRecord,
            "dataType": 13
        });

    }

    v3JSON["dataList"] = v3DataList;

    return v3JSON;

};

module.exports.map = map;