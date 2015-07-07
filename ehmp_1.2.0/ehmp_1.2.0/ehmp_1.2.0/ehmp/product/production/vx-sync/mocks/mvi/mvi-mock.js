'use strict';

var _ = require('underscore');
var format = require('util').format;

var patients = [{
    name: 'Fake Patient, Another',
    ids: [{
        type: 'pid',
        value: '9E7A;42'
    }, {
        type: 'icn',
        value: '10101V420870'
    }]
}, {
    name: 'Patient, Fake',
    ids: [{
        type: 'pid',
        value: 'ABCD;0'
    }, {
        type: 'icn',
        value: '10101V11111'
    }, {
        type: 'edipi',
        value: '10101'
    }]
}, {
    name: 'Four,Patient',
    ids: [{
        type: 'icn',
        value: '10104V248233'
    }, {
        type: 'edipi',
        value: '10104'
    }, {
        type: 'pid',
        value: '9E7A;229'
    }, {
        type: 'pid',
        value: 'C877;229'
    }]
}, {
    name: 'Five,Patient',
    ids: [{
        type: 'icn',
        value: '10105V001065'
    }, {
        type: 'edipi',
        value: '10105'
    }, {
        type: 'pid',
        value: 'C877;231'
    }, {
        type: 'pid',
        value: '9E7A;231'
    }]
}, {
    name: 'Six,Patient',
    ids: [{
        type: 'icn',
        value: '10106V187557'
    }, {
        type: 'edipi',
        value: '10106'
    }, {
        type: 'pid',
        value: 'C877;418'
    }, {
        type: 'pid',
        value: '9E7A;418'
    }]
}, {
    name: 'Seven,Patient',
    ids: [{
        type: 'icn',
        value: '10107V395912'
    }, {
        type: 'edipi',
        value: '10107'
    }, {
        type: 'pid',
        value: '9E7A;253'
    }]
}, {
    name: 'Eight,Patient',
    ids: [{
        type: 'icn',
        value: '10108V420871'
    }, {
        type: 'edipi',
        value: '0000000003'
    }, {
        type: 'pid',
        value: '9E7A;3'
    }]
}, {
    name: 'Ten,Patient',
    ids: [{
        type: 'icn',
        value: '10110V004877'
    }, {
        type: 'edipi',
        value: '10110'
    }, {
        type: 'pid',
        value: 'C877;8'
    }, {
        type: 'pid',
        value: '9E7A;8'
    }]
}, {
    name: 'Seventeen,Patient',
    ids: [{
        type: 'icn',
        value: '10117V810068'
    }, {
        type: 'edipi',
        value: '10117'
    }, {
        type: 'pid',
        value: '9E7A;428'
    }]
}, {
    name: 'Eighteen,Patient',
    ids: [{
        type: 'icn',
        value: '10118V572553'
    }, {
        type: 'edipi',
        value: '10118'
    }, {
        type: 'pid',
        value: '9E7A;149'
    }]
}, {
    name: 'Fortsix,Patient',
    ids: [{
        type: 'icn',
        value: '10146V393772'
    }, {
        type: 'edipi',
        value: '10146'
    }, {
        type: 'pid',
        value: 'C877;301'
    }, {
        type: 'pid',
        value: '9E7A;301'
    }]
}, {
    name: 'Eightyt,Patient',
    ids: [{
        type: 'icn',
        value: '10180V273016'
    }, {
        type: 'edipi',
        value: '10180'
    }, {
        type: 'pid',
        value: '9E7A;433'
    }]
}, {
    name: 'Eightyone,Patient',
    ids: [{
        type: 'icn',
        value: '10181V049578'
    }, {
        type: 'edipi',
        value: '10181'
    }, {
        type: 'pid',
        value: '9E7A;775'
    }, {
        type: 'pid',
        value: 'C877;775'
    }]
}, {
    name: 'Ninetynine,Patient',
    ids: [{
        type: 'icn',
        value: '10199V865898'
    }, {
        type: 'edipi',
        value: '10199'
    }, {
        type: 'pid',
        value: '9E7A;100012'
    }]
}, {
    name: 'Onehundredsixteen,Patient',
    ids: [{
        type: 'icn',
        value: '11016V630869'
    }, {
        type: 'edipi',
        value: '11016'
    }, {
        type: 'pid',
        value: '9E7A;227'
    }, {
        type: 'pid',
        value: 'C877;227'
    }]
}, {
    name: 'Onehunderdtwentysix,Patient',
    ids: [{
        type: 'icn',
        value: '5000000009V082878'
    }, {
        type: 'edipi',
        value: '5000000009'
    }, {
        type: 'pid',
        value: 'C877;100125'
    }, {
        type: 'pid',
        value: '9E7A;100125'
    }]
}, {
    name: 'Eight,Outpatient',
    ids: [{
        type: 'icn',
        value: '5000000116V912836'
    }, {
        type: 'edipi',
        value: '5000000116'
    }, {
        type: 'pid',
        value: '9E7A;100615'
    }, {
        type: 'pid',
        value: 'C877;100615'
    }]
}, {
    name: 'Eight,Inpatient',
    ids: [{
        type: 'icn',
        value: '5000000217V519385'
    }, {
        type: 'edipi',
        value: '5000000217'
    }, {
        type: 'pid',
        value: 'C877;100716'
    }, {
        type: 'pid',
        value: '9E7A;100716'
    }]
}, {
    name: 'Nine,Imagepatient',
    ids: [{
        type: 'icn',
        value: '5000000318V495398'
    }, {
        type: 'edipi',
        value: '5000000318'
    }, {
        type: 'pid',
        value: '9E7A;100817'
    }, {
        type: 'pid',
        value: 'C877;100817'
    }]
}, {
    name: 'Zzzretfivefiftyone,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;1'
    }]
}, {
    name: 'Bcma,Eight',
    ids: [{
        type: 'pid',
        value: '9E7A;100022'
    }]
}, {
    name: 'Bcma,Eighteen-Patient',
    ids: [{
        type: 'pid',
        value: '9E7A,100033'
    }]
}, {
    name: 'Zzzretfourtwentyfive,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;11'
    }]
}, {
    name: 'Zzzretiredseventyseven,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;129'
    }]
}, {
    name: 'Zzzretsixseventysix,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;13'
    }]
}, {
    name: 'Zzzretiredonenineteen,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;164'
    }]
}, {
    name: 'Zzzretiredonefive,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;167'
    }]
}, {
    name: 'Zzzretfourfortyseven,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;17'
    }]
}, {
    name: 'Zzzretfoursixtyfive,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;21'
    }]
}, {
    name: 'Zzzretfivefifty,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;35'
    }]
}, {
    name: 'Zzzretiredzero,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;4'
    }]
}, {
    name: 'Zzzretsixseventyfive,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;50'
    }]
}, {
    name: 'Zzzretiredfiftythree,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;6'
    }]
}, {
    name: 'Zzzretiredfortyeight,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;71'
    }]
}, {
    name: 'Zzzretiredninetyfour,Patient',
    ids: [{
        type: 'pid',
        value: '9E7A;737'
    }]
}, {
    name: 'Bcma,Eight',
    ids: [{
        type: 'pid',
        value: 'C877;100022'
    }]
}, ];

// selectObject: [ type, value ]
// force and error by passing a selectObject with type = 'error'
function lookup(selectObject, callback) {
    setTimeout(fetchPatient, 100, selectObject, callback);
}

function fetchPatient(selectObject, callback) {
    if (!selectObject) {
        return callback('No value passed for "selectObject"');
    }

    if (!_.has(selectObject, 'type') || !_.has(selectObject, 'value')) {
        return callback('"selectObject" must have "type" and "value" properties');
    }

    if (selectObject.type === 'error') {
        return callback('Forced Error');
    }

    if(!_.contains(['icn', 'pid', 'edipi'], selectObject.type)) {
        return callback(format('"selectObject.type" contained an invalid value: %s', selectObject.type));
    }

    var patient = _.find(patients, function(patient) {
        return _.some(patient.ids, function(id) {
            return id.type === selectObject.type && id.value === selectObject.value;
        });
    });

    callback(null, patient || {});
}

module.exports = lookup;
lookup.patients = patients;
