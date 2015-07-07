/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var filemanDateUtil = require('../../utils/filemanDateUtil');
var _ = require('underscore');
var nullChecker = require('../../utils/nullchecker/nullchecker');
var paramUtil = require('../../utils/paramUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;

var GMRATYPE_DRUG = 'D^Drug'; //Automatically populated D=Drug if drug name is submitted,
var GMRATYPE_OTHER = 'O^OTHER'; //otherwise, O=Other type of allergy not necessarily a drug reaction
var GMRANATR_PHARMACOLGICAL = 'P^Pharmacological';
var OBSERVED = 'o^OBSERVED';

var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';


var params = {
    post: {
        localId: {
            required: true,
            description: 'the patient IEN (also known as dfn)',
        },
        allergyName: {
            required: true,
            description: 'the name of the allergy with IEN and VistA file name in the format of NAME^IEN;FILE_REFERENCE, for example INDERAL^198;PSNDF(50.67,'
        },
        natureOfReaction: {
            required: true,
            description: 'the nature of reaction; possible values are A^Allergy, P^Pharmacological, or U^Unknown'
        },
        historicalOrObserved: {
            required: true,
            description: 'whether the allergy is historical or observed; possible values are o^OBSERVED or h^HISTORICAL'
        },
        cmtText: {
            required: false,
            description: 'the comment text'
        },
        symptoms: {
            required: false,
            description: 'an array of symptom objects',
            symptom: {
                dateTime: {
                    required: false,
                    description: 'the date and time of when the symptom was observed',
                },
                name: {
                    required: true,
                    description: 'the name of the symptom'
                },
                IEN: {
                    required: true,
                    description: 'the IEN of the symptom'
                }
            }
        },
        eventDateTime: {
            required: false,
            description: 'the event date and time'
        },
        observedDate: {
            required: false,
            description: 'the observed date and time; only required if the allergy is observed'
        },
        severity: {
            required: false,
            description: 'the severity of the allergy; only required if the allergy is observed; possible values are 1, 2, or 3 where 1=Mild, 2=Moderate, 3=Severe'
        }
    }
};

var apiDocs = {
    spec: {
    },
    models: {
        Allergy: {
            id: 'Allergy',
            required: ['param'],
            properties: {
                param: {
                    $ref: 'AllergyParam'
                },
                name: {
                    type: 'string'
                },
                location: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                fileNumber: {
                    type: 'string'
                },
                severity: {
                    type: 'string'
                },
                symptomSearchInput: {
                    type: 'string'
                }
            }
        },
        AllergyParam: {
            id: 'AllergyParam',
            required: ['localId', 'allergyName', 'natureOfReaction', 'historicalOrObserved'],
            properties: {
                localId: {
                    type: 'string',
                    description: 'the patient IEN (also known as dfn)'
                },
                allergyName: {
                    type: 'string',
                    description: 'the name of the allergy with IEN and VistA file name in the format of NAME^IEN;FILE_REFERENCE, for example INDERAL^198;PSNDF(50.67,'
                    //pattern: '[A-Z]+\\^[0-9]+;[A-Z]+\\([0-9]+.[0-9]+,'  // todo: provide correct pattern
                },
                natureOfReaction: {
                    type: 'string',
                    description: 'the nature of reaction'
                },
                historicalOrObserved: {
                    type: 'string',
                    description: 'whether the allergy is historical or observed',
                    enum: ['o^OBSERVED', 'h^HISTORICAL']
                },
                cmtText: {
                    type: 'string',
                    description: 'the comment text'
                },
                symptoms: {  //"symptoms": [{"IEN": "206", "name": "COUGH", "count": 0, "dateTime": ""}],
                    type: 'array',
                    description: 'an array of Symptom objects',
                    items: {
                        $ref: 'Symptom'
                    }
                },
                severity: {
                    type: 'string',
                    description: 'the severity of the allergy; only required if the allergy is observed; 1=Mild, 2=Moderate, 3=Severe',
                    enum: ['1', '2', '3']
                },
                eventDateTime: {
                    type: 'string',
                    description: 'the event date and time'
                },
                observedDate: {
                    type: 'string',
                    description: 'the observed date and time; only required if the allergy is observed'
                }
            }
        },
        Symptom: {
            id: 'Symptom',
            required: ['name', 'IEN'],
            properties: {
                name: {
                    type: 'string',
                    description: 'the name of the symptom'
                },
                IEN: {
                    type: 'string',
                    description: 'the IEN of the symptom'
                },
                count: {
                    type: 'integer'
                },
                dateTime: {
                    type: 'string',
                    description: 'the date and time of when the symptom was observed'
                }
            }
        }
    }
};
//{
//    "param": {
//        "localId": "3",
//        "allergyName": "CREATINE^4075;PSNDF(50.6,",
//        "natureOfReaction": "ALLERGY",
//        "cmtText": "",
//        "symptoms": [{"IEN": "206", "name": "COUGH", "count": 0, "dateTime": ""}],
//        "severity": "3",
//        "eventDateTime": "20150109084400",
//        "historicalOrObserved": "o^OBSERVED",
//        "observedDate": "20150109"
//    },
//    "name": "CREATINE", "IEN": "4075",
//        "location": "PSNDF(50.6,\"B\")",
//        "type": "D",
//        "fileNumber": "3",
//        "severity": "3",
//        "symptomSearchInput": "cough"
//    }
//}

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        post: performWriteBack,
        parameters: params,
        apiDocs: apiDocs,
        description: {
            post: 'Adds an allergy to a patient'
        },
        interceptors: {
            validateAgainstApiDocs: true,
            synchronize: true
        },
        healthcheck: {
            dependencies: ['jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: ['add-patient-allergy']
    }];
}

function performWriteBack(req, res) {
    req.logger.info('perform write back for Allergies resource POST called');
    var inputAllergyParam,
        userSession,
        originatorIEN,
        site;

    try {
        userSession = req.session.user;
        site = userSession.site;
        originatorIEN = userSession.duz[site];
    } catch (e) {
        res.send(rdk.httpstatus.internal_server_error, 'Required authentication data is not present in request.');
        return;
    }

    inputAllergyParam = req.body.param;

    var allergy = {
        'newAllergyIndicator': 0, //indicates whether or not the allergy record is new or and edit
        'dfn': inputAllergyParam.localId, //the patient ID as it is VistA, maps to localId
        'allergyArray': {
            '"GMRAGNT"': inputAllergyParam.allergyName,
            '"GMRATYPE"': '',
            '"GMRANATR"': inputAllergyParam.natureOfReaction,
            '"GMRAORIG"': originatorIEN,
            '"GMRAORDT"': null,
            '"GMRAOBHX"': inputAllergyParam.historicalOrObserved
        }
    };

    //Set GMRACMTS
    if (inputAllergyParam.cmtText !== '') {
        allergy.allergyArray['"GMRACMTS",0'] = '1';
        allergy.allergyArray['"GMRACMTS",1'] = inputAllergyParam.cmtText;
    }

    //Set GMRATYPE
    if (allergy.allergyArray['"GMRANATR"'] === GMRANATR_PHARMACOLGICAL) {
        allergy.allergyArray['"GMRATYPE"'] = GMRATYPE_DRUG;
    } else {
        allergy.allergyArray['"GMRATYPE"'] = GMRATYPE_OTHER;
    }

    //Set GMRAORDT
    var currentTime = new Date();
    allergy.allergyArray['"GMRAORDT"'] = filemanDateUtil.getFilemanDateTime(currentTime);

    //Set GMRASYMP
    allergy.allergyArray['"GMRASYMP",0'] = (inputAllergyParam.symptoms.length).toString();

    _.each(inputAllergyParam.symptoms, function(symptom, index) {
        var fileManDT = '';
        var displayDate = '';
        if (!nullChecker.isNullish(symptom.dateTime)) {
            var sympDT = paramUtil.convertWriteBackInputDate(symptom.dateTime);
            fileManDT = filemanDateUtil.getFilemanDateTime(sympDT.toDate());
            displayDate = sympDT.format('MMM DD,YYYY@HH:mm');
        }
        allergy.allergyArray['"GMRASYMP",' + (index + 1)] = symptom.IEN + '^' + symptom.name + '^' + fileManDT + '^' + displayDate + '^';
    });

    //Set GMRACHT
    var eventDateTimeMoment = paramUtil.convertWriteBackInputDate(inputAllergyParam.eventDateTime);
    var eventFilemanYear = filemanDateUtil.getFilemanDateWithArgAsStr(eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));

    if (eventFilemanYear !== -1) {
        allergy.allergyArray['"GMRACHT",0'] = (1).toString();
        allergy.allergyArray['"GMRACHT",1'] = eventFilemanYear + '.' + eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_TIME_FORMAT);
    } else {
        var errorMessage1 = 'EventDateTime (a.k.a. GMRACHT) is not a valid date: ' + inputAllergyParam.eventDateTime;
        req.logger.error(errorMessage1);
        res.send(rdk.httpstatus.internal_server_error, errorMessage1);
        return;
    }

    if (inputAllergyParam.historicalOrObserved === OBSERVED &&
        (typeof inputAllergyParam.observedDate === 'undefined' || typeof inputAllergyParam.severity === 'undefined')) {
        var observedAllergyMissingParamError = 'The observed allergy is missing the observed date or severity: ' + inputAllergyParam.observedDate + ' ' + inputAllergyParam.severity;
        req.logger.error(observedAllergyMissingParamError);
        res.send(rdk.httpstatus.internal_server_error, observedAllergyMissingParamError);
        return;
    } else if (inputAllergyParam.historicalOrObserved === OBSERVED) {
        if (typeof inputAllergyParam.observedDate !== 'undefined') {
            var observedDateTimeMoment = paramUtil.convertWriteBackInputDate(inputAllergyParam.observedDate);
            var observedTime = observedDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_TIME_FORMAT);
            if (observedTime.length > 0) {
                observedTime = '.' + observedTime;
            }
            var observedDate = filemanDateUtil.getFilemanDateWithArgAsStr(observedDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));

            if (observedDate !== -1) {
                allergy.allergyArray['"GMRARDT"'] = observedDate + observedTime;
            } else {
                var errorMessage2 = 'ObservedDate (a.k.a. GMRARDT) is not a valid date: ' + inputAllergyParam.observedDate;
                req.logger.error(errorMessage2);
                res.send(rdk.httpstatus.internal_server_error, errorMessage2);
                return;
            }
        }

        if (typeof inputAllergyParam.severity !== 'undefined') {
            allergy.allergyArray['"GMRASEVR"'] = inputAllergyParam.severity;
        }
    }
    req.logger.debug('Allergy writeback input and computed allergy');
    req.logger.debug(inputAllergyParam);
    req.logger.debug(allergy);
    var rpcConfig = getVistaRpcConfiguration(req.app.config, site);
    rpcConfig.accessCode = userSession.accessCode;
    rpcConfig.verifyCode = userSession.verifyCode;
    VistaJS.callRpc(req.logger, rpcConfig, 'ORWDAL32 SAVE ALLERGY', [allergy.newAllergyIndicator, allergy.dfn, allergy.allergyArray], function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            var returnMessage = result.split('^');

            if (returnMessage[0] === '0') {
                req.logger.info('Successfully wrote back to VistA.');
                res.send(JSON.stringify({
                    'data': {
                        'items': [{
                            'message': 'success'
                        }]
                    }
                }));
            } else {
                req.logger.error(errorVistaJSCallback + result);
                res.send(rdk.httpstatus.internal_server_error, (returnMessage && typeof returnMessage[1] !== undefined) ? returnMessage[1] : errorMessage);
            }
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.performWriteBack = performWriteBack;
