define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/ui_components/tabs/component'
], function(Backbone, PuppetForm, Handlebars, Tabs) {
    'use strict';

    var TabsControlPrototype = {
        template: Handlebars.compile([
            '<div class="form-tabs-region"></div>'
        ].join('\n')),
        ui: {
            'FormTabsRegion': '.form-tabs-region'
        },
        regions: {
            'FormTabsRegion': '@ui.FormTabsRegion'
        },
        defaults: {
            tabs: [],
            extraClasses: []
        },
        initialize: function(options) {
            this.initOptions(options);
            this.setFormatter();
            this.listenToFieldName();
            this.listenToFieldOptions();
            this.setExtraClasses();

            var tabs = this.field.get("tabs");
            if (!(tabs instanceof Backbone.Collection)) {
                this.tabs = new Backbone.Collection(tabs);
            } else {
                this.tabs = tabs || new Backbone.Collection();
            }
            this.collection = this.tabs;

            this.collection.bind('change remove add reset', function() {
              var self = this;
              this.tabContent = _.map(this.collection.models, function(tab) {
                return {
                  label: tab.get('title'),
                  view: function() {
                    var containerField = new PuppetForm.Field({
                      control: "container",
                      items: tab.get('items')
                    });
                    return new PuppetForm.ContainerControl({
                      field: containerField,
                      model: self.model,
                      componentList: self.componentList
                    });
                  }()
                };
              }, this);
              this.render();
            }, this);
            var self = this;
            // for each tab, set the label and view, which is a container control
            // containing each control under the tab's items array
            this.tabContent = _.map(this.collection.models, function(tab) {
                return {
                    label: tab.get('title'),
                    view: function() {
                        var containerField = new PuppetForm.Field({
                            control: "container",
                            items: tab.get('items')
                        });
                        return new PuppetForm.ContainerControl({
                            field: containerField,
                            model: self.model,
                            componentList: self.componentList
                        });
                    }()
                };
            });
        },
        commonOnRender: PuppetForm.CommonPrototype.onRender,
        onRender: function() {
            this.commonOnRender();
            this.showChildView("FormTabsRegion", new Tabs({
                tabs: this.tabContent
            }));
        },
        events: _.defaults({}, PuppetForm.CommonPrototype.events, PuppetForm.CommonContainerEvents.events)
    };
    var TabsControl = PuppetForm.TabsControl = Backbone.Marionette.LayoutView.extend(
        _.defaults(TabsControlPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
    );

    return TabsControl;
});
