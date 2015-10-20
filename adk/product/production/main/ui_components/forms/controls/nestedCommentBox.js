define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/ui_components/forms/controls/commentBox'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var NCBShowCommentButtonItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            '{{#if comments.models}}<button type="button" class="btn icon-btn show-comments-button" ' +
            'aria-exanded="true" title="Press enter to view comments">' +
            '<i class="fa fa-file-text"><span class="sr-only">Press enter to expand or collapse the comments for this row</span></i></button>' +
            '{{else}}<a type="button" href="#" aria-expanded="true"  class="show-comments-button" title="Press enter to add a comment">Add</a>{{/if}}'
        ].join('\n')),
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
        },
        ui: {
            'ShowCommentsButton': '.show-comments-button'
        },
        events: {
            'click @ui.ShowCommentsButton': 'showComments'
        },
        showComments: function(e) {
            e.preventDefault();
            this.triggerMethod('show:comments');
        },
        modelEvents: {
            'change': 'render'
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = {
                    comments: attributes[this.attributeMapping.commentsCollection]
                };
            return data;
        },
        tagName: "div"
    });

    var NCBDescriptiveTextItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            '{{label}}'
        ].join('\n')),
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
            this.field = options.field;
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = {
                    value: attributes[this.attributeMapping.value],
                    label: attributes[this.attributeMapping.label]
                };
            return data;
        },
        tagName: 'span'

    });

    var NCBRemoveButtonItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
            // '{{ui-button "" classes="btn icon-btn remove-panel-button" type="button" icon="fa-times"}}'
            '<button type="button" class="btn icon-btn icon-btn-mini remove-panel-button"><i class="fa fa-times-circle"></i><span class="sr-only">Press enter to remove this row from the group of selected items</span></button>'
        ].join('\n')),
        ui: {
            'RemoveButton': '.remove-panel-button'
        },
        events: {
            'click @ui.RemoveButton': function() {
                this.triggerMethod('remove:panel');
            }
        },
        className: "right-pad-xs"
    });

    var NCBPanelView = Backbone.Marionette.LayoutView.extend({
        defaults: {
            additionalColumns: []
        },
        ui: {
            'NCBCommentContainerRegion': '.ncb-comment-container-region',
            'NCBShowCommentsButtonRegion': '.ncb-show-comment-button-region',
            'NCBDescriptiveTextRegion': '.ncb-descriptive-text-region',
            'NCBCommentCollapseContainer': '.ncb-comment-collapse-container',
            'NCBRemoveButtonRegion': '.ncb-remove-button-region'
        },
        regions: {
            'NCBCommentContainerRegion': '@ui.NCBCommentContainerRegion',
            'NCBShowCommentsButtonRegion': '@ui.NCBShowCommentsButtonRegion',
            'NCBDescriptiveTextRegion': '@ui.NCBDescriptiveTextRegion',
            'NCBRemoveButtonRegion': '@ui.NCBRemoveButtonRegion'
        },
        template: Handlebars.compile([
            '{{#if value}}' +
            '<div class="panel-heading">',
            '<div class="panel-title">',
            '<div class="sr-only"><span>You are on an accordion heading. The accordion is collapsed. To expanded the accordion press enter on the accordion heading.</span></div>',
            '<div class="ncb-descriptive-text-region{{#each itemColumn.columnClasses}} {{this}}{{/each}}"></div>',
            '<div class="ncb-show-comment-button-region{{#each commentColumn.columnClasses}} {{this}}{{/each}}"></div>',
            '{{#each additionalColumns}}' +
            '<div class="{{clean-for-id columnTitle}}-region{{#each columnClasses}} {{this}}{{/each}}"></div>' +
            '{{/each}}' +
            '<div class="ncb-remove-button-region pull-right pixel-width-18"></div>',
            '</div>',
            '</div>',
            '<div class="ncb-comment-collapse-container panel-collapse collapse" role="tabpanel" aria-expanded="true"><div class="ncb-comment-container-region panel-body"></div></div>' +
            '{{/if}}',
        ].join("\n")),
        className: 'panel panel-default',
        attributes: {
            role: "tab"
        },
        childEvents: {
            'show:comments': function(child) {
                this.ui.NCBCommentCollapseContainer.collapse('toggle');
            },
            'remove:panel': function(child) {
                this.model.set(this.attributeMapping.value, false);
                this.formModel.trigger('change');
            }
        },
        initialize: function(options) {
            this.formModel = options.formModel;
            this.attributeMapping = options.attributeMapping;
            this.field = options.field;
            this.commentsCollection = this.model.get(this.attributeMapping.commentsCollection) || new Backbone.Collection();
            this.commentView = new PuppetForm.CommentBoxControl({
                attributeMapping: this.attributeMapping,
                collection: this.commentsCollection,
                formModel: this.formModel,
                field: this.field,
                model: this.model
            });
            this.showCommentButtonView = new NCBShowCommentButtonItemView({
                attributeMapping: this.attributeMapping,
                model: this.model
            });
            this.descriptiveTextView = new NCBDescriptiveTextItemView({
                attributeMapping: this.attributeMapping,
                model: this.model
            });
            _.each(this.field.get('additionalColumns'), function(column) {
                column.columnTitle = column.columnTitle || "";
                var id = column.columnTitle.replace(/[^A-Z0-9]+/ig, "-");
                this.addRegion(id + 'Region', '.' + id + '-region');

                var Control = PuppetForm.resolveNameToClass(column.control, 'Control');
                this[id + 'View'] = new Control({
                    field: new PuppetForm.Field(column),
                    model: this.model
                });
            }, this);
            this.removeButtonView = new NCBRemoveButtonItemView();

            var self = this;
            this.listenTo(this.commentsCollection, 'change add remove', function() {
                self.model.trigger('change');
            });
        },
        onRender: function() {
            if (this.model.get(this.attributeMapping.value)) {
                this.showChildView('NCBCommentContainerRegion', this.commentView);
                this.showChildView('NCBShowCommentsButtonRegion', this.showCommentButtonView);
                this.showChildView('NCBDescriptiveTextRegion', this.descriptiveTextView);
                _.each(this.field.get('additionalColumns'), function(column) {
                    column.columnTitle = column.columnTitle || "";
                    var id = column.columnTitle.replace(/[^A-Z0-9]+/ig, "-");
                    this.showChildView(id + 'Region', this[id + 'View']);
                }, this);
                this.showChildView('NCBRemoveButtonRegion', this.removeButtonView);
            }
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = {
                    itemColumn: this.field.get(this.attributeMapping.itemColumn),
                    commentColumn: this.field.get(this.attributeMapping.commentColumn),
                    additionalColumns: this.field.get(this.attributeMapping.additionalColumns),
                    unique: attributes[this.attributeMapping.unique],
                    value: attributes[this.attributeMapping.value],
                    label: attributes[this.attributeMapping.label],
                    comments: attributes[this.attributeMapping.commentsCollection]
                };
            return data;
        }
    });

    var NCBBodyView = Backbone.Marionette.CollectionView.extend({
        childView: NCBPanelView,
        addChild: function(child, ChildView, index) {
            if (child.get(this.attributeMapping.value) && _.isBoolean(child.get(this.attributeMapping.value))) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },
        childViewOptions: function() {
            return {
                attributeMapping: this.attributeMapping,
                formModel: this.formModel,
                field: this.field
            };
        },
        buildCollection: function(faux_collection, collection) {
          var self = this;
          _.each(faux_collection.models, function(model) {
            if(model._changing) {
              if(model.attributes[self.attributeMapping.value]) {
                collection.add(model);
              } else {
                collection.remove(model);
              }
            }
          }); 
          return collection;
        },
        initialize: function(options) {
            this.collection = new Backbone.Collection();
            this.formModel = options.formModel;
            this.attributeMapping = options.attributeMapping;
            this.field = options.field;
            this.faux_collection = this.model.get(this.attributeMapping.collection);
            var self = this;
            _.each(this.faux_collection.models, function(model) {
              if(model.attributes[self.attributeMapping.value]) {
                self.collection.add(model);
              }
            });
            this.listenTo(this.faux_collection, 'change', function() {
                self.model.trigger('change');
            });
            this.listenTo(this.faux_collection, 'change:' + this.attributeMapping.value, function(){
              this.buildCollection(this.faux_collection, this.collection);
            });
        },
        className: 'panel-container'
    });

    var NestedCommentBoxPrototype = {
        ui: {
            'NCBBodyRegion': '.ncb-body-region'
        },
        className: function() {
            return PuppetForm.CommonPrototype.className() + ' ftar-container';
        },
        template: Handlebars.compile([
            '<div class="sr-only no-display"><span>You are on an accordion heading. The accordion is collapsed.' +
            ' To expanded the accordion press enter on the accordion heading.</span></div>',
            '<div class="main-header ncb-header-region">',
            '<div class="{{#each itemColumn.columnClasses}} {{this}}{{/each}}"><span>{{itemColumn.columnTitle}}</span></div>',
            '<div class="{{#each commentColumn.columnClasses}} {{this}}{{/each}}"><span>{{commentColumn.columnTitle}}</span></div>',
            '{{#each additionalColumns}}' +
            '<div class="{{#each columnClasses}} {{this}}{{/each}}"><span>{{columnTitle}}</span></div>' +
            '{{/each}}',
            '</div>',
            '<div class="panel-group accordion-container small ftar ncb-body-region" ' +
            'aria-multiselectable="true" role="tablist"></div>',
        ].join("\n")),
        attributeMappingDefaults: {
            unique: 'id',
            value: 'value',
            label: 'label',
            collection: 'listItems',
            commentsCollection: 'comments',
            comment: 'comment',
            author: 'author',
            timeStamp: 'timeStamp',
            additionalColumns: 'additionalColumns',
            itemColumn: 'itemColumn',
            commentColumn: 'commentColumn'
        },
        childView: NCBBodyView,
        childViewOptions: function() {
            return {
                attributeMapping: this.attributeMapping,
                formModel: this.model,
                field: this.field
            };
        },
        childViewContainer: '@ui.NCBBodyRegion',
        initialize: function(options) {
            this.initOptions(options);
            this.setAttributeMapping();
            this.setFormatter();
            this.setExtraClasses();
            this.initCollection('collection');
            this.listenToFieldName();
            
            var name = this.getComponentInstanceName();
            this.stopListening(this.model, "change:" + name, this.render);
            this.model.set(name, this.collection);
            this.listenTo(this.model, "change:" + name, this.render);

            var self = this;
            this.listenTo(this.collection, 'change', function() {
                self.model.trigger('change');
            });
        }
    };

    var NestedCommentBox = PuppetForm.NestedCommentBoxControl = Backbone.Marionette.CompositeView.extend(
        _.defaults(NestedCommentBoxPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return NestedCommentBox;

});
