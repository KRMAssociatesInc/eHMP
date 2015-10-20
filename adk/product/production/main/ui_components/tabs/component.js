define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {
    'use strict';

    var TabView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            '<a href="#{{clean-for-id label}}-tab-panel" aria-controls="{{clean-for-id label}}-tab-panel" data-toggle="tab" role="tab">' +
            '{{label}}' +
            '<span class="sr-only">You are currently on a tab. There is content below. Continue to arrow down until it indicates that the content is being read.</span>' +
            '</a>',
        ].join("\n")),
        tagName: 'li',
        className: function() {
            if (this.model === this.model.collection.at(0)) {
                return "active";
            }
        },
        attributes: {
            'role': 'presentation'
        }
    });
    var PanelView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile([
            '<span class="sr-only">This is the content for tab 1.</span>',
            '<div></div>'
        ].join("\n")),
        className: function() {
            var className = "tab-pane";
            if (this.model === this.model.collection.at(0)) {
                return className + " active";
            }
            return className;
        },
        regions: {
            'PanelView': 'div',
        },
        attributes: {
            role: 'tabpanel'
        },
        initialize: function() {
            this.View = this.model.get('view');
            // only instantiate if not instantiated already
            if (!_.isFunction(this.View.initialize)) {
                this.View = new this.View();
            }
        },
        onRender: function() {
            this.showChildView('PanelView', this.View);
            var cleanedID = this.model.get('label').replace(/[^A-Z0-9]+/ig, "-");
            cleanedID = cleanedID + '-tab-panel';
            this.$el.attr('id', cleanedID);
        }
    });
    var TabListView = Backbone.Marionette.CollectionView.extend({
        initialize: function(options) {
            this.collection = options.collection;
        },
        childView: TabView,
        tagName: 'ul',
        className: 'nav nav-tabs',
        attributes: {
            'role': 'tablist'
        }
    });
    var TabContentView = Backbone.Marionette.CollectionView.extend({
        initialize: function(options) {
            this.collection = options.collection;
        },
        childView: PanelView,
        className: 'tab-content'
    });
    return Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile([
            '<div class="tab-list-container"></div>',
            '<div class="tab-content-container"></div>',
        ].join("\n")),
        ui: {
            'TabListContainer': '.tab-list-container',
            'TabContentContainer': '.tab-content-container'
        },
        regions: {
            'TabListRegion': '@ui.TabListContainer',
            'TabContentRegion': '@ui.TabContentContainer'
        },
        className: "tab-container",
        initialize: function(options){
            this.tabOptions = options.tabs;
        },
        onBeforeShow: function() {
            if (!(this.tabOptions instanceof Backbone.Collection)) {
                this.tabCollection = new Backbone.Collection(this.tabOptions);
            } else {
                this.tabCollection = this.tabOptions || new Backbone.Collection();
            }
            this.tabListView = new TabListView({
                collection: this.tabCollection
            });
            this.tabContentView = new TabContentView({
                collection: this.tabCollection
            });
            this.showChildView('TabListRegion', this.tabListView);
            this.showChildView('TabContentRegion', this.tabContentView);
        }
    });
});
