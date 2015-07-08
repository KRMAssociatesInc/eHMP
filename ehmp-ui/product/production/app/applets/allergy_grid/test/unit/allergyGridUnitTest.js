/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn, afterEach */

'use strict';

var dependencies = [
    'jquery',
    'backbone',
    'marionette',
    'jasminejquery',
    'app/applets/allergy_grid/utilParse'
];

// Jasmine Unit Testing Suite
define(dependencies,
    function($, Backbone, Marionette, jasminejquery, Util) {

        describe("Test parse functions suite", function() {
            var response = null;

            beforeEach(function() {
                response = {
                    facilityCode: "500",
                    facilityName: "CAMP BEE",
                    entered: "201312051608",
                    kind: "Allergy/Adverse Reaction",
                    originatorName: "LORD,BRIAN",
                    mechanism: "ALLERGY",
                    uid: "urn:va:allergy:C877:100022:967",
                    summary: "PENICILLIN",
                    pid: "C877;100022",
                    localId: "967",
                    historical: false,
                    reference: "125;GMRD(120.82,",
                    products: [{
                        name: "PENICILLIN",
                        vuid: "urn:va:vuid:",
                        summary: "AllergyProduct{uid='null'}"
                    }],
                    reactions: [{
                        name: "ANOREXIA",
                        vuid: "urn:va:vuid:4637051",
                        summary: "AllergyReaction{uid='null'}"
                    }, {
                        name: "DRY MOUTH",
                        vuid: "urn:va:vuid:4538597",
                        summary: "AllergyReaction{uid='null'}"
                    }],
                    drugClasses: [{
                        code: "AM114",
                        name: "(INACTIVE) PENICILLINS",
                        summary: "AllergyDrugClass{uid='null'}"
                    }],
                    observations: [{
                        date: "20131219",
                        severity: "MODERATE",
                        summary: "AllergyObservation{uid='null'}"
                    }],
                    typeName: "DRUG"
                };
            });

            afterEach(function() {
                response = null;
            });

            it("Test getAcuityName sets the Severe coloring ", function() {
                response.acuityName = "severe";
                response = Util.getAcuityName(response);

                expect(response.severe).toBeDefined();

            });

            it("Test getAcuityName sets the Moderate coloring ", function() {
                response.acuityName = "moderate";
                response = Util.getAcuityName(response);

                expect(response.moderate).toBeDefined();

            });

            it("Test getAcuityName sets Mild coloring ", function() {
                response.acuityName = "mild";
                response = Util.getAcuityName(response);

                expect(response.chronic).not.toBeDefined();
                expect(response.moderate).not.toBeDefined();
                expect(response.mild).toBeDefined();

            });

            it("Test getFacilityColor sets DOD color ", function() {
                response.facilityCode = 'DOD';
                response = Util.getFacilityColor(response);

                expect(response.facilityColor).toEqual('DOD');
            });

            it("Test getFacilityColor sets non-DOD color ", function() {
                response = Util.getFacilityColor(response);

                expect(response.facilityColor).toEqual('nonDOD');
            });

            it("Test getReactions for two reactions ", function() {
                response = Util.getReactions(response);

                expect(response.reaction).toEqual('ANOREXIA; DRY MOUTH');
            });

            it("Test getReactions for one reactions ", function() {
                response.reactions = [{
                    name: "ANOREXIA",
                    vuid: "urn:va:vuid:4637051",
                    summary: "AllergyReaction{uid='null'}"
                }];
                response = Util.getReactions(response);

                expect(response.reaction).toEqual('ANOREXIA');
            });

            it("Test getReactions for no reaction", function() {
                response.reactions = null;
                delete response.reactions;
                response = Util.getReactions(response);

                expect(response.reaction).toEqual('');
            });

            it("Test getDrugClasses with zero drug class name", function() {
                delete response.drugClasses;
                response = Util.getDrugClasses(response);
                expect(response.drugClassesNames).toEqual('');
            });

            it("Test getDrugClasses with one drug class name", function() {
                response = Util.getDrugClasses(response);
                expect(response.drugClassesNames).toEqual('(INACTIVE) PENICILLINS');
            });

            it("Test getDrugClasses with two drug class names", function() {
                response.drugClasses = [{
                    "summary": "AllergyDrugClass{uid='null'}",
                    "code": "AM110",
                    "name": "PENICILLIN-G RELATED PENICILLINS"
                }, {
                    code: "AM114",
                    name: "(INACTIVE) PENICILLINS",
                    summary: "AllergyDrugClass{uid='null'}"
                }];
                response = Util.getDrugClasses(response);
                expect(response.drugClassesNames).toEqual('PENICILLIN-G RELATED PENICILLINS, (INACTIVE) PENICILLINS');
            });

            /*it("Test getComments with zero comment", function() {
                response = Util.getComments(response);
                expect(response.comments).toEqual('');
            });

            it("Test getComments with one comment", function() {
                response.comments = [{
                    "comment": "Vomiting",
                    "summary": "AllergyComment{uid='null'}"
                }];
                response = Util.getComments(response);
                expect(response.comments).toEqual('Vomiting');
            });

            it("Test getComments with two comments", function() {
                response.comments = [{
                    "comment": "Vomiting",
                    "summary": "AllergyComment{uid='null'}"
                }, {
                    "comment": "Rash",
                    "summary": "AllergyComment{uid='null'}"
                }];
                response = Util.getComments(response);
                expect(response.comments).toEqual('Vomiting, Rash');
            });*/

            it("Test getStandardizedName ", function() {
                response.codes = [{
                    code: "C0008299",
                    system: "urn:oid:2.16.840.1.113883.6.86",
                    display: "Chocolate"
                }];
                response = Util.getStandardizedName(response);

                expect(response.standardizedName).toBe('Chocolate');
            });


            it("Test getStandardizedName when null ", function() {
                response.codes = null;
                delete response.codes;
                response = Util.getStandardizedName(response);

                expect(response.standardizedName).toBe('');
            });

            it("Test getStandardizedName when not exists ", function() {
                response.codes = [{
                    code: "24",
                    system: "somethingElse",
                    display: "Chocolate"
                }];
                response = Util.getStandardizedName(response);

                expect(response.standardizedName).toBe('');
            });
            
            it("Test getCommentBubble when there is a comment", function() {
                response.comments = 'This is a test comment';
                response = Util.getCommentBubble(response);

                expect(response.commentBubble).toBeDefined();
            });

        });


    });
