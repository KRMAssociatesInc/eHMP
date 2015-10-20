define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars'
], function(Backbone, Marionette, $, _, Handlebars) {

    var DivModel = Backbone.Model.extend({
        defaults: {
            sizeClass: '',
            backdrop: true,
            keyboard: true
        }
    });

    var WorkflowContainerView = Backbone.Marionette.LayoutView.extend({
        className: 'modal fade',
        tagName: 'div',
        attributes: {
            'role': 'dialog',
            'aria-hidden': 'true',
            'id': 'mainWorkflow'
        },
        modelEvents: {
            'change': 'render'
        },
        ui: {
            WorkflowRegion: '.modal-dialog'
        },
        regions: {
            workflowRegion: '@ui.WorkflowRegion'
        },
        template: Handlebars.compile('<div class="workflow-container"><div class="modal-dialog{{#if sizeClass}} {{sizeClass}}{{/if}}"></div></div>'),
        initialize: function(options){
            this.workflowOptions = options.workflowOptions;
            this.controllerView = options.controllerView;
            this.model = new DivModel();
        },
        onBeforeShow: function() {
            if (this.workflowOptions.keyboard === false) {
                this.model.set('keyboard', this.workflowOptions.keyboard);
            }
            if (this.workflowOptions.backdrop === false || this.workflowOptions.backdrop === 'static') {
                this.model.set('backdrop', this.workflowOptions.backdrop);
            }
            this.$el.attr({
                'data-backdrop': this.model.get('backdrop'),
                'data-keyboard': this.model.get('keyboard')
            });

            if (this.workflowOptions.size === 'large') {
                this.model.set('sizeClass', 'modal-lg');
            } else if (this.workflowOptions.size === 'xlarge') {
                this.model.set('sizeClass', 'modal-xlg');
            }
            this.showChildView('workflowRegion', this.controllerView);
        }
    });
    return WorkflowContainerView;
});