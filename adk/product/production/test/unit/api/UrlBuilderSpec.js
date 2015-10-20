/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

// Jasmine Unit Testing Suite
define(['api/UrlBuilder'], function (UrlBuilder) {
    'use strict';

    describe('Replacing URL Routing Parameters (UrlBuilder.replaceURLRouteParams)', function() {
        it('Replaces URL route parameters that follow the prescribed parameter name pattern', function() {
            var correctReplacedURL = 'http://somedomain.com:8080/somePath/value1';
            expect(UrlBuilder.replaceURLRouteParams('http://somedomain.com:8080/somePath/:param1', {param1: 'value1'})).toEqual(correctReplacedURL);
            expect(UrlBuilder.replaceURLRouteParams('http://somedomain.com:8080/somePath/:paramA', {paramA: 'value1'})).toEqual(correctReplacedURL);
            expect(UrlBuilder.replaceURLRouteParams('http://somedomain.com:8080/somePath/:param_1aA', {param_1aA: 'value1'})).toEqual(correctReplacedURL);
            expect(UrlBuilder.replaceURLRouteParams('http://somedomain.com:8080/somePath/:p_1aram', {p_1aram: 'value1'})).toEqual(correctReplacedURL);
            expect(UrlBuilder.replaceURLRouteParams('http://somedomain.com:8080/somePath/:p', {p: 'value1'})).toEqual(correctReplacedURL);
            expect(UrlBuilder.replaceURLRouteParams('http://somedomain.com:8080/somePath/:1p', {'1p': 'value1'})).toEqual('http://somedomain.com:8080/somePath/:1p');
        });
        it('Replaces URL route parameters in different parts of the URL', function() {
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/:p1/somePath', {p1:'value1'})).toEqual('http://domain.com:8080/value1/somePath');
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/somePath/:p1/someOtherPath', {p1:'value1'})).toEqual('http://domain.com:8080/somePath/value1/someOtherPath');
        });
        it('Replaces multiple URL route parameters', function() {
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/:p1/somePath/:p2', {p1:'value1', p2:'value2'})).toEqual('http://domain.com:8080/value1/somePath/value2');
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/users/:userId/:prop/:value', {userId:'12345', prop:'age', value:'65'})).toEqual('http://domain.com:8080/users/12345/age/65');
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/users/:userId/:prop/:value', {value:'65', prop:'age', userId:'12345'})).toEqual('http://domain.com:8080/users/12345/age/65');
        });
        it('Replaces missing parameters with \'undefined\'', function() {
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/:p1/somePath/:p2', {p1:'value1'})).toEqual('http://domain.com:8080/value1/somePath/undefined');
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/:p1/somePath/:p2', {p2:'value2'})).toEqual('http://domain.com:8080/undefined/somePath/value2');
        });
        it('Ignores extra parameters', function() {
            expect(UrlBuilder.replaceURLRouteParams('http://domain.com:8080/:p1/somePath', {p1:'value1', extra:'extra', another:'another'})).toEqual('http://domain.com:8080/value1/somePath');
        });
    });
});