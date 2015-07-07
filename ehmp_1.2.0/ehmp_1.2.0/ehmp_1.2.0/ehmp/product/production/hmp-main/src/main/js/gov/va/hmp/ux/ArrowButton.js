Ext.define('gov.va.hmp.ux.ArrowButton', {
    extend: 'Ext.Component',
    alias: 'widget.arrowbutton',
    cls: 'ios-6-arrow',
    autoEl: {
        tag: 'button',
        type: 'button' // needed so IE9 doesn't treat this like a submit button
    },
    direction: 'left',
    /**
     * @property {Boolean} hidden
     * True if this button is hidden.
     * @readonly
     */
    hidden: false,

    /**
     * @property {Boolean} disabled
     * True if this button is disabled.
     * @readonly
     */
    disabled: false,

    /**
     * @cfg {String} text
     * The button text to be used as innerHTML (html tags are accepted).
     */
    /**
     * @cfg {String} clickEvent
     * The DOM event that will fire the handler of the button. This can be any valid event name (dblclick, contextmenu).
     */
    clickEvent: 'click',

    /**
     * @cfg {Boolean} preventDefault
     * True to prevent the default action when the {@link #clickEvent} is processed.
     */
    preventDefault: true,

    /**
     * @cfg {Object} scope
     * The scope (**this** reference) in which the `{@link #handler}` is executed.
     * Defaults to this Button.
     */

    ariaRole: 'button',
    initComponent:function() {
        this.callParent(arguments);

        this.addEvents(
            /**
             * @event click
             * Fires when this button is clicked, before the configured {@link #handler} is invoked. Execution of the
             * {@link #handler} may be vetoed by returning <code>false</code> to this event.
             * @param {Ext.button.Button} this
             * @param {Event} e The click event
             */
            'click',

            /**
             * @event mouseover
             * Fires when the mouse hovers over the button
             * @param {Ext.button.Button} this
             * @param {Event} e The event object
             */
            'mouseover',

            /**
             * @event mouseout
             * Fires when the mouse exits the button
             * @param {Ext.button.Button} this
             * @param {Event} e The event object
             */
            'mouseout',

            /**
             * @event textchange
             * Fired when the button's text is changed by the {@link #setText} method.
             * @param {Ext.button.Button} this
             * @param {String} oldText
             * @param {String} newText
             */
            'textchange'
        );
    },
    // @private
    clearTip: function() {
        if (Ext.quickTipsActive && Ext.isObject(this.tooltip)) {
            Ext.tip.QuickTipManager.unregister(this.btnEl);
        }
    },

    // @private
    beforeDestroy: function() {
        var me = this;
        if (me.rendered) {
            me.clearTip();
        }
        Ext.destroy(me.repeater);
        me.callParent();
    },

    // @private
    onDestroy: function() {
        var me = this;
        if (me.rendered) {
            me.doc.un('mouseover', me.monitorMouseOver, me);
            me.doc.un('mouseup', me.onMouseUp, me);
            delete me.doc;

            Ext.destroy(me.keyMap);
            delete me.keyMap;
        }
        me.callParent();
    },

    /**
     * Assigns this Button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} [scope] The scope (`this` reference) in which the handler function is executed.
     * Defaults to this Button.
     * @return {Ext.button.Button} this
     */
    setHandler: function(handler, scope) {
        this.handler = handler;
        this.scope = scope;
        return this;
    },

    /**
     * Sets this Button's text
     * @param {String} text The button text
     * @return {Ext.button.Button} this
     */
    setText: function(text) {
        text = text || '';
        var me = this,
            oldText = me.text || '';

        if (text != oldText) {
            me.text = text;
            if (me.rendered) {
                me.getEl().set({
                    'data-title': text
                });
                if (Ext.isStrict && Ext.isIE8) {
                    // weird repaint issue causes it to not resize
                    me.el.repaint();
                }
                me.updateLayout();
            }
            me.fireEvent('textchange', me, oldText, text);
        }
        return me;
    },
    // @private
    onRender: function() {
        var me = this,
            addOnclick,
            btn,
            btnListeners;

        me.doc = Ext.getDoc();
        me.callParent(arguments);

        // Set btn as a local variable for easy access
        btn = me.el;

        btn.addCls(me.direction);
        btn.set({
            'data-title': me.text
        });

        if (me.tooltip) {
            me.setTooltip(me.tooltip, true);
        }

        // Add the mouse events to the button
            btnListeners = {
                scope: me
            };

        // Check if it is a repeat button
        if (me.repeat) {
            me.mon(new Ext.util.ClickRepeater(btn, Ext.isObject(me.repeat) ? me.repeat: {}), 'click', me.onRepeatClick, me);
        } else {

            // If the activation event already has a handler, make a note to add the handler later
            if (btnListeners[me.clickEvent]) {
                addOnclick = true;
            } else {
                btnListeners[me.clickEvent] = me.onClick;
            }
        }

        // Add whatever button listeners we need
        me.mon(btn, btnListeners);

        // If the listeners object had an entry for our clickEvent, add a listener now
        if (addOnclick) {
            me.mon(btn, me.clickEvent, me.onClick, me);
        }
    },
    // @private
    onRepeatClick: function(repeat, e) {
        this.onClick(e);
    },

    // @private
    onClick: function(e) {
        var me = this;
        if (me.preventDefault || (me.disabled && me.getHref()) && e) {
            e.preventDefault();
        }
        if (e.button !== 0) {
            return;
        }
        if (!me.disabled) {
            me.fireHandler(e);
        }
    },
    fireHandler: function(e){
        var me = this,
            handler = me.handler;

        if (me.fireEvent('click', me, e) !== false) {
            if (handler) {
                handler.call(me.scope || me, me, e);
            }
            me.blur();
        }
    },

    /**
     * @private mouseover handler called when a mouseover event occurs anywhere within the encapsulating element.
     * The targets are interrogated to see what is being entered from where.
     * @param e
     */
    onMouseOver: function(e) {
        var me = this;
        if (!me.disabled && !e.within(me.el, true, true)) {
            me.onMouseEnter(e);
        }
    },

    /**
     * @private
     * mouseout handler called when a mouseout event occurs anywhere within the encapsulating element -
     * or the mouse leaves the encapsulating element.
     * The targets are interrogated to see what is being exited to where.
     * @param e
     */
    onMouseOut: function(e) {
        var me = this;
        if (!e.within(me.el, true, true)) {
            me.onMouseLeave(e);
        }
    },

    /**
     * @private
     * mousemove handler called when the mouse moves anywhere within the encapsulating element.
     * The position is checked to determine if the mouse is entering or leaving the trigger area. Using
     * mousemove to check this is more resource intensive than we'd like, but it is necessary because
     * the trigger area does not line up exactly with sub-elements so we don't always get mouseover/out
     * events when needed. In the future we should consider making the trigger a separate element that
     * is absolutely positioned and sized over the trigger area.
     */
    onMouseMove: function(e) {
        var me = this,
            el = me.el,
            over = me.overMenuTrigger,
            overlap, btnSize;

//        if (me.split) {
//            if (me.arrowAlign === 'right') {
//                overlap = e.getX() - el.getX();
//                btnSize = el.getWidth();
//            } else {
//                overlap = e.getY() - el.getY();
//                btnSize = el.getHeight();
//            }
//
//            if (overlap > (btnSize - me.getTriggerSize())) {
//                if (!over) {
//                    me.onMenuTriggerOver(e);
//                }
//            } else {
//                if (over) {
//                    me.onMenuTriggerOut(e);
//                }
//            }
//        }
    },
    /**
     * @private
     * virtual mouseenter handler called when it is detected that the mouseout event
     * signified the mouse entering the encapsulating element.
     * @param e
     */
    onMouseEnter: function(e) {
        var me = this;
        me.addClsWithUI(me.overCls);
        me.fireEvent('mouseover', me, e);
    },

    /**
     * @private
     * virtual mouseleave handler called when it is detected that the mouseover event
     * signified the mouse entering the encapsulating element.
     * @param e
     */
    onMouseLeave: function(e) {
        var me = this;
        me.removeClsWithUI(me.overCls);
        me.fireEvent('mouseout', me, e);
    },

    /**
     * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
     * @param {Boolean} [state] Force a particular state
     * @param {Boolean} [suppressEvent=false] True to stop events being fired when calling this method.
     * @return {Ext.button.Button} this
     */
    toggle: function(state, suppressEvent) {
        var me = this;
        state = state === undefined ? !me.pressed: !!state;
        if (state !== me.pressed) {
            if (me.rendered) {
                me[state ? 'addClsWithUI': 'removeClsWithUI'](me.pressedCls);
            }
            me.pressed = state;
            if (!suppressEvent) {
                me.fireEvent('toggle', me, state);
                Ext.callback(me.toggleHandler, me.scope || me, [me, state]);
            }
        }
        return me;
    }
});