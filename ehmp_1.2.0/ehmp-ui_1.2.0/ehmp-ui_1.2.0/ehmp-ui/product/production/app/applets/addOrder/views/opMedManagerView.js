define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addOrder/templates/opMedManagerTemplate',
    'app/applets/addOrder/views/searchMeds',
    'app/applets/addOrder/views/opMedOrderView',
    'app/applets/addOrder/views/nonformularyView'
], function(Backbone, Marionette, _, opMedOrderTemplate, SearchMedsView, OrderContentView, NonformularyView) {
    'use strict';
    var sharedModel;

    var OutpatientMedOrderView = Backbone.Marionette.LayoutView.extend({
        template: opMedOrderTemplate,
        regions: {
            searchMedsRegion: '#lookup-med-container',
            medOrderFormRegion: '#med-order-form-container',
            warningRegion: '#warning-container'
        },
        initialize: function(options) {

            sharedModel = new Backbone.Model(this.model.attributes);
            this.model = sharedModel;
        },
        onRender: function() {
            var searchView = new SearchMedsView({
                sharedModel: this.model
            });
            this.searchView = searchView;
            this.searchMedsRegion.show(this.searchView);
            this.$('#change-med-btn').hide();
        },
        events: {
            'click #change-med-btn': 'displaySeachMeds'
        },

        displaySeachMeds: function() {
            this.render();
        },

        modelEvents: {
            'change': 'modelChanged'
        },
        modelChanged: function(e) {
            if (this.model.selectedMed !== undefined) {

                if(this.model.selectedMed.get('formulary') === false){
                    var nonformularyView = new NonformularyView({parentView: this});
                    this.searchMedsRegion.$el.hide();
                    this.warningRegion.show(nonformularyView);
                    // this.medOrderFormRegion.show(nonformularyView);
                } else {
                    var orderContentView = new OrderContentView(this.model.selectedMed);
                    this.orderView = orderContentView;
                    this.searchMedsRegion.reset(); 
                    this.medOrderFormRegion.show(this.orderView);
                    this.$('#change-med-btn').show();

                }

                
            }
        }
    });

    return OutpatientMedOrderView;
});
