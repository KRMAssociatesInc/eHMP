define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/documents/appletHelper',
    'app/applets/documents/detail/dodComplexNoteUtil',
    'hbs!app/applets/documents/detail/simple/docDetailTemplate'
], function(Backbone, Marionette, _, appletHelper, dodComplexNoteUtil, detailTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: detailTemplate,
        events: {
            'click .detail-result-link': 'onClickResultLink',
            'keydown .detail-result-link': 'onEnter'
        },
        onClickResultLink: function(event) {
            var docUid = $(event.target).attr('data-doc-uid'),
                $targetResult = this.$el.find('.resultDoc[data-doc-uid="' + docUid + '"]');

            if ($targetResult.length > 0) {
                // scroll to the selected result document
                appletHelper.scrollToResultDoc($(event.target), $targetResult);

                // focus first focusable element in the selected result document
                $targetResult.focus();
            }
        },
        onEnter: function(keyEvent) {
            if (keyEvent.keyCode === 13 || keyEvent.keyCode === 32) {
                keyEvent.preventDefault();
                $(keyEvent.target).click();
            }
        },
        onShow: function() {
            if (this.model.get('dodComplexNoteContent')) {
                dodComplexNoteUtil.showContent(this.model);
            }
        }
    });
});
