'use strict';
//------------------------------------------------------------------------------------
// This contains a set of unit tests for record-enrichment-med-xformer.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../../env-setup');

var _ = require('underscore');

var xformer = require(global.VX_HANDLERS + 'record-enrichment-request/record-enrichment-med-xformer');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-med-xformer-spec',
//     level: 'debug'
// });

var originalVaMedRecord = {
    'dosages': [{
        'amount': 1,
        'dose': 40,
        'instructions': '40MG',
        'noun': 'TABLET',
        'relativeStart': 0,
        'relativeStop': 527040,
        'routeName': 'PO',
        'scheduleFreq': 1440,
        'scheduleName': 'QPM',
        'scheduleType': 'CONTINUOUS',
        'start': 20020305,
        'stop': 20030306,
        'units': 'MG',
        'ivRate': 100, // Added in for testing purposes.
        'routeCode': 102, // Added in for testing purposes.
        'timingExpression': 103, // Added in for testing purposes.
        'restriction': 104, // Added in for testing purposes.
        'relatedOrder': 105, // Added in for testing purposes.
        'complexDuration': 106, // Added in for testing purposes.
        'duration': 101 // Added in for testing purposes.
    }],
    'facilityCode': 500,
    'facilityName': 'CAMP MASTER',
    'fills': [{
        'daysSupplyDispensed': 90,
        'dispenseDate': 20020305,
        'quantityDispensed': 90,
        'releaseDate': 20020305,
        'routing': 'W'
    }],
    'lastFilled': 20020305,
    'lastUpdateTime': 20030306000000,
    'localId': '402189;O',
    'medStatus': 'urn:sct:392521001',
    'medStatusName': 'historical',
    'medType': 'urn:sct:73639000',
    'name': 'SIMVASTATIN TAB',
    'orders': [{
        'daysSupply': 90,
        'fillCost': 72,
        'fillsAllowed': 3,
        'fillsRemaining': 3,
        'orderUid': 'urn:va:order:9E7A:3:12727',
        'ordered': 200203051344,
        'pharmacistName': 'TDPHARMACIST,ONE',
        'pharmacistUid': 'urn:va:user:9E7A:10000000019',
        'prescriptionId': 800013,
        'providerName': 'VEHU,ONE',
        'providerUid': 'urn:va:user:9E7A:20001',
        'quantityOrdered': 90,
        'vaRouting': 'W',
        'expiration': 106 // Added in for testing purposes.
    }],
    'overallStart': 20020305,
    'overallStop': 20030306,
    'patientInstruction': '',
    'pid': '9E7A;3',
    'productFormName': 'TAB',
    'products': [{
        'drugClassCode': 'urn:vadc:CV350',
        'drugClassName': 'ANTILIPEMIC AGENTS',
        'ingredientCode': 'urn:va:vuid:4020400',
        'ingredientCodeName': 'SIMVASTATIN',
        'ingredientName': 'SIMVASTATIN TAB',
        'ingredientRole': 'urn:sct:410942007',
        'strength': '40 MG',
        'suppliedCode': 'urn:va:vuid:4010153',
        'suppliedName': 'SIMVASTATIN 40MG TAB',
        'volume': 106, // Added in for testing purposes.
        'ivBag': 107, // Added in for testing purposes.
        'relatedOrder': 108 // Added in for testing purposes.
    }],
    'administrations': [{
        'dateTime': 20030305101112,
        'status': 'GIVEN'
    }],
    'indications': [{
        'narrative': 'SomeNarrativeGoesHere',
        'code': 123
    }],
    'qualifiedName': 'SIMVASTATIN TAB',
    'sig': 'TAKE ONE TABLET BY BY MOUTH EVERY EVENING',
    'stampTime': 20030306000000,
    'stopped': 20030306,
    'type': 'Prescription',
    'uid': 'urn:va:med:9E7A:3:12727',
    'vaStatus': 'EXPIRED',
    'vaType': 'O'
};
var originalVaMedJob = {
    record: originalVaMedRecord
};

var originalDodMedRecord = {
    'codes': [{
        'code': '3000257828',
        'display': '',
        'system': 'DOD_NCID'
    }
    // , {
    //     'code': '905225',
    //     'display': 'Hydralazine Hydrochloride 25 MG Oral Tablet',
    //     'system': 'urn:oid:2.16.840.1.113883.6.88'
    // }
    ],
    'facilityCode': 'DOD',
    'facilityName': 'DOD',
    'fills': [{
        'dispenseDate': '20131025124400',
        'dispensingPharmacy': 'MAIN PHARMACY',
        'quantityDispensed': '1'
    }],
    'medStatus': 'Active',
    'medType': 'O',
    'name': 'HYDRALAZINE HCL, 25 MG, TABLET, ORAL',
    'orders': [{
        'daysSupply': '30',
        'fillsRemaining': '0',
        'providerName': 'AHLTADTE, ATTEND B',
        'quantityOrdered': '1'
    }],
    'overallStart': '20131025020100',
    'overallStop': '20131124134400',
    'patientInstruction': '\nNONE',
    'pid': 'DOD;0000000003',
    'productFormCode': '2165347221',
    'productFormName': 'HYDRALAZINE HCL, 25 MG, TABLET, ORAL',
    'products': [{
        'suppliedName': 'HYDRALAZINE HCL, 25 MG, TABLET, ORAL'
    }],
    'sig': '',
    'stampTime': '20150305091425',
    'uid': 'urn:va:med:DOD:0000000003:1000000474',
    'vaStatus': 'Active',
    'vaType': 'O'
};
var originalDodMedJob = {
    record: originalDodMedRecord
};

var removedRecord = {
    'pid': 'DOD;0000000003',
    'stampTime': '20150226124943',
    'removed': true,
    'uid': 'urn:va:med:DOD:0000000003:1000010340'
};

var removedJob = {
    record: removedRecord
};

var config = {};

var CODE_SYSTEMS = {
    CODE_SYSTEM_RXNORM: 'urn:oid:2.16.840.1.113883.6.88',
    SYSTEM_DOD_NCID: 'DOD_NCID'
};

var jlvMappedCodeValue = {
    code: 'SomeCode',
    codeSystem: CODE_SYSTEMS.CODE_SYSTEM_RXNORM,
    displayText: 'SomeText'
};
var jdsCodedValue = {
    code: jlvMappedCodeValue.code,
    system: jlvMappedCodeValue.codeSystem,
    display: jlvMappedCodeValue.displayText
};
var vaDrugConcepts = [{
    'urn': 'urn:vandf:4010153',
    'parents': [],
    'codeSystem': 'VANDF',
    'rels': {
        'urn:vandf:4020400': [
            'RO|ingredient_of'
        ],
        'urn:rxnorm:198211': [
            'SY|'
        ],
        'urn:vandf:4021569': [
            'RB|inverse_isa'
        ],
        'urn:vandf:4010153': [
            'SY|print_name_of',
            'SY|has_print_name'
        ]
    },
    'description': 'SIMVASTATIN 40MG TAB',
    'terms': [{
        'tty': 'CD',
        'cui': 'C0690321',
        'rank': '135',
        'str': 'SIMVASTATIN 40MG TAB',
        'aui': 'A8449645',
        'lat': 'ENG'
    }, {
        'tty': 'AB',
        'cui': 'C0690321',
        'rank': '133',
        'str': 'SIMVASTATIN 40MG TAB',
        'aui': 'A15503285',
        'lat': 'ENG'
    }],
    'sameas': [
        'urn:ndfrt:N0000165803',
        'urn:ndfrt:N0000164280',
        'urn:rxnorm:198211',
        'urn:sct:320000009',
        'urn:sct:376638003',
        'urn:vandf:4016607'
    ],
    'ancestors': [],
    'cui': 'C0690321',
    'attributes': {
        'NDC': [
            '024658030390',
            '000093715556'
        ],
        'DCSA': 'UNSCHEDULED',
        'NFI': 'YES',
        'VMO': 'S0022',
        'DDF': 'TAB',
        'NF_NAME': 'SIMVASTATIN TAB',
        'SNGL_OR_MULT_SRC_PRD': 'Multisource',
        'VAC': 'CV350',
        'VA_DISPENSE_UNIT': 'TAB',
        'VA_GENERIC_NAME': 'SIMVASTATIN',
        'VA_CLASS_NAME': '[CV350] ANTILIPEMIC AGENTS',
        'NDF_TRANSMIT_TO_CMOP': 'YES'
    },
    'code': '4010153',
    'aui': 'A8449645'
}, {
    'urn': 'urn:rxnorm:198211',
    'parents': [],
    'codeSystem': 'RXNORM',
    'rels': {
        'urn:ndfrt:N0000165803': [
            'SY|'
        ],
        'urn:rxnorm:152923': [
            'RN|tradename_of'
        ],
        'urn:rxnorm:1158754': [
            'RB|inverse_isa'
        ],
        'urn:rxnorm:1158753': [
            'RB|inverse_isa'
        ],
        'urn:ndfrt:N0000164280': [
            'SY|'
        ],
        'urn:sct:320000009': [
            'SY|'
        ],
        'urn:rxnorm:316674': [
            'RO|constitutes'
        ],
        'urn:vandf:4016607': [
            'SY|'
        ],
        'urn:rxnorm:317541': [
            'RO|dose_form_of'
        ],
        'urn:rxnorm:373888': [
            'RB|inverse_isa'
        ],
        'urn:vandf:4010153': [
            'SY|'
        ]
    },
    'description': 'Simvastatin 40 MG Oral Tablet',
    'terms': [{
        'tty': 'SCD',
        'cui': 'C0690321',
        'rank': '168',
        'str': 'Simvastatin 40 MG Oral Tablet',
        'aui': 'A10427552',
        'lat': 'ENG'
    }],
    'sameas': [
        'urn:ndfrt:N0000165803',
        'urn:ndfrt:N0000164280',
        'urn:sct:320000009',
        'urn:sct:376638003',
        'urn:vandf:4016607',
        'urn:vandf:4010153'
    ],
    'ancestors': [],
    'cui': 'C0690321',
    'attributes': {
        'NDC': [
            '54569583402',
            '54868562900',
            '24658021390'
        ],
        'ORIG_CODE': [
            '016579',
            '51138-237'
        ],
        'RXCUI': [
            '198211',
            '198211'
        ],
        'RXN_AVAILABLE_STRENGTH': '40 MG',
        'RXAUI': [
            '1113510',
            '3620945'
        ],
        'ORIG_SOURCE': [
            'MTHFDA',
            'MTHSPL'
        ],
        'RXN_HUMAN_DRUG': 'US',
        'RXTERM_FORM': 'Tab',
        'ORIG_TTY': [
            'CDC',
            'DP'
        ],
        'ORIG_VSAB': [
            'NDDF_2004_03_11',
            'MTHSPL_2012_03_29'
        ]
    },
    'code': '198211',
    'aui': 'A10427552'
}, {
    'urn': 'urn:vandf:4020400',
    'parents': [],
    'codeSystem': 'VANDF',
    'rels': {
        'urn:vandf:4031762': [
            'RO|has_ingredient'
        ],
        'urn:vandf:4030065': [
            'RO|has_ingredient'
        ]
    },
    'description': 'SIMVASTATIN',
    'terms': [{
        'tty': 'IN',
        'cui': 'C0074554',
        'rank': '134',
        'str': 'SIMVASTATIN',
        'aui': 'A8438207',
        'lat': 'ENG'
    }],
    'sameas': [
        'urn:sct:387584000',
        'urn:rxnorm:36567',
        'urn:ndfrt:N0000005842',
        'urn:ndfrt:N0000148200',
        'urn:sct:96304005'
    ],
    'ancestors': [],
    'cui': 'C0074554',
    'code': '4020400',
    'aui': 'A8438207'
}, {
    'urn': 'urn:ndfrt:N0000005842',
    'parents': [
        'urn:ndfrt:N0000007106'
    ],
    'codeSystem': 'NDFRT',
    'rels': {
        'urn:ndfrt:N0000007106': [
            'PAR|'
        ],
        'urn:ndfrt:N0000165940': [
            'RO|has_contraindicating_class'
        ]
    },
    'description': 'Simvastatin [Chemical/Ingredient]',
    'terms': [{
        'tty': 'FN',
        'cui': 'C0074554',
        'rank': '129',
        'str': 'Simvastatin [Chemical/Ingredient]',
        'aui': 'A17905627',
        'lat': 'ENG'
    }, {
        'tty': 'PT',
        'cui': 'C0074554',
        'rank': '128',
        'str': 'Simvastatin',
        'aui': 'A17905626',
        'lat': 'ENG'
    }, {
        'tty': 'SY',
        'cui': 'C0074554',
        'rank': '127',
        'str': 'Synvinolin',
        'aui': 'A17929979',
        'lat': 'ENG'
    }],
    'sameas': [
        'urn:sct:387584000',
        'urn:rxnorm:36567',
        'urn:vandf:4020400',
        'urn:ndfrt:N0000148200',
        'urn:sct:96304005'
    ],
    'ancestors': [
        'urn:ndfrt:N0000007106',
        'urn:ndfrt:N0000000002',
        'urn:ndfrt:N0000007676',
        'urn:ndfrt:N0000007973',
        'urn:ndfrt:N0000008280',
        'urn:ndfrt:N0000007809',
        'urn:ndfrt:N0000008229',
        'urn:ndfrt:N0000008164'
    ],
    'cui': 'C0074554',
    'code': 'N0000005842',
    'aui': 'A17905627'
}, {
    'urn': 'urn:rxnorm:36567',
    'parents': [],
    'codeSystem': 'RXNORM',
    'rels': {
        'urn:rxnorm:1189822': [
            'RN|tradename_of'
        ],
        'urn:rxnorm:1295323': [
            'RO|has_ingredient'
        ]
    },
    'description': 'Simvastatin',
    'terms': [{
        'tty': 'IN',
        'cui': 'C0074554',
        'rank': '164',
        'str': 'Simvastatin',
        'aui': 'A10339353',
        'lat': 'ENG'
    }],
    'sameas': [
        'urn:sct:387584000',
        'urn:vandf:4020400',
        'urn:ndfrt:N0000005842',
        'urn:ndfrt:N0000148200',
        'urn:sct:96304005'
    ],
    'ancestors': [],
    'cui': 'C0074554',
    'attributes': {
        'RXAUI': '463695',
        'UNII_CODE': 'AGG2FN16EV',
        'RXCUI': '36567'
    },
    'code': '36567',
    'aui': 'A10339353'
}];

var jdsCodedValueBasedOnVATerminology = {
    code: vaDrugConcepts[1].urn.substring('urn:rxnorm:'.length),
    system: CODE_SYSTEMS.CODE_SYSTEM_RXNORM,
    display: vaDrugConcepts[1].description
};


//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valuid JLV terminology
// mapping.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCode_ReturnValidCode(mappingType, sourceCode, callback) {
    return callback(null, jlvMappedCodeValue);
}

//-----------------------------------------------------------------------------
// Mock JLV function that simulates the return of a valid JLV terminology
// mapping list.
//
// parameters are ignored for this mock...
//-----------------------------------------------------------------------------
function getJlvMappedCodeList_ReturnValidCode(mappingType, sourceCode, callback) {
    return callback(null, [jlvMappedCodeValue]);
}

//-----------------------------------------------------------------------------
// This is a stub method that simulates the VA terminology database.  It simply
// sends the callback handler the concept requested, but it returns it from the
// static array that we have in our code - rather than actually calling the
// terminology REST services.
//
// conceptId: The URN of the concept.
// callback: The callback handler.  function(error, concept)
//-----------------------------------------------------------------------------
function getVADrugConcept_ReturnValidCode(conceptId, callback) {
    var concept = _.find(vaDrugConcepts, function(vaDrugConcept) {
        return (conceptId === vaDrugConcept.urn);
    });
    return callback(null, concept);
}

//-----------------------------------------------------------------------------
// This is a stub method that simulates the VA terminology database.  It simply
// sends the callback handler the concept requested, but it returns it from the
// static array that we have in our code - rather than actually calling the
// terminology REST services.
//
// conceptId: The URN of the concept.
// callback: The callback handler.  function(error, concept)
//-----------------------------------------------------------------------------
function getVAConceptMappingTo_ReturnValidCode(concept, targetCodeSystem, callback) {
    if ((concept) && (!_.isEmpty(concept.sameas))) {
        var targetUrn = _.find(concept.sameas, function(urn) {
            return (urn.indexOf('urn:' + targetCodeSystem) >= 0);
        });

        if (targetUrn) {
            return getVADrugConcept_ReturnValidCode(targetUrn, callback);
        } else {
            return callback(null, null);
        }
    } else {
        return callback(null, null);
    }
}

//-----------------------------------------------------------------------------
// This is a stub method that simulates the VA terminology database.  It behaves
// like no code was found in the database.
//
// conceptId: The URN of the concept.
// callback: The callback handler.  function(error, concept)
//-----------------------------------------------------------------------------
function getVADrugConcept_ReturnNoCode(conceptId, callback) {
    return callback(null, null);
}

//-----------------------------------------------------------------------------
// This is a stub method that simulates the VA terminology database.  It behaves
// like no code was found in the database.
//
// conceptId: The URN of the concept.
// callback: The callback handler.  function(error, concept)
//-----------------------------------------------------------------------------
function getVAConceptMappingTo_ReturnNoCode(concept, targetCodeSystem, callback) {
    return callback(null, null);
}

function TerminologyUtil(){}
TerminologyUtil.prototype.CODE_SYSTEMS = CODE_SYSTEMS;
TerminologyUtil.prototype.getJlvMappedCode = getJlvMappedCode_ReturnValidCode;
TerminologyUtil.prototype.getJlvMappedCodeList = getJlvMappedCodeList_ReturnValidCode;
TerminologyUtil.prototype.getVADrugConcept = getVADrugConcept_ReturnValidCode;
TerminologyUtil.prototype.getVAConceptMappingTo = getVAConceptMappingTo_ReturnValidCode;
var goodTerminology = new TerminologyUtil();

function TerminologyUtilNoCode(){}
TerminologyUtilNoCode.prototype.CODE_SYSTEMS = CODE_SYSTEMS;
TerminologyUtilNoCode.prototype.getJlvMappedCode = getJlvMappedCode_ReturnValidCode;
TerminologyUtilNoCode.prototype.getJlvMappedCodeList = getJlvMappedCodeList_ReturnValidCode;
TerminologyUtilNoCode.prototype.getVADrugConcept = getVADrugConcept_ReturnNoCode;
TerminologyUtilNoCode.prototype.getVAConceptMappingTo = getVAConceptMappingTo_ReturnNoCode;
var noCodeTerminology = new TerminologyUtilNoCode();

describe('record-enrichment-med-xformer.js', function() {
    describe('transformAndEnrichRecord()', function() {
        it('Happy Path with VA Medication using VA terminology database transformation', function() {
            var finished = false;
            var environment = {
                terminologyUtils: goodTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level record fields
                    //-------------------------
                    expect(record.supply).toBe(false);
                    expect(record.IMO).toBe(false);
                    expect(record.overallStart).toBe('20020305');
                    expect(record.overallStop).toBe('20030306');
                    expect(record.lastAdmin).toBe('20030305101112');
                    expect(record.units).toBe('MG');
                    expect(record.summary).toEqual('SIMVASTATIN 40MG TAB (EXPIRED)\n TAKE ONE TABLET BY BY MOUTH EVERY EVENING');
                    expect(record.kind).toEqual('Medication, Outpatient');

                    // Root level products
                    //--------------------
                    expect(_.isEmpty(record.products)).toBe(false);
                    expect(record.products.length).toBe(1);
                    expect(record.products[0].summary).toEqual('MedicationProduct{uid=\'\'}');
                    expect(record.products[0].ingredientRXNCode).toEqual('urn:rxnorm:36567');

                    // Root Level administrations
                    //----------------------------
                    expect(_.isEmpty(record.administrations)).toBe(false);
                    expect(record.administrations.length).toBe(1);
                    expect(record.administrations[0].summary).toEqual('MedicationAdministration{uid=\'\'}');
                    expect(record.administrations[0].given).toEqual(true);

                    // Root level dosages
                    //--------------------
                    expect(_.isEmpty(record.dosages)).toBe(false);
                    expect(record.dosages.length).toBe(1);
                    expect(record.dosages[0].summary).toEqual('MedicationDose{uid=\'\'}');
                    expect(record.dosages[0].startDateString).toBeUndefined();
                    expect(record.dosages[0].stopDateString).toBeUndefined();

                    // Root Level Fills
                    //-----------------
                    expect(_.isEmpty(record.fills)).toBe(false);
                    expect(record.fills.length).toBe(1);
                    expect(record.fills[0].summary).toEqual('MedicationFill{uid=\'\'}');

                    // Root Level Indications
                    //-----------------------
                    expect(_.isEmpty(record.indications)).toBe(false);
                    expect(record.indications.length).toBe(1);
                    expect(record.indications[0].summary).toEqual('MedicationIndication{uid=\'\'}');

                    // Root Level Orders
                    //-----------------
                    expect(_.isEmpty(record.orders)).toBe(false);
                    expect(record.orders.length).toBe(1);
                    expect(record.orders[0].summary).toEqual('MedicationOrder{uid=\'\'}');

                    // Verify field data type changes
                    //-------------------------------
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.lastUpdateTime).toEqual('string');
                    expect(typeof record.overallStart).toEqual('string');
                    expect(typeof record.overallStop).toEqual('string');
                    expect(typeof record.stopped).toEqual('string');
                    expect(typeof record.lastFilled).toEqual('string');
                    expect(typeof record.localId).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    _.each(record.administrations, function(administration) {
                        expect(typeof administration.dateTime).toEqual('string');
                    });
                    _.each(record.dosages, function(dosage) {
                        expect(typeof dosage.start).toEqual('string');
                        expect(typeof dosage.stop).toEqual('string');
                        expect(typeof dosage.dose).toEqual('string');
                        expect(typeof dosage.amount).toEqual('string');
                        expect(typeof dosage.ivRate).toEqual('string');
                        expect(typeof dosage.duration).toEqual('string');
                        expect(typeof dosage.routeCode).toEqual('string');
                        expect(typeof dosage.timingExpression).toEqual('string');
                        expect(typeof dosage.restriction).toEqual('string');
                        expect(typeof dosage.relatedOrder).toEqual('string');
                        expect(typeof dosage.complexDuration).toEqual('string');
                    });
                    _.each(record.fills, function(fill) {
                        expect(typeof fill.dispenseDate).toEqual('string');
                        expect(typeof fill.releaseDate).toEqual('string');
                        expect(typeof fill.quantityDispensed).toEqual('string');
                    });
                    _.each(record.orders, function(order) {
                        expect(typeof order.ordered).toEqual('string');
                        expect(typeof order.expiration).toEqual('string');
                        expect(typeof order.fillCost).toEqual('string');
                        expect(typeof order.quantityOrdered).toEqual('string');
                    });
                    _.each(record.indications, function(indication) {
                        expect(typeof indication.code).toEqual('string');
                    });
                    _.each(record.products, function(product) {
                        expect(typeof product.strength).toEqual('string');
                        expect(typeof product.volume).toEqual('string');
                        expect(typeof product.ivBag).toEqual('string');
                        expect(typeof product.relatedOrder).toEqual('string');
                    });

                    // Verify the values in the rxncodes attribute
                    //--------------------------------------------
                    expect(_.isEmpty(record.rxncodes)).toBe(false);
                    if(record.rxncodes) {
                        expect(record.rxncodes.length).toEqual(11);
                        expect(record.rxncodes).toEqual([
                            'urn:vandf:4020400',
                            'urn:ndfrt:N0000007106',
                            'urn:ndfrt:N0000000002',
                            'urn:ndfrt:N0000007676',
                            'urn:ndfrt:N0000007973',
                            'urn:ndfrt:N0000008280',
                            'urn:ndfrt:N0000007809',
                            'urn:ndfrt:N0000008229',
                            'urn:ndfrt:N0000008164',
                            'urn:rxnorm:36567',
                            'urn:ndfrt:N0000148200'
                        ]);
                    }
                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValueBasedOnVATerminology));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication using JLV transformation', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Verify the values in the rxncodes attribute
                    //--------------------------------------------
                    expect(_.isEmpty(record.rxncodes)).toBe(true);

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate for setting overallStart', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.overallStart = undefined;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.overallStart).toBe(record.orders[0].ordered);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting overallStop', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.overallStop = undefined;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.overallStop).toBe(record.stopped);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 2 for setting overallStop', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.overallStop = 20030306;
            vaMedJob.record.stopped = 20030304;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.overallStop).toBe('20030304');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 3 for setting overallStop', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.overallStop = undefined;
            vaMedJob.record.stopped = undefined;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.overallStop).toBe(record.orders[0].ordered);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting lastAdmin', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.administrations[0].status = 'INFUSING';

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.lastAdmin).toBe(record.administrations[0].dateTime);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting units', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.dosages = undefined;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.units).toBeUndefined();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 2 for setting units', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.dosages = [{
                units: 'MG'
            }, {
                units: 'MG'
            }];

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.units).toBe('MG');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting kind', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.supply = true;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.kind).toBe('Medication, Supply');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 2 for setting kind', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.supply = false;
            vaMedJob.record.IMO = true;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.kind).toBe('Medication, Clinic Order');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 3 for setting kind', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.supply = false;
            vaMedJob.record.IMO = false;
            vaMedJob.record.vaType = undefined;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.kind).toBe('Medication');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting root level summary', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.medType = 'urn:sct:105903003';
            vaMedJob.record.vaStatus = undefined;
            vaMedJob.record.products = [{
                ingredientName: 'Name1'
            }, {
                ingredientName: 'Name2'
            }];

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toBe('Name1, Name2(historical)\n TAKE ONE TABLET BY BY MOUTH EVERY EVENING');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 2 for setting root level summary', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.medType = 'urn:sct:105903003';
            vaMedJob.record.vaStatus = undefined;
            vaMedJob.record.vaType = 'V'; //INFUSION
            vaMedJob.record.products = [{
                suppliedName: 'Name1A'
            }, {
                suppliedName: 'Name1B'
            }, {
                suppliedName: 'Name2A',
                ingredientRole: 'urn:sct:418297009'
            }, {
                suppliedName: 'Name2B',
                ingredientRole: 'urn:sct:418297009'
            }];
            vaMedJob.record.dosages[0].ivRate = '100';
            vaMedJob.record.dosages[0].duration = '50';
            vaMedJob.record.dosages[0].scheduleName = 'SchedName';
            vaMedJob.record.dosages[0].restriction = '10';


            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toBe('Name1A, Name1B in Name2A, Name2B(historical)\n TAKE ONE TABLET BY BY MOUTH EVERY EVENING100 50 SchedName for a total of 10');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 3 for setting root level summary', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.medType = 'urn:sct:105903003';
            vaMedJob.record.vaStatus = undefined;
            vaMedJob.record.products = undefined;

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.summary).toBe(record.qualifiedName + '(historical)\n TAKE ONE TABLET BY BY MOUTH EVERY EVENING');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting product.ingredientRXNCode summary', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.products[0].ingredientRXNCode = 'SomeTextGoesHere';

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.products[0].ingredientRXNCode).toBe('SomeTextGoesHere');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting administration.given', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.administrations[0].status = 'INFUSING';

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.administrations[0].given).toBe(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 2 for setting administration.given', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.administrations[0].status = 'STOPPED';

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.administrations[0].given).toBe(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 3 for setting administration.given', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.administrations[0].status = 'SOMETHINGELSE';

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.administrations[0].given).toBe(false);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 1 for setting dosage fields', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.dosages[0].start = undefined;
            vaMedJob.record.dosages[0].stop = undefined;
            vaMedJob.record.dosages[0].med = { medType: 'urn:sct:105903003' };

            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.dosages[0].startDateString).toBeUndefined();
                    expect(record.dosages[0].stopDateString).toBeUndefined();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Happy Path with VA Medication alternate 2 for setting dosage fields', function() {
            var finished = false;
            var environment = {
                terminologyUtils: noCodeTerminology
            };
            var vaMedJob = JSON.parse(JSON.stringify(originalVaMedJob));
            vaMedJob.record.dosages[0].start = undefined;
            vaMedJob.record.dosages[0].stop = undefined;
            vaMedJob.record.dosages[0].relativeStart = '3002';      // Make it use >  2 days
            vaMedJob.record.dosages[0].relativeStop = '1501';       // Makt it use > 1 day but less than 2


            runs(function() {
                xformer(log, config, environment, vaMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.dosages[0].startDateString).toBe('Start + 2 days 2 hours 2 minutes');
                    expect(record.dosages[0].stopDateString).toBe('Start + 1 day 1 hour 1 minute');
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Happy Path with Dod Document', function() {
            var finished = false;
            var environment = {
                terminologyUtils: goodTerminology
            };
            var dodMedJob = JSON.parse(JSON.stringify(originalDodMedJob));

            runs(function() {
                xformer(log, config, environment, dodMedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();

                    // Root level record fields
                    //-------------------------
                    expect(record.supply).toBe(false);
                    expect(record.IMO).toBe(false);
                    expect(record.overallStart).toBe('20131025020100');
                    expect(record.overallStop).toBe('20131124134400');
                    expect(record.lastAdmin).toBeUndefined();
                    expect(record.units).toBeUndefined();
                    expect(record.summary).toEqual('HYDRALAZINE HCL, 25 MG, TABLET, ORAL (Active)\n ');             // It has an extra space on the end because sig is defined as empty string.
                    expect(record.kind).toEqual('Medication, Outpatient');

                    // Root level products
                    //--------------------
                    expect(_.isEmpty(record.products)).toBe(false);
                    expect(record.products.length).toBe(1);
                    expect(record.products[0].summary).toEqual('MedicationProduct{uid=\'\'}');
                    expect(record.products[0].ingredientRXNCode).toBeUndefined();

                    // Root Level administrations
                    //----------------------------
                    expect(_.isEmpty(record.administrations)).toBe(true);

                    // Root level dosages
                    //--------------------
                    expect(_.isEmpty(record.dosages)).toBe(true);

                    // Root Level Fills
                    //-----------------
                    expect(_.isEmpty(record.fills)).toBe(false);
                    expect(record.fills.length).toBe(1);
                    expect(record.fills[0].summary).toEqual('MedicationFill{uid=\'\'}');

                    // Root Level Indications
                    //-----------------------
                    expect(_.isEmpty(record.indications)).toBe(true);

                    // Root Level Orders
                    //-----------------
                    expect(_.isEmpty(record.orders)).toBe(false);
                    expect(record.orders.length).toBe(1);
                    expect(record.orders[0].summary).toEqual('MedicationOrder{uid=\'\'}');

                    // Verify field data type changes
                    //-------------------------------
                    expect(typeof record.stampTime).toEqual('string');
                    expect(typeof record.overallStart).toEqual('string');
                    expect(typeof record.overallStop).toEqual('string');
                    expect(typeof record.facilityCode).toEqual('string');
                    _.each(record.fills, function(fill) {
                        expect(typeof fill.dispenseDate).toEqual('string');
                    });
                    _.each(record.orders, function(order) {
                        expect(typeof order.quantityOrdered).toEqual('string');
                    });

                    // Verify the values in the rxncodes attribute
                    //--------------------------------------------
                    expect(record.rxncodes).toBeUndefined();

                    // Verify that the code was inserted.
                    //-----------------------------------
                    expect(record.codes).toBeTruthy();
                    expect(record.codes.length).toBeGreaterThan(0);
                    expect(record.codes).toContain(jasmine.objectContaining(jdsCodedValue));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

        it('Job was null', function() {
            var finished = false;
            var environment = {};

            runs(function() {
                xformer(log, config, environment, null, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeNull();
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });
        it('Job was removed', function() {
            var finished = false;
            var environment = {
                terminologyUtils: goodTerminology
            };

            runs(function() {
                xformer(log, config, environment, removedJob.record, function(error, record) {
                    expect(error).toBeNull();
                    expect(record).toBeTruthy();
                    expect(record.uid).toEqual('urn:va:med:DOD:0000000003:1000010340');
                    expect(record.pid).toEqual('DOD;0000000003');
                    expect(record.stampTime).toEqual('20150226124943');
                    expect(record.removed).toEqual(true);
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            }, 'Call failed to return in time.', 500);
        });

    });
});