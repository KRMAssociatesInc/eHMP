define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addOrder/templates/searchMedsResultTemplate',
    'hbs!app/applets/addOrder/templates/searchMedsTemplate',
    'app/applets/addOrder/helpers/searchUtil',
    'app/applets/addOrder/helpers/searchMedsEventHandler',
    'app/applets/addOrder/helpers/searchMedsScrollEventHandler',
], function(Backbone, Marionette, _, SearchMedsResultTemplate, SearchMedsTemplate, SearchUtil, SearchEventHandler, ScrollEventHandler) {
    'use strict';

    var selectedMed;

    var SearchMedsResultView = Backbone.Marionette.ItemView.extend({
        template: SearchMedsResultTemplate,
        tagName: 'li',
        events: {
            'click': 'selectMed'
        },

        selectMed: function(evt) {
            evt.preventDefault();
            selectedMed = new Backbone.Model(this.model.attributes);

        }
    });

    var SearchMedsResultsView = Backbone.Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'nav nav-stacked',
        attributes: {
            'id': 'meds-ul',
            'role': 'menu'
        },
        childView: SearchMedsResultView,
        childViewContainer: '#search-scroll',
        initialize: function(options) {
            this.collection = new Backbone.Collection();
        }
    });

    var SearchView = Backbone.Marionette.LayoutView.extend({
        template: SearchMedsTemplate,
        className: 'add-medication-styles',
        regions: {
            searchMedsResults: '#med-results-inner-container',
            medOrderForm: '#med-order-form-container'
        },
        initialize: function(options) {
            this.sharedModel = options.sharedModel;
        },
        onRender: function() {
            var medsView = new SearchMedsResultsView();
            this.medsView = medsView;
            this.searchMedsResults.show(medsView);

            SearchUtil.enableLoadingIndicator(true);
            ScrollEventHandler.setView(this);
        },
        events: {
            'keyup #medsSearchInput': 'submitSearchMeds',
            'click #med-results-inner-container': 'clicked',

            'keydown input': function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                }
            }
        },

        clicked: function() {
            this.sharedModel.nameDesc = selectedMed.get('name') + ' ' + SearchUtil.escapeHtml(selectedMed.get('desc'));
            this.sharedModel.selectedMed = selectedMed;
            this.sharedModel.trigger('change');
        },

        submitSearchMeds: function(event) {
            if (event.keyCode !== 9) {
                $('#search-scroll').unbind('scroll', ScrollEventHandler.handleScroll);
                SearchEventHandler.setView(this);
                SearchUtil.performActionWhileTyping(event, 'keyup', 2, 500, SearchEventHandler.medsEventHandler);
            }
        }

    });

    return SearchView;
});
