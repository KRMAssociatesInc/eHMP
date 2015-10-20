'use strict';
var _ = require('underscore');
var orderResource = require('./order-resource');
var inputValue = require('./order-resource-spec-data').data;
var fhirUtils = require('../common/utils/fhir-converter');

var statusDiagOrderMap = {
    'COMPLETE': 'completed',
    'PENDING': 'requested',
    'DISCONTINUED': 'suspended',
    'DISCONTINUED/EDIT': 'suspended',
    'ACTIVE': 'in progress',
    'EXPIRED': 'failed'
};

describe('Order FHIR Resource', function() {
    var req = {
        '_pid': '9E7A;8',
        query: {
            'subject.identifier': '9E7A;8'
        },
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http',
        param: function() {
            return '9E7A;8';
        }
    };
    var vprOrders = inputValue.data.items;
    var fhirOrders = orderResource.convertToFhir(inputValue, req);
    it('verifies that given a valid VPR Orders Resource converts to a defined FHIR Orders Resource object', function() {
        expect(fhirOrders).not.to.be.undefined();
    });
    _.each(vprOrders, function(vprO) {
        it('verifies that each VPR Order Resource has a corresponding FHIR Order Resource in the collection with the same uid', function() {
            var fhirO = _.filter(fhirOrders, function(p) {
                return p._id === vprO.uid;
            })[0];
            expect(fhirO).not.to.be.undefined();
            orderTests(fhirO, vprO, fhirOrders, vprO.pid);
        });
    });
});

function orderTests(fhirO, vprO, fhirOrders, pid, uid) {
    if (fhirO !== undefined) {
        describe('found FHIR Order corresponds to the original VPR Order Resource - uid: ' + vprO.uid, function() {
            it('verifies that the text from FHIR Order Resource contains the fields from VPR Order Resource', function() {
                expect(fhirO.text.status).to.eql('generated');
                var txt = '<div>Request for ' + vprO.kind + ' (on patient \'' + pid;
                txt += '\' @ ' + vprO.providerDisplayName + ')\r\n' + vprO.summary + '</div>';
                expect(fhirO.text.div).to.eql(txt);
            });
            it('verifies that the start date from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.when.schedule.event[0].start).to.eql(fhirUtils.convertToFhirDateTime(vprO.start));
            });
            it('verifies that the stop date from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.when.schedule.event[0].end).to.eql(fhirUtils.convertToFhirDateTime(vprO.stop));
            });
            it('verifies that the entered date from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.date).to.eql(fhirUtils.convertToFhirDateTime(vprO.entered));
            });
            it('verifies that the patient id from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.subject.reference).to.eql('Patient/' + pid);
            });
            describe('Contained Resources', function() {
                it('verifies that the provider from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                    var resProvider = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'Practitioner' && res.identifier[0].value === vprO.providerUid;
                    });
                    expect(resProvider).not.to.be.undefined();
                    if (resProvider !== undefined && vprO.providerName !== undefined || vprO.providerDisplayName !== undefined) {
                        expect(resProvider.text.status).to.eql('generated');
                        expect(fhirUtils.removeDivFromText(resProvider.text.div)).to.eql(vprO.providerDisplayName);
                        expect(resProvider.identifier[0].label).to.eql('provider-uid');
                        expect(resProvider.name.text).to.eql(vprO.providerName);
                        expect(resProvider.name.family[0]).to.eql(vprO.providerName.split(',')[0]);
                        expect(resProvider.name.given[0]).to.eql(vprO.providerName.split(',')[1]);
                    }
                    expect(resProvider._id).not.to.be.undefined();
                    expect(fhirO.source.display).to.eql(resProvider.name.text);
                    expect(fhirO.source.reference).to.eql('#' + resProvider._id);
                });
                it('verifies that the location from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                    var resLocation = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'Location' && res.identifier.value === vprO.locationUid;
                    });
                    expect(resLocation).not.to.be.undefined();
                    if (resLocation !== undefined) {
                        expect(resLocation.text.status).to.eql('generated');
                        expect(fhirUtils.removeDivFromText(resLocation.text.div)).to.eql(vprO.locationName);
                        expect(resLocation.identifier.label).to.eql('location-uid');
                        expect(resLocation.name).to.eql(vprO.locationName);
                    }
                });
                it('verifies that the facility from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                    var resLocation = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'Organization' && res.identifier[0].value === vprO.facilityCode;
                    });
                    expect(resLocation).not.to.be.undefined();
                    if (resLocation !== undefined && vprO.facilityCode !== undefined || vprO.facilityName !== undefined) {
                        expect(resLocation.text.status).to.eql('generated');
                        expect(fhirUtils.removeDivFromText(resLocation.text.div)).to.eql(vprO.facilityName);
                        expect(resLocation.identifier[0].label).to.eql('facility-code');
                        expect(resLocation.name).to.eql(vprO.facilityName);
                    }
                });
                _.each(vprO.clinicians, function(clinician) {
                    it('verifies that the practitioner from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                        var resPractitioner = _.find(fhirO.contained, function(res) {
                            return res.resourceType === 'Practitioner' && res.identifier[0].label === 'uid' && res.identifier[0].value === clinician.uid;
                        });
                        expect(resPractitioner).not.to.be.undefined();
                        if (resPractitioner !== undefined) {
                            expect(resPractitioner.resourceType).to.eql('Practitioner');
                            expect(resPractitioner.text.status).to.eql('generated');
                            expect(fhirUtils.removeDivFromText(resPractitioner.text.div)).to.eql(clinician.name);
                            expect(resPractitioner.identifier[0].label).to.eql('uid');
                            expect(resPractitioner.identifier[0].value).to.eql(clinician.uid);
                            expect(resPractitioner.name.text).to.eql(clinician.name);
                            expect(resPractitioner.name.family[0]).to.eql(clinician.name.split(',')[0]);
                            expect(resPractitioner.name.given[0]).to.eql(clinician.name.split(',')[1]);
                            /*
                            expect(resPractitioner.role.coding[0].system).to.eql('http://hl7.org/fhir/practitioner-role');
                            var rols = {
                                'doctor': 'S',
                                'nurse': 'N',
                                '': 'C'
                            };
                            expect(rols[resPractitioner.role.coding[0].code]).to.eql(clinician.role);
                            */
                        }
                    });
                });
            });
            var txt = 'Order/';
            describe('extensions', function() {
                it('verifies that the kind information from VPR Order Resource coresponds to the category code from the FHIR Order Resource', function() {
                    var kind = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#kind';
                    });
                    expect(kind.valueString).to.eql(vprO.kind);
                });
                it('verifies that the localId from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                    var localId = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#localId';
                    });
                    expect(localId.valueString).to.eql(vprO.localId);
                });
                it('verifies that the displayGroup field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                    var displayGroup = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#displayGroup';
                    });
                    expect(displayGroup.valueString).to.eql(vprO.displayGroup);
                });
                it('verifies that each result from VPR Order Resource exists in the FHIR Order Resource', function() {
                    _.each(vprO.results, function(result) {
                        var fhirResult = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#result' && ext.valueString === result.uid;
                        });
                        expect(fhirResult).not.to.be.undefined();
                    });
                });
                it('verifies that the service field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                    var service = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#service';
                    });
                    expect(service.valueString).to.eql(vprO.service);
                });
                if (vprO.predecessor !== undefined) {
                    it('verifies that the predecessor field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                        var predecessor = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#predecessor';
                        });
                        expect(predecessor.valueResource.reference).to.eql(vprO.predecessor);
                    });
                }
                if (vprO.successor !== undefined) {
                    it('verifies that the successor field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                        var successor = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#successor';
                        });
                        expect(successor.valueResource.reference).to.eql(vprO.successor);
                    });
                }
                it('verifies that each child from VPR Order Resource exists in the FHIR Order Resource', function() {
                    _.each(vprO.children, function(vprChild) {
                        var fhirChild = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#child' && ext.valueResource.reference === txt + vprChild.uid;
                        });
                        var child = _.find(fhirOrders, function(res) {
                            return txt + res._id === fhirChild.valueResource.reference;
                        });
                        expect(child).not.to.be.undefined();
                        orderTests(child, vprChild, fhirOrders, pid, vprO.uid);
                    });
                });
                if (uid !== undefined) {
                    it('verifies that the parent field from the FHIR Order Resource is defined', function() {
                        var parent = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#parent';
                        });
                        expect(parent.valueResource.reference).to.eql(txt + uid);
                    });
                }
            });
            it('verifies that the ordered item from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                var orderRef = fhirO.detail[0];
                var orderCode, order;
                if (vprO.service === 'LR' || vprO.service === 'RA') {
                    order = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'DiagnosticOrder';
                    });
                    expect(orderRef.display).to.eql(fhirUtils.removeDivFromText(order.text.div));
                    expect(orderRef.reference).to.eql('#' + order._id);
                    expect(order.orderer.display).to.eql(fhirO.source.display);
                    expect(order.orderer.reference).to.eql(fhirO.source.reference);
                    orderCode = order.item[0].code;
                } else {
                    order = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'MedicationPrescription';
                    });
                    expect(orderRef.display).to.eql(order.text.div);
                    expect(orderRef.reference).to.eql('#' + order._id);
                    expect(order.prescriber.display).to.eql(fhirO.source.display);
                    expect(order.prescriber.reference).to.eql(fhirO.source.reference);
                    orderCode = order.medication.code;
                }
                expect(order.subject.reference).to.eql(fhirO.subject.reference);
                expect(order.identifier[0].label).to.eql('uid');
                expect(order.identifier[0].value).to.eql(vprO.uid);
                expect(order.status).to.eql(statusDiagOrderMap[vprO.statusName]);
                expect(orderCode.text).to.eql(vprO.oiName);
                expect(orderCode.coding[0].system).to.eql('oi-code');
                expect(orderCode.coding[0].code).to.eql(vprO.oiCode);
                expect(orderCode.coding[0].display).to.eql(vprO.oiName);
                var oiPack = _.find(orderCode.coding[0].extension, function(ext) {
                    return ext.url === 'http://vistacore.us/fhir/extensions/order#oiPackageRef';
                });
                expect(oiPack.valueString).to.eql(vprO.oiPackageRef);
                _.each(vprO.codes, function(code) {
                    var fCode = _.find(orderCode.coding, function(c) {
                        return c.code === code.code;
                    });
                    expect(fCode).not.to.be.undefined();
                    expect(fCode.system).to.eql(code.system);
                    expect(fCode.display).to.eql(code.display);
                });
            });
        });
    }
}
