/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

// Jasmine Unit Testing Suite
define(['api/ResourceService'], function (ResourceService) {
    'use strict';

    describe('ResourceService api', function() {
        it('Contains a replaceURLRouteParams function', function() {
            expect(ResourceService.replaceURLRouteParams).toBeDefined();
        });
    });
});