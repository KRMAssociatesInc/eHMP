define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/ui_components/forms/controls/commentBox'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var STRowItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            '{{#each columns}}' +
            '<div><span>{{value}}</span></div>' + //data
            '{{/each}}'
        ].join('\n')),
        tagName: 'a',
        className: 'table-row',
        attributes: {
            'href': '#'
        },
        initialize: function(options) {
            this.field = options.field;
            this.formModel = options.formModel;
        },
        onRender: function() {
            if (this.formModel.get(this.field.get('name')) && _.isEqual(this.model.attributes, this.formModel.get(this.field.get('name')).attributes)) {
                this.$el.addClass('active');
            }
        },
        serializeModel: function(model) {
            var attributes = model.toJSON();
            return {
                columns: _.map(this.field.get('columns'), function(column) {
                    return _.extend(column, {
                        value: attributes[column.id]
                    });
                })
            };
        },
        events: {
            'click': 'assignModel'
        },
        assignModel: function(e) {
            e.preventDefault();
            this.formModel.set(this.field.get('name'), this.model);
            this.trigger('click:table:row', this);
        }
    });

    var SelectableTablePrototype = {
        template: Handlebars.compile([
            '<div class="col-xs-12">', // container
            '<div id="{{#if id}}{{clean-for-id id}}{{else}}{{clean-for-id name}}{{/if}}" class="faux-table-container">', // wrapper for control
            '<div class="faux-table">',
            '<div class="header">',
            '<div class="table-row">',
            '{{#each columns}}' +
            '<div><div>{{title}}</div></div>' +
            '{{/each}}',
            '</div>', // header row
            '</div>', // header (composite's "item view")
            '<div class="body"></div>', // body (composite's "collection view")
            '</div>', // faux-table
            '</div>', // wrapper for control
            '</div>' // container
        ].join('\n')),
        ui: {
            'BodyContainer': '.faux-table-container .body'
        },
        initialize: function(options) {
            this.initOptions(options);
            this.setAttributeMapping();
            this.setFormatter();
            this.setExtraClasses();
            // takes in a collection to generate table (different from other controls)
            if (!(this.field.get('collection') instanceof Backbone.Collection)) {
                this.collection = new Backbone.Collection(this.field.get('collection'));
            } else {
                this.collection = this.field.get('collection') || new Backbone.Collection();
            }
        },
        childView: STRowItemView,
        childViewContainer: '@ui.BodyContainer',
        childViewOptions: function() {
            return {
                attributeMapping: this.attributeMapping,
                field: this.field,
                formModel: this.model
            };
        },
        onChildviewClickTableRow: function(child) {
            if (!child.$el.hasClass('active')) {
                this.children.each(function(view) {
                    view.$el.removeClass('active');
                });
                child.$el.addClass('active');
            }
        }
    };

    var SelectableTable = PuppetForm.SelectableTableControl = Backbone.Marionette.CompositeView.extend(
        _.defaults(SelectableTablePrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return SelectableTable;

});
