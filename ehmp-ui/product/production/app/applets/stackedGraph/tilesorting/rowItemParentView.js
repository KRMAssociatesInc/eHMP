define([
    'backbone',
    'marionette',
    'underscore',
    'main/components/appletToolbar/appletToolbarView'
], function(Backbone, Marionette, _, ToolbarView) {
    var dragged;
    var TileSortRowItemView = Backbone.Marionette.LayoutView.extend({
        regions: {
            toolbarView: '.toolbarContainer'
        },
        ui: {
            popoverEl: '[data-toggle=popover]',
            toolbarToggler: '.selectable:not([data-toggle=popover])'
        },
        events: {
            'click .selectable:not([data-toggle=popover])': function(e) {
                this.toggleToolbar();
            },
            'keydown': function(e) {
                var k = e.which || e.keyCode;
                if (!/(13|32)/.test(k)) return;
                this.ui.toolbarToggler.trigger('click');
                e.preventDefault();
                e.stopPropagation();
            },
            'keydown [data-toggle=popover]': function(e) {
                var k = e.which || e.keyCode;
                if (!/(13|32)/.test(k)) return;
                $(e.target).trigger('click');
                e.preventDefault();
                e.stopPropagation();
            },
            'dragstart': function(event) {
                var index = $(this.el).parent().find('.row').index(this.el).toString();
                if(event.originalEvent){
                    dragged = event.currentTarget;
                    // IE requires the first parameter to be text or URL. You can't give it a custom name.
                    event.originalEvent.dataTransfer.setData('text', index);

                } else {
                    this.performManualDragStart(index);
                }
            },
            'dragover': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                dragged.style.display = 'none';

                if(event.target.className === 'placeholder-tile-sort') return;

                var placeholder = $(this.el).parent().find('.placeholder-tile-sort');
                $(placeholder).removeClass('hidden');
                if($(this.el).index() === 1){
                    $(placeholder).insertBefore($(this.el));
                }else {
                    $(placeholder).insertAfter($(this.el));
                }
            },
            'drop': function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                originalIndex = Number(this.manualOriginalIndex);
                targetIndex = $(this.el).parent().find('.row').index(this.el);

                var reorder = {
                    oldIndex: originalIndex,
                    newIndex: targetIndex
                };

                $(this.el).trigger('reorder', reorder);
            },
            'dragend': function (event) {
                // Handle when dropped outside of placeholder
                event.preventDefault();
                $(this.el).parent().parent().find('.placeholder-tile-sort').addClass('hidden');
                dragged.style.display = 'block';
            }
        },
        onRender: function(){
            var currentScreen = ADK.Messaging.request('get:current:screen');
            var isUserWorkspace = !(currentScreen.config.predefined);
            $(this.el).attr('draggable', isUserWorkspace);

            if(isUserWorkspace){
                if(this.tlbrOpts && this.tlbrOpts.buttonTypes && isUserWorkspace){
                   this.tlbrOpts.buttonTypes.unshift('tilesortbutton');
                   this.tlbrOpts.isStackedGraph = true;
                }
            } else {
                $(this.el).unbind('dragstart');
                $(this.el).unbind('drop');
                $(this.el).unbind('dragover');
            }

            var toolbarView = new ToolbarView(this.tlbrOpts);
            this.toolbarView.show(toolbarView);
        },
        performManualDragStart: function(originalIndex){
            this.manualOriginalIndex = originalIndex;
        },
        onDestroy: function(){
            this.ui.popoverEl.popup('destroy');
        },
        createPopover: function() {
            this.ui.popoverEl.popup({
                trigger: 'click',
                html: 'true',
                container: 'body',
                template: popoverTemplate(this.model),
                placement: 'bottom',
                referenceEl: this.$el
            });
        },
        toggleToolbar: function() {
            var toolbarView = this.toolbarView.currentView;
            if (this.$el.hasClass('toolbarActive')) {
                this.hideToolbar();
            } else {
                this.showToolbar();
            }
        },
        showToolbar: function() {
            var toolbarView = this.toolbarView.currentView;
            this.trigger('before:showtoolbar');
            toolbarView.show();
            this.$el.addClass('toolbarActive');
            this.trigger('after:showtoolbar', toolbarView);
            $(this.el).focus();
        },
        hideToolbar: function() {
            var toolbarView = this.toolbarView.currentView;
            this.trigger('before:hidetoolbar');
            toolbarView.hide();
            this.$el.removeClass('toolbarActive');
            this.trigger('after:hidetoolbar');
        }
    });

    TileSortRowItemView.extend = function(child) {
        var view = Backbone.Marionette.LayoutView.extend.apply(this, arguments);

        if(typeof this.prototype.events == 'function'){
            view.prototype.events = _.extend({}, this.prototype.events(), child.events);
        } else {
            view.prototype.events = _.extend({}, this.prototype.events, child.events);
        }
        return view;
    };

    return TileSortRowItemView;
});