'use strict';

describe('rdk', function() {
    var rdk = require('./rdk');

    it('should expose uriBuilder', function() {
        expect(rdk.utils.uriBuilder).not.to.be.undefined();
    });
});

describe('uriBuilder fromUri()', function() {
    var rdk = require('./rdk');
    var uriBuilder = rdk.utils.uriBuilder;

    it('handles empty string', function() {
        var uri = uriBuilder.fromUri('').build();
        var expected = '';

        expect(uri).to.equal(expected);
    });
    it('handles null', function() {
        var uri = uriBuilder.fromUri(null).build();
        var expected = '';

        expect(uri).to.equal(expected);
    });
    it('create simple uri', function() {
        var uri = uriBuilder.fromUri('http://site.com').build();
        var expected = 'http://site.com';

        expect(uri).to.equal(expected);
    });
    it('create simple uri preserves trailing slash', function() {
        var uri = uriBuilder.fromUri('http://site.com/').build();
        var expected = 'http://site.com/';

        expect(uri).to.equal(expected);
    });
});

describe('uriBuilder path()', function() {
    var rdk = require('./rdk');
    var uriBuilder = rdk.utils.uriBuilder;

    it('can combine uri without trailing slash and a single path', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('subpath').build();
        var expected = 'http://site.com/subpath';

        expect(uri).to.equal(expected);
    });
    it('can combine uri with trailing slash and a single path', function() {
        var uri = uriBuilder.fromUri('http://site.com/').path('subpath').build();
        var expected = 'http://site.com/subpath';

        expect(uri).to.equal(expected);
    });
    it('can combine uri without trailing slash and a single path with leading slash', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('/subpath').build();
        var expected = 'http://site.com/subpath';

        expect(uri).to.equal(expected);
    });
    it('can combine uri with trailing slash and a single path with leading slash', function() {
        var uri = uriBuilder.fromUri('http://site.com/').path('/subpath').build();
        var expected = 'http://site.com/subpath';

        expect(uri).to.equal(expected);
    });
    it('trailing slash on path is preserved', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('subpath/').build();
        var expected = 'http://site.com/subpath/';

        expect(uri).to.equal(expected);
    });
    it('append multiple paths', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('a').path('b').build();
        var expected = 'http://site.com/a/b';

        expect(uri).to.equal(expected);
    });
    it('append multiple paths with slashes', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('/a/').path('/b').build();
        var expected = 'http://site.com/a/b';

        expect(uri).to.equal(expected);
    });
    it('ignores path with empty string', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('a').path('').path('b').build();
        var expected = 'http://site.com/a/b';

        expect(uri).to.equal(expected);
    });
    it('ignores path with null string', function() {
        var uri = uriBuilder.fromUri('http://site.com').path('a').path(null).path('b').build();
        var expected = 'http://site.com/a/b';

        expect(uri).to.equal(expected);
    });
    it('can combine uri with query params with a path', function() {
        var uri = uriBuilder.fromUri('http://site.com?query').path('subpath').build();
        var expected = 'http://site.com/subpath?query';

        expect(uri).to.equal(expected);
    });
    it('can handle without base uri', function() {
        var uri = uriBuilder.fromUri('rootpath').path('subpath').build();
        var expected = 'rootpath/subpath';

        expect(uri).to.equal(expected);
    });
    it('can handle without base uri with leading slash', function() {
        var uri = uriBuilder.fromUri('/rootpath').path('subpath').build();
        var expected = '/rootpath/subpath';

        expect(uri).to.equal(expected);
    });
});

describe('uriBuilder query()', function() {
    var rdk = require('./rdk');
    var uriBuilder = rdk.utils.uriBuilder;

    it('can append a single query value', function() {
        var uri = uriBuilder.fromUri('http://site.com').query('key', 'value').build();
        var expected = 'http://site.com?key=value';

        expect(uri).to.equal(expected);
    });
    it('can append a multiple query value', function() {
        var uri = uriBuilder.fromUri('http://site.com').query('key', 'value').query('key2', 'value2').build();
        var expected = 'http://site.com?key=value&key2=value2';

        expect(uri).to.equal(expected);
    });
    it('ignore empty key', function() {
        var uri = uriBuilder.fromUri('http://site.com').query('').build();
        var expected = 'http://site.com';

        expect(uri).to.equal(expected);
    });
    it('ignore null key', function() {
        var uri = uriBuilder.fromUri('http://site.com').query(null).build();
        var expected = 'http://site.com';

        expect(uri).to.equal(expected);
    });
    it('handle empty query param value', function() {
        var uri = uriBuilder.fromUri('http://site.com').query('key', '').build();
        var expected = 'http://site.com?key';

        expect(uri).to.equal(expected);
    });
    it('handle null query param value', function() {
        var uri = uriBuilder.fromUri('http://site.com').query('key', null).build();
        var expected = 'http://site.com?key';

        expect(uri).to.equal(expected);
    });
    it('can append a single query value with base uri having a trailing slash', function() {
        var uri = uriBuilder.fromUri('http://site.com/').query('key', 'value').build();
        var expected = 'http://site.com?key=value';

        expect(uri).to.equal(expected);
    });
    it('can append a single query value with path having a trailing slash', function() {
        var uri = uriBuilder.fromUri('http://site.com/').path('a/').query('key', 'value').build();
        var expected = 'http://site.com/a?key=value';

        expect(uri).to.equal(expected);
    });
});

describe('uriBuilder path()/param()', function() {
    var rdk = require('./rdk');
    var uriBuilder = rdk.utils.uriBuilder;

    it('create uri with param and path out of order', function() {
        var uri = uriBuilder.fromUri('http://site.com').query('key', 'value').path('a').query('key2', 'value2').path('b').build();
        var expected = 'http://site.com/a/b?key=value&key2=value2';

        expect(uri).to.equal(expected);
    });
});
