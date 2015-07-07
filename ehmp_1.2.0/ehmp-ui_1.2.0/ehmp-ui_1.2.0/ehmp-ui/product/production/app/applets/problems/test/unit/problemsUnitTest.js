// /*jslint node: true, nomen: true, unparam: true */
// /*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

// 'use strict';

// define(["jquery", "backbone", "marionette", "jasminejquery", "testUtil", "utilParse"],
//     function($, Backbone, Marionette, jasminejquery, testUtil, Util) {

//         describe("Util suite", function() {

//             it("Test parseExposure with no Y", function() {
//                 var expoArr = [{
//                     "name": "No",
//                     "uid": "urn:va:combat-vet:N"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:agent-orange:N"
//                 }, {
//                     "name": "Unknown",
//                     "uid": "urn:va:head-neck-cancer:U"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:ionizing-radiation:N"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:sw-asia:N"
//                 }, {
//                     "name": "Unknown",
//                     "uid": "urn:va:mst:U"
//                 }];
//                 expect(Util.parseExposure(expoArr)).toBe('No exposures');

//             });

//             it("Test parseExposure with one Y", function() {
//                 var expoArr = [{
//                     "name": "No",
//                     "uid": "urn:va:combat-vet:Y"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:agent-orange:N"
//                 }, {
//                     "name": "Unknown",
//                     "uid": "urn:va:head-neck-cancer:U"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:ionizing-radiation:N"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:sw-asia:N"
//                 }, {
//                     "name": "Unknown",
//                     "uid": "urn:va:mst:U"
//                 }];
//                 expect(Util.parseExposure(expoArr)).toBe('combat-vet');

//             });

//             it("Test parseExposure with two Y", function() {
//                 var expoArr = [{
//                     "name": "No",
//                     "uid": "urn:va:combat-vet:Y"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:agent-orange:Y"
//                 }, {
//                     "name": "Unknown",
//                     "uid": "urn:va:head-neck-cancer:U"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:ionizing-radiation:N"
//                 }, {
//                     "name": "No",
//                     "uid": "urn:va:sw-asia:N"
//                 }, {
//                     "name": "Unknown",
//                     "uid": "urn:va:mst:U"
//                 }];
//                 expect(Util.parseExposure(expoArr)).toBe('combat-vet; agent-orange');

//             });

//             it("Test toTitleCase", function() {
//                 expect(Util.toTitleCase('abc')).toBe('Abc');

//                 expect(Util.toTitleCase('ABCD')).toBe('Abcd');

//                 expect(Util.toTitleCase('')).toBe('');

//                 expect(Util.toTitleCase('Abcde')).toBe('Abcde');
//             });

//         });

//         describe("Parse functions suite", function() {
//             var response = null;

//             beforeEach(function() {
//                 response = initializeResponse();
//             });


//             it("Test getStandardizedDescription ", function() {
//                 response = Util.getStandardizedDescription(response);

//                 expect(response.standardizedDescription).toBe(response.codes[0].display);
//             });

//             it("Test getStatusName where the statusName is ACTIVE", function() {
//                 spyOn(Util, 'toTitleCase').and.callThrough();

//                 response = Util.getStatusName(response);

//                 expect(Util.toTitleCase).toHaveBeenCalled();
//                 expect(response.statusName).toEqual("Active");
//             });

//             it("Test getStatusName where the statusName is INACTIVE", function() {
//                 spyOn(Util, 'toTitleCase').and.callThrough();

//                 response.statusName = "INACTIVE";
//                 response = Util.getStatusName(response);

//                 expect(Util.toTitleCase).toHaveBeenCalled();
//                 expect(response.statusName).not.toEqual("INACTIVE");
//             });

//             it("Test getServiceConnected is true", function() {
//                 response.serviceConnected = true;
//                 response = Util.getServiceConnected(response);

//                 expect(response.serviceConnectedDisp).toEqual("Yes");
//             });

//             it("Test getServiceConnected is false", function() {
//                 response = Util.getServiceConnected(response);

//                 expect(response.serviceConnectedDisp).toEqual("No");
//             });

//             it("Test getServiceConnected where service connected is undefined", function() {
//                 response.serviceConnected = undefined;
//                 response = Util.getServiceConnected(response);

//                 expect(response.serviceConnectedDisp).toBeDefined();
//             });

//             it("Test getProblemText removes the (ICD-9 ...) trailer ", function() {
//                 var originalLength = response.problemText.length;
//                 response = Util.getProblemText(response);

//                 expect(response.problemText.length).toBeLessThan(originalLength);
//                 expect(response.problemText).not.toContain("(ICD-9");
//             });

//             it("Test getICDCode removes urn prefix ", function() {
//                 response = Util.getICDCode(response);

//                 expect(response.icdCode).not.toContain("urn:icd:");
//             });

//             it("Test getAcuityName sets Title case", function() {
//                 spyOn(Util, 'toTitleCase');
//                 response = Util.getAcuityName(response);

//                 expect(Util.toTitleCase).toHaveBeenCalled();
//             });

//             it("Test getAcuityName sets the Chronic coloring ", function() {
//                 response = Util.getAcuityName(response);

//                 expect(response.chronic).toBeDefined();
//             });

//             it("Test getAcuityName sets the Moderate coloring ", function() {
//                 response.acuityName = "moderate";
//                 response = Util.getAcuityName(response);

//                 expect(response.moderate).toBeDefined();
//             });

//             it("Test getAcuityName sets Other coloring ", function() {
//                 response.acuityName = "Acute";
//                 response = Util.getAcuityName(response);

//                 expect(response.chronic).not.toBeDefined();
//                 expect(response.moderate).not.toBeDefined();
//             });

//             it("Test getFacilityColor sets DOD color ", function() {
//                 response.facilityCode = 'DOD';
//                 response = Util.getFacilityColor(response);

//                 expect(response.facilityColor).toEqual('DOD');
//             });

//             it("Test getFacilityColor sets non-DOD color ", function() {
//                 response = Util.getFacilityColor(response);

//                 expect(response.facilityColor).toEqual('nonDOD');
//             });

//             it("Test getCommentBubble when there is no comments", function() {
//                 response = Util.getCommentBubble(response);

//                 expect(response.commentBubble).not.toBeDefined();
//             });

//             it("Test getCommentBubble when there is empty comments", function() {
//                 response = Util.getCommentBubble(response);

//                 expect(response.commentBubble).not.toBeDefined();
//             });

//             it("Test getCommentBubble when there is a comment", function() {
//                 response.comments = [{
//                     comment: "@",
//                     entered: "19990708",
//                     enteredByCode: "urn:va:user:C877:11597",
//                     enteredByName: "PROVIDER,PRF",
//                     summary: "ProblemComment{uid='null'}"
//                 }];
//                 response = Util.getCommentBubble(response);

//                 expect(response.commentBubble).toBeDefined();
//             });

//         });


//         describe("Formatter functions suite", function() {
//             var response = null;
//             var Util;

//             beforeEach(function(done) {
//                 Util = null;
//                 response = initializeResponse();

//                 testUtil.reset();
//                 testUtil.stub('main/ADK', {
//                     utils: {
//                         formatDate: function(inputDate) {
//                             return 'blah';
//                         }
//                     }
//                 });
//                 testUtil.stub('app/applets/problems/utilParse', {});
//                 testUtil.loadWithCurrentStubs('util', function(loadedModule) {
//                     Util = loadedModule;
//                     done();
//                 });

//             });

//             it("Test getOnsetFormatted adds formatted date to response", function() {
//                 response = Util.getOnsetFormatted(response);
//                 expect(response.onsetFormatted).toBeDefined();

//             });

//             it("Test getUpdatedFormatted adds formatted date to response", function() {
//                 response = Util.getUpdatedFormatted(response);
//                 expect(response.updatedFormatted).toBeDefined();

//             });

//             it("Test getEnteredFormatted adds formatted date to response", function() {
//                 response = Util.getEnteredFormatted(response);
//                 expect(response.enteredFormatted).toBeDefined();

//             });


//         });

//         function initializeResponse() {
//             var response = {
//                 acuityCode: "urn:va:prob-acuity:c",
//                 acuityName: "chronic",
//                 codes: [{
//                     code: "441481004",
//                     display: "Chronic systolic heart failure (disorder)",
//                     system: "http://snomed.info/sct"
//                 }],
//                 entered: "20040309",
//                 facilityCode: "500",
//                 facilityName: "CAMP MASTER",
//                 icdCode: "urn:icd:428.22",
//                 icdGroup: "428",
//                 icdName: "CHRONIC SYSTOLIC HEART FAILURE",
//                 kind: "Problem",
//                 localId: "323",
//                 locationDisplayName: "General Medicine",
//                 locationName: "GENERAL MEDICINE",
//                 locationUid: "urn:va:location:9E7A:23",
//                 onset: "20040309",
//                 pid: "9E7A;3",
//                 problemText: "Chronic Systolic Heart failure (ICD-9-CM 428.22)",
//                 providerDisplayName: "Labtech,Special",
//                 providerName: "LABTECH,SPECIAL",
//                 providerUid: "urn:va:user:9E7A:11745",
//                 removed: false,
//                 serviceConnected: false,
//                 statusCode: "urn:sct:55561003",
//                 statusDisplayName: "Active",
//                 statusName: "ACTIVE",
//                 summary: "Chronic Systolic Heart failure (ICD-9-CM 428.22)",
//                 uid: "urn:va:problem:9E7A:3:323",
//                 unverified: false,
//                 updated: "20040309"
//             };

//             return response;
//         }

//     });
