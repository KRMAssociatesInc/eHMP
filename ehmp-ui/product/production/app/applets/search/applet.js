define([
    "backbone",
    "marionette",
    "underscore",
    "app/applets/search/searchView",
    "hbs!app/applets/search/templates/searchTemplate",
    "app/applets/search/eventHandlers"
], function(Backbone, Marionette, _, searchView, searchTemplate, eventHandlers) {

    var SearchModel = Backbone.Model.extend({
        defaults: {

        }
    });

    var searchModel = new SearchModel();

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        initialize: function() {
            this.searchView = new searchView();
        },
        onRender: function() {
            this.appletMain.show(this.searchView);
        },
        template: searchTemplate,
        model: searchModel,
        regions: {
            appletMain: "#search-applet-main"
        }
    });

    var applet = {
        id: "search",
        getRootView: function() {
            return AppletLayoutView;
        }
    };

    return applet;
});
