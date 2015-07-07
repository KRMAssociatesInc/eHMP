define([
    "jquery",
    "underscore",
    "backbone",
    "marionette",
    "api/Messaging",
    "api/ResourceService",
    'hbs!main/components/appletToolbar/toolbarTemplate',
    'main/components/appletToolbar/factory/buttonFactory'
], function($, _, Backbone, Marionette, Messaging, ResourceService, toolbarTemplate, ButtonClass) {

    var toolbarView = Backbone.Marionette.ItemView.extend({
        template: toolbarTemplate,
        className: 'appletToolbar',
        initialize: function(options) {
            this.options = options;
            this._super = Backbone.Marionette.ItemView.prototype;
            this.targetElement = options.targetElement;
            this.buttonFactory = new ButtonClass();
            this.buttons = [];
            _.each(options.buttonTypes, function(buttontype) {
                this.buttons.push(this.buttonFactory.createButton(this.options, buttontype));
            }, this);
            this.render();
        },
        create: function() {
            var obj = this.targetElement;
            var el = obj.$el,
                that = this;
            this.toolbarPopover = el.find('.appletToolbar');
            el.attr('hasAppletToolbar', 'true');
            el.on('focusin', function() {
                if (!el.hasClass('toolbarActive')) {
                    $('[data-toggle=popover]').popover('hide');
                    that.removeExisting();
                    //that.toolbarPopover.fadeIn(100);
                    //el.addClass('toolbarActive');
                }
            });
            el.on('click keydown', function(e) {
                if (e.type === 'click' || ((e.type === 'keydown') && (e.which === 13 || e.which === 32))) {
                    that.toolbarPopover.fadeIn(100);
                    el.addClass('toolbarActive');
                    //$('.btn:first', that.toolbarPopover).focus();
                }
            });
        },
        onDestroy: function() {
            $('body').off('click.appletToolbar');
        },
        onBeforeDestroy: function() {
            $('body').off('click.appletToolbar');
            _.each(this.$el.find('.fa-eye'), function(item) {
                $(item).parent().off('click');
            });
            _.each(this.$el.find('.fa-search'), function(item) {
                $(item).parent().off('click');
            });
            _.each(this.$el.find('.btn'), function(item) {
                $(item).off('focus');
            });
            _.each(this.clickHandlers, function(obj) {
                obj.toggler.off(obj.toggleEvent);
            });
        },
        render: function() {
            this._super.render.apply(this, arguments);

        },
        onRender: function() {
            var that = this;
            this.targetElement.$el.children(':first-child').before(this.$el);
            this.create();
            $('body').on('click.appletToolbar', function(e) {
                if (that.isDismissable(e)) {
                    that.removeExisting();
                }
            });

            _.each(this.buttons, function(button) {
                this.$el.find('.btn-group').append(button.btn);
            }, this);
        },
        removeExisting: function() {
            var existingToolbars = $('[hasAppletToolbar=true]');
            if (existingToolbars.length > 0) {
                existingToolbars.find('.appletToolbar').hide();
                existingToolbars.removeClass('toolbarActive');
            }
        },

        isDismissable: function(e) {
            var isInsideEl = ($(e.target).parents('div.toolbarActive').length > 0),
                isInsideModal = ($(e.target).parents('#modal-region').length > 0),
                isInsidePopover = ($(e.target).parents('.popover').length > 0);

            return (!isInsideEl && !isInsideModal && !isInsidePopover);
        }
    });
    return toolbarView;
});