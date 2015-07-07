'use strict';

var applyFilters = require('./jdsFilterApplier').applyFilters;
var parseFilters = require('./jdsFilter').parse;

var mock = {
    uid: 'urn:va:test:93EF:-7:1',
    topValue: 1,
    strValue: 'quick brown fox',
    valueA: 'red',
    result: 7.6,
    observed: 20110919,
    facility: {name: 'VAMC'},
    products: [
        {ingredient: 'aspirin'},
        {ingredient: 'codeine'}
    ],
    orders: [
        {clinician: {name: 'Welby'}}
    ]
};
function expectFilter(resultsShouldBeReturned, filter) {
    var _expect = expect(applyFilters(parseFilters(filter), [mock]));
    if(resultsShouldBeReturned) {
        return _expect.not.toEqual([]);
    }
    return _expect.toEqual([]);
}

describe('local jds query filter', function() {
    it('handles comparing numbers and strings', function() {
        // Just some sanity tests using a manually built filter array
        // Prevents bugs from slipping through that could be
        // caused by the filter parser
        expect(applyFilters(['eq', 'topValue', 1], [mock])).not.toEqual([]);
        expect(applyFilters(['eq', 'topValue', '1'], [mock])).not.toEqual([]);
        expect(applyFilters(['eq', 'topValue', 42], [mock])).toEqual([]);
        expect(applyFilters(['eq', 'topValue', '42'], [mock])).toEqual([]);
    });
    it('handles simple filters', function() {
        expectFilter(1, 'eq(topValue,1)');
        expectFilter(0, 'eq(topValue,42)');
        expectFilter(0, 'eq(missingValue,27)');
        expectFilter(1, 'eq("products[].ingredient","codeine")');
        expectFilter(0, 'eq("products[].ingredient","acetaminphen")');
        expectFilter(1, 'eq("facility.name","VAMC")');
        expectFilter(0, 'eq("facility.name","other")');
    });
    it('handles filters with and', function() {
        expectFilter(1, 'eq(topValue,1),eq(strValue,"quick brown fox")');
        expectFilter(0, 'eq(topValue,1),eq(strValue,"wrong")');
        expectFilter(1, 'ne(topValue,2),eq("products[].ingredient","aspirin")');
        expectFilter(1, 'eq(topValue,1),ne("products[].ingredient","acetaminophen")');
        expectFilter(0, 'eq(topValue,1),eq("products[].ingredient","acetaminophen")');
    });
    it('handles filters with or', function() {
        expectFilter(1, 'eq(topValue,1),or(eq(valueA,"red"),eq(valueA,"green"))');
        expectFilter(0, 'eq(topValue,1),or(eq(valueA,"blue"),eq(valueA,"yellow"))');
        expectFilter(1, 'eq(topValue,1),or(eq(valueA,"red"),eq(valueA,"green"))');
    });
    it('handles filters with not', function() {
        expectFilter(1, 'eq(topValue,1),not(eq(valueA,"yellow"),eq(valueA,"green"),eq(valueA,"blue"))');
        expectFilter(0, 'eq(topValue,1),not(eq(valueA,"red"),eq(valueA,"green"),eq(valueA,"blue"))');
        expectFilter(0, 'eq(topValue,1),not(eq(valueA,"red"),eq(valueA,"green"),eq(valueA,"blue"))');
    });
    it('handles the in filter', function() {
        expectFilter(1, 'in(valueA,["red","green","blue"])');
        expectFilter(0, 'in(valueA,["orange","banana","peach"])');
    });
    it('handles the nin filter', function() {
        expectFilter(0, 'nin(valueA,["red","green","blue"])');
        expectFilter(1, 'nin(valueA,["orange","banana","peach"])');
        expectFilter(1, 'nin("products[].ingredient",["acetiminophen","ibuprofin"])');
        expectFilter(0, 'nin("products[].ingredient",["aspirin","codeine"])');
    });
    it('handles the gt, lt, gte, lte filters with numbers', function() {
        // These tests quote the numbers unlike the JDS tests
        // I would rather not loosen the somewhat-strict
        // parser to allow stray dots in strings
        expectFilter(1, 'gt(result,"7.0")');
        expectFilter(0, 'gt(result,"8")');
        expectFilter(1, 'gte(result,"7.5")');
        expectFilter(1, 'gte(result,"7.6")');
        expectFilter(0, 'gte(result,"7.7")');
        expectFilter(1, 'lt(result,"8")');
        expectFilter(0, 'lte(result,"6")');
        expectFilter(1, 'lte(result,"7.6")');
        expectFilter(0, 'lte(result,"7.5")');
        expectFilter(0, 'lt(result,"5")');
    });
    it('handles the gt, lt, gte, lte filters with strings', function() {
        expectFilter(1, 'gt(valueA,"blue")');
        expectFilter(1, 'gt(valueA,"TAN")');
        expectFilter(1, 'gte(valueA,"record")');
        expectFilter(1, 'gte(valueA,"red")');
        expectFilter(0, 'gte(valueA,"reddish")');
        expectFilter(0, 'lt(valueA,"TAN")');
        expectFilter(1, 'lte(valueA,"reddish")');
        expectFilter(1, 'lte(valueA,"red")');
        expectFilter(0, 'lte(valueA,"blue")');
        expectFilter(0, 'lt(valueA,"brown")');
    });
    it('handles the between filter with numbers', function() {
        expectFilter(1, 'between(result,7,8)');
        expectFilter(0, 'between(result,6,7)');
        expectFilter(0, 'between(result,8,9)');
    });
    it('handles the between filter with strings', function() {
        expectFilter(1, 'between(valueA,"rat","rot")');
        expectFilter(0, 'between(valueA,"RAT","ROT")');
        expectFilter(0, 'between(valueA,"reddish","tan")');
    });
    it('handles the like filter', function() {
        expectFilter(1, 'like(strValue,"%brown%")');
        expectFilter(0, 'like(strValue,"%red%")');
        expectFilter(1, 'like(strValue,"%fox")');
        expectFilter(1, 'like("products[].ingredient","asp%")');
        expectFilter(0, 'like("products[].ingredient","ace%")');
        expectFilter(0, 'like("products[].ingredient","%C%")');
    });
    it('handles the ilike filter', function() {
        expectFilter(0, 'ilike("products[].ingredient","ACE%")');
        expectFilter(1, 'ilike("products[].ingredient","%C%")');
    });
    it('handles the exist filter', function() {
        expectFilter(1, 'exists(result)');
        expectFilter(0, 'exists(absent)');
        expectFilter(1, 'exists("orders[].clinician.name")');
        expectFilter(1, 'exists(absent,false)');
    });
    it('handles dates represented as strings', function() {
        expectFilter(1, 'between(observed,"2008","2012")');
        expectFilter(1, 'lt(observed,"201110")');
        expectFilter(1, 'gte(observed,"20110919")');
        expectFilter(0, 'lt(observed,"20080919103426")');
    });
});
