define([
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/tabTemplate"
], function(Backbone, Marionette, tabTemplate) {
    var TabModel = Backbone.Model.extend({
        defaults: {
            'searchType': 'mySite'
        }
    });
    var TabView = Backbone.Marionette.ItemView.extend({
        //model: new TabModel(),
        template: tabTemplate,
        tagName: "ul",
        className: "nav nav-tabs",
        attributes: {
            "role": "tablist",
            "id": "patientSearchTabs"
        },
        initialize: function() {
            this.model = new TabModel();
        },
        onRender: function() {
            $(this.el).find('#' + this.model.get('searchType')).addClass('active');
        },
        events: {
            'click #global': 'updateSearchType',
            'click #mySite': 'updateSearchType',
            'click #myCPRSList': 'updateSearchType'
        },
        updateSearchType: function(event) {
            this.model.set({
                'searchType': $(event.currentTarget).attr('id')
            });
        }
    });

    return TabView;
});
