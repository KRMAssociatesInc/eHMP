'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var fhirResource = require('../common/entities/fhir-resource');
var helpers = require('../common/utils/helpers');
var constants = require('../common/utils/constants');
var fhirUtils = require('../common/utils/fhir-converter');

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
    },
    get: function(code) {
        return this[this.getShortCode(code)];
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
        return code.split(':').pop();
    },
    get: function(code) {
        return this[this.getShortCode(code)];
    }
};

function createDiagnosticReport(item, req) {
    //item.result = " ";
    var pid = null;
    if (nullchecker.isNotNullish(req)) {
        pid = req._pid;

    }
    var dr = new fhirResource.DiagnosticReport();
    dr.contained = []; // initialize contained, values will be added when building the rest of the report
    setName(dr, item);
    setStatus(dr, item);
    setIssued(dr, item);
    setSubject(dr, pid);
    setPerformer(dr, item);
    // Missing fhir::encounter attribute
    setIdentifier(dr, item);
    // Missing fhir::requestDetail attribute
    setServiceCategory(dr, item);
    setDiagnostic_X_(dr, item);
    setSpecimen(dr, item, pid);
    // Missing fhir::imagingStudy attribute
    // Missing fhir::image attribute
    // Missing fhir::conclusion attribute
    // Missing fhir::codedDiagnosis attribute
    // Missing fhir::presentedForm attribute

    // Inherited from DomainResource
    dr.extension = createExtensions(item);
    setObservations(dr, item);
    setText(dr, item);

    // clean up contained property if empty
    if (dr.contained.length === 0) {
        dr.contained = undefined;
        delete dr.contained;
    }

    return dr;
}

function setStatus(dr, item) {
    if (nullchecker.isNotNullish(item.statusName)) {
        dr.status = statusMap[item.statusName];
    }
    if (nullchecker.isNullish(dr.status)) {
        dr.status = 'final';
    }
}

function setSubject(dr, pid) {
    if (nullchecker.isNotNullish(pid)) {
        dr.subject = new fhirResource.ReferenceResource(constants.labResultsFhir.PATIENT_PREFIX + pid);
    }
}

function setIssued(dr, item) {
    if (nullchecker.isNotNullish(item.resulted)) {
        dr.issued = fhirUtils.convertToFhirDateTime(item.resulted);
    }
    if (nullchecker.isNullish(dr.issued) && nullchecker.isNotNullish(item.observed)) {
        dr.issued = fhirUtils.convertToFhirDateTime(item.observed);
    }
}

function setDiagnostic_X_(dr, item) {
    if (nullchecker.isNotNullish(item.observed)) {
        dr.diagnosticDateTime = fhirUtils.convertToFhirDateTime(item.observed);
    }
    if (nullchecker.isNullish(dr.diagnosticDateTime) && nullchecker.isNotNullish(item.resulted)) {
        dr.diagnosticDateTime = fhirUtils.convertToFhirDateTime(item.resulted);
    }
}

function setServiceCategory(dr, item) {
    if (nullchecker.isNotNullish(item.categoryCode)) {
        var category = categoryMap.get(item.categoryCode);
        //serviceCategory
        if (nullchecker.isNotNullish(category)) {
            dr.serviceCategory = new fhirResource.CodeableConcept(
                category.display,
                new fhirResource.Coding(category.code, category.display, constants.labResultsFhir.SERVICE_CATEGORY_SYSTEM));
        }
    }
}

function setPerformer(dr, item) {
    if (nullchecker.isNotNullish(item.facilityCode)) {
        var organization = createOrganization(item);
        dr.contained.push(organization);
        dr.performer = new fhirResource.ReferenceResource('#' + organization.id, organization.name);
    }
}

function setIdentifier(dr, item) {
    if (nullchecker.isNotNullish(item.uid)) {
        dr.identifier = [new fhirResource.Identifier(item.uid, constants.labResultsFhir.LAB_RESULTS_UID_IDENTIFIER_SYSTEM)];
    }
}

function createOrganization(item) {
    var contOrganization = new fhirResource.Organization(helpers.generateUUID());
    contOrganization.identifier = contOrganization.identifier || [];
    contOrganization.identifier.push(
        new fhirResource.Identifier(item.facilityCode, undefined, undefined, new fhirResource.CodeableConcept('facility-code')));
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
                orgAddress.postalCode = orgAddrMatches[4];
            }
        }
        contOrganization.address.push(orgAddress);
    }
    var orgText = '';
    if (nullchecker.isNotNullish(contOrganization.name)) {
        orgText += contOrganization.name;
    }
    if (nullchecker.isNotNullish(orgAddressText)) {
        orgText += '<br/>' + orgAddressText;
    }
    if (nullchecker.isNotNullish(orgText)) {
        contOrganization.text = new fhirResource.Narrative('<div>' + orgText + '</div>');
    }
    return contOrganization;
}

function setName(dr, item) {
    var name = new fhirResource.CodeableConcept();
    var shortCategoryCode = categoryMap.getShortCode(item.categoryCode);

    if (shortCategoryCode === 'CH' || shortCategoryCode === 'MI') {
        name = new fhirResource.CodeableConcept(item.typeName);
    } else if (shortCategoryCode === 'CY' || shortCategoryCode === 'EM' || shortCategoryCode === 'SP') {
        if (nullchecker.isNotNullish(item.results) && nullchecker.isNotNullish(item.results[0])) {
            name = new fhirResource.CodeableConcept(item.results[0].localTitle);
        } else {
            name = new fhirResource.CodeableConcept();
        }
    } else if (shortCategoryCode === 'AP') {
        name = new fhirResource.CodeableConcept('LR ANATOMIC PATHOLOGY REPORT');
    }
    name.coding = name.coding || [];
    if (nullchecker.isNotNullish(item.vuid)) {
        name.coding.push(new fhirResource.Coding(item.vuid, item.typeName, constants.labResultsFhir.LAB_RESULTS_UID_IDENTIFIER_SYSTEM));
    }
    if (nullchecker.isNotNullish(item.typeCode)) {
        name.coding.push(new fhirResource.Coding(item.typeCode, item.typeName, constants.labResultsFhir.DIAGNOSTIC_REPORTS_SYSTEM));
    }
    //The code information in the codes array will be tagged on the end of the name.coding array
    if (nullchecker.isNotNullish(item.codes)) {
        for (var i in item.codes) {
            if (nullchecker.isNotNullish(item.codes[i])) {
                name.coding.push(new fhirResource.Coding(item.codes[i].code, item.codes[i].display, item.codes[i].system));
            }
        }
    }
    if (name.coding.length === 0) {
        name.coding = undefined;
    }
    dr.name = name;
}

function setSpecimen(dr, item, pid) {
    if (nullchecker.isNotNullish(item.specimen)) {
        var subject;
        if (nullchecker.isNotNullish(pid)) {
            subject = new fhirResource.ReferenceResource(constants.labResultsFhir.PATIENT_PREFIX + pid);
        }
        var contSpecimen = new fhirResource.Specimen(helpers.generateUUID(), subject, new fhirResource.CodeableConcept(item.specimen), fhirUtils.convertToFhirDateTime(item.observed));
        dr.contained.push(contSpecimen);
        var refSpecimen = new fhirResource.ReferenceResource('#' + contSpecimen.id, item.specimen);
        if (!(dr.specimen instanceof Array)) {
            dr.specimen = dr.specimen || [];
        }
        dr.specimen.push(refSpecimen);
    }
}

function setCHObservation(dr, item) {
    if (nullchecker.isNotNullish(item.result)) {
        var contCHObservation = createCHObservation(dr, item);
        dr.contained.push(contCHObservation);
        dr.result = dr.result || [];
        dr.result.push(new fhirResource.ReferenceResource('#' + contCHObservation.id, dr.name.text));
    }
}

function createCHObservation(dr, item) {
    var shortCategoryCode = categoryMap.getShortCode(item.categoryCode);
    var contCHObservation = new fhirResource.Observation(helpers.generateUUID(), new fhirResource.CodeableConcept(dr.name.text));
    var coding = [];

    if (nullchecker.isNotNullish(item.vuid)) {
        coding.push(new fhirResource.Coding(item.vuid, item.typeName, constants.labResultsFhir.LAB_RESULTS_UID_IDENTIFIER_SYSTEM));
    }
    if (nullchecker.isNotNullish(item.typeCode)) {
        coding.push(new fhirResource.Coding(item.typeCode, item.typeName, constants.labResultsFhir.DIAGNOSTIC_REPORTS_SYSTEM));
    }
    if (shortCategoryCode !== 'CH') {
        //The code information in the codes array will be tagged on the end of the name.coding array
        if (nullchecker.isNotNullish(item.codes)) {
            _.each(item.codes, function(c) {
                if (nullchecker.isNotNullish(c)) {
                    coding.push(new fhirResource.Coding(c.code, c.display, c.system));
                }
            });
        }
    }
    if (coding.length > 0) {
        contCHObservation.code.coding = coding;
    }
    if (nullchecker.isNotNullish(item.resultNumber)) {
        contCHObservation.valueQuantity = new fhirResource.Quantity(item.resultNumber, item.units);
    } else {
        contCHObservation.valueString = item.result;
    }
    if ((shortCategoryCode === 'CH' || shortCategoryCode === 'MI') && nullchecker.isNotNullish(item.interpretationCode)) {
        var mapped = interpretationMap.get(item.interpretationCode);
        contCHObservation.interpretation = new fhirResource.CodeableConcept(undefined, [new fhirResource.Coding(mapped.code, mapped.display, constants.labResultsFhir.INTERPRETATION_SYSTEM)]);
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
    return contCHObservation;
}

function setObservations(dr, item) {
    //result - Observation
    // CH, AP Observation
    setCHObservation(dr, item);

    // MI GramStain Observations
    for (var gs in item.gramStain) {
        if (nullchecker.isNotNullish(item.gramStain[gs]) && nullchecker.isNotNullish(item.gramStain[gs].result)) {
            var contMIGSObservation = new fhirResource.Observation(helpers.generateUUID());
            contMIGSObservation.valueString = item.gramStain[gs].result;
            contMIGSObservation.code = new fhirResource.CodeableConcept(constants.labResultsFhir.GRAMSTAIN_DISPLAY, [new fhirResource.Coding(constants.labResultsFhir.GRAMSTAIN_CODE, constants.labResultsFhir.GRAMSTAIN_DISPLAY, constants.labResultsFhir.GRAMSTAIN_SYSTEM)]);
            contMIGSObservation.status = statusMap.completed;
            contMIGSObservation.reliability = 'ok';
            if (nullchecker.isNotNullish(dr.specimen)) {
                contMIGSObservation.specimen = dr.specimen[0];
            }
            dr.contained.push(contMIGSObservation);
            dr.result = dr.result || [];
            dr.result.push(new fhirResource.ReferenceResource('#' + contMIGSObservation.id, dr.name.text));
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

                    contMIOgsmObservation.code = new fhirResource.CodeableConcept(ogsmResult,
                        new fhirResource.Coding(constants.labResultsFhir.ORGANISM_CODE, constants.labResultsFhir.ORGANISM_DISPLAY, constants.labResultsFhir.ORGANISM_SYSTEM));

                    dr.contained.push(contMIOgsmObservation);
                    dr.result = dr.result || [];
                    dr.result.push(new fhirResource.ReferenceResource('#' + contMIOgsmObservation.id, ogsmResult));
                }
            }
        }
    }
}

function setText(dr, item) {
    var shortCategoryCode = categoryMap.getShortCode(item.categoryCode);

    if (shortCategoryCode === 'CH' || shortCategoryCode === 'MI') {
        dr.text = createText(dr);
    } else {
        if (nullchecker.isNotNullish(item.summary)) {
            dr.text = new fhirResource.Narrative('<div>' + item.summary + '</div>');
        }
    }
}

function createExtensions(item) {
    var drExtension = [
        createExtension('abnormal', item.abnormal, 'Boolean'),
        createExtension('categoryCode', item.categoryCode, 'String'),
        createExtension('categoryName', item.categoryName, 'String'),
        createExtension('displayName', item.displayName, 'String'),
        createExtension('displayOrder', item.displayOrder, 'Decimal'),
        createExtension('facilityCode', item.facilityCode, 'String'),
        createExtension('groupName', item.groupName, 'String'),
        createExtension('groupUid', item.groupUid, 'String'),
        createExtension('high', item.high, 'String'),
        createExtension('interpretationCode', item.interpretationCode, 'String'),
        createExtension('interpretationName', item.interpretationName, 'String'),
        createExtension('kind', item.kind, 'String'),
        createExtension('labType', item.labType, 'String'),
        createExtension('localId', item.localId, 'String'),
        createExtension('micro', item.micro, 'Boolean'),
        createExtension('orderId', item.orderId, 'String'),
        createExtension('organizerType', item.organizerType, 'String'),
        createExtension('pid', item.pid, 'String'),
        createExtension('qualifiedName', item.qualifiedName, 'String'),
        createExtension('result', item.result, 'String'),
        createExtension('resultsNumber', item.resultsNumber, 'Decimal'),
        createExtension('specimen', item.specimen, 'String'),
        createExtension('stampTime', item.stampTime, 'String'),
        createExtension('statusCode', item.statusCode, 'String'),
        createExtension('summary', item.summary, 'String'),
        createExtension('typeId', item.typeId, 'Integer'),
        createExtension('units', item.units, 'String'),
        createExtension('lastUpdateTime', item.lastUpdateTime, 'String'),
        createExtension('low', item.low, 'String'),
        createExtension('sample', item.sample, 'String'),
        createExtension('urineScreen', item.urineScreen, 'String'),
        createExtension('orderUid', item.orderUid, 'String'),
        createExtension('bactRemarks', item.bactRemarks, 'String')
    ];
    setLnccodes(drExtension, item);
    setCodesExtensions(drExtension, item);
    setResultsExtensions(drExtension, item);
    setGramStainExtensions(drExtension, item);
    setOrganismsExtensions(drExtension, item);

    if (nullchecker.isNotNullish(item.results) && nullchecker.isNotNullish(item.results[0]) && nullchecker.isNotNullish(item.results[0].resultUid)) {
        var extReport = new fhirResource.ReferenceResource(constants.labResultsFhir.COMPOSITION_PREFIX + item.results[0].resultUid);
        drExtension.push(createExtension('report', extReport, 'Resource'));
    }

    drExtension = _.compact(drExtension); // Remove empty Array items

    if (drExtension.length === 0) {
        drExtension = undefined;
    }

    return drExtension;
}

function setLnccodes(ext, item) {
    if (nullchecker.isNotNullish(item.lnccodes)) {
        for (var i = 0; i < item.lnccodes.length; i++) {
            ext.push(createExtension('lnccodes[' + i + ']', item.lnccodes[i], 'String'));
        }
    }
}

function setCodesExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.codes)) {
        for (var i = 0; i < item.codes.length; i++) {
            var o = item.codes[i];
            ext.push(createExtension('codes[' + i + ']/code', o.code, 'String'));
            ext.push(createExtension('codes[' + i + ']/system', o.system, 'String'));
            ext.push(createExtension('codes[' + i + ']/display', o.display, 'String'));
        }
    }
}

function setResultsExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.results)) {
        for (var i = 0; i < item.results.length; i++) {
            var o = item.results[i];
            ext.push(createExtension('results[' + i + ']/resultUid', o.resultUid, 'String'));
            ext.push(createExtension('results[' + i + ']/summary', o.summary, 'String'));
            ext.push(createExtension('results[' + i + ']/uid', o.uid, 'String'));
        }
    }
}

function setGramStainExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.gramStain)) {
        for (var i = 0; i < item.gramStain.length; i++) {
            var o = item.gramStain[i];
            ext.push(createExtension('gramStain[' + i + ']/result', o.result, 'String'));
        }
    }
}

function setOrganismsExtensions(ext, item) {
    if (nullchecker.isNotNullish(item.organisms)) {
        for (var i = 0; i < item.organisms.length; i++) {
            var o = item.organisms[i];
            ext.push(createExtension('organisms[' + i + ']/name', o.name, 'String'));
            ext.push(createExtension('organisms[' + i + ']/qty', o.qty, 'String'));
        }
    }
}

function createExtension(key, valueX, x) {
    if (nullchecker.isNotNullish(valueX)) {
        return (new fhirResource.Extension(constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + key, valueX, x));
    } else {
        return null;
    }
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
            text += 'Collected: ' + dr.diagnosticDateTime + '<br/>';
        }

        if (nullchecker.isNotNullish(dr.issued)) {
            text += 'Report Released: ' + dr.issued + '<br/>';
        }

        var extensionValue = fhirUtils.getExtensionValue(dr.extension, constants.labResultsFhir.LAB_EXTENSION_URL_PREFIX + 'groupUid');
        if (nullchecker.isNotNullish(extensionValue)) {
            text += 'Accession: ' + extensionValue + '<br/>';
        }

        if (nullchecker.isNotNullish(dr.name) && nullchecker.isNotNullish(dr.name.text)) {
            text += 'Test: ' + dr.name.text + '<br/>';
        }

        _.each(dr.contained, function(observation) {
            if (observation.resourceType === 'Observation') {
                if (nullchecker.isNotNullish(observation.valueQuantity)) {
                    text += 'Result: ' + observation.valueQuantity.value + ' ' + observation.valueQuantity.units + '<br/>';
                    if (nullchecker.isNotNullish(observation.referenceRange) && nullchecker.isNotNullish(observation.referenceRange[0])) {
                        if (nullchecker.isNotNullish(observation.referenceRange[0].low)) {
                            text += 'Low: ' + observation.referenceRange[0].low.value + ' ' + observation.referenceRange[0].low.units + '<br/>';
                        }
                        if (nullchecker.isNotNullish(observation.referenceRange[0].high)) {
                            text += 'High: ' + observation.referenceRange[0].high.value + ' ' + observation.referenceRange[0].high.units + '<br/>';
                        }
                    }
                } else if (nullchecker.isNotNullish(observation.valueString)) {
                    text += 'Result: ' + observation.valueString + '<br/>';
                }
            }
        });

        _.each(dr.contained, function(specimen) {
            if (specimen.resourceType === 'Specimen') {
                if (nullchecker.isNotNullish(specimen.type)) {
                    text += 'Specimen: ' + specimen.type.text + '<br/>';
                }
            }
        });

        _.each(dr.contained, function(performer) {
            if (performer.resourceType === 'Organization') {
                if (nullchecker.isNotNullish(performer.name)) {
                    text += 'Performing Lab: ' + performer.name + '<br/>';
                    var perfTextLines = fhirUtils.removeDivFromText(performer.text.div).split('<br/>');
                    _.each(perfTextLines, function(l) {
                        text += '\t\t' + perfTextLines[l] + '<br/>';
                    });
                }
            }
        });

        text += '</div>';
    }

    return new fhirResource.Narrative(text);
}

module.exports.convertToFhir = convertToFhir;
