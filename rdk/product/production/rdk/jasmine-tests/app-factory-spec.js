'use strict';

var appFactory = require('../rdk/app-factory');
var sortWhitelistedInterceptors = appFactory._sortWhitelistedInterceptors;
var warnIfInterceptorNotFound = appFactory._warnIfInterceptorNotFound;

describe('sortWhitelistedInterceptors', function() {
    var app;
    beforeEach(function() {
        app = {};
        app.interceptors = [
            { audit: require('../interceptors/audit/audit') },
            { metrics: require('../interceptors/metrics') },
            { authentication: require('../interceptors/authentication/authentication') },
            { pep: require('../interceptors/pep') },
            { operationalDataCheck: require('../interceptors/operationalDataCheck') },
            { validateAgainstApiDocs: require('../interceptors/validateAgainstApiDocs') },
            { synchronize: require('../interceptors/synchronize') },
            { jdsFilter: require('../interceptors/jdsFilterInterceptor') },
            { convertPid: require('../interceptors/convertPid') }
        ];
    });
    it('sorts unsorted interceptors', function() {
        var unsortedInterceptors = ['pep', 'audit', 'synchronize'];
        var sortedInterceptorObjects = [
            app.interceptors[0],
            app.interceptors[3],
            app.interceptors[6]
        ];
        var sortedWhitelistedInterceptors = sortWhitelistedInterceptors(app, unsortedInterceptors);
        expect(sortedWhitelistedInterceptors).toEqual(sortedInterceptorObjects);
    });
    it('sorts sorted interceptors', function() {
        var unsortedInterceptors = ['audit', 'pep', 'synchronize'];
        var sortedInterceptorObjects = [
            app.interceptors[0],
            app.interceptors[3],
            app.interceptors[6]
        ];
        var sortedWhitelistedInterceptors = sortWhitelistedInterceptors(app, unsortedInterceptors);
        expect(sortedWhitelistedInterceptors).toEqual(sortedInterceptorObjects);
    });
});

describe('warnIfInterceptorNotFound', function() {
    var app;
    var configItem;
    beforeEach(function() {
        app = {};
        app.logger = {};
        app.logger.warn = function() {};
        spyOn(app.logger, 'warn');
        app.interceptors = [
            {one: 'one'},
            {two: 'two'}
        ];
        configItem = {};
        configItem.name = 'unit-test';
    });
    it('warns if an interceptor is not found', function() {
        var interceptorNames = ['one', 'two', 'three'];
        warnIfInterceptorNotFound(app, configItem, interceptorNames);
        expect(app.logger.warn).toHaveBeenCalled();
    });
    it('does not warn if all interceptors are found', function() {
        var interceptorNames = ['one', 'two'];
        warnIfInterceptorNotFound(app, configItem, interceptorNames);
        expect(app.logger.warn).not.toHaveBeenCalled();
    });
});
