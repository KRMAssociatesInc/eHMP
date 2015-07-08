define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/addAllergy/templates/allergenSearchResultTemplate",
    "hbs!app/applets/addAllergy/templates/allergenSearchTemplate",
    "app/applets/addAllergy/allergySelectedView",
    "hbs!app/applets/addAllergy/templates/AllergenSearchResultCompositeViewTemplate",
    "app/applets/addAllergy/utils/allergiesUtil",
    "app/applets/addAllergy/utils/modelBindingUtil",
    "app/applets/addAllergy/models/allergenModel",
    "app/applets/addAllergy/allergenSearchEventHandler"
], function(Backbone, Marionette, _, AllergenSearchResultTemplate, AllergenSearchTemplate, selectedModalView, AllergenSearchResultCompositeViewTemplate, AllergiesUtil, ModelBindingUtil, AllergenModel, AllergenSearchEventHandler) {

    var GridView;

    var allergySearchModalOptions = {
        'title': 'Add New Allergy',
        'regionName': 'allergySearch'
    };

    var AllergenSearchResultView = Backbone.Marionette.ItemView.extend({
        tagName: "li",
        className: "list-unstyled row-layout",
        template: AllergenSearchResultTemplate,
        events: {
            "click": "selectAllergen"
        },
        initialize: function() {

        },
        selectAllergen: function(event) {
            event.preventDefault();

            //pass in function pointer so that we can get back to this modal
            var View = selectedModalView.extend({
                navToSearch: this.navToSearch,
                gridView: GridView
            });

            if (!this.selectedView) {
                this.selectedView = new View();
            }
            var destroy = (this.selectedView.model.get('IEN') === this.model.get('IEN')) ? false : true;
            this.selectedView.setAllergen(this.model); //copy all relevant data to new view's model

            this.selectedView.showModal(destroy);
        },
        navToSearch: function(event) {
            event.preventDefault();
            ADK.showWorkflowItem(AppletLayoutView, allergySearchModalOptions);
        },
    });

    var AllergenSearchResultsCompositeView = Backbone.Marionette.CompositeView.extend({
        initialize: function() {
            this.collection = new Backbone.Collection(this.model.get("results"));
        },
        childView: AllergenSearchResultView,
        childViewContainer: "#allergen-search-result-item-container",
        template: AllergenSearchResultCompositeViewTemplate
    });

    var AllergenSearchResultsView = Backbone.Marionette.CollectionView.extend({

        onAddChild: function(childView) {
            // If the child being added has an empty collection
            if (childView.collection.isEmpty()) {
                // Destroy it
                childView.destroy();
            }
        },
        onRender: function() {
            var hasData = typeof this.collection !== 'undefined';
            if (hasData) {
                var total = 0;
                this.collection.each(function(item) {
                    total += item.get('results').length;
                });
                // Get the search results view
                if (total === 0) {
                    var group = $("#allergen-search-results .allergen-list-group");
                    group.append($("<li id='allergen-search-results-empty'>No Results Found.</li>"));
                } else {
                    // Results Found, remove the notice.
                    $("#allergen-search-results-empty").remove();
                }
            }

        },

        childView: AllergenSearchResultsCompositeView,
        tagName: "li",
        className: "allergen-list-group"
    });

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend(ModelBindingUtil).extend({
        template: AllergenSearchTemplate,
        className: 'add-allergy-styles',
        regions: {
            allergenSearchResults: "#allergen-search-results",
            allergenSearchError: "#error-container"
        },
        initialize: function() {
            this.errorView = new ADK.Views.ServerSideError();
            this.model = new AllergenModel();
        },
        onRender: function() {
            this.loadSearchResults('');
            AllergiesUtil.enableLoadingIndicator(true);
            this.allergenSearchError.show(this.errorView);
        },
        events: {
            'click #allergenSearchButton': 'search',
            'keyup #allergenSearchInput': 'search',
        },
        search: function(e) {
            var that = this;
            if (allergenSearchInput.value.length >= 3) {
                AllergiesUtil.enableLoadingIndicator(true);
                var fetchOptions = {
                    resourceTitle: "allergy-op-data-search",
                    reset: true,
                    data: $.param({
                        'searchParam': allergenSearchInput.value.toUpperCase()
                    }),
                    error: function(model, resp) {
                        AllergiesUtil.enableLoadingIndicator(false);
                        that.showError(resp);
                    },
                    success: function(model, resp) {
                        AllergiesUtil.enableLoadingIndicator(false);
                        $('#allergy-loading-annoucement').hide();
                        $('#allergy-loading-annoucement').text('Lookup complete');
                        $('#allergy-loading-annoucement').show();
                    }
                };
                var AllergyCollection = Backbone.Collection.extend({
                        url: ADK.ResourceService.buildUrl(fetchOptions.resourceTitle)
                    }),
                    allergyCollection = new AllergyCollection();
                allergyCollection.fetch(fetchOptions);
                this.collection = allergyCollection;

                this.loadSearchResults(e);
            }
        },
        submitAllergenSearch: function(event) {
            if (event.keyCode !== 9) {
                AllergenSearchEventHandler.setView(this);
                AllergiesUtil.performActionWhileTyping(event, 'keyup', 2, 500, AllergenSearchEventHandler.allergenEventHandler);
            }
        },
        showError: function(resp) {
            this.errorView.addError(resp.responseText);
        },
        showModal: function(event, gridView) {
            event.preventDefault();
            GridView = gridView;
            ADK.showWorkflowItem(this, allergySearchModalOptions);
        },
        loadSearchResults: function(event) {
            var allergensView = new AllergenSearchResultsView({
                collection: this.collection
            });
            this.allergenSearchResults.show(allergensView);
            $("#allergen-search-result-composite-outer-div").find("a").attr("tabindex", 0);
            this.submitAllergenSearch(event);
        }
    });

    return AppletLayoutView;
});
