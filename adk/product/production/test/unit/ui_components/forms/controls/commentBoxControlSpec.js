'use strict';
define([
    'jquery',
    'backbone',
    'marionette',
    'main/ui_components/components',
    'api/UIComponents',
    'jasminejquery'
], function($, Backbone, Marionette, UI) {
    var $form, form;

    var commentCollection1 = new Backbone.Collection([{
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
    }]);
    var commentCollection2 = new Backbone.Collection([{
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
    }]);
    var commentBoxControlDefinitionBasic = {
        control: "commentBox",
        name: "commentCollection1",
        attributeMapping: {
            comment: "commentString",
            author: "author",
            timeStamp: "timeStamp"
        }
    };
    var commentBoxControlDefinitionInitialValueField = {
        control: "commentBox",
        name: "commentCollection2",
        collection: commentCollection1,
        attributeMapping: {
            comment: "commentString",
            author: "author",
            timeStamp: "timeStamp"
        }
    };
    var commentBoxControlDefinitionInitialValueModel = {
        control: "commentBox",
        name: "commentCollection3",
        attributeMapping: {
            comment: "commentString",
            author: "author",
            timeStamp: "timeStamp"
        }
    };
    var formModel = new Backbone.Model();
    var formModelInitialValue = new Backbone.Model({
        commentCollection3: commentCollection2
    });

    describe('A commentBox control', function() {
        afterEach(function() {
            form.remove();
        });

        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [commentBoxControlDefinitionBasic]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct number of correct wrapping classes', function() {
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body')).toHaveLength(1);
                expect($form.find('.control.comment-box .comment.enter-comment-region')).toHaveLength(1);
            });
            it('contains an input field', function() {
                expect($form.find('.control.comment-box .enter-comment-input-region input')).toHaveLength(1);
            });
            it('contains no comments with no initial value', function() {
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row')).toHaveLength(0);
            });
            it('adds a comment to comment region correctly', function() {
                var charCountSpan = $form.find('.control.comment-box .enter-comment-input-region span.input-char-count');
                var addCommentButton = $form.find('.control.comment-box .enter-comment-button-region button.add-comment-button');
                var addCommentInput = $form.find('.control.comment-box .enter-comment-input-region input');
                expect(charCountSpan).toHaveText('60');
                addCommentInput.val('New comment').trigger('keyup');
                expect(charCountSpan).toHaveText('49');
                expect(addCommentButton).toHaveLength(1);
                addCommentButton.click();
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row')).toHaveLength(1);
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:last-of-type')).toContainText("New comment");
                expect(form.model.get(commentBoxControlDefinitionBasic.name).models[0].get('commentString')).toBe("New comment");
            });
        });

        describe('with initial value in fields', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [commentBoxControlDefinitionInitialValueField]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct number of correct wrapping classes', function() {
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body')).toHaveLength(1);
                expect($form.find('.control.comment-box .comment.enter-comment-region')).toHaveLength(1);
            });
            it('contains correct number of initial comments', function() {
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row')).toHaveLength(commentBoxControlDefinitionInitialValueField.collection.length);
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:nth-of-type(1)')).toContainText(commentBoxControlDefinitionInitialValueField.collection.models[0].get('commentString'));
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:nth-of-type(2)')).toContainText(commentBoxControlDefinitionInitialValueField.collection.models[1].get('commentString'));
            });
            it('adds a comment to comment region correctly', function() {
                var charCountSpan = $form.find('.control.comment-box .enter-comment-input-region span.input-char-count');
                var addCommentButton = $form.find('.control.comment-box .enter-comment-button-region button.add-comment-button');
                var addCommentInput = $form.find('.control.comment-box .enter-comment-input-region input');
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row')).toHaveLength(2);
                expect(charCountSpan).toHaveText('60');
                addCommentInput.val('New comment').trigger('keyup');
                expect(charCountSpan).toHaveText('49');
                expect(addCommentButton).toHaveLength(1);
                addCommentButton.click();
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row')).toHaveLength(3);
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:last-of-type')).toContainText("New comment");
                expect(form.model.get(commentBoxControlDefinitionInitialValueField.name).models[2].get('commentString')).toBe("New comment");
            });
        });

        describe('with initial value in model', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelInitialValue,
                    fields: [commentBoxControlDefinitionInitialValueModel]
                });

                $form = form.render().$el;
                $('body').append($form);
            });
            it('contains correct number of correct wrapping classes', function() {
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body')).toHaveLength(1);
                expect($form.find('.control.comment-box .comment.enter-comment-region')).toHaveLength(1);
            });
            it('contains correct number of initial comments', function() {
                expect(commentBoxControlDefinitionInitialValueModel.name).toBe('commentCollection3');
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row').length).toBe(commentCollection2.length);
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:nth-of-type(1)')).toContainText(commentCollection2.models[0].get('commentString'));
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:nth-of-type(2)')).toContainText(commentCollection2.models[1].get('commentString'));
            });
            it('adds a comment to comment region correctly', function() {
                var charCountSpan = $form.find('.control.comment-box .enter-comment-input-region span.input-char-count');
                var addCommentButton = $form.find('.control.comment-box .enter-comment-button-region button.add-comment-button');
                var addCommentInput = $form.find('.control.comment-box .enter-comment-input-region input');
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row').length).toBe(2);
                expect(charCountSpan).toHaveText('60');
                addCommentInput.val('New comment').trigger('keyup');
                expect(charCountSpan).toHaveText('49');
                expect(addCommentButton).toHaveLength(1);
                addCommentButton.click();
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row').length).toBe(3);
                expect($form.find('.control.comment-box .faux-table-container.comments-container .body .table-row:last-of-type')).toContainText("New comment");
                expect(form.model.get(commentBoxControlDefinitionInitialValueModel.name).models[2].get('commentString')).toBe("New comment");
            });
        });
        describe("using trigger to dynamically change attributes", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModel,
                    fields: [commentBoxControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });

            it("hidden", function() {
                $form.find('.commentCollection1').trigger("control:hidden", true);
                expect($form.find('.commentCollection1')).toHaveClass('hidden');
                $form.find('.commentCollection1').trigger("control:hidden", false);
                expect($form.find('.commentCollection1')).not.toHaveClass('required');

            });
        });
    });
});