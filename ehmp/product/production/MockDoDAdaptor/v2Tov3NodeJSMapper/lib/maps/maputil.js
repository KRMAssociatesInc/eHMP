var baseTransfom = function (v2DataRecord) {
    var v3DataRecord = {};

    v3DataRecord.repository = {};
    v3DataRecord.repository.name = v2DataRecord.CustodianName;
    v3DataRecord.repository.id = [{
        "assigningAuthority": v2DataRecord.RepositoryId
    }];
    v3DataRecord.recordId = {};
    v3DataRecord.recordId.id = v2DataRecord.EventId;
    v3DataRecord.enteredBy = nullInsteadOfEmptyOneElementObject(v2DataRecord.EnteredBy, "name")
    v3DataRecord.enteredDate = nullInsteadOfEmptyString(v2DataRecord.EnteredByDate);
    v3DataRecord.dataDomain = [{
        "system": "2.16.840.1.113883.6.1",
        "primary": true,
        "display": null,
        "code": v2DataRecord.LoincCode
    }];
    //v3DataRecord.facility = {};
    //v3DataRecord.facility.name = v2DataRecord.Facility;
    v3DataRecord.facility = nullInsteadOfEmptyOneElementObject(v2DataRecord.Facility, "name");

    return v3DataRecord;
};

// if the string is an empty string returns a null, otherwise just return the string
var nullInsteadOfEmptyString = function(theString) {
    if (!theString) {
        return null;
    }
    return theString;
}

// if the string is an empty string returns a null, otherwise return an object that has the
// string as a value with the given key
// for example
//   nullInsteadOfEmptyOneElementObject("yes", "notEmpty") = {"notEmpty": "yes"}
//   nullInsteadOfEmptyOneElementObject("", "notEmpty") = null
var nullInsteadOfEmptyOneElementObject = function(theString, key) {
    if (!theString) {
        return null;
    }
    var returnObject = {};
    returnObject[key] = theString;
    return returnObject;
}

// if the string is an empty string returns a null, otherwise return an object that has the
// string as a value with the given key
// for example
//   nullInsteadOfEmptyOneElementObject("yes", "notEmpty") = {"notEmpty": "yes"}
//   nullInsteadOfEmptyOneElementObject("", "notEmpty") = null
var nullInsteadOfEmptyOneElementObjectArray = function(theString, key) {
    if (!theString) {
        return null;
    }
    var returnObject = {};
    returnObject[key] = theString;
    return [returnObject];
}


module.exports.baseTransform = baseTransfom;
module.exports.nullInsteadOfEmptyString = nullInsteadOfEmptyString;
module.exports.nullInsteadOfEmptyOneElementObject = nullInsteadOfEmptyOneElementObject;
module.exports.nullInsteadOfEmptyOneElementObjectArray = nullInsteadOfEmptyOneElementObjectArray;