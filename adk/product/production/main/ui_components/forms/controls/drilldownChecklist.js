define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/ui_components/forms/controls/select',
    'main/ui_components/forms/controls/checklist'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var ChecklistCollectionContainer = Backbone.Marionette.CollectionView.extend({
        addChild: function(child, ChildView, index) {
            var valueCheckObj = {};
            valueCheckObj[this.selectView.attributeMapping.value] = this.selectedValue;
            if (child == this.collection.where(valueCheckObj)[0]) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },
        childView: PuppetForm.ChecklistControl,
        childViewOptions: function(model, index) {
            var field = this.checklistOptions.set('label', model.get(this.selectView.attributeMapping.label));
            field.set('attributeMapping', _.defaults({
                label: "label"
            }, this.checklistOptions.get('attributeMapping') || {}));
            return {
                field: field,
                model: model,
                componentList: this.componentList
            };
        },
        initialize: function(options) {
            this.checklistOptions = options.checklistOptions;
            this.selectView = options.selectView;
            this.selectOptions = this.selectView.field;
            this.collection = this.selectView.pickList;
            this.selectedValue = options.selectedValue || "";
        },
        updateChecklist: function(selectedValue) {
            this.selectedValue = selectedValue;
            this.render();
        },
        className: "well read-only-well"
    });

    var DrilldownChecklistMethods = {
        template: Handlebars.compile([
            '<div class="col-xs-3 left-pad-md right-pad-xs drilldown-select-region"></div>',
            '<div class="col-xs-9 left-pad-xs drilldown-checklist-region"></div>'
        ].join('\n')),
        ui: {
            'SelectRegion': '.drilldown-select-region',
            'ChecklistRegion': '.drilldown-checklist-region'
        },
        regions: {
            'SelectRegion': '@ui.SelectRegion',
            'ChecklistRegion': '@ui.ChecklistRegion'
        },
        defaults: {

        },
        initialize: function(options) {
            this.initOptions(options);
            this.setFormatter();
            // this.listenToFieldName();
            // this.listenToFieldOptions();
            this.setExtraClasses();

            this.selectOptions = new PuppetForm.Field(this.field.get('selectOptions') || {});
            this.checklistOptions = new PuppetForm.Field(this.field.get('checklistOptions') || {});
            this.selectedValue = this.model.get(this.selectOptions.get('name')) || "";
            this.selectView = new PuppetForm.SelectControl({
                field: this.selectOptions,
                model: this.model,
                componentList: this.componentList
            });
            this.checklistContainerView = new ChecklistCollectionContainer({
                checklistOptions: this.checklistOptions,
                selectView: this.selectView,
                selectedValue: this.selectedValue
            });

            this.listenTo(this.model, 'change:' + this.selectOptions.get('name'), function(model, value) {
                this.selectedValue = model.get(this.selectOptions.get('name'));
                this.checklistContainerView.updateChecklist(this.selectedValue);
            });
        },
        onRender: function() {
            this.$el.addClass(this.field.get('controlName') + '-control ' + this.field.get('name').split('.').shift() + (this.extraClasses ? ' ' + this.extraClasses : ''));
            this.updateInvalid();

            this.showChildView('SelectRegion', this.selectView);
            this.showChildView('ChecklistRegion', this.checklistContainerView);
        }
    };
    var DrilldownChecklist = PuppetForm.DrilldownChecklistControl = Backbone.Marionette.LayoutView.extend(
        _.defaults(DrilldownChecklistMethods, PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions)
    );

    return DrilldownChecklist;
});
