// /*jslint node: true, nomen: true, unparam: true */
// /*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

// 'use strict';

// define(["jquery", "backbone", "marionette", "jasminejquery", "moment", "appletHelper"],
//     function($, Backbone, Marionette, jasminejquery, moment, appletHelper) {
//         var testDocData = {
//             'kind': '',
//             'referenceDateTime': '',
//             'text': [{
//                 // 'dateTime': null,
//                 'content': null
//             }]
//         };

//         beforeEach(function() {
//             testDocData.kind = '';
//             testDocData.referenceDateTime = '';
//             testDocData.text.dateTime = null;
//             testDocData.text.content = null;
//             if(testDocData.text.length > 1){
//                 for(var i=1; i<testDocData.text.length; i++){
//                     testDocData.text.pop();
//                 }
//             }
//         });

//         //Test for .hasAddenda()
//         describe("Determine if the document has multiple addenda", function() {
//             it("Should return 'true' if the text[] array has a length greater than 1", function() {
//                 testDocData.text[0].content = "Content 1";
//                 // testDocData.text[1].content = "Content 2";
//                 testDocData.text.push([{'dateTime':null, 'content':null}]);
//                 expect(appletHelper.hasAddenda(testDocData)).toBe(true);
//             });

//             it("Should return 'false' if the text[] array has a length equal to 1", function() {
//                 testDocData.text.length = 1;
//                 expect(appletHelper.hasAddenda(testDocData)).toBe(false);
//             });

//             it("Should return false for .formatAddenda() if the document is a Progress Note but hasAddenda is false", function(){
//                 testDocData.text.length = 1;
//                 testDocData.kind = "Progress Note";
//                 expect(appletHelper.formatAddenda(testDocData)).toBe(false);
//             });
//         });

//         //Test for .formatAddenda()
//         describe("Create a new text array for text addenda", function(){
//             it("Should return false if the document is not a Progress Note", function(){
//                 testDocData.kind = "Crisis Note";
//                 expect(appletHelper.formatAddenda(testDocData)).toBe(false);
//             });

//             it('Should return an array of text[] items if the doc is a Progress Note and has addenda', function(){
//                 testDocData.kind = 'Progress Note';
//                 testDocData.text[0].content = "Content 1";
//                 testDocData.text[0].dateTime = "200001261607";
//                 var tempArray = [{'dateTime':'200001261602', 'content':'Content 2'}];
//                 testDocData.text.push(tempArray);
//                 var retArray = appletHelper.formatAddenda(testDocData);
//                 expect(retArray[0]).toBe(tempArray);

//             });
//         });

//         //Test for .formatDateTime()
//         describe('Take in an unformatted date field and output as a date or date and time', function(){
//             it('Should return a formatted date and time if the display parameter is "datetime"', function(){
//                 testDocData.referenceDateTime = "200001261607";
//                 expect(appletHelper.formatDateTime(testDocData.referenceDateTime, 'YYYYMMDDHHmmssSSS', 'datetime')).toBe('2000-01-26 -- 07:00');
//             });

//             it('Should return a formatted date if the display parameter is "date"', function(){
//                 testDocData.referenceDateTime = "200001261607";
//                 expect(appletHelper.formatDateTime(testDocData.referenceDateTime, 'YYYYMMDDHHmmssSSS', 'date')).toBe('2000-01-26');
//             });
//         });

//         //Tests that test for 'undefined'
//         describe('Case handling for undefined', function(){
//             it("Should return 'false' for .hasAddenda() if the text[] array is undefined", function() {
//                 testDocData.text = undefined;
//                 expect(appletHelper.hasAddenda(testDocData)).toBe(false);
//             });
//         });

//     });
