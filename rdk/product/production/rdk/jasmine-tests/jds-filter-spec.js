/*jslint node: true */
'use strict';

var jdsFilter = require('../utils/jdsFilter/jdsFilter');

describe('jdsFilter.parse', function() {
    it('should parse a JDS filter query with a trailing comma', function() {
        var query = 'eq("foo","bar"),';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [['eq', '"foo"', '"bar"']];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should parse a JDS filter query without a trailing comma', function() {
        var query = 'eq("foo","bar")';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [['eq', '"foo"', '"bar"']];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should parse multiple top-level JDS filters', function() {
        var query = 'eq("foo","bar"),lt("baz","quux")';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [
            ['eq', '"foo"', '"bar"'],
            ['lt', '"baz"', '"quux"']
        ];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should parse group operators', function() {
        var query = 'or(eq("foo","bar"),lt("baz","quux"))';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [
            ['or',
                ['eq', '"foo"', '"bar"'],
                ['lt', '"baz"', '"quux"']
            ]
        ];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should parse nested group operators', function() {
        var query = 'or(eq("foo","bar"),not(exists("abc"),lt("baz","quux")))';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [
            ['or',
                ['eq', '"foo"', '"bar"'],
                ['not',
                    ['exists', '"abc"'],
                    ['lt', '"baz"', '"quux"']
                ]
            ]
        ];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should parse unquoted strings', function() {
        var query = 'eq(ping123pong,"bar")';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [['eq', 'ping123pong', '"bar"']];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should handle 3 arguments', function() {
        var query = 'between("date","2014","2016")';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [['between', '"date"', '"2014"', '"2016"']];
        expect(parsed).toEqual(expectedFilterObject);
    });
    it('should handle 1 argument', function() {
        var query = 'exists(patientStatus)';
        var parsed = jdsFilter.parse(query);
        var expectedFilterObject = [['exists', 'patientStatus']];
        expect(parsed).toEqual(expectedFilterObject);
    });
});

describe('jdsFilter.build', function() {
    it('should build one jds filter', function() {
        var filter = [['eq', 'foo', 'bar']];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'eq("foo","bar")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build multiple jds filters', function() {
        var filter = [['eq', 'foo', 'bar'], ['exists', 'patientStatus']];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'eq("foo","bar"),exists("patientStatus")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with quoted arguments', function() {
        var filter = [['eq', '"foo"', 'bar']];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'eq("foo","bar")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should escape stray quotes in arguments', function() {
        var filter = [['eq', '"fo"o"', 'b"a"""r']];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'eq("fo""o","b""a""""r")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with group operators', function() {
        var filter = [
            ['or',
                ['eq', 'ping', 'pong'],
                ['eq', 'siteCode', 'DOD']
            ]
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'or(eq("ping","pong"),eq("siteCode","DOD"))';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with nested group operators', function() {
        var filter = [
            ['or',
                ['and',
                    ['eq', 'ping', 'pong'],
                    ['gt', 'sides', '4']
                ],
                ['eq', 'siteCode', 'DOD']
            ]
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'or(and(eq("ping","pong"),gt("sides","4")),eq("siteCode","DOD"))';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with list arguments', function() {
        var filter = [
            ['in', 'siteCode', ['DOD', '500']]
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'in("siteCode",["DOD","500"])';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with unquoted arguments', function() {
        var filter = [
            ['exists', 'elephant']
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'exists("elephant")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with quoted arguments', function() {
        var filter = [
            ['exists', '"hot dog"']
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'exists("hot dog")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build with number arguments', function() {
        var filter = [
            ['gt', 'wheels', 3]
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'gt("wheels","3")';
        expect(built).toBe(expectedBuiltFilter);
    });
    it('should build a complex filter', function() {
        var filter = [
            [ 'and',
                [ 'ne', 'removed', 'true' ]
            ],
            [ 'ne', 'result', 'Pass' ],
            [
                [ 'and',
                    [ 'between', 'observed', '20131108', '20151108235959' ]
                ]
            ]
        ];
        var built = jdsFilter.build(filter);
        var expectedBuiltFilter = 'and(ne("removed","true")),ne("result","Pass"),and(between("observed","20131108","20151108235959"))';
        expect(built).toBe(expectedBuiltFilter);
    });
});
