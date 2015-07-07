define([
    "app/applets/medication_review_v2/medicationCollectionHandler",
    "hbs!app/applets/medication_review_v2/templates/appletLayout",
    "app/applets/medication_review_v2/views/medicationListView"
], function(CollectionHandler, AppletLayout, MedicationListView) {


    var AppletLayoutView = Backbone.Marionette.CompositeView.extend({
        template: AppletLayout,
        childView: MedicationListView,
        childViewContainer: "#medsReviewApplet_mainContentArea",
        initialize: function(options) {
            this._super = Backbone.Marionette.CompositeView.prototype;
            this.collection = options.collection;
            this._super.initialize.apply(this, arguments);
        },
        onRender: function() {
            var instanceID = $('[data-appletid="medication_review_v2"]').attr('data-instanceid');
            var chromeHeight = $('#' + instanceID).height() - 30;
            $('[data-appletid="medication_review_v2"]').find('.grid-container').height(chromeHeight.toString() + 'px');
            //$('[data-appletid="medication_review_v2"]').find('.grid-container').attr('data-sizey', 12);
        }
    });
    var AppletView = ADK.Applets.BaseDisplayApplet.extend({
        initialize: function(options) {
            var self = this;
            this._super = ADK.Applets.BaseDisplayApplet.prototype;
            this.appletOptions = {
                collection: CollectionHandler.fetchAllMeds(true),
                AppletView: AppletLayoutView,
                filterFields: ['name', 'sig', 'standardizedVaStatus', 'drugClassName']
            };
            this.$el.addClass('gridster');
            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dateRangeRefresh();
            });
            this.appletOptions.collection.on("customfilter", this.onCustomFilter, this);
            this.appletOptions.collection.on("clear_customfilter", this.onClearCustomFilter, this);
            this._super.initialize.apply(this, arguments);
        },
        dateRangeRefresh: function() {

            this.loading();

            var collection = this.appletOptions.collection;
            this.loading();
            this.displayAppletView = new this.appletOptions.AppletView(this.appletOptions);

            if (this.appletOptions.collection instanceof Backbone.PageableCollection) {
                this.appletOptions.collection.fullCollection.reset();
            } else {
                this.appletOptions.collection.reset();
            }


            ADK.ResourceService.fetchCollection(this.appletOptions.collection.fetchOptions, this.appletOptions.collection);
        },
        onCustomFilter: function(search) {
            if (CollectionHandler.shadowCollection === undefined) {
                return;
            }
            var self = this;
            var filtered = CollectionHandler.shadowCollection.filter(function(item) {
                var filterString = '';
                _.each(self.appletOptions.filterFields, function(field) {
                    if (field === 'drugClassName') {
                        var productLength = item.get('products') !== undefined ? item.get('products').length : 0;
                        for (var i=0; i< productLength; i++) {
                            if (item.get('products')[i].drugClassName !== undefined) {
                                filterString = filterString + ' ' + item.get('products')[i].drugClassName;
                            }
                        }
                    } else {
                        filterString = filterString + ' ' + item.get(field);
                    }

                });
                return search.test(filterString);
            });
            var filteredCollection = new Backbone.Collection();
            filteredCollection.reset(filtered);
            var filteredGrouped = CollectionHandler.groupCollectionModels(filteredCollection);
            this.appletOptions.collection.reset(filteredGrouped);
        },

        onClearCustomFilter: function() {
            var originalCollection = new Backbone.Collection();
            console.log(CollectionHandler.shadowCollection);
            originalCollection.reset(CollectionHandler.shadowCollection.models);
            var originalGrouped = CollectionHandler.groupCollectionModels(originalCollection);
            this.appletOptions.collection.reset(originalGrouped);
        }
    });
    return AppletView;
});
