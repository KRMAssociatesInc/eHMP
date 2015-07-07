/*jslint node: true */
'use strict';

var ResourceRegistry = require('../modules/resourcedirectory/resourceRegistry');

describe('resource registry', function() {
    it('constructor returns a correctly "newed" instance', function() {
        var registry = new ResourceRegistry();
        expect(registry instanceof ResourceRegistry).toBe(true);
    });

    it('newly constructed registry has no resources registered', function() {
        var registry = new ResourceRegistry();
        expect(registry.getResources().length).toEqual(0);
    });


    it('registering single resource results in one entry', function() {
        var registry = new ResourceRegistry();
        registry.register({
            title: 't1',
            path: 'l1'
        });
        expect(registry.getResources().length).toEqual(1);
    });

    it('registering multiple resources results in multiple entries', function() {
        var registry = new ResourceRegistry();
        expect(registry.getResources().length).toEqual(0);

        registry.register({
            title: 't1',
            path: 'l1'
        });

        registry.register({
            title: 't2',
            path: 'l2'
        });

        expect(registry.getResources().length).toEqual(2);
    });

    it('throws an exception when attempting to add a resource without a title', function() {
        var registry = new ResourceRegistry();
        expect(function() {
            registry.register({
                path: 'l1'
            });
        }).toThrow();
    });

    it('throws an exception when attempting to add a resource without a path', function() {
        var registry = new ResourceRegistry();
        expect(function() {
            registry.register({
                title: 't1'
            });
        }).toThrow();
    });


    it('when adding a resource with unknown fields, those fields do not appear in the registry', function() {
        var registry = new ResourceRegistry();
        registry.register({
            title: 't1',
            path: 'l1',
            custom1: 'x'
        });
        registry.register({
            title: 't2',
            path: 'l2',
            custom2: 'x'
        });

        var directory = registry.getDirectory();

        expect(directory.link[0].title).toBeDefined();
        expect(directory.link[0].href).toBeDefined();
        expect(directory.link[0].custom1).not.toBeDefined();

        expect(directory.link[1].title).toBeDefined();
        expect(directory.link[1].href).toBeDefined();
        expect(directory.link[1].custom2).not.toBeDefined();
    });
});
