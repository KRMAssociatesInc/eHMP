'use strict';
var jdsInput = {
    "apiVersion": "1.0",
    "data": {
        "updated": 20150617113333,
        "totalItems": 99,
        "currentItemCount": 2,
        "items": [
            {
                "encounterName": "0Apr 17, 2000",
                "encounterUid": "urn:va:visit:9E7A:237:2056",
                "entered": 20000417,
                "facilityCode": 500,
                "facilityName": "CAMP MASTER",
                "lastUpdateTime": 20000417000000,
                "localId": 42,
                "name": "SMOKING CESSATION",
                "pid": "9E7A;237",
                "stampTime": 20000417000000,
                "uid": "urn:va:education:9E7A:237:42"
            },
            {
                "encounterName": "0Apr 17, 2000",
                "encounterUid": "urn:va:visit:C877:237:2056",
                "entered": 20000417,
                "facilityCode": 500,
                "facilityName": "CAMP BEE",
                "lastUpdateTime": 20000417000000,
                "localId": 42,
                "name": "SMOKING CESSATION",
                "pid": "C877;237",
                "stampTime": 20000417000000,
                "uid": "urn:va:education:C877:237:42"
            }
            ]
    }
};

module.exports.data = {
    jdsData: jdsInput
};
