/*jslint node: true */
'use strict';

var _ = require('underscore');
var adversereactionsResource = require('../fhir/adverseReaction/adversereactionResource');
var fhirUtils = require('../fhir/common/utils/fhirUtils');

describe('AdverseReactions FHIR Resource Collection', function() {
    var inputValue = {
        'apiVersion': '1.01',
        'data': {
            'updated': '20131204154008',
            'totalItems': 1,
            'items': [{
                'uid': 'urn:va:allergy:B362:1:107',
                'summary': 'CYCLOPHOSPHAMIDE',
                'pid': 'B362;1',
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'localId': '107',
                'entered': '199401311422',
                'verified': '19940131142332',
                'historical': false,
                'kind': 'Allergy / Adverse Reaction',
                'reference': '711;PS(50.416,',
                'products': [{
                    'summary': 'AllergyProduct{uid=\'null\'}',
                    'name': 'CYCLOPHOSPHAMIDE',
                    'vuid': 'urn:va:vuid:4018114'
                }],
                'codes': [{
                    'code': 'C0010583',
                    'system': 'urn:oid:2.16.840.1.113883.6.86',
                    'display': 'Cyclophosphamide'
                }],
                'reactions': [{
                    'summary': 'AllergyReaction{uid=\'null\'}',
                    'name': 'HIVES',
                    'vuid': 'urn:va:vuid:'
                }, {
                    'summary': 'AllergyReaction{uid=\'null\'}',
                    'name': 'ITCHING,WATERING EYES',
                    'vuid': 'urn:va:vuid:'
                }, {
                    'summary': 'AllergyReaction{uid=\'null\'}',
                    'name': 'DRY MOUTH',
                    'vuid': 'urn:va:vuid:4538597'
                }],
                'comments': [{
                    'summary': 'AllergyComment{uid=\'null\'}',
                    'entered': '19940131142240',
                    'enteredByName': 'WARDCLERK,FIFTYTHREE',
                    'enteredByDisplayName': 'Wardclerk,Fiftythree',
                    'comment': ' TESTING AN ADVERSE REACTION',
                    'enteredByUid': 'urn:va:user:B362:10958'
                }],
                'originatorName': 'WARDCLERK,FIFTYTHREE',
                'verifierName': '<auto-verified>',
                'mechanism': 'ALLERGY',
                'observations': [{
                    'summary': 'AllergyObservation{uid=\'null\'}',
                    'date': '19940131',
                    'severity': ''
                }, {
                    'summary': 'AllergyObservation{uid=\'null\'}',
                    'date': '19940207',
                    'severity': ''
                }],
                'typeName': 'DRUG'
            }]
        }
    };
    var req = {
        '_pid': '9E7A;253',
        query: {
            'subject.identifier': '9E7A;253'
        },
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http',
        param: function() {
            return '9E7A;253';
        }
    };

    var vprAdverseReactions = inputValue.data.items;

    var fhirAdverseReactions = adversereactionsResource.convertToFhir(inputValue, req);

    it('verifies that given a valid VPR AdverseReactions Resource converts to a defined FHIR AdverseReactions Resource object', function() {
        expect(fhirAdverseReactions).toBeDefined();
        //expect(fhirAdverseReactions).toBe({});
        expect(fhirAdverseReactions.entry.length).toEqual(vprAdverseReactions.length);
    });

    _.each(vprAdverseReactions, function(vprAR) {
        it('verifies that each VPR adverseReaction Resource has a coresponding FHIR AdverseReaction Resource in the collection with the same uid', function() {
            var fhirAR;
            if (fhirAdverseReactions) {
                fhirAR = _.find(fhirAdverseReactions.entry, function(ar) {
                    var uid;
                    if (ar.content && ar.content.identifier !== undefined) {
                        uid = _.find(ar.content.identifier, function(id) {
                            return id.system === 'urn:oid:2.16.840.1.113883.6.233' && id.value === vprAR.uid;
                        });

                    }
                    return uid !== undefined;
                });
                if (fhirAR) {
                    fhirAR = fhirAR.content;
                }
            }
            expect(fhirAR).toBeDefined();

            if (fhirAR !== undefined) {
                describe('found FHIR AdverseReaction coresponds to the original VPR AdverseReaction Resource', function() {

                    describe('extensions', function() {
                        it('verifies that the datetime information from VPR AdverseReactions Resource coresponds to the one from the FHIR AdverseReactions Resource', function() {
                            var extDateTime = _.find(fhirAR.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/profiles/@main#entered-datetime';
                            });

                            expect(extDateTime.valueDateTime).toEqual(fhirUtils.convertToFhirDateTime(vprAR.entered));
                        });

                        it('verifies that the ReactionNature extension exists in the FHIR AdverseReactions Resource', function() {
                            var extDateTime = _.find(fhirAR.extension, function(ext) {
                                return ext.url === 'http://vistacore.us/fhir/profiles/@main#reaction-nature';
                            });

                            expect(extDateTime.valueString).toEqual('allergy');
                        });
                    });

                    it('verifies that the summary from the VPR AdverseReaction Resource coresponds to the text in the FHIR AdverseReaction Resource', function() {
                        expect(fhirAR.text).toBeDefined();
                        expect(fhirUtils.removeDivFromText(fhirAR.text.div)).toEqual(vprAR.summary);
                    });

                    describe('Contained Resources', function() {
                        it('verifies that the Practitioner from the VPR AdverseResource exists in the contained resources from the FHIR AdverseReaction', function() {
                            var resPractitioner = _.find(fhirAR.contained, function(res) {
                                return res.resourceType === 'Practitioner' && res.name !== undefined && res.name.text === vprAR.originatorName;
                            });
                            expect(resPractitioner).toBeDefined();
                            if (resPractitioner !== undefined && vprAR.facilityName !== undefined || vprAR.facilityCode !== undefined) {
                                expect(resPractitioner.location).toBeDefined();
                                expect(resPractitioner.location.identifier).toBeDefined();
                                expect(resPractitioner.location.identifier.label).toEqual(vprAR.facilityName);
                                expect(resPractitioner.location.identifier.value).toEqual(vprAR.facilityCode);
                            }
                        });

                        it('verifies that the Patient from the VPR AdverseResource exists in the contained resources from the FHIR AdverseReaction', function() {
                            var resPatient = _.find(fhirAR.contained, function(res) {
                                return res.resourceType === 'Patient' && res.identifier !== undefined && res.identifier.label === vprAR.pid;
                            });
                            expect(resPatient).toBeDefined();
                        });

                        it('verifies that FHIR AdverseReaction Resource contains a substance resource', function() {
                            var resSubstance = _.find(fhirAR.contained, function(res) {
                                return res.resourceType === 'Substance'; // && res.type !== undefined && res.type.coding !== undefined && res.type.coding.code === prod.vuid;
                            });
                            expect(resSubstance).toBeDefined();

                            if (resSubstance !== undefined) {
                                describe('Products', function() {
                                    _.each(vprAR.products, function(prod) {
                                        it('verifies that each product from the VPR AdverseResource exists in the coding of contained substance resource from the FHIR AdverseReaction', function() {
                                            var prodVuid = _.find(resSubstance.type.coding, function(c) {
                                                return c.system === 'urn:oid:2.16.840.1.113883.6.233' && c.code === prod.vuid;
                                            });
                                            expect(prodVuid).toBeDefined();
                                            if (prodVuid !== undefined) {
                                                expect(prodVuid.display).toEqual(prod.name);
                                            }
                                        });
                                        it('verifies that contained substance.type.text from FHIR AdverseReaction Resource coresponds to the product name from VPR AdverseReaction Resource', function() {
                                            expect(resSubstance.type.text).toEqual(prod.name);
                                        });
                                        it('verifies that contained substance.text.div from FHIR AdverseReaction Resource coresponds to the summary from VPR AdverseReaction Resource', function() {
                                            expect(fhirUtils.removeDivFromText(resSubstance.text.div)).toEqual(vprAR.summary);
                                        });
                                    });
                                });

                                describe('Codes', function() {
                                    _.each(vprAR.codes, function(code) {
                                        it('verifies that each code from the VPR AdverseResource exists in the coding of contained substance resource from the FHIR AdverseReaction', function() {
                                            var cc = _.find(resSubstance.type.coding, function(c) {
                                                return c.system === code.system && c.code === code.code;
                                            });
                                            expect(cc).toBeDefined();
                                            if (cc !== undefined) {
                                                expect(cc.display).toEqual(code.display);
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    });

                    describe('Symptoms', function() {
                        _.each(vprAR.reactions, function(r) {
                            var fhirSymptom = _.find(fhirAR.symptom, function(s) {
                                return s.code.coding.system === 'urn:oid:2.16.840.1.113883.6.233' && s.code.coding.code === r.vuid && s.code.coding.display === r.name;
                            });
                            it('verifies that each reaction from the VPR AdverseReaction Resource has a corespondent in the symptoms from the FHIR AdverseReaction Resource', function() {
                                expect(fhirSymptom).toBeDefined();
                            });

                            // if(fhirSymptom !== undefined) {
                            //     it('verifies that the reaction name coresponds to the observation display from the FHIR format', function() {
                            //         expect(fhirSymptom.code.coding.display).toEqual(r.name);
                            //     })
                            // }

                            if (fhirSymptom !== undefined && vprAR.observations !== undefined && vprAR.observations.length > 0) {
                                it('verifies that the severity from the first observation in VPR AdverseReaction Resource is saved in the FHIR AdverseReaction Resource', function() {
                                    expect(fhirSymptom.severity).toEqual(vprAR.observations[0].severity);
                                });
                            }
                        });
                    });

                    it('verifies that the recorder reference coresponds to the contained practioner resource from the FHIR AdverseReaction Resource', function() {
                        expect(fhirAR.contained).toBeDefined();
                        var resPractitioner = _.find(fhirAR.contained, function(res) {
                            return res.resourceType === 'Practitioner' && res.id === fhirAR.recorder.reference;
                        });
                        expect(resPractitioner).toBeDefined();
                    });

                    if (vprAR.observations !== undefined && vprAR.observations.length > 0) {
                        it('verifies that the date from the first observation of VPR AdverseReaction Resource coresponds to the date from the FHIR AdverseReaction Resource', function() {
                            expect(fhirAR.date).toEqual(fhirUtils.convertToFhirDateTime(vprAR.observations[0].date));
                        });
                    }

                    if (fhirAR.exposure !== undefined && fhirAR.exposure.substance !== undefined) {
                        it('verifies that the exposure substance reference coresponds to the contained substance resource from the FHIR AdverseReaction Resource', function() {
                            expect(fhirAR.contained).toBeDefined();
                            var resSubstance = _.find(fhirAR.contained, function(res) {
                                return res.resourceType === 'Substance' && res.id === fhirAR.exposure.substance.reference;
                            });
                            expect(resSubstance).toBeDefined();
                        });
                    }
                });
            }
        });
    });

});
