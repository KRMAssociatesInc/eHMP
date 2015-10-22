'use strict';
define([
    'underscore',
    'jquery',
    'backbone',
    'marionette',
    'main/ui_components/components',
    'api/UIComponents',
    'jasminejquery'
], function(_, $, Backbone, Marionette, UI) {
    var $form,
        form;

    var nestedCommentBoxCollection = [{
        id: "diagnosisGroup1",
        label: "Diagnosis Group 1",
        listItems: new Backbone.Collection([{
            id: "group1-diagnosis1",
            label: "group1 Diagnosis 1",
            selectedValue: true,
            addToCL: true,
            primary: true
        }, {
            id: "group1-diagnosis2",
            label: "group1 Diagnosis 2",
            selectedValue: true,
            addToCL: false,
            comments: new Backbone.Collection([{
                commentString: "This might be a non-causative symptom",
                author: {
                    name: "USER,PANORAMA",
                    duz: {
                        "9E7A": "10000000255"
                    }
                },
                timeStamp: "12/12/2014 11:12PM"
            }]),
            primary: false
        }])
    }, {
        id: "diagnosisGroup2",
        label: "Diagnosis Group 2",
        listItems: new Backbone.Collection([{
            id: "group2-diagnosis1",
            label: "group2 Diagnosis 1",
            selectedValue: true,
            addToCL: true,
            comments: new Backbone.Collection([{
                commentString: "This is probably the primary cause of the patients pain",
                author: {
                    name: "USER,PANORAMA",
                    duz: {
                        "9E7A": "10000000255"
                    }
                },
                timeStamp: "12/14/2014 11:15PM"
            }, {
                commentString: "Some additional thoughts: this cause is so weird",
                author: {
                    name: "USER,OTHER",
                    duz: {
                        "9E7A": "10000000238"
                    }
                },
                timeStamp: "12/13/2014 11:17PM"
            }]),
            primary: true
        }, {
            id: "group2-diagnosis2",
            label: "group2 Diagnosis 2",
            selectedValue: false,
            addToCL: false,
            comments: new Backbone.Collection([{
                commentString: "This might be a non-causative symptom",
                author: {
                    name: "USER,OTHER",
                    duz: {
                        "9E7A": "10000000238"
                    }
                },
                timeStamp: "12/19/2014 11:11PM"
            }]),
            primary: false
        }])
    }];


    var nestedCommentBoxControlDefinitionBasic = {
        control: "nestedCommentBox",
        name: "nestedCommentBoxCollection",
        label: "Nested Comment Box Example",
        commentColumn: {
            columnTitle: "Comments",
            columnClasses: ["special-class-2"]
        },
        itemColumn: {
            columnTitle: "Item Descriptive Text",
            columnClasses: ["special-class-1"]
        },
        additionalColumns: [{
            columnClasses: ["special-class-3"],
            columnTitle: "Checkbox",
            name: "checkboxValue",
            control: 'checkbox'
        }, {
            columnClasses: ["special-class-4"],
            columnTitle: "Button",
            name: "buttonValue",
            control: 'button',
            extraClasses: ["btn-xs", "btn-link"],
            type: "button",
            label: "Click Me"
        }],
        collection: new Backbone.Collection(nestedCommentBoxCollection),
        attributeMapping: {
            collection: "listItems",
            commentsCollection: "comments",
            comment: "commentString",
            value: "selectedValue",
            label: "label",
            unique: "id",
            author: "author",
            timeStamp: "timeStamp"
        },
        extraClasses: ["special-class-ncb-1", "special-class-ncb-2"]
    };
    var formModel = new Backbone.Model();
// left to test: removing row, adding row
    describe('A nestedCommentBox control', function() {
        afterEach(function() {
            form.destroy();
        });

        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [nestedCommentBoxControlDefinitionBasic]
                });
                $form = form.render().$el;
                $('body').append($form);
            });
            it('contains correct number of correct wrapping classes', function() {
                expect($form.find('.control.nestedCommentBox-control')).toHaveClass(nestedCommentBoxControlDefinitionBasic.name);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region')).toHaveLength(1);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region')).toHaveLength(1);
                // and contains 3 rows and 3 commentBox controls
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel .panel-heading')).toHaveLength(3);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .ncb-comment-collapse-container .control.comment-box')).toHaveLength(3);
            });
            it('contains correct number of columns', function() {
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div')).toHaveLength(4);
                // will be two more than number of columns because of sr-only and remove divs
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:first-of-type .panel:first-of-type .panel-title > div')).toHaveLength(6);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:first-of-type .panel:first-of-type .panel-title > div:first-of-type')).toHaveClass('sr-only');
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:first-of-type .panel:first-of-type .panel-title > div:last-of-type.ncb-remove-button-region button')).toHaveClass('remove-panel-button');
            });
            it('contains correct column titles from config', function() {
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:first-of-type > span')).toHaveText(nestedCommentBoxControlDefinitionBasic.itemColumn.columnTitle);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:nth-of-type(2) > span')).toHaveText(nestedCommentBoxControlDefinitionBasic.commentColumn.columnTitle);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:nth-of-type(3) > span')).toHaveText(nestedCommentBoxControlDefinitionBasic.additionalColumns[0].columnTitle);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:nth-of-type(4) > span')).toHaveText(nestedCommentBoxControlDefinitionBasic.additionalColumns[1].columnTitle);
            });
            it('contains correct column classes from config', function() {
                // headers
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:first-of-type')).toHaveClass(nestedCommentBoxControlDefinitionBasic.itemColumn.columnClasses[0]);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:nth-of-type(2)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.commentColumn.columnClasses[0]);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:nth-of-type(3)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.additionalColumns[0].columnClasses[0]);
                expect($form.find('.control.nestedCommentBox-control .ncb-header-region > div:nth-of-type(4)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.additionalColumns[1].columnClasses[0]);
                // body
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-title > div:nth-of-type(2)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.itemColumn.columnClasses[0]);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-title > div:nth-of-type(3)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.commentColumn.columnClasses[0]);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-title > div:nth-of-type(4)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.additionalColumns[0].columnClasses[0]);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-title > div:nth-of-type(5)')).toHaveClass(nestedCommentBoxControlDefinitionBasic.additionalColumns[1].columnClasses[0]);
            });
            it('contains correct extra classes from config', function() {
                expect($form.find('.control.nestedCommentBox-control')).toHaveClass(nestedCommentBoxControlDefinitionBasic.extraClasses[0]);
                expect($form.find('.control.nestedCommentBox-control')).toHaveClass(nestedCommentBoxControlDefinitionBasic.extraClasses[1]);
            });
            it('contains only rows from models with value: true', function() {
                // could also just use .panel-title here
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-title > div:nth-of-type(2)')).toHaveLength(3);
                // checking if the text equals the correct text (same for each visible row)
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(1) .panel-title > div:nth-of-type(2)')).toContainText(nestedCommentBoxControlDefinitionBasic.collection.models[0].get('listItems').models[0].get('label'));
                // checking if selectedValue is true (same for each row)
                expect(nestedCommentBoxControlDefinitionBasic.collection.models[0].get('listItems').models[0].get(nestedCommentBoxControlDefinitionBasic.attributeMapping.value)).toBe(true);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(2) .panel-title > div:nth-of-type(2)')).toContainText(nestedCommentBoxControlDefinitionBasic.collection.models[0].get('listItems').models[1].get('label'));
                expect(nestedCommentBoxControlDefinitionBasic.collection.models[0].get('listItems').models[1].get(nestedCommentBoxControlDefinitionBasic.attributeMapping.value)).toBe(true);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(2) .panel:nth-of-type(1) .panel-title > div:nth-of-type(2)')).toContainText(nestedCommentBoxControlDefinitionBasic.collection.models[1].get('listItems').models[0].get('label'));
                expect(nestedCommentBoxControlDefinitionBasic.collection.models[1].get('listItems').models[0].get(nestedCommentBoxControlDefinitionBasic.attributeMapping.value)).toBe(true);
                // checking that the row not visible has false for selectedValue
                expect(nestedCommentBoxControlDefinitionBasic.collection.models[1].get('listItems').models[1].get(nestedCommentBoxControlDefinitionBasic.attributeMapping.value)).toBe(false);
            });
            it('displays show comment button when comments exist in that rows model', function() {
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(2) .panel-title > div:nth-of-type(3) button')).toHaveLength(1);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(2) .panel-title > div:nth-of-type(3) button')).toHaveClass('show-comments-button');
            });
            it('displays add comment link/button when no comments exist in that rows model', function() {
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(1) .panel-title > div:nth-of-type(3) a')).toHaveLength(1);
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(1) .panel-title > div:nth-of-type(3) a')).toHaveClass('show-comments-button');
            });
            it('displays controls specified in additionalColumns', function() {
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(1) .panel-title > div:nth-of-type(4) > div.control')).toHaveClass(nestedCommentBoxControlDefinitionBasic.additionalColumns[0].control + '-control');
                expect($form.find('.control.nestedCommentBox-control .ncb-body-region .panel-container:nth-of-type(1) .panel:nth-of-type(1) .panel-title > div:nth-of-type(5) > div.control')).toHaveClass(nestedCommentBoxControlDefinitionBasic.additionalColumns[1].control + '-control');
            });
        });
        describe("using trigger to dynamically change attributes", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [nestedCommentBoxControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });

            it("hidden", function() {
                $form.find('.nestedCommentBoxCollection').trigger("control:hidden", true);
                expect($form.find('.nestedCommentBoxCollection')).toHaveClass('hidden');
                $form.find('.nestedCommentBoxCollection').trigger("control:hidden", false);
                expect($form.find('.nestedCommentBoxCollection')).not.toHaveClass('hidden');
            });
        });
    });
});