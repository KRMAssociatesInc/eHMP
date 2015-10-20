define([
    "backbone",
    "marionette",
    "underscore",
    "main/components/applet_chrome/chromeView",
    "main/Utils"
], function(Backbone, Marionette, _, ChromeView, Utils) {
    'use strict';
    var AppletControllerView = Backbone.Marionette.LayoutView.extend({
        template: _.template('<div class="gridContainer"><div>'),
        regions: {
            appletRegion: '.gridContainer'
        },
        initialize: function(options) {
            var self = this;
            this.options = options;
            this.model = new Backbone.Model();
            this.setView(this.viewType);
        },
        onShow: function() {
            //this.showViewType(this.viewType);
            this.showView();
        },
        modelEvents: {
            'change currentView': 'showView'
        },
        /**
         *  Grabbing the config for the specified view type from the applet's viewType array
         *  example config:
         *      {type: 'gist', view: AppletGistView ...}
         *  creating a new instance of the viewType's 'view' and showing it inside 'appletRegion'
         *
         *  @param {String} viewType   (ex: 'gist')
         */
        showView: function(viewType) {
            this.appletRegion.show(this.model.get('currentView'));
        },
        setView: function(viewType) {
            var viewConfig = Utils.appletUtils.getViewTypeConfig(this.options, viewType);
            if (!_.isUndefined(viewConfig)){
                this.model.set({
                    'currentViewType':viewType,
                    'currentView': new viewConfig.view(this.options)
                });
            } else if (this.options.defaultView){ //REMOVE
                this.model.set({
                    'currentViewType':this.options.defaultView,
                    'currentView': new this.options.defaultView(this.options)
                });
            } else {
                console.log("View Type: '" + viewType + "' is not available for the " + this.options.appletConfig.id + " applet.");
            }
        },
        changeView: function(viewType){
            this.setView(viewType);
        }
    });

    return AppletControllerView;
});
