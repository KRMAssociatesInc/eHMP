/**
 * Created by alexluong on 7/1/15.
 */

/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
    function($, Backbone, Marionette, UI) {
        var $form, form;

        var testItems = [{
            label: 'Sub Item 1',
            id: 'item-1',
            extraClasses: ['extra-class-a']
        }, {
            label: 'Sub Item 2',
            id: 'item-2',
            extraClasses: ['extra-class-b']
        }];
        var dropdownControlDefinitions = [{
            control: 'dropdown',
            split: false,
            label: 'Dropdown Label 1',
            icon: 'fa-list',
            id: 'dropdown-a',
            items: testItems
        }, {
            control: 'dropdown',
            split: true,
            label: 'Dropdown Label 2',
            icon: 'fa-heartbeat',
            id: 'dropdown-b',
            type: 'submit',
            items: testItems
        }];

        var formModel = new Backbone.Model();

        describe('A dropdown control', function() {
            afterEach(function() {
                form.remove();
            });
            describe('basic', function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: dropdownControlDefinitions
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });
                it('has the same number of controls as defined', function() {
                    expect($form.find('.control').length).toBe(2);
                });
                it('builds regular dropdown or split dropdown based on option', function() {
                    expect($('.btn-group:eq(0) > button')).toHaveLength(1);
                    expect($('.btn-group:eq(1) > button')).toHaveLength(2);
                });
                it('contains label text', function() {
                    expect($('.btn-group:eq(0) > button')).toContainText(dropdownControlDefinitions[0].label);
                    expect($('.btn-group:eq(1) > button')).toContainText(dropdownControlDefinitions[1].label);
                });
                it('contains icon', function() {
                    expect($('.btn-group:eq(0) > button > i')).toHaveClass('fa-list');
                    expect($('.btn-group:eq(1) > button > i')).toHaveClass('fa-heartbeat');
                });
                it('contains type attribute', function() {
                    expect($('.btn-group:eq(0) > button')).toHaveAttr('type', 'button');
                    expect($('.btn-group:eq(1) > button')).toHaveAttr('type', 'submit');
                });
                it('contains id', function() {
                    expect($('.btn-group:eq(0) > button')).not.toHaveId('dropdown-a');
                    expect($('.btn-group:eq(1) > button')).toHaveId('dropdown-b');
                });
                describe('items', function() {
                    it('contains correct number of items', function() {
                        expect($('.btn-group:eq(0) > ul > li')).toHaveLength(2);
                    });
                    it('contain labels', function() {
                        expect($('.btn-group:eq(0) > ul > li:eq(0)')).toContainText(testItems[0].label);
                        expect($('.btn-group:eq(0) > ul > li:eq(1)')).toContainText(testItems[1].label);
                    });
                    it('contain ids as dropdown id-item id', function() {
                        expect($('.btn-group:eq(0) > ul > li:eq(0)')).toHaveId(dropdownControlDefinitions[0].id + '-' + testItems[0].id);
                        expect($('.btn-group:eq(1) > ul > li:eq(1)')).toHaveId(dropdownControlDefinitions[1].id + '-' + testItems[1].id);
                    });
                    it('contain extra classes', function() {
                        expect($('.btn-group:eq(0) > ul > li:eq(0)')).toHaveClass(testItems[0].extraClasses[0]);
                        expect($('.btn-group:eq(0) > ul > li:eq(1)')).toHaveClass(testItems[1].extraClasses[0]);
                    });
                });
                xdescribe("using trigger to dynamically change attributes", function() {
                    beforeEach(function() {
                        form = new UI.Form({
                            model: formModel,
                            fields: [dropdownControlDefinitions]
                        });
                        $form = form.render().$el;
                        $("body").append($form);
                    });

                    it("hidden", function() {
                        $form.find('.dropdown-a').trigger("control:hidden", true);
                        expect($form.find('.inputValue')).toHaveClass('hidden');
                        $form.find('.inputValue').trigger("control:hidden", false);
                        expect($form.find('.inputValue')).not.toHaveClass('hidden');

                    });
                });
            });
        });
    });