'use strict';

var _ = require('underscore');
var solrSimpleClient = require('./solr-simple-client');

var hmpSolrResponseTransformer = require('./hmp-solr-response-transformer');

var updateCumulativeResponseData = hmpSolrResponseTransformer._updateCumulativeResponseData;
var transformSolrHighlightingToHmpObject = hmpSolrResponseTransformer._transformSolrHighlightingToHmpObject;
var transformSolrItemsToHmpFormat = hmpSolrResponseTransformer._transformSolrItemsToHmpFormat;
var buildResponseObjectSkeleton = hmpSolrResponseTransformer._buildResponseObjectSkeleton;
var getSearchedDomainFromSolrResponse = hmpSolrResponseTransformer._getSearchedDomainFromSolrResponse;
var isGroupingEnabled = hmpSolrResponseTransformer._isGroupingEnabled;

describe('detect solr grouping', function () {
    it('should detect when grouping is on', function () {
        var specializedSolrResult = { grouped: {} };
        var groupingDetected = isGroupingEnabled(specializedSolrResult);
        expect(groupingDetected).to.be.truthy();
    });
    it('should detect when grouping is off', function () {
        var specializedSolrResult = { response: {} };
        var groupingDetected = isGroupingEnabled(specializedSolrResult);
        expect(groupingDetected).to.be.falsy();
    });
});

describe('update cumulative response data', function () {
    it('should add facets', function () {
        var facetMap = solrSimpleClient.generateFacetMap();
        var solrResult = { responseHeader: { status: 0,
            QTime: 5,
            params: { 'hl.fragsize': '45',
                facet: 'true',
                sort: 'reference_date_time desc',
                'facet.mincount': '1',
                qf: 'all',
                synonyms: 'true',
                'hl.fl': [ 'body', 'subject' ],
                wt: 'json',
                hl: 'true',
                defType: 'synonym_edismax',
                rows: '101',
                fl: 'uid,datetime,summary,url,domain,kind,facility_name,local_title,phrase',
                'hl.snippets': '5',
                'facet.query': [ '{!ex=dt}datetime:[20130718 TO *]',
                    '{!ex=dt}datetime:[20140717 TO *]',
                    '{!ex=dt}datetime:[20120718 TO *]',
                    '{!ex=dt}datetime:[20140711 TO *]',
                    '{!ex=dt}datetime:[* TO *]',
                    '{!ex=dt}datetime:[20140418 TO *]',
                    '{!ex=dt}datetime:[20140618 TO *]',
                    '{!ex=dt}datetime:[20140715 TO *]' ],
                q: '\'metformin\'',
                'q.op': 'AND',
                'group.field': 'local_title',
                qs: '4',
                'facet.field': '{!ex=domain}domain',
                group: 'true',
                fq: [ 'pid:10108', 'domain:document' ] } },
            grouped: { local_title: { matches: 1,
                groups: [
                    { groupValue: 'Discharge Summary',
                        doclist: { numFound: 1,
                            start: 0,
                            docs: [
                                { uid: 'urn:va:document:9E7A:3:3960',
                                    summary: 'Discharge Summary',
                                    kind: 'Discharge Summary',
                                    facility_name: 'ABILENE (CAA)',
                                    datetime: '20040325191705',
                                    local_title: 'Discharge Summary',
                                    domain: 'document' }
                            ] } }
                ] } },
            facet_counts: { facet_queries: { '{!ex=dt}datetime:[20130718 TO *]': 0,
                '{!ex=dt}datetime:[20140717 TO *]': 0,
                '{!ex=dt}datetime:[20120718 TO *]': 0,
                '{!ex=dt}datetime:[20140711 TO *]': 0,
                '{!ex=dt}datetime:[* TO *]': 1,
                '{!ex=dt}datetime:[20140418 TO *]': 0,
                '{!ex=dt}datetime:[20140618 TO *]': 0,
                '{!ex=dt}datetime:[20140715 TO *]': 0 },
                facet_fields: { domain: [ 'document', 1 ] },
                facet_dates: {},
                facet_ranges: {} },
            highlighting: { 'urn:va:document:9E7A:3:3960': { body: [ ') Metoprolol 50mg PO BID\n2) <span class=\'cpe-search-term-match\'>Metformin</span> HCL 500 mg PO',
                ') Metoprolol 50 mg PO BID\n2) <span class=\'cpe-search-term-match\'>Metformin</span> HCL 500 mg PO',
                ' in \n150s-175s. Patient is receiving <span class=\'cpe-search-term-match\'>metformin</span>' ] } } };
        var hmpEmulatedResponseObject = buildResponseObjectSkeleton({query: 'foo'});

        var cumulativeResponseData = updateCumulativeResponseData(solrResult, facetMap, hmpEmulatedResponseObject);
        expect(cumulativeResponseData.data.facets.all).to.be.above(0);
    });

    it('should update facets', function () {
        var facetMap = solrSimpleClient.generateFacetMap();
        var solrResult1 = { responseHeader: { status: 0,
            QTime: 5,
            params: { 'hl.fragsize': '45',
                facet: 'true',
                sort: 'reference_date_time desc',
                'facet.mincount': '1',
                qf: 'all',
                synonyms: 'true',
                'hl.fl': [ 'body', 'subject' ],
                wt: 'json',
                hl: 'true',
                defType: 'synonym_edismax',
                rows: '101',
                fl: 'uid,datetime,summary,url,domain,kind,facility_name,local_title,phrase',
                'hl.snippets': '5',
                'facet.query': [ '{!ex=dt}datetime:[20130718 TO *]',
                    '{!ex=dt}datetime:[20140717 TO *]',
                    '{!ex=dt}datetime:[20120718 TO *]',
                    '{!ex=dt}datetime:[20140711 TO *]',
                    '{!ex=dt}datetime:[* TO *]',
                    '{!ex=dt}datetime:[20140418 TO *]',
                    '{!ex=dt}datetime:[20140618 TO *]',
                    '{!ex=dt}datetime:[20140715 TO *]' ],
                q: '\'metformin\'',
                'q.op': 'AND',
                'group.field': 'local_title',
                qs: '4',
                'facet.field': '{!ex=domain}domain',
                group: 'true',
                fq: [ 'pid:10108', 'domain:document' ] } },
            grouped: { local_title: { matches: 1,
                groups: [
                    { groupValue: 'Discharge Summary',
                        doclist: { numFound: 1,
                            start: 0,
                            docs: [
                                { uid: 'urn:va:document:9E7A:3:3960',
                                    summary: 'Discharge Summary',
                                    kind: 'Discharge Summary',
                                    facility_name: 'ABILENE (CAA)',
                                    datetime: '20040325191705',
                                    local_title: 'Discharge Summary',
                                    domain: 'document' }
                            ] } }
                ] } },
            facet_counts: { facet_queries: { '{!ex=dt}datetime:[20130718 TO *]': 0,
                '{!ex=dt}datetime:[20140717 TO *]': 0,
                '{!ex=dt}datetime:[20120718 TO *]': 0,
                '{!ex=dt}datetime:[20140711 TO *]': 0,
                '{!ex=dt}datetime:[* TO *]': 1,
                '{!ex=dt}datetime:[20140418 TO *]': 0,
                '{!ex=dt}datetime:[20140618 TO *]': 0,
                '{!ex=dt}datetime:[20140715 TO *]': 0 },
                facet_fields: { domain: [ 'document', 1 ] },
                facet_dates: {},
                facet_ranges: {} },
            highlighting: { 'urn:va:document:9E7A:3:3960': { body: [ ') Metoprolol 50mg PO BID\n2) <span class=\'cpe-search-term-match\'>Metformin</span> HCL 500 mg PO',
                ') Metoprolol 50 mg PO BID\n2) <span class=\'cpe-search-term-match\'>Metformin</span> HCL 500 mg PO',
                ' in \n150s-175s. Patient is receiving <span class=\'cpe-search-term-match\'>metformin</span>' ] } } };
        var solrResult2 = { responseHeader: { status: 0,
            QTime: 2,
            params: { facet: 'true',
                sort: 'observed desc',
                'facet.mincount': '1',
                wt: 'json',
                rows: '101',
                fl: 'uid,datetime,summary,url,kind,facility_name',
                start: '0',
                'facet.query': [ '{!ex=dt}datetime:[* TO *]',
                    '{!ex=dt}datetime:[20140623 TO *]',
                    '{!ex=dt}datetime:[20140621 TO *]',
                    '{!ex=dt}datetime:[20140617 TO *]',
                    '{!ex=dt}datetime:[20140524 TO *]',
                    '{!ex=dt}datetime:[20140324 TO *]',
                    '{!ex=dt}datetime:[20130624 TO *]',
                    '{!ex=dt}datetime:[20120624 TO *]' ],
                q: '\'pulse\'',
                'group.field': 'qualified_name',
                'facet.field': '{!ex=domain}domain',
                group: 'true',
                fq: [ 'pid:10110', 'domain:vital', 'domain:(NOT patient)' ] } },
            grouped: { qualified_name: { matches: 45,
                groups: [
                    { groupValue: 'PULSE',
                        doclist: { numFound: 35,
                            start: 0,
                            docs: [
                                { uid: 'urn:va:vital:9E7A:8:23464',
                                    summary: 'PULSE 74 /min',
                                    facility_name: 'CAMP MASTER',
                                    datetime: '20100305105350',
                                    kind: 'Vital Sign' }
                            ] } },
                    { groupValue: 'PULSE OXIMETRY',
                        doclist: { numFound: 10,
                            start: 0,
                            docs: [
                                { uid: 'urn:va:vital:9E7A:8:22861',
                                    summary: 'PULSE OXIMETRY 98 %',
                                    facility_name: 'CAMP MASTER',
                                    datetime: '20100305105244',
                                    kind: 'Vital Sign' }
                            ] } }
                ] } },
            facet_counts: { facet_queries: { '{!ex=dt}datetime:[* TO *]': 38,
                '{!ex=dt}datetime:[20140623 TO *]': 0,
                '{!ex=dt}datetime:[20140621 TO *]': 0,
                '{!ex=dt}datetime:[20140617 TO *]': 0,
                '{!ex=dt}datetime:[20140524 TO *]': 0,
                '{!ex=dt}datetime:[20140324 TO *]': 0,
                '{!ex=dt}datetime:[20130624 TO *]': 0,
                '{!ex=dt}datetime:[20120624 TO *]': 0 },
                facet_fields: { domain: [ 'vital', 45 ] },
                facet_dates: {},
                facet_ranges: {} } };

        var hmpEmulatedResponseObject = buildResponseObjectSkeleton({query: 'bar'});

        var cumulativeResponseData;
        cumulativeResponseData = updateCumulativeResponseData(solrResult1, facetMap, hmpEmulatedResponseObject);
        cumulativeResponseData = updateCumulativeResponseData(solrResult2, facetMap, hmpEmulatedResponseObject);

        expect(cumulativeResponseData.data.facets.all).to.equal(
                cumulativeResponseData.data.facets['domain:document'] +
                cumulativeResponseData.data.facets['domain:vital']);
    });

    it('should accumulate QTime', function () {
        var facetMap = solrSimpleClient.generateFacetMap();
        var solrResult1 = generateFakeSolrResponse(facetMap, 'document');
        var solrResult2 = generateFakeSolrResponse(facetMap, 'result', 'lab');
        var hmpEmulatedResponseObject = buildResponseObjectSkeleton({query: 'bar'});

        var cumulativeResponseData;
        cumulativeResponseData = updateCumulativeResponseData(solrResult1, facetMap, hmpEmulatedResponseObject);
        cumulativeResponseData = updateCumulativeResponseData(solrResult2, facetMap, hmpEmulatedResponseObject);

        expect(cumulativeResponseData.data.elapsed).to.equal(
                solrResult1.responseHeader.QTime +
                solrResult2.responseHeader.QTime);
    });
});

describe('transform solr highlighting to hmp object', function () {
    it('should put solr highlighting into an hmp object', function () {
        var solrResponse = {
            'responseHeader': {
                'status': 0,
                'QTime': 5,
                'params': {
                    'hl.fragsize': '45',
                    'facet': 'true',
                    'sort': 'reference_date_time desc',
                    'facet.mincount': '1',
                    'qf': 'all',
                    'synonyms': 'true',
                    'hl.fl': [
                        'body',
                        'subject'
                    ],
                    'wt': 'json',
                    'hl': 'true',
                    'defType': 'synonym_edismax',
                    'rows': '101',
                    'fl': 'uid,datetime,summary,url,domain,kind,facility_name,local_title,phrase',
                    'hl.snippets': '5',
                    'facet.query': [
                        '{!ex=dt}datetime:[20130718 TO *]',
                        '{!ex=dt}datetime:[20140717 TO *]',
                        '{!ex=dt}datetime:[20120718 TO *]',
                        '{!ex=dt}datetime:[20140711 TO *]',
                        '{!ex=dt}datetime:[* TO *]',
                        '{!ex=dt}datetime:[20140418 TO *]',
                        '{!ex=dt}datetime:[20140618 TO *]',
                        '{!ex=dt}datetime:[20140715 TO *]'
                    ],
                    'q': '\'metformin\'',
                    'q.op': 'AND',
                    'group.field': 'local_title',
                    'qs': '4',
                    'facet.field': '{!ex=domain}domain',
                    'group': 'true',
                    'fq': [
                        'pid:10108',
                        'domain:document'
                    ]
                }
            },
            'grouped': {
                'local_title': {
                    'matches': 1,
                    'groups': [
                        {
                            'groupValue': 'Discharge Summary',
                            'doclist': {
                                'numFound': 1,
                                'start': 0,
                                'docs': [
                                    {
                                        'uid': 'urn:va:document:9E7A:3:3960',
                                        'summary': 'Discharge Summary',
                                        'kind': 'Discharge Summary',
                                        'facility_name': 'ABILENE (CAA)',
                                        'datetime': '20040325191705',
                                        'local_title': 'Discharge Summary',
                                        'domain': 'document'
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            'facet_counts': {
                'facet_queries': {
                    '{!ex=dt}datetime:[20130718 TO *]': 0,
                    '{!ex=dt}datetime:[20140717 TO *]': 0,
                    '{!ex=dt}datetime:[20120718 TO *]': 0,
                    '{!ex=dt}datetime:[20140711 TO *]': 0,
                    '{!ex=dt}datetime:[* TO *]': 1,
                    '{!ex=dt}datetime:[20140418 TO *]': 0,
                    '{!ex=dt}datetime:[20140618 TO *]': 0,
                    '{!ex=dt}datetime:[20140715 TO *]': 0
                },
                'facet_fields': {
                    'domain': [
                        'document',
                        1
                    ]
                },
                'facet_dates': { },
                'facet_ranges': { }
            },
            'highlighting': {
                'urn:va:document:9E7A:3:3960': {
                    'body': [
                        ') Metoprolol 50mg PO BID\n2) <span class=\'cpe-search-term-match\'>Metformin</span> HCL 500 mg PO',
                        ') Metoprolol 50 mg PO BID\n2) <span class=\'cpe-search-term-match\'>Metformin</span> HCL 500 mg PO',
                        ' in \n150s-175s. Patient is receiving <span class=\'cpe-search-term-match\'>metformin</span>'
                    ]
                }
            }

        };
        var hmpEmultatedResponseObject = buildResponseObjectSkeleton({query: 'foobar'});
        hmpEmultatedResponseObject.data.items = [
            { uid: 'urn:va:document:9E7A:3:3960' }
        ];
        hmpEmultatedResponseObject = transformSolrHighlightingToHmpObject(solrResponse, hmpEmultatedResponseObject);
        expect(hmpEmultatedResponseObject.data.items[0].highlights.length).to.be.above(0);
    });
});

describe('transform solr items to hmp format', function () {
    it('should handle grouped items', function () {
        var solrResponse = { responseHeader: { status: 0,
            QTime: 3,
            params: { 'hl.fragsize': '72',
                facet: 'true',
                sort: 'overall_stop desc',
                'facet.mincount': '1',
                'hl.fl': 'administration_comment,prn_reason',
                wt: 'json',
                hl: 'true',
                rows: '101',
                fl: 'qualified_name,va_type,last_filled,last_give,med_drug_class_name,uid,datetime,summary,url,kind,facility_name',
                'hl.snippets': '5',
                'facet.query': [ '{!ex=dt}datetime:[* TO *]',
                    '{!ex=dt}datetime:[20140622 TO *]',
                    '{!ex=dt}datetime:[20140620 TO *]',
                    '{!ex=dt}datetime:[20140616 TO *]',
                    '{!ex=dt}datetime:[20140523 TO *]',
                    '{!ex=dt}datetime:[20140323 TO *]',
                    '{!ex=dt}datetime:[20130623 TO *]',
                    '{!ex=dt}datetime:[20120623 TO *]' ],
                start: '0',
                q: '\'metformin\'',
                'q.op': 'AND',
                'group.field': 'qualified_name',
                'facet.field': '{!ex=domain}domain',
                group: 'true',
                fq: [ 'pid:10108', 'domain:med', 'domain:(NOT patient)' ] } },
            grouped: { qualified_name: { matches: 5,
                groups: [
                    { groupValue: 'METFORMIN TAB,SA',
                        doclist: { numFound: 5,
                            start: 0,
                            docs: [
                                { uid: 'urn:va:med:9E7A:3:27837',
                                    summary: 'METFORMIN HCL 500MG TAB,SA (EXPIRED)\n TAKE ONE TABLET MOUTH TWICE A DAY',
                                    facility_name: 'CAMP MASTER',
                                    datetime: '20100227',
                                    va_type: 'O',
                                    last_filled: '20100227',
                                    qualified_name: 'METFORMIN TAB,SA',
                                    kind: 'Medication, Outpatient',
                                    med_drug_class_name: [ 'ORAL HYPOGLYCEMIC AGENTS,ORAL' ] }
                            ] } }
                ] } },
            facet_counts: { facet_queries: { '{!ex=dt}datetime:[* TO *]': 5,
                '{!ex=dt}datetime:[20140622 TO *]': 0,
                '{!ex=dt}datetime:[20140620 TO *]': 0,
                '{!ex=dt}datetime:[20140616 TO *]': 0,
                '{!ex=dt}datetime:[20140523 TO *]': 0,
                '{!ex=dt}datetime:[20140323 TO *]': 0,
                '{!ex=dt}datetime:[20130623 TO *]': 0,
                '{!ex=dt}datetime:[20120623 TO *]': 0 },
                facet_fields: { domain: [ 'med', 5 ] },
                facet_dates: {},
                facet_ranges: {} },
            highlighting: { 'urn:va:med:9E7A:3:27837': {} } };

        var hmpEmulatedResponseObject = buildResponseObjectSkeleton({query: 'foo'});
        var hmpObject = transformSolrItemsToHmpFormat(solrResponse, hmpEmulatedResponseObject);

        expect(hmpObject.data.items.length)
            .to.equal(solrResponse.grouped.qualified_name.groups[0].doclist.docs.length);
    });

    it('should handle ungrouped items', function () {
        var solrResponse = { responseHeader: { status: 0,
            QTime: 2,
            params: { 'hl.fragsize': '45',
                facet: 'true',
                'facet.mincount': '1',
                'hl.fl': 'content',
                wt: 'json',
                hl: 'true',
                rows: '101',
                fl: 'service,status_name,uid,datetime,summary,url,kind,facility_name',
                'hl.snippets': '5',
                start: '0',
                'facet.query': [ '{!ex=dt}datetime:[* TO *]',
                    '{!ex=dt}datetime:[20140622 TO *]',
                    '{!ex=dt}datetime:[20140620 TO *]',
                    '{!ex=dt}datetime:[20140616 TO *]',
                    '{!ex=dt}datetime:[20140523 TO *]',
                    '{!ex=dt}datetime:[20140323 TO *]',
                    '{!ex=dt}datetime:[20130623 TO *]',
                    '{!ex=dt}datetime:[20120623 TO *]' ],
                q: '\'potassium\'',
                'facet.field': '{!ex=domain}domain',
                fq: [ 'service:(LR OR GMRC OR RA OR FH OR UBEC OR \'OR\')',
                    '-status_name:(COMPLETE OR \'DISCONTINUED/EDIT\' OR DISCONTINUED OR EXPIRED OR LAPSED)',
                    'pid:10108',
                    'domain:order',
                    'domain:(NOT patient)' ] } },
            response: { numFound: 5,
                start: 0,
                docs: [
                    { uid: 'urn:va:order:9E7A:3:30564',
                        summary: 'POTASSIUM BLOOD SERUM WC LB #14908\n',
                        facility_name: 'CAMP MASTER',
                        status_name: 'PENDING',
                        service: 'LR',
                        datetime: '201003231059',
                        kind: 'Lab Order' },
                    { uid: 'urn:va:order:9E7A:3:30463',
                        summary: 'POTASSIUM BLOOD SERUM WC LB #14807\n',
                        facility_name: 'CAMP MASTER',
                        status_name: 'PENDING',
                        service: 'LR',
                        datetime: '201003231059',
                        kind: 'Lab Order' },
                    { uid: 'urn:va:order:9E7A:3:30362',
                        summary: 'POTASSIUM BLOOD SERUM WC LB #14706\n',
                        facility_name: 'CAMP MASTER',
                        status_name: 'PENDING',
                        service: 'LR',
                        datetime: '201003231058',
                        kind: 'Lab Order' },
                    { uid: 'urn:va:order:9E7A:3:30261',
                        summary: 'POTASSIUM BLOOD SERUM WC LB #14605\n',
                        facility_name: 'CAMP MASTER',
                        status_name: 'PENDING',
                        service: 'LR',
                        datetime: '201003231057',
                        kind: 'Lab Order' },
                    { uid: 'urn:va:order:9E7A:3:30160',
                        summary: 'POTASSIUM BLOOD SERUM WC LB #14504\n',
                        facility_name: 'CAMP MASTER',
                        status_name: 'PENDING',
                        service: 'LR',
                        datetime: '201003231056',
                        kind: 'Lab Order' }
                ] },
            facet_counts: { facet_queries: { '{!ex=dt}datetime:[* TO *]': 5,
                '{!ex=dt}datetime:[20140622 TO *]': 0,
                '{!ex=dt}datetime:[20140620 TO *]': 0,
                '{!ex=dt}datetime:[20140616 TO *]': 0,
                '{!ex=dt}datetime:[20140523 TO *]': 0,
                '{!ex=dt}datetime:[20140323 TO *]': 0,
                '{!ex=dt}datetime:[20130623 TO *]': 0,
                '{!ex=dt}datetime:[20120623 TO *]': 0 },
                facet_fields: { domain: [ 'order', 5 ] },
                facet_dates: {},
                facet_ranges: {} },
            highlighting: { 'urn:va:order:9E7A:3:30564': { content: [ '<span class=\'cpe-search-term-match\'>POTASSIUM</span> BLOOD SERUM WC LB #14908\n' ] },
                'urn:va:order:9E7A:3:30463': { content: [ '<span class=\'cpe-search-term-match\'>POTASSIUM</span> BLOOD SERUM WC LB #14807\n' ] },
                'urn:va:order:9E7A:3:30362': { content: [ '<span class=\'cpe-search-term-match\'>POTASSIUM</span> BLOOD SERUM WC LB #14706\n' ] },
                'urn:va:order:9E7A:3:30261': { content: [ '<span class=\'cpe-search-term-match\'>POTASSIUM</span> BLOOD SERUM WC LB #14605\n' ] },
                'urn:va:order:9E7A:3:30160': { content: [ '<span class=\'cpe-search-term-match\'>POTASSIUM</span> BLOOD SERUM WC LB #14504\n' ] } } };
        var hmpEmulatedResponseObject = buildResponseObjectSkeleton({query: 'foo'});
        var hmpObject = transformSolrItemsToHmpFormat(solrResponse, hmpEmulatedResponseObject);

        expect(hmpObject.data.items.length)
            .to.equal(solrResponse.response.docs.length);
    });
});

describe('get searched domain from solr response', function () {
    it('should handle searching from a domain', function () {
        var solrResult = { responseHeader: { status: 0,
            QTime: 0,
            params: { facet: 'true',
                fl: 'uid,datetime,summary,url,kind,facility_name',
                'facet.mincount': '1',
                'facet.query': [ '{!ex=dt}datetime:[* TO *]',
                    '{!ex=dt}datetime:[20140622 TO *]',
                    '{!ex=dt}datetime:[20140620 TO *]',
                    '{!ex=dt}datetime:[20140616 TO *]',
                    '{!ex=dt}datetime:[20140523 TO *]',
                    '{!ex=dt}datetime:[20140323 TO *]',
                    '{!ex=dt}datetime:[20130623 TO *]',
                    '{!ex=dt}datetime:[20120623 TO *]' ],
                start: '0',
                q: '\'hematology\'',
                'facet.field': '{!ex=domain}domain',
                wt: 'json',
                fq: [ 'pid:10108', 'domain:procedure', 'domain:(NOT patient)' ],
                rows: '101' } },
            response: { numFound: 1,
                start: 0,
                docs: [
                    { uid: 'urn:va:consult:9E7A:3:382',
                        summary: 'HEMATOLOGY CONSULT Cons',
                        kind: 'Consult',
                        facility_name: 'CAMP MASTER',
                        datetime: '20040401225707' }
                ] },
            facet_counts: { facet_queries: { '{!ex=dt}datetime:[* TO *]': 1,
                '{!ex=dt}datetime:[20140622 TO *]': 0,
                '{!ex=dt}datetime:[20140620 TO *]': 0,
                '{!ex=dt}datetime:[20140616 TO *]': 0,
                '{!ex=dt}datetime:[20140523 TO *]': 0,
                '{!ex=dt}datetime:[20140323 TO *]': 0,
                '{!ex=dt}datetime:[20130623 TO *]': 0,
                '{!ex=dt}datetime:[20120623 TO *]': 0 },
                facet_fields: { domain: [ 'procedure', 1 ] },
                facet_dates: {},
                facet_ranges: {} } };
        var searchedDomain = getSearchedDomainFromSolrResponse(solrResult);
        expect(searchedDomain).to.equal('procedure');
    });
});

function generateFakeSolrResponse(facetMap, domain, group_field) {
    var solrFacetQueries = _.extend({}, facetMap);
    var counter = Math.ceil(Math.random() * 10 + 10); // count down because 'all' is first
    _.each(solrFacetQueries, function (count, facet, me) {
        counter--;
        me[facet] = counter;
    });
    var solrResult = {
        responseHeader: {
            QTime: Math.ceil(Math.random() * 2 + 2)
        },
        highlighting: { theUid: { theGroup: [
            'abc def ghi',
            'zyx def foo',
            'eik def kek'
        ] } },
        facet_counts: {
            facet_queries: solrFacetQueries,
            facet_fields: { domain: [
                domain,
                _.reduce(_.toArray(solrFacetQueries), function (memo, num) {
                    return memo + num;
                })
            ] }
        }
    };
    if(group_field) {
        solrResult.grouped = {};
        solrResult.grouped[group_field] = { matches: Math.random() * 10 + 10 };
    } else {
        solrResult.response = {};
        solrResult.response.numFound = Math.random() * 10 + 10;
    }
    return solrResult;
}
