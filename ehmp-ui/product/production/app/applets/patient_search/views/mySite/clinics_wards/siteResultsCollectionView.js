define([
    "backbone",
    "marionette",
    "app/applets/patient_search/views/mySite/clinics_wards/singleSearchResultView",
    "app/applets/patient_search/views/common/blankView"
], function(Backbone, Marionette, SingleSearchResultView, BlankView) {

    var SCROLL_TRIGGERPOINT = 50;
    var SCROLL_ADDITIONAL_ROWS = 100;
    var INITIAL_NUMBER_OF_ROWS = 30;

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: _.template('<h5 class="loading"><i class="fa fa-spinner fa-spin"></i> Loading...</h5>'),
    });

    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: _.template('<p class="error-message padding" role="alert" tabindex="0">No results found.</p>'),
        tagName: "p"
    });

    var SiteResultsCollectionView = Backbone.Marionette.CollectionView.extend({
        searchView: undefined,
        locationFilterView: undefined,
        emptyView: LoadingView,
        initialize: function(options) {
            this.searchView = options.searchView;
            this.locationFilterView = options.locationListFilterView;
            this.locationType = options.locationType;
            this.searchApplet = options.searchApplet;
            var siteCode = ADK.UserService.getUserSession().attributes.site;
            var searchOptions = {
                resourceTitle: 'locations-' + this.locationType,
                criteria: {
                    "site.code": siteCode,
                    itemsPerPage: 20
                },
                cache: false,
                pageable: true
            };
            var self = this;
            searchOptions.onError = function(model, resp) {
                self.emptyView = ErrorView;
                self.render();
            };
            searchOptions.onSuccess = function(resp) {
                self.emptyView = ErrorView;
                self.collection.setPageSize(INITIAL_NUMBER_OF_ROWS);
                self.updateResults(self.locationFilterView.model);
                self.render();
            };

            this.collection = ADK.ResourceService.fetchCollection(searchOptions);
            this.listenTo(this.locationFilterView.model, 'change:filterString', this.updateResults);
        },
        onRender: function() {},
        childView: SingleSearchResultView,
        childViewOptions: function() {
            return {
                searchView: this.searchView,
                locationCollectionView: this,
                locationType: this.locationType,
                searchApplet: this.searchApplet
            };
        },
        fields: ['displayName'],
        fetchRows: function(event) {
            var e = event.currentTarget;
            if ((e.scrollTop + e.clientHeight + SCROLL_TRIGGERPOINT > e.scrollHeight) && this.collection.hasNextPage()) {
                console.log('Scroll Event');
                event.preventDefault();
                this.collection.setPageSize(this.collection.state.pageSize + SCROLL_ADDITIONAL_ROWS);
            }
        },
        updateResults: function(filterModel) {
            this.collection.setPageSize(INITIAL_NUMBER_OF_ROWS, {silent: true});
            this.collection.fullCollection.reset(this.collection.originalModels, {silent: true});
            var matcher = _.bind(this.makeMatcher(filterModel.get('filterString').toLowerCase()), this);
            this.collection.getFirstPage({
                silent: true
            });
            this.collection.fullCollection.reset(this.collection.fullCollection.filter(matcher), {
                reindex: false
            });
        },
        makeMatcher: function(query) {
            var regexp = this.makeRegExp(query);
            return function(model) {
                var keys = this.fields || model.keys();
                for (var i = 0, l = keys.length; i < l; i++) {
                    if (regexp.test(model.get(keys[i]) + "")) return true;
                }
                return false;
            };
        },
        makeRegExp: function(query) {
            return new RegExp(query.trim().split(/\s+/).join("|"), "i");
        },
        tagName: "div",
        className: "list-group"
    });

    return SiteResultsCollectionView;

});
