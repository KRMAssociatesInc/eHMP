/*jslint node: true */
'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var fhirResource = require('../common/entities/fhirResource');
var helpers = require('../common/utils/helpers');
var constants = require('../common/utils/constants');
var fhirUtils = require('../common/utils/fhirUtils');

function convertToFhir(inputJSON, req) {
    var outJSON = [];
    var items = inputJSON.data.items;

    for (var i = 0; i < items.length; i++) {
        outJSON.push(createDiagnosticReport(items[i], req));
        //outJSON.push(new fhirResource.DiagnosticReport()); // TEST - empty DiagnosticReport
    }
    return outJSON;
}

var statusMap = {
    //'': 'amended',
    //'': 'cancelled',
    //'': 'interim',
    //'': 'registered',
    //'': 'withdrawn',
    'completed': 'final',
    'COMPLETE': 'final',
    '': 'final'
};

var categoryMap = {
    'CH': {
        code: 'CH',
        display: 'Chemistry'
    },
    'CY': {
        code: 'CP',
        display: 'Cytopathology'
    },
    'EM': {
        code: 'OTH',
        display: 'Other'
    },
    'MI': {
        code: 'MB',
        display: 'Microbiology'
    },
    'SP': {
        code: 'SP',
        display: 'Surgical Pathology'
    },
    'AP': {
        code: 'OTH',
        display: 'Other'
    },
    getShortCode: function(code) {
        var shortCode = code;
        if (code.length > 1) {
            shortCode = code.substring(code.length - 2);
        }
        return shortCode;
    }
};
module.exports.categoryMap = categoryMap;

var interpretationMap = {
    'H': {
        code: 'H',
        display: 'Above high normal'
    },
    'HH': {
        code: 'HH',
        display: 'Above upper panic limits'
    },
    'N': {
        code: 'N',
        display: 'Normal'
    },
    'L': {
        code: 'L',
        display: 'Below low normal'
    },
    'LL': {
        code: 'LL',
        display: 'Below lower panic limits'
    },
    getShortCode: function(code) {
        //return code.replace(constants.labResultsFhir.INTERPRETATION_VPR_PREFIX, '');
        return code.split(':').pop();
    }
};

function createDiagnosticReport(item, req) {
    //item.result = " ";
    var pid = null;
    if (nullchecker.isNotNullish(req)) {
        pid = req._pid;

    }
    var dr = new fhirResource.DiagnosticReport();

    if (nullchecker.isNotNullish(pid)) {
        dr.subject = new fhirResource.ReferenceResource(constants.labResultsFhir.PATIENT_PREFIX + pid);
    }
    //issued
    if (nullchecker.isNotNullish(item.resulted)) {
        dr.issued = fhirUtils.convertToFhirDateTime(item.resulted);
    }
    if (nullchecker.isNullish(dr.issued) && nullchecker.isNotNullish(item.observed)) {
        dr.issued = fhirUtils.convertToFhirDateTime(item.observed);
    }
    //diagnostic[x]
    if (nullchecker.isNotNullish(item.observed)) {
        dr.diagnosticDateTime = fhirUtils.convertToFhirDateTime(item.observed);
    }
    if (nullchecker.isNullish(dr.diagnosticDateTime) && nullchecker.isNotNullish(item.resulted)) {
        dr.diagnosticDateTime = fhirUtils.convertToFhirDateTime(item.resulted);
    }
    //status
    if (nullchecker.isNotNullish(item.statusName)) {
        dr.status = statusMap[item.statusName];
    }
    if (nullchecker.isNullish(dr.status)) {
        dr.status = 'final';
    }

    var shortCategoryCode = '';
    if (nullchecker.isNotNullish(item.categoryCode)) {
        shortCategoryCode = categoryMap.getShortCode(item.categoryCode);
        //serviceCategory
        if (nullchecker.isNotNullish(categoryMap[shortCategoryCode])) {
            dr.serviceCategory = new fhirResource.CodeableConcept(
                categoryMap[shortCategoryCode].display,
                new fhirResource.Coding(categoryMap[shortCategoryCode].code, categoryMap[shortCategoryCode].display, constants.labResultsFhir.SERVICE_CATEGORY_SYSTEM));
        }
        //name
        if (shortCategoryCode === 'CH' || shortCategoryCode === 'MI') {
            dr.name = new fhirResource.CodeableConcept(item.typeName);
        } else if (shortCategoryCode === 'CY' || shortCategoryCode === 'EM' || shortCategoryCode === 'SP') {
            if (nullchecker.isNotNullish(item.results) && nullchecker.isNotNullish(item.results[0])) {
                dr.name = new fhirResource.CodeableConcept(item.results[0].localTitle);
            } else {
                dr.name = new fhirResource.CodeableConcept();
            }
        } else if (shortCategoryCode === 'AP') {
            dr.name = new fhirResource.CodeableConcept('LR ANATOMIC PATHOLOGY REPORT');
        }
        dr.name.coding = dr.name.coding || [];
        if (nullchecker.isNotNullish(item.vuid)) {
            dr.name.coding.push(new fhirResource.Coding(item.vuid, item.typeName, constants.labResultsFhir.LAB_RESULTS_UID_IDENTIFIER_SYSTEM));
        }
        if (nullchecker.isNotNullish(item.typeCode)) {
            dr.name.coding.push(new fhirResource.Coding(item.typeCode, item.typeName, constants.labResultsFhir.DIAGNOSTIC_REPORTS_SYSTEM));
        }
        //The code information in the codes array will be tagged on the end of the name.coding array
        if (nullchecker.isNotNullish(item.codes)) {
            for (var i in item.codes) {
                if (nullchecker.isNotNullish(item.codes[i])) {
                    dr.name.coding.push(new fhirResource.Coding(item.codes[i].code, item.codes[i].display, item.codes[i].system));
                }
            }
        }
        if (dr.name.coding.length === 0) {
            dr.name.coding = undefined;
        }
    }
    // extensions
    dr.extension = createExtensions(item);
    // identifiers
    if (nullchecker.isNotNullish(item.uid)) {
        dr.identifier = new fhirResource.Identifier(item.uid, constants.labResultsFhir.LAB_RESULTS_UID_IDENTIFIER_SYSTEM);
    }
    dr.contained = [];
    //performer - Organization
    if (nullchecker.isNotNullish(item.facilityCode)) {
        var contOrganization = new fhirResource.Organization(helpers.generateUUID());
        contOrganization.identifier = contOrganization.identifier || [];
        contOrganization.identifier.push(new fhirResource.Identifier(item.facilityCode, undefined, undefined, 'facility-code'));
        var orgName = null;
        var orgAddressText = null;
        var commMatches = null;
        if (nullchecker.isNotNullish(item.comment)) {
            commMatches = item.comment.match(constants.labResultsFhir.COMMENTS_REGEX_STRING);
            if (nullchecker.isNotNullish(commMatches)) {
                orgName = commMatches[4];
                orgAddressText = commMatches[5];
            }
        }
        contOrganization.name = orgName || item.facilityName;
        if (nullchecker.isNotNullish(orgAddressText)) {
            contOrganization.address = contOrganization.address || [];
            var orgAddress = new fhirResource.Address();
            orgAddress.text = orgAddressText;
            orgAddress.line = [];
            orgAddress.line.push(contOrganization.name);
            if (nullchecker.isNotNullish(orgAddress.text)) {
                var orgAddrMatches = orgAddress.text.match(constants.labResultsFhir.ADDRESS_REGEX_STRING);
                if (nullchecker.isNotNullish(orgAddrMatches[1])) {
                    orgAddress.line.push(orgAddrMatches[1]);
                }
                if (nullchecker.isNotNullish(orgAddrMatches[2])) {
                    orgAddress.city = orgAddrMatches[2];
                }
                if (nullchecker.isNotNullish(orgAddrMatches[3])) {
                    orgAddress.state = orgAddrMatches[3];
                }
                if (nullchecker.isNotNullish(orgAddrMatches[4])) {
                    orgAddress.zip = orgAddrMatches[4];
                }
            }
            contOrganization.address.push(orgAddress);
        }
        var orgText = '';
        if (nullchecker.isNotNullish(contOrganization.name)) {
            orgText += contOrganization.name;
        }
        if (nullchecker.isNotNullish(orgAddressText)) {
            orgText += '<br>' + orgAddressText;
        }
        if (nullchecker.isNotNullish(orgText)) {
            contOrganization.text = new fhirResource.Narrative('<div>' + orgText + '</div>');
        }

        dr.contained.push(contOrganization);
        dr.performer = new fhirResource.ReferenceResource('#' + contOrganization._id, contOrganization.name);
    }
    //specimen - Specimen
    if (nullchecker.isNotNullish(item.specimen)) {
        var contSpecimen = new fhirResource.Specimen(helpers.generateUUID());
        if (nullchecker.isNotNullish(pid)) {
            contSpecimen.subject = new fhirResource.ReferenceResource(constants.labResultsFhir.PATIENT_PREFIX + pid);
        }
        contSpecimen.type = new fhirResource.CodeableConcept(item.specimen);
        contSpecimen.collection.collectedDateTime = fhirUtils.convertToFhirDateTime(item.observed);
        dr.contained.push(contSpecimen);
        var refSpecimen = new fhirResource.ReferenceResource('#' + contSpecimen._id, item.specimen);
        dr.specimen = dr.specimen || [];
        dr.specimen.push(refSpecimen);
    }
    //result - Observation
    // CH, AP Observation

    if (nullchecker.isNotNullish(item.result)) {
        var contCHObservation = new fhirResource.Observation(helpers.generateUUID());
        contCHObservation.name = new fhirResource.CodeableConcept(dr.name.text);
        contCHObservation.name.coding = contCHObservation.name.coding || [];
        if (nullchecker.isNotNullish(item.vuid)) {
            contCHObservation.name.coding.push(new fhirResource.Coding(item.vuid, item.typeName, constants.labResultsFhir.LAB_RESULTS_UID_IDENTIFIER_SYSTEM));
        }
        if (nullchecker.isNotNullish(item.typeCode)) {
            contCHObservation.name.coding.push(new fhirResource.Coding(item.typeCode, item.typeName, constants.labResultsFhir.DIAGNOSTIC_REPORTS_SYSTEM));
        }
        if (shortCategoryCode !== 'CH') {
            //The code information in the codes array will be tagged on the end of the name.coding array
            if (nullchecker.isNotNullish(item.codes)) {
                _.each(item.codes, function(c) {
                    if (nullchecker.isNotNullish(c)) {
                        contCHObservation.name.coding.push(new fhirResource.Coding(c.code, c.display, c.system));
                    }
                });
            }
        }
        if (contCHObservation.name.coding.length === 0) {
            delete contCHObservation.name.coding;
        }
        if (!isNaN(parseFloat(item.result))) {
            contCHObservation.valueQuantity = new fhirResource.Quantity(item.result, item.units);
        } else {
            contCHObservation.valueString = item.result;
        }
        if ((shortCategoryCode === 'CH' || shortCategoryCode === 'MI') && (nullchecker.isNotNullish(item.result.replace(/\s/g, ''))) && !isNaN(item.result)) {
            var interpretationCode = 'N';
            if (nullchecker.isNotNullish(item.interpretationCode)) {
                interpretationCode = interpretationMap.getShortCode(item.interpretationCode);
            }
            contCHObservation.interpretation = new fhirResource.CodeableConcept(undefined,
                new fhirResource.Coding(interpretationMap[interpretationCode].code, interpretationMap[interpretationCode].display, constants.labResultsFhir.INTERPRETATION_SYSTEM));
        }
        contCHObservation.status = dr.status;
        contCHObservation.reliability = 'ok';
        if (nullchecker.isNotNullish(dr.specimen)) {
            contCHObservation.specimen = dr.specimen[0];
        }
        var range = {};
        if (nullchecker.isNotNullish(item.high)) {
            range.high = new fhirResource.Quantity(item.high, item.units);
        }
        if (nullchecker.isNotNullish(item.low)) {
            range.low = new fhirResource.Quantity(item.low, item.units);
        }
        if (nullchecker.isNotNullish(range.high) || nullchecker.isNotNullish(range.low)) {
            contCHObservation.referenceRange = contCHObservation.referenceRange || [];
            contCHObservation.referenceRange.push(range);
        }
        dr.contained.push(contCHObservation);
        dr.result = dr.result || [];
        dr.result.push(new fhirResource.ReferenceResource('#' + contCHObservation._id, contCHObservation.name.text));
    }
    // MI GramStain Observations
    for (var gs in item.gramStain) {
        if (nullchecker.isNotNullish(item.gramStain[gs]) && nullchecker.isNotNullish(item.gramStain[gs].result)) {
            var contMIGSObservation = new fhirResource.Observation(helpers.generateUUID());
            contMIGSObservation.valueString = item.gramStain[gs].result;
            contMIGSObservation.name = new fhirResource.CodeableConcept(constants.labResultsFhir.GRAMSTAIN_DISPLAY,
                new fhirResource.Coding(constants.labResultsFhir.GRAMSTAIN_CODE, constants.labResultsFhir.GRAMSTAIN_DISPLAY, constants.labResultsFhir.GRAMSTAIN_SYSTEM));
            contMIGSObservation.status = statusMap.completed;
            contMIGSObservation.reliability = 'ok';
            if (nullchecker.isNotNullish(dr.specimen)) {
                contMIGSObservation.specimen = dr.specimen[0];
            }

            dr.contained.push(contMIGSObservation);
            dr.result = dr.result || [];
            dr.result.push(new fhirResource.ReferenceResource('#' + contMIGSObservation._id, contMIGSObservation.name.text));
        }
    }
    // MI Organisms Observations
    for (var ogsm in item.organisms) {
        if (nullchecker.isNotNullish(item.organisms[ogsm]) && nullchecker.isNotNullish(item.organisms[ogsm].name)) {
            var organism = item.organisms[ogsm];
            for (var d in organism.drugs) {
                if (nullchecker.isNotNullish(organism.drugs[d])) {
                    var contMIOgsmObservation = new fhirResource.Observation(helpers.generateUUID());

                    contMIOgsmObservation.status = statusMap.completed;
                    contMIOgsmObservation.reliability = 'ok';
                    var ogsmResult = organism.name;
                    if (nullchecker.isNotNullish(organism.qty)) {
                        ogsmResult += ' (' + organism.qty + ')';
                    }
                    ogsmResult += ' :';
                    if (nullchecker.isNotNullish(organism.drugs[d].name)) {
                        ogsmResult += ' DRUG=' + organism.drugs[d].name;
                    }
                    if (nullchecker.isNotNullish(organism.drugs[d].interp)) {
                        ogsmResult += ' INTERP=' + organism.drugs[d].interp;
                    }
                    if (nullchecker.isNotNullish(organism.drugs[d].result)) {
                        ogsmResult += ' RESULT=' + organism.drugs[d].result;
                    }
                    //contMIOgsmObservation.valueString = ogsmResult;
                    contMIOgsmObservation.name = new fhirResource.CodeableConcept(ogsmResult,
                        new fhirResource.Coding(constants.labResultsFhir.ORGANISM_CODE, constants.labResultsFhir.ORGANISM_DISPLAY, constants.labResultsFhir.ORGANISM_SYSTEM));

                    dr.contained.push(contMIOgsmObservation);
                    dr.result = dr.result || [];
                    dr.result.push(new fhirResource.ReferenceResource('#' + contMIOgsmObservation._id, contMIOgsmObservation.name.text));
                }
            }
        }
    }

    if (dr.contained.length === 0) {
        dr.contained = undefined;
    }
    // text
    if (shortCategoryCode === 'CH' || shortCategoryCode === 'MI') {
        dr.text = createText(dr);
    } else {
        if (nullchecker.isNotNullish(item.summary)) {
            dr.text = new fhirResource.Narrative('<div>' + item.summary + '</div>');
        }
    }

    return dr;
}

function createExtensions(item) {
    var drExtension = [];
    if (nullchecker.isNotNullish(item.bactRemarks)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'bactRemarks', item.bactRemarks, 'String'));
    }
    if (nullchecker.isNotNullish(item.groupName)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'groupName', item.groupName, 'String'));
    }
    if (nullchecker.isNotNullish(item.groupUid)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'groupUid', item.groupUid, 'String'));
    }
    if (nullchecker.isNotNullish(item.labOrderId)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'labOrderId', item.labOrderId, 'String'));
    }
    if (nullchecker.isNotNullish(item.localId)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'localId', item.localId, 'String'));
    }
    if (nullchecker.isNotNullish(item.orderIid)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'orderIid', item.orderIid, 'String'));
    }
    if (nullchecker.isNotNullish(item.orderUid)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'orderUid', item.orderUid, 'String'));
    }
    if (nullchecker.isNotNullish(item.urineScreen)) {
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'urineScreen', item.urineScreen, 'String'));
    }

    if (nullchecker.isNotNullish(item.results) && nullchecker.isNotNullish(item.results[0]) && nullchecker.isNotNullish(item.results[0].resultUid)) {
        var extReport = new fhirResource.ReferenceResource(constants.labResultsFhir.COMPOSITION_PREFIX + item.results[0].resultUid);
        drExtension.push(new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'report', extReport, 'Resource'));
    }

    if (drExtension.length === 0) {
        drExtension = undefined;
    }

    return drExtension;
}

/**
 * This method extracts and set the text information for the FHIR Diagnostic
 * report Create text.div in the format: Collected: <<diagnostic[DateTime]>> <br>
 * Report Released: <<issued>> <br>
 * Accession: <<extension[externalAccession].value>> <br>
 * Test: <<results.name.text>> <br>
 * Result: <<contained[Observation].value[Quantity].value>>
 * <<contained[Observation].value[Quantity].units>> <br>
 * Low: <<contained[Observation].referenceRange.low.value>><<<<contained[
 * Observation].value[Quantity].units>> <br>
 * High: <<contained[Observation].referenceRange.high.value>><<<<contained[
 * Observation].value[Quantity].units>> <br>
 * Specimen: <<contained[Specimen].type.text>> <br>
 * Performing Lab: <<contained[Organization].name>> <br>
 * <tab><tab> <<contained[Organization].text.div>>
 *
 * @param dr
 *            The FHIR DiagnosticReport being updated with text.
 */
function createText(dr) {
    var text = null;

    if (nullchecker.isNotNullish(dr)) {

        text = '<div>';
        if (nullchecker.isNotNullish(dr.diagnosticDateTime)) {
            text += 'Collected: ' + dr.diagnosticDateTime + '<br>';
        }

        if (nullchecker.isNotNullish(dr.issued)) {
            text += 'Report Released: ' + dr.issued + '<br>';
        }

        var extensionValue = fhirUtils.getExtensionValue(dr.extension, constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'groupUid');
        if (nullchecker.isNotNullish(extensionValue)) {
            text += 'Accession: ' + extensionValue + '<br>';
        }

        if (nullchecker.isNotNullish(dr.name) && nullchecker.isNotNullish(dr.name.text)) {
            text += 'Test: ' + dr.name.text + '<br>';
        }

        _.each(dr.contained, function(observation) {
            if (observation.resourceType === 'Observation') {
                if (nullchecker.isNotNullish(observation.valueQuantity)) {
                    text += 'Result: ' + observation.valueQuantity.value + ' ' + observation.valueQuantity.units + '<br>';
                    if (nullchecker.isNotNullish(observation.referenceRange) && nullchecker.isNotNullish(observation.referenceRange[0])) {
                        if (nullchecker.isNotNullish(observation.referenceRange[0].low)) {
                            text += 'Low: ' + observation.referenceRange[0].low.value + ' ' + observation.referenceRange[0].low.units + '<br>';
                        }
                        if (nullchecker.isNotNullish(observation.referenceRange[0].high)) {
                            text += 'High: ' + observation.referenceRange[0].high.value + ' ' + observation.referenceRange[0].high.units + '<br>';
                        }
                    }
                } else if (nullchecker.isNotNullish(observation.valueString)) {
                    text += 'Result: ' + observation.valueString + '<br>';
                }
            }
        });

        _.each(dr.contained, function(specimen) {
            if (specimen.resourceType === 'Specimen') {
                if (nullchecker.isNotNullish(specimen.type)) {
                    text += 'Specimen: ' + specimen.type.text + '<br>';
                }
            }
        });

        _.each(dr.contained, function(performer) {
            if (performer.resourceType === 'Organization') {
                if (nullchecker.isNotNullish(performer.name)) {
                    text += 'Performing Lab: ' + performer.name + '<br>';
                    var perfTextLines = fhirUtils.removeDivFromText(performer.text.div).split('<br>');
                    _.each(perfTextLines, function(l) {
                        text += '\t\t' + perfTextLines[l] + '<br>';
                    });
                }
            }
        });

        text += '</div>';
    }

    return new fhirResource.Narrative(text);
}

module.exports.convertToFhir = convertToFhir;
