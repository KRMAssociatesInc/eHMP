'use strict';

var uidUtil = require('../utils/uidUtil');

describe('getDomain', function() {
    it('returns the domain of a valid VPR UID', function() {
        expect(uidUtil.getDomain('urn:va:domain:SITE:pid:1234')).toEqual('domain');
    });

    it('throws an error for an invalid uid', function() {
        expect(function() {
          uidUtil.getDomain('urn:va:domain');
        }).toThrow();
    });
});

describe('getSiteUid', function() {
    it('returns the site uid of a valid VPR UID', function() {
        expect(uidUtil.getSiteUid('urn:va:domain:SITE:pid:1234')).toEqual('SITE');
    });

    it('throws an error for an invalid uid', function() {
        expect(function() {
          uidUtil.getDomain('urn:va:domain');
        }).toThrow();
    });
});

describe('fromSite', function() {
    it('returns true if the uid is from the siteUid', function() {
        expect(uidUtil.fromSite('urn:va:domain:SITE:pid:1234', 'SITE')).toBe(true);
    });

    it('returns false if the uid is NOT from the siteUid', function() {
        expect(uidUtil.fromSite('urn:va:domain:SITE:pid:1234', 'NOTTHISSITE')).toBe(false);
    });
});
