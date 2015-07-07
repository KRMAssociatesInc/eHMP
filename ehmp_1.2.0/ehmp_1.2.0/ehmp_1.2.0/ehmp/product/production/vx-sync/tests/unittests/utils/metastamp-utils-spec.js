'use strict';

require('../../../env-setup');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var log = require(global.VX_UTILS + 'dummy-logger');

var metastamp = require(global.VX_UTILS + 'metastamp-utils');

var allergySubset = {
    'apiVersion': '1.0',
    'data': {
        'updated': 20141215144035,
        'totalItems': 32,
        'currentItemCount': 32,
        'items': [{
            'entered': '200503172015',
            'verified': '20050317201533',
            'uid': 'urn:va:allergy:9E7A:8:753',
            'pid': '9E7A;8',
            'localId': '753',
            'typeName': 'DRUG'
        }]
    }
};

var operational = {
    'apiVersion': '1.01',
    'data': {
        'updated': '20140917195624',
        'currentItemCount': 417,
        'totalItems': 417,
        'last': 425,
        'items': [{
            'localId': 334,
            'name': 'TARTRAZINE <YELLOW DYES>',
            'root': 'GMRD(120.82,"D")',
            'uid': 'urn:va:allergy-list::334'
        }]
    }
};

describe('metastamp.js', function() {
    var myTimestamp = '20131031094920.853';

    describe('metastampOperational()', function() {
        it('base operational data', function() {
            var result = metastamp.metastampOperational(operational, null, '9E7A');

            expect(result).toBeDefined();
            expect(result.stampTime).toEqual('20140917195624.000');
            expect(result.sourceMetaStamp['9E7A']).toBeTruthy();
            expect(result.sourceMetaStamp['9E7A'].stampTime).toBe('20140917195624.000');
            expect(result.icn).toBeUndefined();
        });
    });

    describe('metastampDomain()', function() {
        it('verify domain payloads from file', function() {
            var directory = path.resolve('tests/data/secondary/vpr');

            var files = _.filter(fs.readdirSync(directory), function(filename) {
                return (filename.search('metastamp') < 0);
            });

            expect(files).toBeDefined();
            expect(files.length).toBeGreaterThan(0);

            var callCount = 0;
            _.each(files, function(file) {
                var result;
                callCount++;
                var path = directory + '/' + file;
                var contents = fs.readFileSync(path);
                log.debug('have contents of ' + path);
                try {
                    contents = JSON.parse(contents);
                    log.debug('contents parsed');
                    expect(contents).not.toBeUndefined();
                    expect(contents.data).not.toBeUndefined();
                    expect(contents.data.items).not.toBeUndefined();
                    log.debug('generating metastamp');
                    result = metastamp.metastampDomain(contents, myTimestamp, null);
                } catch (e) {
                    expect(e).toBeUndefined();
                    console.log('metastamp-spec.js');
                    console.log('File ' + path + ' encountered an error');
                    console.log(e);
                }

                expect(result.icn).toBeDefined();
                expect(result.stampTime).toBe(myTimestamp);
                expect(result.sourceMetaStamp).not.toEqual({}); //more specific tests require knowledge of the file contents
            });

            expect(callCount).toBe(files.length);
        });

        it('malformed record payload', function() {
            metastamp.metastampDomain({}, myTimestamp, null);
            metastamp.metastampDomain(null, myTimestamp, null);
            metastamp.metastampDomain({
                data: {}
            }, myTimestamp, null);
            metastamp.metastampDomain(undefined, myTimestamp, null);
        });

        it('malformed timestamp', function() {
            metastamp.metastampDomain({}, 'myTimestamp', null);
        });

        it('supplied ICN', function() {
            var myICN = '123456V7789';
            var result = metastamp.metastampDomain(allergySubset, myTimestamp, myICN);
            expect(result.icn).toBe(myICN);
            expect(result.sourceMetaStamp['9E7A'].domainMetaStamp.allergy).toBeDefined();
            expect(result.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.domain).toBeDefined();
            expect(result.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.domain).toBe('allergy');
        });

        it('no callback provided', function() {
            var retValue = metastamp.metastampDomain(allergySubset);
            expect(retValue).toBeDefined();
        });
    });
});