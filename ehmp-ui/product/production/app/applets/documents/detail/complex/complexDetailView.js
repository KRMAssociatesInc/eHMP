define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/documents/appletHelper',
    'app/applets/documents/detail/addendaView',
    'hbs!app/applets/documents/detail/complex/complexDetailWrapperTemplate',
    'hbs!app/applets/documents/detail/complex/resultsTemplate',
    'hbs!app/applets/documents/detail/complex/resultLinkTemplate',
    'hbs!app/applets/documents/detail/complex/resultDocTemplate',
    'app/applets/documents/detail/dodComplexNoteUtil'
], function(Backbone, Marionette, _, appletHelper, AddendaView, complexDetailWrapperTemplate, resultsTemplate, resultLinkTemplate, resultDocTemplate, dodComplexNoteUtil) {
    'use strict';

    // An item view representing a shortcut link to a child/result document
    var ResultLinkItemView = Backbone.Marionette.ItemView.extend({
        template: resultLinkTemplate
    });

    // An item view representing a single child/result document, of which there may be several
    var ResultDocItemView = Backbone.Marionette.LayoutView.extend({
        template: resultDocTemplate,
        regions: {
            addendaView: '.document-detail-addenda-region'
        },
        onRender: function() {
            this.addendaView.show(new AddendaView({ model: this.model }));
        }
    });

    // A view representing the children/results portion of the detail view (the child/result documents and the corresponding shortcut links)
    var ResultLinksCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ResultLinkItemView,
    });

    // A collection view for the child/result documents
    var ResultDocsCollectionView = Backbone.Marionette.CollectionView.extend({
        className: 'complexDocDetail',
        childView: ResultDocItemView
    });

    // A mid-level view representing the results or child docs area, including shortcut links, document content, and header
    var ResultsView = Backbone.Marionette.LayoutView.extend({
        template: resultsTemplate,
        events: {
            'click .detail-result-link': 'onClickResultLink',
            'keydown .detail-result-link': 'onEnter'
        },
        regions: {
            resultLinksRegion: '.result-links-region',
            resultDocsRegion: '.result-docs-region'
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
            // show the shortcut links to the child/result documents
            this.resultLinksRegion.show(new ResultLinksCollectionView({
                collection: this.resultDocCollection
            }));
            // show the child/result documents
            this.resultDocsRegion.show(new ResultDocsCollectionView({
                collection: this.resultDocCollection
            }));
        }
    });

    // The top-level view representing a document detail view of a document with child/result documents
    var DocumentDetailView = Backbone.Marionette.LayoutView.extend({
        template: complexDetailWrapperTemplate,
        regions: {
            addendaRegion: '.document-detail-addenda-region',
            resultsRegion: '#results-region',
            childrenRegion: '#children-region'
        },
        initialize: function(options) {
            this.childDocCollection = options.childDocCollection;
            this.resultDocCollection = options.resultDocCollection;
            if (this.hasChildDocuments()) {
                this.childDocCollection.once('all', this.onChildDocsReady, this);
            }
            if (this.hasResultDocuments()) {
                this.resultDocCollection.once('all', this.onResultDocsReady, this);
            }
        },
        hasResultDocuments: function() {
            return this.model.get('results') && this.model.get('results').length > 0;
        },
        hasChildDocuments: function() {
            return this.childDocCollection !== null && this.childDocCollection !== undefined;
        },
        onResultDocsReady: function() {
            if (this.resultDocCollection.isEmpty()) {
                // if there were no results, hide the loading view and show nothing
                this.resultsRegion.reset();
            } else {
                // otherwise show the results
                this.resultsRegion.show(new ResultsView({
                    resultDocCollection: this.resultDocCollection,
                    model: new Backbone.Model({
                        regionTitle: 'Results'
                    })
                }));
            }
            ADK.Messaging.getChannel('search').trigger('documentsLoaded', this.$el);
        },
        onChildDocsReady: function() {
            if (this.childDocCollection.isEmpty()) {
                // if there were no child documents, hide the loading view and show nothing
                this.childrenRegion.reset();
            } else {
                // otherwise show the child documents
                this.childrenRegion.show(new ResultsView({
                    resultDocCollection: this.childDocCollection,
                    model: new Backbone.Model({
                        regionTitle: 'Child Documents'
                    })
                }));
            }
            ADK.Messaging.getChannel('search').trigger('documentsLoaded', this.$el);
        },
        onRender: function() {
            this.addendaRegion.show(new AddendaView({ model: this.model }));

            // if we're waiting for child documents to be fetched, show a loading view
            if (this.hasChildDocuments()) {
                this.childrenRegion.show(ADK.Views.Loading.create());
            }
            // if we're waiting for result documents to be fetched, show a loading view
            if (this.hasResultDocuments()) {
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