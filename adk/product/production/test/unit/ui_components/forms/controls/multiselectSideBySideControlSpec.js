/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(["jquery", "handlebars", "backbone", "marionette", "main/ui_components/components", "api/UIComponents", "jasminejquery"],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $form, form;

        var multiselectSideBySideControlDefinition_1 = {
                control: "multiselectSideBySide",
                name: "items",
                label: "Items",
                extraClasses: ["class1", "class2"]
            },
            multiselectSideBySideControlDefinition_2 = {
                control: "multiselectSideBySide",
                name: "items",
                label: "Items",
                extraClasses: ["class1", "class2"],
                attributeMapping: {
                    unique: 'id',
                    value: 'booleanValue',
                    label: 'description'
                }
            },
            formModel_1 = new Backbone.Model({
                items: new Backbone.Collection([{
                    unique: '001',
                    label: 'Item 01',
                    value: true
                }, {
                    unique: '002',
                    label: 'Item 02',
                    value: false
                }, {
                    unique: '003',
                    label: 'Item 03',
                    value: undefined
                }])
            }),
            formModel_2 = new Backbone.Model({
                items: new Backbone.Collection([{
                    id: '001',
                    description: 'Item 01',
                    booleanValue: true
                }, {
                    id: '002',
                    description: 'Item 02',
                    booleanValue: false
                }, {
                    id: '003',
                    description: 'Item 03',
                    booleanValue: undefined
                }])
            });

        describe("A multiselectSideBySide control", function() {
            afterEach(function() {
                form.remove();
            });

            describe("basic", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel_1,
                        fields: [multiselectSideBySideControlDefinition_1]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });

                it("contains correct wrapper", function() {
                    expect($form.find('.row.control.multiselectSideBySide-control.items')).toBeInDOM();
                    expect($form.find('.control > .mssbs')).toBeInDOM();
                });
                it("contains two container regions", function() {
                    expect($form.find('.mssbs > .col-md-6').length).toBe(2);
                    expect($form.find('.control > .mssbs')).toBeInDOM();
                    expect($form.find('.control > .mssbs > .available-region')).toBeInDOM();
                    expect($form.find('.control > .mssbs > .selected-region')).toBeInDOM();
                });
                it("contains correct panel headings", function() {
                    expect($form.find('.available-region .panel-default.panel-w-list-group > .panel-heading > .row > .mssbs-header')).toBeInDOM();
                    expect($form.find('.available-region .mssbs-header')).toContainText("Available");
                    expect($form.find('.available-region .panel-heading .mssbs-input > .control.form-group > input.input-sm.filter')).toBeInDOM();

                    expect($form.find('.selected-region .faux-table > .header > .table-row')).toBeInDOM();
                    expect($form.find('.selected-region .faux-table > .header > .table-row > div:first-of-type')).toContainText("Selected");
                    expect($form.find('.selected-region .faux-table > .header > input.input-sm.filter')).not.toBeInDOM();
                });
                it("initial render of items are placed in correct regions", function() {
                    expect($form.find('.available-region ul.list-group > li.list-group-item').length).toBe(2);
                    expect($form.find('.available-region ul > li.list-group-item:nth-child(1) > .row > .col-xs-10')).toContainText('Item 02');
                    expect($form.find('.available-region ul > li.list-group-item:nth-child(2) > .row > .col-xs-10')).toContainText('Item 03');

                    expect($form.find('.selected-region .faux-table > .body > .table-row').length).toBe(1);
                    expect($form.find('.selected-region .faux-table > .body > .table-row:first-of-type > div:first-of-type ')).toContainText('Item 01');
                });
                it("clicking plus button moves item from available to selected", function() {
                    expect($form.find('.available-region ul > li.list-group-item').length).toBe(2);
                    $form.find("button[title='Press enter to add Item 03.']").focus().click();
                    expect($form.find('.available-region ul > li.list-group-item').length).toBe(1);
                    expect($form.find('.available-region ul > li.list-group-item > .row > .col-xs-10')).toContainText('Item 02');
                });
                it("clicking x button moves item from selected to available", function() {
                    expect($form.find('.selected-region .faux-table > .body > .table-row').length).toBe(2);
                    $form.find("button[title='Press enter to remove Item 01.']").focus().click();
                    expect($form.find('.selected-region .faux-table > .body > .table-row').length).toBe(1);
                    expect($form.find('.selected-region .faux-table > .body > .table-row:first-of-type > div:first-of-type')).toContainText('Item 03');
                });
                it("removing all items from selected container leaves 'No Items found' text", function() {
                    expect($form.find('.selected-region .faux-table > .body > .table-row').length).toBe(1);
                    $form.find("button[title='Press enter to remove Item 03.']").focus().click();
                    expect($form.find('.selected-region .faux-table > .body > .table-row').length).toBe(1);
                    expect($form.find('.selected-region .faux-table > .body > .table-row:first-of-type p')).toContainText('No Items found');
                });
                it("removing all items from available container leaves 'No Providers Found' text", function() {
                    expect($form.find('.available-region ul.list-group > li.list-group-item').length).toBe(3);
                    $form.find("button[title='Press enter to add Item 01.']").focus().click();
                    $form.find("button[title='Press enter to add Item 02.']").focus().click();
                    $form.find("button[title='Press enter to add Item 03.']").focus().click();
                    expect($form.find('.available-region ul > li.list-group-item').length).toBe(1);
                    expect($form.find('.available-region ul > li.list-group-item > .row > .col-xs-12 > p')).toContainText('No Items found');
                });
                it("correct filtering of available items", function() {
                    $form.find("button[title='Press enter to remove Item 01.']").focus().click();
                    $form.find("button[title='Press enter to remove Item 02.']").focus().click();
                    $form.find("button[title='Press enter to remove Item 03.']").focus().click();
                    expect($form.find('.available-region ul > li.list-group-item').length).toBe(3);

                    $form.find('.available-region input.filter:text').val('03').trigger('keyup');
                    expect($form.find('.available-region input.filter:text')).toHaveValue('03');

                    expect($form.find('.available-region ul > li.list-group-item').length).toBe(1);
                    // expect($form.find('.available-region ul > li.list-group-item > .row > .col-xs-10')).toContainText('Item 03');
                });
            });
        });

    });
