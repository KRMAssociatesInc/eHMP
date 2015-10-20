define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {
    'use strict';

    var CollapseView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile(
            '<div></div>'
        ),
        regions: {
            'ChildView': 'div'
        },
        initialize: function(options) {
            this.View = options.view;
            if (!_.isFunction(this.View.initialize)) {
                this.View = new this.View();
            }
        },
        onRender: function() {
            this.showChildView('ChildView', this.View);
        },
        className: 'col-xs-12 collapse-content'
    });

    var HeaderView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<div></div>'),
        regions: {
            'ChildView': 'div'
        },
        initialize: function(options) {
            this.View = options.view;
            if (!_.isFunction(this.View.initialize)) {
                this.View = new this.View();
            }
        },
        onRender: function() {
            this.showChildView('ChildView', this.View);
        },
        className: 'row header-content'
    });

    var CollapsibleContainer = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile([
            '<div class="row">',
                '<div class="well well-collapse">',
                    '<div class="well well-sm", style="overflow: hidden">',
                        '<div class="col-xs-1">',
                            '{{#if collapse}}',
                                '<button id="collapsibleContainerTrigger" class="btn btn-sm icon-btn collapsed" title="Press enter to expand or collapse" type="button" data-toggle="collapse">',
                                '</button>',
                            '{{/if}}',
                        '</div>',
                        '<div class="col-xs-11 {{#unless collapse}} col-xs-offset-1 {{/unless}} collapsibleContainerHeaderRegion">',
                            '<div class="row header-content"></div>',
                        '</div>',
                        '<div class="collapse collapsibleContainerCollapseRegion">',
                        '<div class="col-xs-12 collapse-content"></div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('\n')),
        className: 'collapsible-container-component',
        ui: {
            'HeaderRegionContainer': '.collapsibleContainerHeaderRegion > .header-content',
            'CollapseRegionContainer': '.collapsibleContainerCollapseRegion > .collapse-content'
        },
        regions: {
            'HeaderRegion': '@ui.HeaderRegionContainer',
            'CollapseRegion': '@ui.CollapseRegionContainer'
        },
        initialize: function(options) {
            this.collapsibleContainerHeaderOptions = options.headerItems;
            this.collapsibleContainerCollapseOptions = options.collapseItems;
            this.name = options.name || '';

            this.uid = this.name.replace(/[^A-Z0-9]+/ig, "-");
        },
        onBeforeShow: function() {
            this.headerView = this.collapsibleContainerHeaderOptions.view;
            if (!_.isFunction(this.headerView.initialize)) {
                this.headerView = new this.headerView();
            }

            this.collapseView = this.collapsibleContainerCollapseOptions.view;
            if (!_.isFunction(this.collapseView.initialize)) {
                this.collapseView = new this.collapseView();
            }

            this.$el.find('#collapsibleContainerTrigger').attr('data-target', '#collapsibleContainerCollapseRegion-' + this.uid);

            this.$el.find('.collapsibleContainerCollapseRegion').attr('id', 'collapsibleContainerCollapseRegion-' + this.uid);

            this.showChildView('HeaderRegion', this.headerView);
            this.showChildView('CollapseRegion', this.collapseView);
        },
        serializeData: function() {
            var data = {
                collapse: true
            };
            if (!(_.isFunction(this.collapsibleContainerCollapseOptions.view))) {
                data.collapse = (this.collapsibleContainerCollapseOptions.view.collection.length > 0) ? true : false;
            }
            return data;
        }
    });

    return CollapsibleContainer;
});
