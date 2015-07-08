define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/documents/appletHelper',
    'hbs!app/applets/documents/detail/complex/complexDetailWrapperTemplate',
    'hbs!app/applets/documents/detail/complex/resultsTemplate',
    'hbs!app/applets/documents/detail/complex/resultLinkTemplate',
    'hbs!app/applets/documents/detail/complex/resultDocTemplate',
    'app/applets/documents/detail/dodComplexNoteUtil'
], function(Backbone, Marionette, _, appletHelper, complexDetailWrapperTemplate, resultsTemplate, resultLinkTemplate, resultDocTemplate, dodComplexNoteUtil) {
    'use strict';

    // An item view representing a shortcut link to a result document
    var ResultLinkItemView = Backbone.Marionette.ItemView.extend({
        template: resultLinkTemplate
    });

    // An item view representing a single child ("result") document, of which there may be several
    var ResultDocItemView = Backbone.Marionette.ItemView.extend({
        template: resultDocTemplate
    });

    // A view representing the "results" portion of the detail view (the result documents and the corresponding shortcut links)
    var ResultLinksCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ResultLinkItemView,
    });

    // A collection view for the child ("result") documents
    var ResultDocsCollectionView = Backbone.Marionette.CollectionView.extend({
        className: 'complexDocDetail',
        childView: ResultDocItemView
    });

    // A mid-level view representing the results area, including result links, result documents, and header
    var ResultsView = Backbone.Marionette.LayoutView.extend({
        template: resultsTemplate,
        events: {
            'click .detail-result-link': 'onClickResultLink',
            'keydown .detail-result-link': 'onEnter'
        },
        regions: {
            resultLinksRegion: '#result-links-region',
            resultDocsRegion: '#result-docs-region'
        },
        initialize: function(options) {
            this.resultDocCollection = options.resultDocCollection;
        },
        onEnter: function(keyEvent) {
            if (keyEvent.keyCode === 13 || keyEvent.keyCode === 32) {
                keyEvent.preventDefault();
                $(keyEvent.target).click();
            }
        },
        onClickResultLink: function(event) {
            // handle scrolling the view to the result document when the shortcut link is clicked
            var docUid = $(event.target).attr('data-doc-uid'),
                $targetResult = this.$el.find('.resultDoc[data-doc-uid="' + docUid + '"]');

            if ($targetResult.length > 0) {
                // scroll to the selected result document
                appletHelper.scrollToResultDoc($(event.target), $targetResult);

                // focus first focusable element in the selected result document
                $targetResult.find('*[tabindex]').first().focus();
            }
        },
        onRender: function() {
            // show the shortcut links to the child documents
            this.resultLinksRegion.show(new ResultLinksCollectionView({
                collection: this.resultDocCollection
            }));
            // show the child documents
            this.resultDocsRegion.show(new ResultDocsCollectionView({
                collection: this.resultDocCollection
            }));
        }
    });

    // The top-level view representing a document detail view of a document with child ("result") documents
    var DocumentDetailView = Backbone.Marionette.LayoutView.extend({
        template: complexDetailWrapperTemplate,
        regions: {
            resultsRegion: '#results-region'
        },
        initialize: function(options) {
            this.resultDocCollection = options.resultDocCollection;
            if (this.hasChildDocuments()) {
                this.resultDocCollection.once('all', this.onResultDocsReady, this);
            }
        },
        hasChildDocuments: function() {
            return this.model.get('results') && this.model.get('results').length > 0;
        },
        onResultDocsReady: function() {
            if (this.resultDocCollection.isEmpty()) {
                // if there were no results, hide the loading view and show nothing
                this.resultsRegion.reset();
            } else {
                // otherwise show the results
                this.resultsRegion.show(new ResultsView({
                    resultDocCollection: this.resultDocCollection
                }));
            }
            ADK.Messaging.getChannel('search').trigger('documentsLoaded', this.$el);
        },
        onRender: function() {
            // if we're waiting for child documents to be fetched, show a loading view
            if (this.hasChildDocuments()) {
                this.resultsRegion.show(ADK.Views.Loading.create());
            }
        },
        onShow: function() {
            if (this.model.get('dodComplexNoteContent')) {
                dodComplexNoteUtil.showContent(this.model);
            }
        }
    });

    return DocumentDetailView;
});