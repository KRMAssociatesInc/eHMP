'use strict';

var _ = require('lodash');
var appFactory = require('./app-factory');
var sortWhitelistedInterceptors = appFactory._sortWhitelistedInterceptors;
var warnIfInterceptorNotFound = appFactory._warnIfInterceptorNotFound;
var addRdkSendToResponse = appFactory._addRdkSendToResponse;

describe('sortWhitelistedInterceptors', function() {
    var app;
    beforeEach(function() {
        app = {};
        app.interceptors = [
            { audit: require('../interceptors/audit/audit') },
            { metrics: require('../interceptors/metrics') },
            { authentication: require('../interceptors/authentication/authentication') },
            { pep: require('../interceptors/authorization/pep') },
            { operationalDataCheck: require('../interceptors/operational-data-check') },
            { validateAgainstApiDocs: require('../interceptors/validate-against-api-docs') },
            { synchronize: require('../interceptors/synchronize') },
            { jdsFilter: require('../interceptors/jds-filter-interceptor') },
            { convertPid: require('../interceptors/convert-pid') }
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
        expect(sortedWhitelistedInterceptors).to.eql(sortedInterceptorObjects);
    });

    it('sorts sorted interceptors', function() {
        var unsortedInterceptors = ['audit', 'pep', 'synchronize'];
        var sortedInterceptorObjects = [
            app.interceptors[0],
            app.interceptors[3],
            app.interceptors[6]
        ];
        var sortedWhitelistedInterceptors = sortWhitelistedInterceptors(app, unsortedInterceptors);
        expect(sortedWhitelistedInterceptors).to.eql(sortedInterceptorObjects);
    });
});

describe('warnIfInterceptorNotFound', function() {
    var app;
    var configItem;
    beforeEach(function() {
        app = {};
        app.logger = sinon.stub(require('bunyan').createLogger({
            name: 'app-factory-spec.js'
        }));
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
        expect(app.logger.warn.called).to.be.true();
    });

    it('does not warn if all interceptors are found', function() {
        var interceptorNames = ['one', 'two'];
        warnIfInterceptorNotFound(app, configItem, interceptorNames);
        expect(app.logger.warn.called).to.be.false();
    });
});

describe('rdkSend', function() {
    var res;
    var sentBody;
    beforeEach(function() {
        sentBody = undefined;
        res = {
            statusCode: 200,
            send: function(body) {
                sentBody = body;
                return this;
            },
            get: function() {
                return this.type;
            }
        };
        res.status = _.bind(function(code) {
                this.statusCode = code;
                return this;
            }, res);
        var app = {
            use: function(next) {
                next(null, res, function(){});
            }
        };
        addRdkSendToResponse(app);
    });

    it('wraps a string in an object with a "message" field', function() {
        res.rdkSend('Hello, world');
        expect(sentBody).to.eql({message: 'Hello, world', status: 200});
    });

    it('wraps an object in an object with a "data" field', function() {
        res.rdkSend({name: 'Bob'});
        expect(sentBody).to.eql({data: {name: 'Bob'}, status: 200});
    });

    it('doesn\'t wrap an object that already has a "data" field that\'s an object', function() {
        var data = {data: {name: 'Bob'}};
        res.rdkSend(data);
        expect(sentBody).to.eql({data: {name: 'Bob'}, status: 200});
    });

    it('wraps an object that already has a "data" field that\'s not an object', function() {
        res.rdkSend({data: 'Bob'});
        expect(sentBody).to.eql({data: {data: 'Bob'}, status: 200});
    });

    it('wraps an array in an object with a "data" field', function() {
        res.rdkSend(['one', 'two']);
        expect(sentBody).to.eql({data: ['one', 'two'], status: 200});
    });

    it('treats a string as an object when there\'s a Content-Type of application/json', function() {
        res.type = 'application/json';
        res.rdkSend('{"data": {}}');
        expect(sentBody).to.eql({data: {}, status: 200});
    });

    it('handles a JSON parse error when there\'s a Content-Type of application/json', function() {
        res.type = 'application/json';
        res.rdkSend('This is {not} JSON');
        expect(sentBody).to.eql({message: 'This is {not} JSON', status: 200});
    });

    it('handles an empty body', function() {
        res.rdkSend();
        expect(sentBody).to.eql({status: 200});
    });

    it('handles a null body', function() {
        res.rdkSend(null);
        expect(sentBody).to.eql({status: 200});
    });

    it('handles an empty body when there\'s an error', function() {
        res.status(500).rdkSend();
        expect(sentBody).to.eql({status: 500});
    });

    it('passes along an empty object body', function() {
        res.rdkSend({});
        expect(sentBody).to.eql({status: 200});
    });

    it('handles an array body', function() {
        res.rdkSend([]);
        expect(sentBody).to.eql({status: 200, data: []});
    });

    it('handles a message object', function() {
        res.rdkSend({message: 'Howdy'});
        expect(sentBody).to.eql({message: 'Howdy', status: 200});
    });

    it('doesn\'t support an error object', function() {
        res.rdkSend({error: 'Oops'});
        expect(sentBody).to.eql({data: {error: 'Oops'}, status: 200});
    });

    it('overwrites a status field with the response\'s statusCode', function() {
        res.status(500).rdkSend({message: 'Hi', status: 303});
        expect(sentBody).to.eql({message: 'Hi', status: 500});
    });

    it('overwrites a status field with a 200 statusCode by default', function() {
        res.rdkSend({message: 'Hi', status: 303});
        expect(sentBody).to.eql({message: 'Hi', status: 200});
    });
});

describe('registerInterceptors', function() {
    var app = {};
    appFactory._registerInterceptors(app);
    var interceptorOrder = _.map(app.interceptors, function(item) {
        return _.first(_.keys(item));
    });

    it('places convertPid after authentication', function() {
        var convertPidIndex = _.indexOf(interceptorOrder, 'convertPid');
        var authenticationIndex = _.indexOf(interceptorOrder, 'authentication');
        expect(convertPidIndex).to.be.gt(authenticationIndex);
    });
    it('has all the required interceptors', function() {
        expect(interceptorOrder).to.contain('fhirPid');
        expect(interceptorOrder).to.contain('audit');
        expect(interceptorOrder).to.contain('metrics');
        expect(interceptorOrder).to.contain('authentication');
        expect(interceptorOrder).to.contain('convertPid');
        expect(interceptorOrder).to.contain('pep');
        expect(interceptorOrder).to.contain('operationalDataCheck');
        expect(interceptorOrder).to.contain('validateAgainstApiDocs');
        expect(interceptorOrder).to.contain('synchronize');
        expect(interceptorOrder).to.contain('jdsFilter');
    });
    it('places authentication before pep', function() {
        var authenticationIndex = _.indexOf(interceptorOrder, 'authentication');
        var pepIndex = _.indexOf(interceptorOrder, 'pep');
        expect(authenticationIndex).to.be.lt(pepIndex);
    });
    it('places fhirPid first', function() {
        var fhirPidIndex = _.indexOf(interceptorOrder, 'fhirPid');
        expect(fhirPidIndex).to.equal(0);
    });
});

describe('processConfigItem', function() {
    it('processes a configuration item', function() {
        //function processConfigItem(configItem, resourceFamilyName, mountpoint) {
        var configItem = {
            name: 'test-config-item',
            path: '/test/config/item',
            get: function() {
            }
        };
        appFactory._processConfigItem(configItem, 'test-family', '/test/family');
        expect(configItem.title).to.equal('test-family-test-config-item');
        expect(configItem.path).to.equal('/test/family/test/config/item');
        expect(configItem.rel).to.equal('vha.read');
    });
});
