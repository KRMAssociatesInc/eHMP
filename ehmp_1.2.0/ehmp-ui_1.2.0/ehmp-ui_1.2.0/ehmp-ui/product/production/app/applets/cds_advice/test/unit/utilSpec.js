/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, afterEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'backbone', 'marionette', 'jasminejquery', 'testUtil'],
    function ($, Backbone, Marionette, jasminejquery, testUtil) {
        var Util;

        beforeEach(function (done) {
            testUtil.loadWithCurrentStubs('app/applets/cds_advice/util', function (loadedModule) {
                Util = loadedModule;
                done();
            });
        });

        afterEach(function (done) {
            testUtil.reset();
            done();
        });

        describe('cdsAdviceUtil', function () {

            it('method getTypeText returns a string for type', function () {
                expect(Util.getTypeText('advice')).toEqual('Advice');
                expect(Util.getTypeText('proposal')).toEqual('Proposal');
                expect(Util.getTypeText('reminder')).toEqual('Reminder');
            });

            it('method getPriorityText returns a string for priority', function () {
                expect(Util.getPriorityText(100)).toEqual('Critical');
                expect(Util.getPriorityText(81)).toEqual('Critical');
                expect(Util.getPriorityText(80)).toEqual('High');
                expect(Util.getPriorityText(61)).toEqual('High');
                expect(Util.getPriorityText(60)).toEqual('Moderate');
                expect(Util.getPriorityText(41)).toEqual('Moderate');
                expect(Util.getPriorityText(40)).toEqual('Low');
                expect(Util.getPriorityText(21)).toEqual('Low');
                expect(Util.getPriorityText(20)).toEqual('Very Low');
                expect(Util.getPriorityText(1)).toEqual('Very Low');
                expect(Util.getPriorityText(0)).toEqual('None');
            });

            it('method getPriorityCSS should return a string with the CSS class for the corresponding priority', function () {
                expect(Util.getPriorityCSS(100)).toEqual('critical');
                expect(Util.getPriorityCSS(81)).toEqual('critical');
                expect(Util.getPriorityCSS(80)).toEqual('');
            });
        });
    });
