'use strict';

require('../../../env-setup');

var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var jobUtil = require(global.VX_UTILS + 'job-utils');

describe('patient-identifier.js', function() {
    describe('create()', function() {
        it('verify correct structure', function() {
            var id = idUtil.create('icn', '10110V004877');
            expect(id).toEqual({
                type: 'icn',
                value: '10110V004877'
            });
        });
    });

    describe('extractIdsOfTypes()', function() {
        var pIds = [{
            type: 'icn',
            value: '10110V004877'
        }, {
            type: 'pid',
            value: '9E7A;8'
        }, {
            type: 'pid',
            value: 'C877;8'
        }, {
            type: 'hdr',
            value: 'HDR:10110V004877'
        }];

        it('verify icn match', function() {
            var icns = idUtil.extractIdsOfTypes(pIds, 'icn');
            expect(icns).toEqual([{
                type: 'icn',
                value: '10110V004877'
            }]);
        });
        it('verify pid match', function() {
            var pids = idUtil.extractIdsOfTypes(pIds, 'pid');
            expect(pids).toEqual([{
                type: 'pid',
                value: '9E7A;8'
            }, {
                type: 'pid',
                value: 'C877;8'
            }]);
        });

        it('verify undefined and null type', function() {
            var pids = idUtil.extractIdsOfTypes(pIds);
            expect(pids).toEqual([]);
            idUtil.extractIdsOfTypes(pIds, null);
            expect(pids).toEqual([]);
        });

        it('verify not present type', function() {
            var pids = idUtil.extractIdsOfTypes(pIds, 'edipi');
            expect(pids).toEqual([]);
        });

        it('verify multiple present types', function() {
            var pids = idUtil.extractIdsOfTypes(pIds, ['icn', 'hdr']);
            expect(pids).toEqual([{
                type: 'icn',
                value: '10110V004877'
            }, {
                type: 'hdr',
                value: 'HDR:10110V004877'
            }]);
        });

        it('verify undefined and null patientIdentifiers', function() {
            expect(idUtil.extractIdsOfTypes(undefined, 'icn')).toEqual([]);
            expect(idUtil.extractIdsOfTypes(null, 'icn')).toEqual([]);
            expect(idUtil.extractIdsOfTypes([], 'icn')).toEqual([]);
            expect(idUtil.extractIdsOfTypes('', 'icn')).toEqual([]);
        });
    });

    describe('hasIdsOfTypes()', function() {
        var pIds = [{
            type: 'icn',
            value: '10110V004877'
        }, {
            type: 'pid',
            value: '9E7A;8'
        }, {
            type: 'pid',
            value: 'C877;8'
        }, {
            type: 'hdr',
            value: 'HDR:10110V004877'
        }];

        it('verify icn match', function() {
            var icns = idUtil.hasIdsOfTypes(pIds, 'icn');
            expect(icns).toBe(true);
        });

        it('verify pid match', function() {
            var pids = idUtil.hasIdsOfTypes(pIds, 'pid');
            expect(pids).toBe(true);
        });

        it('verify undefined and null type', function() {
            var pids = idUtil.hasIdsOfTypes(pIds);
            expect(pids).toBe(false);
            idUtil.hasIdsOfTypes(pIds, null);
            expect(pids).toBe(false);
        });

        it('verify not present type', function() {
            var pids = idUtil.hasIdsOfTypes(pIds, 'edipi');
            expect(pids).toBe(false);
        });

        it('verify multiple present types', function() {
            var pids = idUtil.hasIdsOfTypes(pIds, ['icn', 'hdr']);
            expect(pids).toBe(true);
        });

        it('verify undefined and null patientIdentifiers', function() {
            expect(idUtil.hasIdsOfTypes(undefined, 'icn')).toBe(false);
            expect(idUtil.hasIdsOfTypes(null, 'icn')).toBe(false);
            expect(idUtil.hasIdsOfTypes([], 'icn')).toBe(false);
            expect(idUtil.hasIdsOfTypes('', 'icn')).toBe(false);
        });
    });

    describe('extractPidBySite()', function() {
        var pIds = [{
            type: 'icn',
            value: '10110V004877'
        }, {
            type: 'pid',
            value: '9E7A;8'
        }, {
            type: 'pid',
            value: 'C877;8'
        }, {
            type: 'pid',
            value: 'HDR;10110V004877'
        }];

        it('verify site found', function() {
            var pidList = idUtil.extractPidBySite(pIds, 'HDR');
            expect(pidList).toEqual([{
                type: 'pid',
                value: 'HDR;10110V004877'
            }]);
        });

        it('verify no site found', function() {
            var pidList = idUtil.extractPidBySite(pIds, 'AAAA');
            expect(pidList).toEqual([]);
        });
    });


    describe('isIdFormatValid()', function() {
        it('verify undefined type', function() {
            expect(idUtil.isIdFormatValid(undefined, '10110V004877')).toBe(false);
        });

        it('verify null type', function() {
            expect(idUtil.isIdFormatValid(null, '10110V004877')).toBe(false);
        });

        it('verify invalid type', function() {
            expect(idUtil.isIdFormatValid('xyz', '10110V004877')).toBe(false);
        });


        it('verify icn undefined id false', function() {
            expect(idUtil.isIdFormatValid('icn')).toBe(false);
        });

        it('verify icn null id false', function() {
            expect(idUtil.isIdFormatValid('icn', null)).toBe(false);
        });
        it('verify icn empty id false', function() {
            expect(idUtil.isIdFormatValid('icn', '')).toBe(false);
        });
        it('verify icn valid id true', function() {
            expect(idUtil.isIdFormatValid('icn', '10110V004877')).toBe(true);
        });


        it('verify dfn undefined id false', function() {
            expect(idUtil.isIdFormatValid('dfn')).toBe(false);
        });

        it('verify dfn null id false', function() {
            expect(idUtil.isIdFormatValid('dfn', null)).toBe(false);
        });
        it('verify dfn empty id false', function() {
            expect(idUtil.isIdFormatValid('dfn', '')).toBe(false);
        });
        it('verify dfn invalid id false', function() {
            expect(idUtil.isIdFormatValid('dfn', '10110V004877')).toBe(false);
        });
        it('verify dfn valid id true', function() {
            expect(idUtil.isIdFormatValid('dfn', '9E7A;8')).toBe(true);
        });


        it('verify pid undefined id false', function() {
            expect(idUtil.isIdFormatValid('pid')).toBe(false);
        });

        it('verify pid null id false', function() {
            expect(idUtil.isIdFormatValid('pid', null)).toBe(false);
        });
        it('verify pid empty id false', function() {
            expect(idUtil.isIdFormatValid('pid', '')).toBe(false);
        });
        it('verify pid invalid id false', function() {
            expect(idUtil.isIdFormatValid('pid', '10110V004877')).toBe(false);
        });
        it('verify pid valid id true', function() {
            expect(idUtil.isIdFormatValid('pid', '9E7A;8')).toBe(true);
        });


        it('verify hdr undefined id false', function() {
            expect(idUtil.isIdFormatValid('hdr')).toBe(false);
        });

        it('verify hdr null id false', function() {
            expect(idUtil.isIdFormatValid('hdr', null)).toBe(false);
        });
        it('verify hdr empty id false', function() {
            expect(idUtil.isIdFormatValid('hdr', '')).toBe(false);
        });
        it('verify hdr invalid id false', function() {
            expect(idUtil.isIdFormatValid('hdr', '10110V004877')).toBe(false);
        });
        it('verify hdr valid id true', function() {
            expect(idUtil.isIdFormatValid('hdr', 'HDR;8')).toBe(true);
        });


        it('verify dod undefined id false', function() {
            expect(idUtil.isIdFormatValid('dod')).toBe(false);
        });

        it('verify dod null id false', function() {
            expect(idUtil.isIdFormatValid('dod', null)).toBe(false);
        });
        it('verify dod empty id false', function() {
            expect(idUtil.isIdFormatValid('dod', '')).toBe(false);
        });
        it('verify dod invalid id false', function() {
            expect(idUtil.isIdFormatValid('dod', '10110V004877')).toBe(false);
        });
        it('verify dod valid id true', function() {
            expect(idUtil.isIdFormatValid('dod', 'DOD;8')).toBe(true);
        });


        it('verify das undefined id false', function() {
            expect(idUtil.isIdFormatValid('das')).toBe(false);
        });

        it('verify das null id false', function() {
            expect(idUtil.isIdFormatValid('das', null)).toBe(false);
        });
        it('verify das empty id false', function() {
            expect(idUtil.isIdFormatValid('das', '')).toBe(false);
        });
        it('verify das invalid id false', function() {
            expect(idUtil.isIdFormatValid('das', '10110V004877')).toBe(false);
        });
        it('verify das valid id true', function() {
            expect(idUtil.isIdFormatValid('das', 'DAS;8')).toBe(true);
        });


        it('verify vler undefined id false', function() {
            expect(idUtil.isIdFormatValid('vler')).toBe(false);
        });

        it('verify vler null id false', function() {
            expect(idUtil.isIdFormatValid('vler', null)).toBe(false);
        });
        it('verify vler empty id false', function() {
            expect(idUtil.isIdFormatValid('vler', '')).toBe(false);
        });
        it('verify vler invalid id false', function() {
            expect(idUtil.isIdFormatValid('vler', '10110V004877')).toBe(false);
        });
        it('verify vler valid id true', function() {
            expect(idUtil.isIdFormatValid('vler', 'VLER;8')).toBe(true);
        });


        it('verify empty types', function() {
            expect(idUtil.isIdFormatValid([], '10110V004877')).toBe(false);
        });

        it('verify invalid type', function() {
            expect(idUtil.isIdFormatValid(['xyz'], '10110V004877')).toBe(false);
        });

        it('verify icn undefined id false', function() {
            expect(idUtil.isIdFormatValid(['icn'])).toBe(false);
        });

        it('verify icn null id false', function() {
            expect(idUtil.isIdFormatValid(['icn'], null)).toBe(false);
        });

        it('verify icn empty id false', function() {
            expect(idUtil.isIdFormatValid(['icn'], '')).toBe(false);
        });

        it('verify icn valid id true', function() {
            expect(idUtil.isIdFormatValid(['xyz'], '9E7A;3')).toBe(false);
        });

        it('verify icn valid id true', function() {
            expect(idUtil.isIdFormatValid(['icn'], '9E7A;3')).toBe(false);
        });

        it('verify icn valid id true', function() {
            expect(idUtil.isIdFormatValid(['icn', 'pid'], '10110V004877')).toBe(true);
        });

        it('verify icn valid id true', function() {
            expect(idUtil.isIdFormatValid(['icn', 'pid'], '9E7A;3')).toBe(true);
        });

        it('verify icn valid id true', function() {
            expect(idUtil.isIdFormatValid(['xyz', 'icn', 'pid'], '10110V004877')).toBe(true);
        });
    });


    describe('isIcn()', function() {
        it('verify non-match undefined', function() {
            expect(idUtil.isIcn()).toBe(false);
        });

        it('verify non-match null', function() {
            expect(idUtil.isIcn(null)).toBe(false);
        });

        it('verify non-match from zero-length string', function() {
            expect(idUtil.isIcn('')).toBe(false);
        });

        it('verify non-match from non alpha-numeric character', function() {
            expect(idUtil.isIcn('5e5a;4d')).toBe(false);
        });

        it('verify match', function() {
            expect(idUtil.isIcn('10110V004877')).toBe(true);
        });
    });

    describe('isPid()', function() {
        it('verify non-match undefined', function() {
            expect(idUtil.isPid()).toBe(false);
        });

        it('verify non-match null', function() {
            expect(idUtil.isPid(null)).toBe(false);
        });

        it('verify non-match from bad pattern', function() {
            expect(idUtil.isPid('5e5a;4d')).toBe(false);
        });

        it('verify non-match from punctuation', function() {
            expect(idUtil.isPid('9E7A:3')).toBe(false);
        });

        it('verify match, uppercase site', function() {
            expect(idUtil.isPid('9E7A;3')).toBe(true);
        });

        it('verify match, lowercase site', function() {
            expect(idUtil.isPid('9e7a;3')).toBe(true);
        });

        it('verify match, mixedcase site', function() {
            expect(idUtil.isPid('9e7A;3')).toBe(true);
        });
    });

    describe('isDod()', function() {
        it('verify non-match undefined', function() {
            expect(idUtil.isDod()).toBe(false);
        });

        it('verify non-match null', function() {
            expect(idUtil.isDod(null)).toBe(false);
        });

        it('verify non-match from bad pattern', function() {
            expect(idUtil.isDod('5e5a;4d')).toBe(false);
        });

        it('verify non-match from punctuation', function() {
            expect(idUtil.isDod('DOD:3')).toBe(false);
        });

        it('verify no match, lowercase site', function() {
            expect(idUtil.isDod('dod;3')).toBe(false);
        });

        it('verify match, uppercase site', function() {
            expect(idUtil.isDod('DOD;3')).toBe(true);
        });
    });

    describe('isDas()', function() {
        it('verify non-match undefined', function() {
            expect(idUtil.isDas()).toBe(false);
        });

        it('verify non-match null', function() {
            expect(idUtil.isDas(null)).toBe(false);
        });

        it('verify non-match from bad pattern', function() {
            expect(idUtil.isDas('5e5a;4d')).toBe(false);
        });

        it('verify non-match from punctuation', function() {
            expect(idUtil.isDas('DAS:3')).toBe(false);
        });

        it('verify no match, lowercase site', function() {
            expect(idUtil.isDas('das;3')).toBe(false);
        });

        it('verify match, uppercase site', function() {
            expect(idUtil.isDas('DAS;3')).toBe(true);
        });
    });

    describe('isVler()', function() {
        it('verify non-match undefined', function() {
            expect(idUtil.isVler()).toBe(false);
        });

        it('verify non-match null', function() {
            expect(idUtil.isVler(null)).toBe(false);
        });

        it('verify non-match from bad pattern', function() {
            expect(idUtil.isVler('5e5a;4d')).toBe(false);
        });

        it('verify non-match from punctuation', function() {
            expect(idUtil.isVler('VLER:3')).toBe(false);
        });

        it('verify no match, lowercase site', function() {
            expect(idUtil.isVler('vler;3')).toBe(false);
        });

        it('verify match, uppercase site', function() {
            expect(idUtil.isVler('VLER;3')).toBe(true);
        });
    });

    describe('isHdr()', function() {
        it('verify non-match undefined', function() {
            expect(idUtil.isHdr()).toBe(false);
        });

        it('verify non-match null', function() {
            expect(idUtil.isHdr(null)).toBe(false);
        });

        it('verify non-match from bad pattern', function() {
            expect(idUtil.isHdr('5e5a;4d')).toBe(false);
        });

        it('verify non-match from punctuation', function() {
            expect(idUtil.isHdr('HDR:3')).toBe(false);
        });

        it('verify no match, lowercase site', function() {
            expect(idUtil.isHdr('hdr;3')).toBe(false);
        });

        it('verify match, uppercase site', function() {
            expect(idUtil.isHdr('HDR;3')).toBe(true);
        });
    });

    describe('isSecondarySite()', function() {
        it('verify DOD is secondary site', function() {
            expect(idUtil.isSecondarySite('DOD;111')).toBe(true);
        });

        it('verify HDR is secondary site', function() {
            expect(idUtil.isSecondarySite('HDR;111')).toBe(true);
        });

        it('verify DAS is secondary site', function() {
            expect(idUtil.isSecondarySite('DAS;111')).toBe(true);
        });

        it('verify VLER is secondary site', function() {
            expect(idUtil.isSecondarySite('VLER;111')).toBe(true);
        });

        it('verify 9E7A is not secondary site', function() {
            expect(idUtil.isSecondarySite('9E7A;111')).toBe(false);
        });
    });

    describe('extractPiecesFromPid()', function() {
        it('verify extract from undefined, null, and empty', function() {
            var pieces = {
                site: null,
                dfn: null
            };
            expect(idUtil.extractPiecesFromPid()).toEqual(pieces);
            expect(idUtil.extractPiecesFromPid(null)).toEqual(pieces);
            expect(idUtil.extractPiecesFromPid('')).toEqual(pieces);
        });

        it('verify extract from pid', function() {
            var pid = '9E7A;8';
            var pieces = {
                site: '9E7A',
                dfn: '8'
            };
            expect(idUtil.extractPiecesFromPid(pid)).toEqual(pieces);
        });

        it('verify extract from pid with no delimiter', function() {
            var pid = '8';
            var pieces = {
                site: null,
                dfn: '8'
            };
            expect(idUtil.extractPiecesFromPid(pid)).toEqual(pieces);
        });

        it('verify extract from pid with only site piece', function() {
            var pid = '9E7A;';
            var pieces = {
                site: '9E7A',
                dfn: null
            };
            expect(idUtil.extractPiecesFromPid(pid)).toEqual(pieces);
        });

        it('verify extract from pid with only dfn piece', function() {
            var pid = ';8';
            var pieces = {
                site: null,
                dfn: '8'
            };
            expect(idUtil.extractPiecesFromPid(pid)).toEqual(pieces);
        });

        it('verify extract from pid with too many delimiters', function() {
            var pid = '9E7A;8;3';
            var pieces = {
                site: '9E7A',
                dfn: '8'
            };
            expect(idUtil.extractPiecesFromPid(pid)).toEqual(pieces);
        });
    });

    describe('extractSiteFromPid()', function() {
        it('verify extract from undefined, null, and empty', function() {
            var site = null;
            expect(idUtil.extractSiteFromPid()).toEqual(site);
            expect(idUtil.extractSiteFromPid(null)).toEqual(site);
            expect(idUtil.extractSiteFromPid('')).toEqual(site);
        });

        it('verify extract from pid', function() {
            var pid = '9E7A;8';
            var site = '9E7A';
            expect(idUtil.extractSiteFromPid(pid)).toEqual(site);
        });
    });

    describe('extractDfnFromPid()', function() {
        it('verify extract from undefined, null, and empty', function() {
            var dfn = null;
            expect(idUtil.extractDfnFromPid()).toEqual(dfn);
            expect(idUtil.extractDfnFromPid(null)).toEqual(dfn);
            expect(idUtil.extractDfnFromPid('')).toEqual(dfn);
        });

        it('verify extract from pid', function() {
            var pid = '9E7A;8';
            var dfn = '8';
            expect(idUtil.extractDfnFromPid(pid)).toEqual(dfn);
        });
    });

    describe('extractPidFromJob()', function() {
        it('verify extract pid from job - happy path', function() {
            var pid = '9E7A;3';
            var patientId = {
                type: 'pid',
                value: pid
            };
            var jobType = 'vista-9E7A-subscribe-request';
            var job = jobUtil.create(jobType, patientId, null, null, null, 'jpid', false);
            expect(idUtil.extractPidFromJob(job)).toEqual(pid);
        });

        it('verify extract pid from job - identifier had an ICN and not a pid', function() {
            var icn = '10000V10000';
            var patientId = {
                type: 'icn',
                value: icn
            };
            var jobType = 'vista-9E7A-subscribe-request';
            var job = jobUtil.create(jobType, patientId, null, null, null, 'jpid', false);
            expect(idUtil.extractPidFromJob(job)).toEqual('');
        });

        it('verify extract pid from job - Job did not contain an identifier', function() {
            var jobType = 'vista-9E7A-subscribe-request';
            var job = jobUtil.create(jobType, null, null, null, null, 'jpid', false);
            // console.log("Job looks like: %j", job);
            expect(idUtil.extractPidFromJob(job)).toEqual('');
        });
    });


});