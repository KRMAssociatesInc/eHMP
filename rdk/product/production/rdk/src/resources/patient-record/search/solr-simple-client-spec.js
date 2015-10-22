'use strict';

var _ = require('underscore');
var solrSimpleClient = require('./solr-simple-client');
var generateFacetMap = solrSimpleClient.generateFacetMap;
var compileQueryParameters = solrSimpleClient.compileQueryParameters;
var emulatedHmpGetRelativeDate = solrSimpleClient.emulatedHmpGetRelativeDate;
var escapeQueryChars = solrSimpleClient.escapeQueryChars;


// TODO: test executeSolrQuery with http interception+mock

describe('generate facet map', function () {
    it('should generate an object with "T-" values', function () {
        var facetMap = generateFacetMap();
        var nonTeeMinusValues = [];
        _.toArray(facetMap).forEach(function (teeMinus) {
            if (!teeMinus.toLowerCase().match(/^(t-\d+(m|d|h|y)$|^all$)/)) {
                nonTeeMinusValues = nonTeeMinusValues.concat(teeMinus);
            }
        });
        expect(nonTeeMinusValues.length).to.equal(0);
    });

    it('should generate an object with solr datetime facet keys', function () {
        var facetMap = generateFacetMap();
        var nonSolrDatetimeKeys = [];
        Object.keys(facetMap).forEach(function (solrFacet) {
            if (!solrFacet.match(/\{!ex=dt\}datetime:\[(\*|\d{8})\ TO \*]$/)) {
                nonSolrDatetimeKeys = nonSolrDatetimeKeys.concat(solrFacet);
            }
        });
        expect(nonSolrDatetimeKeys.length).to.equal(0);
    });
});

describe('get emulated HMP relative date with T- values', function () {
    it('should return a YYYYMMDD date for years', function () {
        var relativeDate = emulatedHmpGetRelativeDate('T-3y');
        expect(relativeDate.match(/^\d{8}$/)).to.be.truthy();
    });
    it('should return a YYYYMMDD date for months', function () {
        var relativeDate = emulatedHmpGetRelativeDate('T-3m');
        expect(relativeDate.match(/^\d{8}$/)).to.be.truthy();
    });
    it('should return a YYYYMMDD date for days', function () {
        var relativeDate = emulatedHmpGetRelativeDate('T-3d');
        expect(relativeDate.match(/^\d{8}$/)).to.be.truthy();
    });
    it('should return a YYYYMMDD date for hours', function () {
        var relativeDate = emulatedHmpGetRelativeDate('T-3h');
        expect(relativeDate.match(/^\d{8}$/)).to.be.truthy();
    });
});

describe('compile query parameters', function () {
    it('should merge fl arrays into a comma-separated string', function () {
        var queryParameters = {
            fl: [
                'foo',
                'bar',
                'baz',
                'quux'
            ]
        };
        var compiledQueryParameters = compileQueryParameters(queryParameters);
        expect(compiledQueryParameters.fl).to.equal('foo,bar,baz,quux');
    });
    it('should merge hl.fl arrays into a comma-separated string', function () {
        var queryParameters = {
            'hl.fl': [
                'aboard',
                'about',
                'above',
                'across'
            ]
        };
        var compiledQueryParameters = compileQueryParameters(queryParameters);
        expect(compiledQueryParameters['hl.fl']).to.equal('aboard,about,above,across');
    });

});

describe('escape query chars', function () {
    it('should not escape regular characters', function () {
        var regularCharacters = 'Thequick,brownfoxjumpsoverthelazydog.';
        var processedCharacters = escapeQueryChars(regularCharacters);
        expect(processedCharacters).to.equal(regularCharacters);
    });
    it('should escape spaces', function () {
        var sentence = 'The quick, brown fox jumps over the lazy dog.';
        var processedSentence = escapeQueryChars(sentence);
        var expectedSentence = 'The\\ quick,\\ brown\\ fox\\ jumps\\ over\\ the\\ lazy\\ dog.';
        expect(processedSentence).to.equal(expectedSentence);
    });
    it('should escape other solr-escapable characters', function () {
        var escapables = '\\+-!():^[]"{}~*?|&;';  // literally \+-!():^[]"{}~*?|&;
        var processedEscapables = escapeQueryChars(escapables);
        var expectedEscapables = '\\\\\\+\\-\\!\\(\\)\\:\\^\\[\\]\\"\\{\\}\\~\\*\\?\\|\\&\\;';
        // the above is literally \\\+\-\!\(\)\:\^\[\]\"\{\}\~\*\?\|\&\;
        expect(processedEscapables).to.equal(expectedEscapables);
    });
});
