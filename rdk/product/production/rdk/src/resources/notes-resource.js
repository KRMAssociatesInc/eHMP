'use strict';

var async = require('async');
var rdk = require('../core/rdk');
var Datastore = require('nedb');

module.exports.getResourceConfig = function() {
    return [{
        name: 'getNotesFromEcrud',
        path: '',
        get: getNotesFromEcrud,
        parameters: {
            get: {
                pid: {
                    required: true,
                    description: 'The pid of the patient'
                }
            }
        },
        apiDocs: {
            spec: {
                summary: 'Returns array of notes associated with the patient pid',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('pid', 'the patient\'s pid', 'string', true),
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns array of notes associated with the patient pid'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: []
        }
    }];
};

function getNotesFromEcrud(req, res) {
    var pid = req.param('pid') || '';

    if (!pid) {
        return res.status(rdk.httpstatus.internal_server_error).rdkSend('Missing parameter: pid');
    }

    // var db = new Datastore({
    //     filename: '/tmp/tmp_unsigned_notes.db'
    // });
    // db.loadDatabase();
    var db = new Datastore();

    if (pid === '10108V420871') {
        async.waterfall([
                function(callback) {
                    db.find({
                        patientIcn: '10108V420871',
                        status: 'UNSIGNED'
                    }, function(err, docs) {
                        if (err) {
                            callback(err);
                        }

                        if (docs.length === 0) {
                            console.log('newPatientEightNotes1' + JSON.stringify(newPatientEightNotes));
                            db.insert(newPatientEightNotes, function(err, newDoc) {
                                console.log('worked ******************');
                                console.log(JSON.stringify(newDoc));
                                callback(null, newDoc);
                            });
                        } else {
                            callback(null, docs);
                        }
                    });
                },
                function(docs, callback) {
                    callback(null, docs);
                }
            ],
            function(err, results) {
                if (err) {
                    return res.status(rdk.httpstatus.internal_server_error).rdkSend();
                }

                return res.rdkSend({
                    notes: results
                });
            });
    } else {
        db.find({
            patientIcn: pid,
            status: 'UNSIGNED'
        }, function(err, docs) {
            console.log('newPatientEightNotes2' + JSON.stringify(docs));
            if (err) {
                return res.status(rdk.httpstatus.internal_server_error).rdkSend();
            }

            return res.rdkSend({
                notes: docs
            });
        });
    }
}

var newPatientEightNotes = [{
    'author': 'USER,PANORAMA',
    'authorDisplayName': 'User,Panorama',
    'authorUid': 'urn:va:user:9E7A:10000000237',
    'documentClass': 'PROGRESS NOTES',
    'documentDefUid': 'urn:va:doc-def:9E7A:1295',
    'documentTypeName': 'Progress Note',
    'encounterName': '7A GEN MED Aug 14, 2014',
    'encounterUid': 'urn:va:visit:9E7A:3:11420',
    'entered': '20150527142231',
    'facilityCode': '998',
    'facilityName': 'ABILENE (CAA)',
    'isInterdisciplinary': 'false',
    'lastUpdateTime': '20150527142231',
    'localId': '11455',
    'localTitle': 'C&P ACROMEGALY',
    'patientIcn': '10108V420871',
    'pid': '9E7A;3',
    'referenceDateTime': '201505271422',
    'stampTime': '20150527142402',
    'status': 'UNSIGNED',
    'statusDisplayName': 'Unsigned',
    'summary': 'C&P ACROMEGALY',
    'text': [
        {
            'author': 'USER,PANORAMA',
            'authorDisplayName': 'User,Panorama',
            'authorUid': 'urn:va:user:9E7A:10000000237',
            'content': 'This is a new C& ACROMEGLY note\r\n',
            'dateTime': '201505271422',
            'status': 'UNSIGNED',
            'uid': 'urn:va:note:9E7A:3:114551',
        }
    ],
    'uid': 'urn:va:document:9E7A:3:114551',
    'facilityDisplay': 'Bay Pines CIO Test',
    'facilityMoniker': 'BAY'
}, {
    'author': 'USER,PANORAMA',
    'authorDisplayName': 'User,Panorama',
    'authorUid': 'urn:va:user:9E7A:10000000237',
    'documentClass': 'PROGRESS NOTES',
    'documentDefUid': 'urn:va:doc-def:9E7A:1653',
    'documentTypeName': 'Progress Note',
    'encounterName': '7A GEN MED Aug 14, 2014',
    'encounterUid': 'urn:va:visit:9E7A:3:11420',
    'entered': '20150527142333',
    'facilityCode': '998',
    'facilityName': 'ABILENE (CAA)',
    'isInterdisciplinary': 'false',
    'lastUpdateTime': '20150527142333',
    'localId': '11456',
    'localTitle': 'NURSING ADMISSION ASSESSMENT ',
    'nationalTitle': {
        'name': 'NURSING ADMISSION EVALUATION NOTE',
        'vuid': 'urn:va:vuid:4696648'
    },
    'patientIcn': '10108V420871',
    'pid': '9E7A;3',
    'referenceDateTime': '201505271423',
    'stampTime': '20150527142302',
    'status': 'UNSIGNED',
    'statusDisplayName': 'Unsigned',
    'summary': 'NURSING ADMISSION ASSESSMENT ',
    'text': [
        {
            'author': 'USER,PANORAMA',
            'authorDisplayName': 'User,Panorama',
            'authorUid': 'urn:va:user:9E7A:10000000237',
            'content': 'This is a new nursing admission assessment note\r\n',
            'dateTime': '201505271423',
            'status': 'UNSIGNED',
            'uid': 'urn:va:note:9E7A:3:114562',
        }
    ],
    'uid': 'urn:va:document:9E7A:3:114562',
    'facilityDisplay': 'Bay Pines CIO Test',
    'facilityMoniker': 'BAY'
}, {
    'author': 'USER,PANORAMA',
    'authorDisplayName': 'User,Panorama',
    'authorUid': 'urn:va:user:9E7A:10000000237',
    'documentClass': 'PROGRESS NOTES',
    'documentDefUid': 'urn:va:doc-def:9E7A:40',
    'documentTypeName': 'Progress Note',
    'encounterName': '7A GEN MED Aug 14, 2014',
    'encounterUid': 'urn:va:visit:9E7A:3:11420',
    'entered': '20150527142402',
    'facilityCode': '998',
    'facilityName': 'ABILENE (CAA)',
    'isInterdisciplinary': 'false',
    'lastUpdateTime': '20150527142402',
    'localId': '11457',
    'localTitle': 'ASI-ADDICTION SEVERITY INDEX',
    'patientIcn': '10108V420871',
    'pid': '9E7A;3',
    'referenceDateTime': '201505271424',
    'stampTime': '20150527142402',
    'status': 'UNSIGNED',
    'statusDisplayName': 'Unsigned',
    'summary': 'ASI-ADDICTION SEVERITY INDEX',
    'text': [
        {
            'author': 'USER,PANORAMA',
            'authorDisplayName': 'User,Panorama',
            'authorUid': 'urn:va:user:9E7A:10000000237',
            'content': 'This is a new ASI note for testing\r\n',
            'dateTime': '201505271424',
            'status': 'UNSIGNED',
            'uid': 'urn:va:note:9E7A:3:114573',
        }
    ],
    'uid': 'urn:va:document:9E7A:3:114573',
    'facilityDisplay': 'Bay Pines CIO Test',
    'facilityMoniker': 'BAY'
}];
