'use strict';

require('../../../env-setup');

var _ = require('underscore');
var solr = require('solr-client');
var log = require(global.VX_UTILS + '/dummy-logger');
// NOTE: be sure next line is commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'record-enrichment-allergy-xformer-spec',
//     level: 'debug'
// });

var config = require('../../../worker-config');

var solrXform = require(global.VX_UTILS + 'solr-xform');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var client = solr.createClient(config.solrClient);

client.autoCommit = true;
client.UPDATE_JSON_HANDLER = 'update';

// var data = {};
// _.each(domains, function(domain) {
//     try {
//         data[domain] = require(global.VX_ROOT + 'tests/data/secondary/vpr/' + domain).data.items;
//     } catch (e) {}
// });

var vprRecord = {
    'codes': [{
        'code': 'C0008299',
        'display': 'Chocolate',
        'system': 'urn:oid:2.16.840.1.113883.6.86'
    }],
    'drugClasses': [{
        'code': 'CHOCO100',
        'name': 'CHOCOLATE'
    }],
    'entered': '200712171515',
    'enteredByUid': 'urn:va:user:9E7A:100',
    'verifiedByUid': 'urn:va:user:9E7A:101',
    'facilityCode': '500',
    'facilityName': 'CAMP MASTER',
    'historical': true,
    'kind': 'Allergy/Adverse Reaction',
    'lastUpdateTime': '20071217151553',
    'localId': '876',
    'mechanism': 'ALLERGY',
    'originatorName': 'PROVIDER,ONE',
    'pid': '9E7A;3',
    'products': [{
        'name': 'CHOCOLATE',
        'summary': 'AllergyProduct{uid=\'\'}',
        'vuid': 'urn:va:vuid:4636681'
    }],
    'reactions': [{
        'name': 'DIARRHEA',
        'summary': 'AllergyReaction{uid=\'\'}',
        'vuid': 'urn:va:vuid:4637011'
    }],
    'reference': '3;GMRD(120.82,',
    'stampTime': '20071217151553',
    'summary': 'CHOCOLATE',
    'typeName': 'DRUG, FOOD',
    'uid': 'urn:va:allergy:9E7A:3:876',
    'verified': '20071217151553',
    'verifierName': '<auto-verified>',
    'comments': [{
        'entered': 200503172009,
        'comment': 'The allergy comment.'
    }],
    'observations': [{
        'date': 200503172009,
        'severity': 'bad'
    }],
    'severityName': 'SEVERE'

};

describe('solr-client.js', function() {
    describe('send test data to SOLR', function() {
        it('Can send one document to SOLR.', function() {
            var solrRecord = solrXform(vprRecord, log);
            expect(_.isObject(solrRecord)).toBe(true);
            if (_.isObject(solrRecord)) {
                var finished = false;
                runs(function() {
                    client.add(solrRecord, function(error, data) {
                        /**console.log(doc, error, data);/**/
                        expect(error).toBeNull();
                        expect(data).not.toBeUndefined();
                        expect(val(data, 'responseHeader')).not.toBeUndefined();
                        expect(val(data, 'responseHeader', 'status')).toBe(0);
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                });
            }
        });
    });
});