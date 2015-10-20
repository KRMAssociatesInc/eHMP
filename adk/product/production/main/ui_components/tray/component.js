define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'api/Messaging',
], function(Backbone, Marionette, $, Handlebars, Messaging) {
    'use strict';

    var getUID = $.prototype.tooltip.Constructor.prototype.getUID; //grab this from the bootstrap tooltip

    var defaultOptions = {
        //if no viewport is specified we are just going to stick it on the bottom of the button, and end it at the #center-region
        //'viewport': '#center-region',
        //'tray': TrayView, //some view definition
        //'buttonLabel': 'This is what my button says',
        'position': 'right',
        'preventFocusoutClose': false
    };

    var TRANSITION_SPEED = 2000;

    var TrayView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile([
            '<button id={{tray_id}} type="button" class="btn" data-toggle="sidebar-tray" aria-haspopup="true" aria-expanded="false">{{buttonLabel}}</button>',
            '<div class="sidebar-tray {{position}}" aria-labelledby="{{tray_id}}" aria-hidden="true" tabindex="-1"/>'
        ].join('\r\n')),
        options: defaultOptions,
        attributes: function(e) {
            return {
                'id': this.tray_id
            };
        },
        className: 'sidebar',
        isOpen: function() {
            return this.$el.hasClass('open');
        },
        eventString: function() {
            return [
                'focusin.' + this.cid,
                'click.' + this.cid
            ].join(' ');
        },
        ui: {
            'ButtonContainer': '[data-toggle=sidebar-tray]',
            'TrayContainer': '.sidebar-tray'
        },
        regions: {
            'TrayRegion': '@ui.TrayContainer'
        },
        events: {
            //listen to the dom events and broadcast at the view level
            'tray.show': function(thisE, e) {
                this.trigger('tray.show', e);
                if (!this.isOpen()) {
                    this.open(e);
                }
            },
            'tray.shown': function(thisE, e) {
                if (!this.options.preventFocusoutClose) {
                    //this is how bootstrap handles closing dropdowns
                    //rather than use focusout which also fires when the browser loses focus, instead look for focus or click on another element
                    $(document).off(this.eventString(), 'body'); //don't add a duplicate
                    $(document).on(this.eventString(), 'body', [this], this.documentHandler);
                }
                this.trigger('tray.shown', e);
            },
            'tray.hide': function(thisE, e) {
                this.trigger('tray.hide', e);
                if (this.isOpen()) {
                    this.close(e);
                }
            },
            'tray.hidden': function(thisE, e) {
                $(document).off(this.eventString(), 'body');
                this.ui.ButtonContainer.off('focusin');
                this.trigger('tray.hidden', e);
            },
            //action events
            'click @ui.ButtonContainer': function(e) {
                this.toggle(e);
            },
            'keydown @ui.ButtonContainer': function(e) {
                this.keyHandler(e, this.ui.ButtonContainer);
            },
            'keydown @ui.TrayContainer': function(e) {
                this.keyHandler(e, this.ui.TrayContainer);
            },
            'click [data-dismiss=tray]': function(e) {
                this.$el.trigger('tray.hide', e);
            },
            'select2:open': function(e) {
                //when a select2 is attached to body, we don't want to lose the dropdown until the select2
                //operation finishes
                var self = this;
                this.options.preventFocusoutClose = true;
                $(e.target).off('select2:close');
                $(e.target).one('select2:close', function() {
                    self.options.preventFocusoutClose = false;
                });
            }
        },
        documentHandler: function(e) {
            //safer than using stopPropagation since stopProp would prevent the click from bubbling and wouldn't trigger the close
            //if another tray recieves focus or click
            var view = e.data[0];
            if (view.$(e.target).length || view.options.preventFocusoutClose) {
                return;
            }
            view.stopListening(view, 'tray.hidden.' + view.cid);
            view.$el.trigger('tray.hide');
        },
        keyHandler: function(e, el) {
            //This closely copied from the Bootstrap dropdown lib.  It has been very slightly modified to work with Marionette.
            //The original function can't be sourced from document data because the Paypal lib overwrites it.
            //We added the tab key to handle some edge cases and slightly changed some selectors to grab the appropriate elements.
            if (!/(38|40|27|32|9)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

            var $this = el;

            var isActive = this.isOpen();

            //edge cases for shift key--not in Bootstrap
            if (e.which == 9) {
                var firstmenuitem = this.$('[role=menuitem]')[0];
                if (firstmenuitem && isActive && e.target === this.ui.ButtonContainer[0] && !this.options.preventFocusoutClose) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $(firstmenuitem).trigger('focus');
                } else if (isActive && e.shiftKey && (this.ui.TrayContainer.find(e.target).length || e.target === this.ui.TrayContainer[0])) {
                    //if it's active, shift key is pressed, and we are inside the tray container, or focused on the tray container itself
                    $(document).one('focusin.buttoncontainer.' + this.tray_id, 'body', [this.ui.ButtonContainer[0]], function(e) {
                        if (e.target === e.data[0]) {
                            $(e.target).parent().trigger('tray.hide');
                        }
                    });
                }
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            if ($this.is('.disabled, :disabled')) return;

            if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
                if (e.which == 27) return this.ui.ButtonContainer.trigger('focus').trigger('click');
                return $this.trigger('click');
            }

            var desc = ' li:not(.disabled):visible a';
            var $items = this.$('[role="menu"]' + desc + ', [role="listbox"]' + desc);

            if (!$items.length) return;

            var index = $items.index(e.target);

            if (e.which == 38 && index > 0) index--; // up
            if (e.which == 40 && index < $items.length - 1) index++; // down
            if (!~index) index = 0;

            $items.eq(index).trigger('focus');
        },
        initialize: function() {
            this.tray_id = getUID('tray');
            if (!this.model) this.model = new Backbone.Model();
            this.model.set('tray_id', this.tray_id);
            this.model.set('buttonLabel', this.options.buttonLabel);
            this.model.set('position', this.options.position);
            this.tray = (this.options.tray instanceof Backbone.Marionette.View) ? this.options.tray : (typeof this.options.tray === 'function') ? new this.options.tray() : undefined;

            var self = this;

            //resize the tray if the window size changes
            //resize gets issued continuously while dragging the size grip so a timer stops the calculations
            var resizer;
            $(window).on('resize.' + this.cid, function() {
                if (!self.isOpen()) return;
                if (resizer) clearTimeout(resizer); //prevent resize from going crazy
                resizer = setTimeout(function() {
                    self.resetBounds();
                    self.resetContainerPosition();
                }, 50);
            });

            //Close if I'm not the droid you are looking for
            this.listenTo(Messaging, 'tray.close', function(cid) {
                if (self.cid !== cid && self.isOpen()) {
                    self.close(this, true);
                }
            });

            this.listenTo(this, 'tray.show', function() {
                this.onAttach();
            });
        },
        onRender: function() {
            if (this.tray) {
                this.showChildView('TrayRegion', this.tray);
            }
        },
        onAttach: function() {
            this.resetBounds();
            this.resetContainerPosition();
        },
        resetBounds: function() {
            //getBoundingClientRect is supposedly much faster than offset but it's read only hence why we need to clone it
            if (this.options.viewport) {
                this.containerBounds = _.clone($(this.options.viewport)[0].getBoundingClientRect());
            } else {
                //if viewport isn't specified, extend the tray from the bottom of the button to the bottom of the center region
                this.containerBounds = _.clone($('#center-region')[0].getBoundingClientRect());
                var buttonBounds = this.ui.ButtonContainer[0].getBoundingClientRect(),
                    ext = {
                        top: buttonBounds.bottom,
                        height: this.containerBounds.bottom - buttonBounds.bottom
                    };
                _.extend(this.containerBounds, ext);
            }
        },
        resetContainerPosition: function() {
            this.ui.TrayContainer.offset({
                top: this.containerBounds.top,
            }).height(this.containerBounds.height);
        },
        childEvents: {
            'show': function() {
                //508 -- Bootstrap sets events on document that look for certain patterns.  If these patterns exist keyboard arrow nav is applied
                var menu = this.ui.TrayContainer.children().first();
                if (!menu.is('ul')) {
                    return;
                }
                menu.attr('role', 'menu');
                menu.attr('tabindex', '-1'); //required to hard set focus on this element
                menu.children().attr('role', 'presentation');
                menu.find('[role=presentation]').children()
                    .attr('role', 'menuitem')
                    .attr('tabindex', '-1').on('keydown', function(e) {
                        var k = e.which || e.keycode;
                        if (!/(13|32)/.test(k)) return;
                        $(this).trigger('click');
                        e.preventDefault();
                    });
            }
        },
        toggle: function(e) {
            var el = this.$el;
            if (this.isOpen()) {
                el.trigger('tray.hide', e);
            } else {
                el.trigger('tray.show', e);
            }
        },
        open: function(e, preventShiftFocus) {
            var firstmenuitem = this.$('[role=menuitem]')[0],
                el = this.$el;
            this.triggerEl = e.currentTarget;

            Messaging.trigger('tray.close', this.cid); //close the other trays

            //set focus to the first menu item once the tray is open
            if (!preventShiftFocus) {
                if (firstmenuitem) {
                    this.listenToOnce(this, 'tray.shown', function() {
                        firstmenuitem.focus();
                    });
                } else {
                    this.listenToOnce(this, 'tray.shown', function() {
                        this.ui.TrayContainer.focus();
                    });
                }
            }

            //use the built in bootstrap timer and event to wait for the CSS animation to complete
            this.ui.TrayContainer.one('bsTransitionEnd', function() {
                $(this).attr('aria-hidden', 'false');
                el.trigger('tray.shown');
            }).emulateTransitionEnd(TRANSITION_SPEED);

            this.ui.ButtonContainer.attr('aria-expanded', true);
            el.addClass('open');
        },
        close: function(e, preventShiftFocus) {
            var el = this.$el,
                self = this;

            //set focus to the element that opened the tray when the tray is closed, unless it's told to close from another tray
            if (this.triggerEl && !preventShiftFocus) {
                this.listenToOnce(this, 'tray.hidden', function() {
                    this.triggerEl.focus();
                });
            }

            //use the built in bootstrap timer and event to wait for the CSS animation to complete
            this.ui.TrayContainer.one('bsTransitionEnd', function() {
                $(this).attr('aria-hidden', 'true');
                el.trigger('tray.hidden');
            }).emulateTransitionEnd(TRANSITION_SPEED);

            this.ui.ButtonContainer.attr('aria-expanded', false);
            el.removeClass('open');
        },
        setTrayView: function(view) {
            this.TrayRegion.show(view);
        },
        onDestroy: function() {
            $(document).off(this.eventString(), 'body');
            $(document).off('focusin.buttoncontainer.' + this.tray_id, 'body');
            $(window).off('resize.' + this.cid);
        }
    });

    var Orig = TrayView,
        Modified = Orig.extend({
            constructor: function() {
                this.options = _.extend({}, defaultOptions, this.options);
                var args = Array.prototype.slice.call(arguments),
                    init = this.initialize,
                    onRender = this.onRender,
                    onAttach = this.onAttach,
                    onDestroy = this.onDestroy,
                    events = this.events,
                    argEvents = (args[0]) ? _.extend({}, this.options.events || {}, args[0].events) : _.extend({}, this.options.events);
                this.initialize = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.initialize.apply(this, args);
                    if (Orig.prototype.initialize === init) return;
                    init.apply(this, args);
                };
                this.onRender = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.onRender.apply(this, args);
                    if (Orig.prototype.onRender === onRender) return;
                    onRender.apply(this, args);
                };
                this.onAttach = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.onAttach.apply(this, args);
                    if (Orig.prototype.onAttach === onAttach) return;
                    onAttach.apply(this, args);
                };
                this.onDestroy = function() {
                    var args = Array.prototype.slice.call(arguments);
                    Orig.prototype.onDestroy.apply(this, args);
                    if (Orig.prototype.onDestroy === onDestroy) return;
                    onDestroy.apply(this, args);
                };
                this.events = _.extend({}, (typeof Orig.prototype.events == 'function') ? Orig.prototype.events() : Orig.prototype.events, (typeof this.events == 'function') ? this.events() : this.events, (typeof argEvents == 'function') ? argEvents() : argEvents);
                if (args[0] && args[0].events) {
                    delete args[0].events; //required or else Backbone will destroy our inherited events
                }
                if (this.options.events) {
                    delete this.options.events; //required or else Backbone will destroy our inherited events
                }

                Orig.apply(this, args);
            }
        });
    TrayView = Modified;

    return TrayView;
});