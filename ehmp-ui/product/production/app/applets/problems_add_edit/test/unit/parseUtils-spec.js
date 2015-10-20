/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['backbone', 'jasminejquery', 'app/applets/problems_add_edit/utils/parseUtils'],
    function (Backbone, Jasmine, ParseUtil) {

        describe('Parse utility function for problems pick list', function() {
            it('empty response should return empty array', function() {
                var pickList = ParseUtil.getProblemTermPickList({});
                expect(pickList).toEqual([]);
            });
        });
	});