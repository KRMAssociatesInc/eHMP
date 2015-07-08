'use strict';
var _ = require('underscore');
var orderResource = require('../fhir/order/orderResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

var statusDiagOrderMap = {
    'COMPLETE': 'completed',
    'PENDING': 'requested',
    'DISCONTINUED': 'suspended',
    'DISCONTINUED/EDIT': 'suspended',
    'ACTIVE': 'in progress',
    'EXPIRED': 'failed'
};

describe('Order FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20141014055011,
            'totalItems': 2,
            'currentItemCount': 2,
            'items': [{
                'facilityCode': '500',
                'facilityName': 'CAMP BEE',
                'name': 'HDL',
                'oiName': 'HDL',
                'oiPackageRef': '244;99LRT',
                'content': 'HDL BLOOD SERUM WC LB #17333\r\n',
                'start': '200912011000',
                'displayGroup': 'CH',
                'statusName': 'COMPLETE',
                'providerDisplayName': 'Labtech,Seventeen',
                'service': 'LR',
                'kind': 'Laboratory',
                'uid': 'urn:va:order:C877:8:32989',
                'summary': 'HDL BLOOD SERUM WC LB #17333\r\n',
                'pid': '9E7A;8',
                'localId': '32989',
                'locationName': 'GENERAL MEDICINE',
                'oiCode': 'urn:va:oi:357',
                'entered': '20100323125437',
                'stop': '201003231254',
                'statusCode': 'urn:va:order-status:comp',
                'statusVuid': 'urn:va:vuid:4501088',
                'providerUid': 'urn:va:user:C877:20364',
                'providerName': 'LABTECH,SEVENTEEN',
                'locationUid': 'urn:va:location:C877:23',
                'clinicians': [{
                    'name': 'LABTECH,SEVENTEEN',
                    'role': 'S',
                    'signedDateTime': 199912291525,
                    'uid': 'urn:va:user:C877:20364'
                }],
                'results': [{
                    'uid': 'urn:va:lab:C877:8:CH;6908797.899993;80'
                }, {
                    'uid': 'urn:va:lab:C877:8:CH;6908797.899993;81'
                }]
            }, {
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'name': 'CBC & DIFF (WITH MORPHOLOGY)',
                'oiName': 'CBC & DIFF (WITH MORPHOLOGY)',
                'oiPackageRef': '276;99LRT',
                'content': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD LC Q6H\r\n',
                'start': '199912291600',
                'displayGroup': 'LAB',
                'statusName': 'DISCONTINUED',
                'providerDisplayName': 'Provider,Twohundredninetyseven',
                'service': 'LR',
                'children': [{
                    'facilityCode': '998',
                    'facilityName': 'ABILENE (CAA)',
                    'name': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiName': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiPackageRef': '276;99LRT',
                    'content': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1333\r\n<Discharge>\r\n',
                    'start': '199912291800',
                    'displayGroup': 'LAB',
                    'statusName': 'DISCONTINUED',
                    'providerDisplayName': 'Provider,Twohundredninetyseven',
                    'service': 'LR',
                    'kind': 'Laboratory',
                    'uid': 'urn:va:order:9E7A:8:11515',
                    'summary': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1333\r\n<Discharge>\r\n',
                    'localId': '11515',
                    'locationName': '5 WEST PSYCH',
                    'oiCode': 'urn:va:oi:384',
                    'entered': '199912291525',
                    'stop': '200203141653',
                    'statusCode': 'urn:va:order-status:dc',
                    'statusVuid': 'urn:va:vuid:4500704',
                    'providerUid': 'urn:va:user:9E7A:11712',
                    'providerName': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                    'locationUid': 'urn:va:location:9E7A:66'
                }, {
                    'facilityCode': '998',
                    'facilityName': 'ABILENE (CAA)',
                    'name': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiName': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiPackageRef': '276;99LRT',
                    'content': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1336\r\n<Discharge>\r\n',
                    'start': '199912292359',
                    'displayGroup': 'LAB',
                    'statusName': 'DISCONTINUED',
                    'providerDisplayName': 'Provider,Twohundredninetyseven',
                    'service': 'LR',
                    'kind': 'Laboratory',
                    'uid': 'urn:va:order:9E7A:8:11516',
                    'summary': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1336\r\n<Discharge>\r\n',
                    'localId': '11516',
                    'locationName': '5 WEST PSYCH',
                    'oiCode': 'urn:va:oi:384',
                    'entered': '199912291525',
                    'stop': '200203141653',
                    'statusCode': 'urn:va:order-status:dc',
                    'statusVuid': 'urn:va:vuid:4500704',
                    'providerUid': 'urn:va:user:9E7A:11712',
                    'providerName': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                    'locationUid': 'urn:va:location:9E7A:66'
                }, {
                    'facilityCode': '998',
                    'facilityName': 'ABILENE (CAA)',
                    'name': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiName': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiPackageRef': '276;99LRT',
                    'content': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1339\r\n<Discharge>\r\n',
                    'start': '199912300600',
                    'displayGroup': 'LAB',
                    'statusName': 'DISCONTINUED',
                    'providerDisplayName': 'Provider,Twohundredninetyseven',
                    'service': 'LR',
                    'kind': 'Laboratory',
                    'uid': 'urn:va:order:9E7A:8:11517',
                    'summary': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1339\r\n<Discharge>\r\n',
                    'localId': '11517',
                    'locationName': '5 WEST PSYCH',
                    'oiCode': 'urn:va:oi:384',
                    'entered': '199912291525',
                    'stop': '200203141653',
                    'statusCode': 'urn:va:order-status:dc',
                    'statusVuid': 'urn:va:vuid:4500704',
                    'providerUid': 'urn:va:user:9E7A:11712',
                    'providerName': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                    'locationUid': 'urn:va:location:9E7A:66'
                }, {
                    'facilityCode': '998',
                    'facilityName': 'ABILENE (CAA)',
                    'name': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiName': 'CBC & DIFF (WITH MORPHOLOGY)',
                    'oiPackageRef': '276;99LRT',
                    'content': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1342\r\n<Discharge>\r\n',
                    'start': '199912301200',
                    'displayGroup': 'LAB',
                    'statusName': 'DISCONTINUED',
                    'providerDisplayName': 'Provider,Twohundredninetyseven',
                    'service': 'LR',
                    'kind': 'Laboratory',
                    'uid': 'urn:va:order:9E7A:8:11518',
                    'summary': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD WC LB #1342\r\n<Discharge>\r\n',
                    'localId': '11518',
                    'locationName': '5 WEST PSYCH',
                    'oiCode': 'urn:va:oi:384',
                    'entered': '199912291525',
                    'stop': '200203141653',
                    'statusCode': 'urn:va:order-status:dc',
                    'statusVuid': 'urn:va:vuid:4500704',
                    'providerUid': 'urn:va:user:9E7A:11712',
                    'providerName': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                    'locationUid': 'urn:va:location:9E7A:66'
                }],
                'kind': 'Laboratory',
                'uid': 'urn:va:order:9E7A:8:11514',
                'summary': 'CBC & DIFF (WITH MORPHOLOGY) BLOOD LC Q6H\r\n',
                'pid': '9E7A;8',
                'localId': '11514',
                'locationName': '5 WEST PSYCH',
                'oiCode': 'urn:va:oi:384',
                'entered': '199912291525',
                'stop': '200203141653',
                'statusCode': 'urn:va:order-status:dc',
                'statusVuid': 'urn:va:vuid:4500704',
                'providerUid': 'urn:va:user:9E7A:11712',
                'providerName': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                'locationUid': 'urn:va:location:9E7A:66',
                'clinicians': [{
                    'name': 'PROVIDER,TWOHUNDREDNINETYSEVEN',
                    'role': 'S',
                    'signedDateTime': 199912291525,
                    'uid': 'urn:va:user:9E7A:11712'
                }]
            }]
        }
    };
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
        expect(fhirOrders).toBeDefined();
    });
    _.each(vprOrders, function(vprO) {
        it('verifies that each VPR Order Resource has a coresponding FHIR Order Resource in the collection with the same uid', function() {
            var fhirO = _.filter(fhirOrders, function(p) {
                return p._id === vprO.uid;
            })[0];
            expect(fhirO).toBeDefined();
            orderTests(fhirO, vprO, fhirOrders, vprO.pid);
        });
    });
});

function orderTests(fhirO, vprO, fhirOrders, pid, uid) {
    if (fhirO !== undefined) {
        describe('found FHIR Order coresponds to the original VPR Order Resource - uid: ' + vprO.uid, function() {
            it('verifies that the text from FHIR Order Resource contains the fields from VPR Order Resource', function() {
                expect(fhirO.text.status).toEqual('generated');
                var txt = '<div>Request for ' + vprO.kind + ' (on patient \'' + pid;
                txt += '\' @ ' + vprO.providerDisplayName + ')\r\n' + vprO.summary + '</div>';
                expect(fhirO.text.div).toEqual(txt);
            });
            it('verifies that the start date from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.when.schedule.event[0].start).toEqual(fhirUtils.convertToFhirDateTime(vprO.start));
            });
            it('verifies that the stop date from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.when.schedule.event[0].end).toEqual(fhirUtils.convertToFhirDateTime(vprO.stop));
            });
            it('verifies that the entered date from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.date).toEqual(fhirUtils.convertToFhirDateTime(vprO.entered));
            });
            it('verifies that the patient id from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                expect(fhirO.subject.reference).toEqual('Patient/' + pid);
            });
            describe('Contained Resources', function() {
                it('verifies that the provider from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                    var resProvider = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'Practitioner' && res.identifier[0].value === vprO.providerUid;
                    });
                    expect(resProvider).toBeDefined();
                    if (resProvider !== undefined && vprO.providerName !== undefined || vprO.providerDisplayName !== undefined) {
                        expect(resProvider.text.status).toEqual('generated');
                        expect(fhirUtils.removeDivFromText(resProvider.text.div)).toEqual(vprO.providerDisplayName);
                        expect(resProvider.identifier[0].label).toEqual('provider-uid');
                        expect(resProvider.name.text).toEqual(vprO.providerName);
                        expect(resProvider.name.family[0]).toEqual(vprO.providerName.split(',')[0]);
                        expect(resProvider.name.given[0]).toEqual(vprO.providerName.split(',')[1]);
                    }
                    expect(resProvider._id).toBeDefined();
                    expect(fhirO.source.display).toEqual(resProvider.name.text);
                    expect(fhirO.source.reference).toEqual('#' + resProvider._id);
                });
                it('verifies that the location from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                    var resLocation = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'Location' && res.identifier.value === vprO.locationUid;
                    });
                    expect(resLocation).toBeDefined();
                    if (resLocation !== undefined) {
                        expect(resLocation.text.status).toEqual('generated');
                        expect(fhirUtils.removeDivFromText(resLocation.text.div)).toEqual(vprO.locationName);
                        expect(resLocation.identifier.label).toEqual('location-uid');
                        expect(resLocation.name).toEqual(vprO.locationName);
                    }
                });
                it('verifies that the facility from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                    var resLocation = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'Organization' && res.identifier[0].value === vprO.facilityCode;
                    });
                    expect(resLocation).toBeDefined();
                    if (resLocation !== undefined && vprO.facilityCode !== undefined || vprO.facilityName !== undefined) {
                        expect(resLocation.text.status).toEqual('generated');
                        expect(fhirUtils.removeDivFromText(resLocation.text.div)).toEqual(vprO.facilityName);
                        expect(resLocation.identifier[0].label).toEqual('facility-code');
                        expect(resLocation.name).toEqual(vprO.facilityName);
                    }
                });
                _.each(vprO.clinicians, function(clinician) {
                    it('verifies that the practitioner from the VPR Order Resource exists in the contained resources from the FHIR Order', function() {
                        var resPractitioner = _.find(fhirO.contained, function(res) {
                            return res.resourceType === 'Practitioner' && res.identifier[0].label === 'uid' && res.identifier[0].value === clinician.uid;
                        });
                        expect(resPractitioner).toBeDefined();
                        if (resPractitioner !== undefined) {
                            expect(resPractitioner.resourceType).toEqual('Practitioner');
                            expect(resPractitioner.text.status).toEqual('generated');
                            expect(fhirUtils.removeDivFromText(resPractitioner.text.div)).toEqual(clinician.name);
                            expect(resPractitioner.identifier[0].label).toEqual('uid');
                            expect(resPractitioner.identifier[0].value).toEqual(clinician.uid);
                            expect(resPractitioner.name.text).toEqual(clinician.name);
                            expect(resPractitioner.name.family[0]).toEqual(clinician.name.split(',')[0]);
                            expect(resPractitioner.name.given[0]).toEqual(clinician.name.split(',')[1]);
                            /*
                            expect(resPractitioner.role.coding[0].system).toEqual('http://hl7.org/fhir/practitioner-role');
                            var rols = {
                                'doctor': 'S',
                                'nurse': 'N',
                                '': 'C'
                            };
                            expect(rols[resPractitioner.role.coding[0].code]).toEqual(clinician.role);
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
                    expect(kind.valueString).toEqual(vprO.kind);
                });
                it('verifies that the localId from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                    var localId = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#localId';
                    });
                    expect(localId.valueString).toEqual(vprO.localId);
                });
                it('verifies that the displayGroup field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                    var displayGroup = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#displayGroup';
                    });
                    expect(displayGroup.valueString).toEqual(vprO.displayGroup);
                });
                it('verifies that each result from VPR Order Resource exists in the FHIR Order Resource', function() {
                    _.each(vprO.results, function(result) {
                        var fhirResult = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#result' && ext.valueString === result.uid;
                        });
                        expect(fhirResult).toBeDefined();
                    });
                });
                it('verifies that the service field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                    var service = _.find(fhirO.extension, function(ext) {
                        return ext.url === 'http://vistacore.us/fhir/extensions/order#service';
                    });
                    expect(service.valueString).toEqual(vprO.service);
                });
                if (vprO.predecessor !== undefined) {
                    it('verifies that the predecessor field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                        var predecessor = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#predecessor';
                        });
                        expect(predecessor.valueResource.reference).toEqual(vprO.predecessor);
                    });
                }
                if (vprO.successor !== undefined) {
                    it('verifies that the successor field from VPR Order Resource coresponds to the one from the FHIR Order Resource', function() {
                        var successor = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#successor';
                        });
                        expect(successor.valueResource.reference).toEqual(vprO.successor);
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
                        expect(child).toBeDefined();
                        orderTests(child, vprChild, fhirOrders, pid, vprO.uid);
                    });
                });
                if (uid !== undefined) {
                    it('verifies that the parent field from the FHIR Order Resource is defined', function() {
                        var parent = _.find(fhirO.extension, function(ext) {
                            return ext.url === 'http://vistacore.us/fhir/extensions/order#parent';
                        });
                        expect(parent.valueResource.reference).toEqual(txt + uid);
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
                    expect(orderRef.display).toEqual(fhirUtils.removeDivFromText(order.text.div));
                    expect(orderRef.reference).toEqual('#' + order._id);
                    expect(order.orderer.display).toEqual(fhirO.source.display);
                    expect(order.orderer.reference).toEqual(fhirO.source.reference);
                    orderCode = order.item[0].code;
                } else {
                    order = _.find(fhirO.contained, function(res) {
                        return res.resourceType === 'MedicationPrescription';
                    });
                    expect(orderRef.display).toEqual(order.text.div);
                    expect(orderRef.reference).toEqual('#' + order._id);
                    expect(order.prescriber.display).toEqual(fhirO.source.display);
                    expect(order.prescriber.reference).toEqual(fhirO.source.reference);
                    orderCode = order.medication.code;
                }
                expect(order.subject.reference).toEqual(fhirO.subject.reference);
                expect(order.identifier[0].label).toEqual('uid');
                expect(order.identifier[0].value).toEqual(vprO.uid);
                expect(order.status).toEqual(statusDiagOrderMap[vprO.statusName]);
                expect(orderCode.text).toEqual(vprO.oiName);
                expect(orderCode.coding[0].system).toEqual('oi-code');
                expect(orderCode.coding[0].code).toEqual(vprO.oiCode);
                expect(orderCode.coding[0].display).toEqual(vprO.oiName);
                var oiPack = _.find(orderCode.coding[0].extension, function(ext) {
                    return ext.url === 'http://vistacore.us/fhir/extensions/order#oiPackageRef';
                });
                expect(oiPack.valueString).toEqual(vprO.oiPackageRef);
                _.each(vprO.codes, function(code) {
                    var fCode = _.find(orderCode.coding, function(c) {
                        return c.code === code.code;
                    });
                    expect(fCode).toBeDefined();
                    expect(fCode.system).toEqual(code.system);
                    expect(fCode.display).toEqual(code.display);
                });
            });
        });
    }
}
