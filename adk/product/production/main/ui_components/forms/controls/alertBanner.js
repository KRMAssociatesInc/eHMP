define([
    'backbone',
    'puppetForm',
    'handlebars'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var AlertBannerControlPrototype = {
        template: Handlebars.compile([
            '{{#if value}}',
            '<div class="alert alert-{{#if type}}{{type}}{{else}}info{{/if}}' +
            '{{#if dismissible}} alert-dismissible{{/if}}' +
            ' alert-user' +
            '" role="alert">',
            '<div class="alert-content">',
            '{{#if icon}}<p><strong>{{else}}{{#if title}}<p><strong>{{/if}}{{/if}}' +
            '{{#if icon}}' +
            '<i class="fa {{icon}}"></i>' +
            '{{/if}}' +
            '{{#if title}} {{title}}{{/if}}' +
            '{{#if icon}}</strong>{{#if title}}</p>{{/if}}{{else}}{{#if title}}</strong></p>{{/if}}{{/if}}' +
            '{{#if title}}<p>{{/if}} {{value}}</p>' +
            '</div>',
            '{{#if dismissible}}' +
            '<button type="button" class="close" title="To close this alert, press enter">',
            '<span aria-hidden="true">&times;</span>',
            '</button>' +
            '{{/if}}',
            '</div>' +
            '{{/if}}'
        ].join('\n')),
        events: {
            'click button.close': function(e) {
                e.preventDefault();
                this.model.unset(this.field.get('name'));
            },
            'control:message': function(e, messageString) {
                e.preventDefault();
                e.stopPropagation();
                if (_.isString(messageString)) {
                    this.model.set(this.field.get('name'), messageString);
                }
            },
            'control:title': function(e, titleString) {
                e.preventDefault();
                this.setStringFieldOption('title', titleString, e);
            },
            'control:type': function(e, typeString) {
                e.preventDefault();
                this.setStringFieldOption('type', typeString, e);
            },
            'control:icon': function(e, iconString) {
                e.preventDefault();
                this.setStringFieldOption('icon', iconString, e);
            },
            'control:dismissible': function(e, dismissibleBool) {
                e.preventDefault();
                this.setBooleanFieldOption('dismissible', dismissibleBool, e);
            }
        },
        initialize: function(options) {
            this.initOptions(options);
            this.setFormatter();
            this.listenToFieldName();
            this.setExtraClasses();
            this.listenToFieldOptions();
        }
    };

    var AlertBannerControl = PuppetForm.AlertBannerControl = Backbone.Marionette.ItemView.extend(
        _.defaults(AlertBannerControlPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return AlertBannerControl;
});
