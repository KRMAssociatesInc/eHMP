define([
    'underscore',
    'main/ADK',
    'backbone',
    'marionette',
    'hbs!main/components/patient/modal/demographicTableTemplate',
    'hbs!main/components/patient/modal/demographicTableRowTemplate'
], function(_, ADK, Backbone, Marionette, demoDiffModalTemplate, simpleDemoItemTemplate){

    var Demographic = Backbone.Model.extend({});
    var Demographics = Backbone.Collection.extend({
        model: Demographic
    });

    var SimpleDemographicView = Backbone.Marionette.ItemView.extend({
        template: simpleDemoItemTemplate,
        tagName: 'tr',
    });

    var TableView = Marionette.CompositeView.extend({
        template: demoDiffModalTemplate,
        childView: SimpleDemographicView,
        childViewContainer: "#demographic-item-container",
        templateHelpers: function() {
            return { items: this.collection.toJSON() };
        }
    });


    return TableView;

});
