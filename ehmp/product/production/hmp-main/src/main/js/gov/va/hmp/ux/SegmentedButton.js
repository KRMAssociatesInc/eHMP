/**
 * SegmentedButton is a container for a group of {@link Ext.Button}s. Generally a SegmentedButton would be
 * a child of a {@link Ext.Toolbar} and would be used to switch between different views.
 *
 * ## Example usage:
 *
 *     @example
 *     var segmentedButton = Ext.create('Ext.SegmentedButton', {
 *         allowMultiple: true,
 *         items: [
 *             {
 *                 text: 'Option 1'
 *             },
 *             {
 *                 text: 'Option 2',
 *                 pressed: true
 *             },
 *             {
 *                 text: 'Option 3'
 *             }
 *         ],
 *         listeners: {
 *             toggle: function(container, button, pressed){
 *                 alert("User toggled the '" + button.getText() + "' button: " + (pressed ? 'on' : 'off'));
 *             }
 *         }
 *     });
 *     Ext.Viewport.add({ xtype: 'container', padding: 10, items: [segmentedButton] });
 */
Ext.define('gov.va.hmp.ux.SegmentedButton', {
    extend:'Ext.Container',
    xtype:'segmentedbutton',
    requires:['Ext.Button'],

    config:{
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls:Ext.baseCSSPrefix + 'segmentedbutton',

        /**
         * @cfg {String} pressedCls
         * CSS class when a button is in pressed state.
         * @accessor
         */
        pressedCls:Ext.baseCSSPrefix + 'btn-pressed',

        /**
         * @cfg {Boolean} allowMultiple
         * Allow multiple pressed buttons.
         * @accessor
         */
        allowMultiple:false,

        /**
         * @cfg {Boolean} allowDepress
         * Allow toggling the pressed state of each button.
         * Defaults to `true` when {@link #allowMultiple} is `true`.
         * @accessor
         */
        allowDepress:false,

        /**
         * @cfg {Boolean} allowToggle Allow child buttons to be pressed when clicked on. Set to `false` to allow clicking but not toggling of the buttons.
         * @accessor
         */
        allowToggle:true,

        /**
         * @cfg {Array} pressedButtons
         * The pressed buttons for this segmented button.
         *
         * You can remove all pressed buttons by calling {@link #setPressedButtons} with an empty array.
         * @accessor
         */
        pressedButtons:[]
    },

    /**
     * @cfg
     * @inheritdoc
     */
    layout:{
        type:'hbox',
        align:'stretch'
    },

    /**
     * @cfg
     * @inheritdoc
     */
    defaultType:'button',

    /**
     * @cfg {"extra-small"/"small"/"medium"/"large"} scale
     * The size of the Button. Three values are allowed:
     */
    scale: 'small',
    // private
    suppressToggleEvents: false,

    constructor:function (config) {
        this.initConfig(config);
        return this.callParent(arguments);
    },

    /**
     * @event toggle
     * Fires when any child button's pressed state has changed.
     * @param {Ext.SegmentedButton} this
     * @param {Ext.Button} button The toggled button.
     * @param {Boolean} isPressed Boolean to indicate if the button was pressed or not.
     */

    initComponent:function () {
        var me = this,
            pressedButtons = [],
            ln, i, item;

        if (me.allowToggle) {
            var defaults = me.defaults || {};
            defaults.enableToggle = true;
            me.defaults = defaults;
        }

        if (!me.allowDepress) {
            ln = me.items.length;
            for (i = 0; i < ln; i++) {
                item = me.items[i];
                if (item.pressed) {
                    delete item.pressed;
                }
            }
        }

        me.callParent(arguments);

        ln = me.items.length;

        for (i = 0; i < ln; i++) {
            item = me.items.getAt(i);
            item.ui = me.ui;
            item.scale = me.scale;
            if (item.initialConfig.pressed) {
                pressedButtons.push(item);
            }
        }

        me.updateFirstAndLastCls(me.items);

        me.setPressedButtons(pressedButtons);
    },

    initEvents:function () {
        var me = this;

        me.callParent(arguments);

        var buttons = me.query('> button');
        Ext.Array.each(buttons, function (button, index) {
            me.mon(button, 'click', me.onButtonRelease, me);
            me.mon(button, 'hide', me.onButtonHiddenChange, me);
            me.mon(button, 'show', me.onButtonHiddenChange, me);
        });
    },

    updateAllowMultiple:function (allowMultiple) {
        if (!this.initialized && !this.getInitialConfig().hasOwnProperty('allowDepress') && allowMultiple) {
            this.setAllowDepress(true);
        }
    },

    /**
     * Button sets a timeout of 10ms to remove the {@link #pressedCls} on the release event.
     * We don't want this to happen, so lets return `false` and cancel the event.
     * @private
     */
    onButtonRelease:function (button) {
        if (!this.getAllowToggle()) {
            return;
        }
        var me = this,
            pressedButtons = me.getPressedButtons() || [],
            buttons = [],
            alreadyPressed;

        if (!me.isDisabled() && !button.isDisabled()) {
            //if we allow for multiple pressed buttons, use the existing pressed buttons
            if (me.getAllowMultiple()) {
                buttons = pressedButtons.concat(buttons);
            }

            alreadyPressed = (buttons.indexOf(button) !== -1) || (pressedButtons.indexOf(button) !== -1);

            //if we allow for depressing buttons, and the new pressed button is currently pressed, remove it
            if (alreadyPressed && me.getAllowDepress()) {
                Ext.Array.remove(buttons, button);
            } else if (!alreadyPressed || !me.getAllowDepress()) {
                buttons.push(button);
            }
            button.blur();
            me.setPressedButtons(buttons);
        }
    },

    // @private
    onAdd:function () {
        this.callParent(arguments);
        this.updateFirstAndLastCls(this.items);
    },

    // @private
    onRemove:function () {
        this.callParent(arguments);
        this.updateFirstAndLastCls(this.items);
    },

    // @private
    onButtonHiddenChange:function () {
        this.updateFirstAndLastCls(this.items);
    },

    // @private
    updateFirstAndLastCls:function (items) {
        var ln = items.length,
            basePrefix = Ext.baseCSSPrefix,
            firstCls = basePrefix + 'first',
            lastCls = basePrefix + 'last',
            item, i;

        //remove all existing classes
        for (i = 0; i < ln; i++) {
            item = items.getAt(i);
            item.removeCls(firstCls);
            item.removeCls(lastCls);
        }

        //add a first cls to the first non-hidden button
        for (i = 0; i < ln; i++) {
            item = items.getAt(i);
            if (!item.isHidden()) {
                item.addCls(firstCls);
                break;
            }
        }

        //add a last cls to the last non-hidden button
        for (i = ln - 1; i >= 0; i--) {
            item = items.getAt(i);
            if (!item.isHidden()) {
                item.addCls(lastCls);
                break;
            }
        }
    },

    /**
     * @private
     */
    applyPressedButtons:function (newButtons) {
        var me = this,
            array = [],
            button, ln, i;

        if (me.getAllowToggle()) {
            if (Ext.isArray(newButtons)) {
                ln = newButtons.length;
                for (i = 0; i < ln; i++) {
                    button = me.getComponent(newButtons[i]);
                    if (button && array.indexOf(button) === -1) {
                        array.push(button);
                    }
                }
            } else {
                button = me.getComponent(newButtons);
                if (button && array.indexOf(button) === -1) {
                    array.push(button);
                }
            }
        }

        return array;
    },

    /**
     * Updates the pressed buttons.
     * @private
     */
    updatePressedButtons:function (newButtons, oldButtons) {
        var me = this,
            items = me.items,
            pressedCls = me.getInitialConfig('pressedCls'),
            events = [],
            item, button, ln, i, e;


        //loop through existing items and remove the pressed cls from them
        if (Ext.isDefined(items)) {
            ln = items.length;
            if (oldButtons && oldButtons.length) {
                for (i = 0; i < ln; i++) {
                    item = items.getAt(i);

                    if (oldButtons.indexOf(item) != -1 && newButtons.indexOf(item) == -1) {
                        item.toggle(false, false);
                        item.removeCls([pressedCls, item.getInitialConfig('pressedCls')]);
                        events.push({
                            item:item,
                            toggle:false
                        });
                    }
                }
            }
        }

        //loop through the new pressed buttons and add the pressed cls to them
        ln = newButtons.length;
        for (i = 0; i < ln; i++) {
            button = newButtons[i];
            if (!oldButtons || oldButtons.indexOf(button) == -1) {
                button.toggle(true, false);
                button.addCls(pressedCls);
                events.push({
                    item:button,
                    toggle:true
                });
            }
        }

        //loop through each of the events and fire them after a delay
        if (!me.suppressToggleEvents) {
            ln = events.length;
            if (ln && oldButtons !== undefined) {
                Ext.defer(function () {
                    for (i = 0; i < ln; i++) {
                        e = events[i];
                        me.fireEvent('toggle', me, e.item, e.toggle);
                    }
                }, 10);
            }
        }
    },

    /**
     * Returns `true` if a specified {@link Ext.Button} is pressed.
     * @param {Ext.Button} button The button to check if pressed.
     * @return {Boolean} pressed
     */
    isPressed:function (button) {
        var pressedButtons = this.getPressedButtons();
        return pressedButtons.indexOf(button) != -1;
    },

    /**
     *  @param {Boolean} [suppressEvent=false] True to stop events being fired when calling this method.
     */
    clearPressedButtons:function(suppressEvent) {
        if (suppressEvent) {
            this.suppressToggleEvents = true;
        }
        this.setPressedButtons([]);
        if (suppressEvent) {
            this.suppressToggleEvents = false;
        }
    },

    setPressedButton:function(button, suppressEvent) {
        if (suppressEvent) {
            this.suppressToggleEvents = true;
        }
        this.setPressedButtons([button]);
        if (suppressEvent) {
            this.suppressToggleEvents = false;
        }
    },

    setDisabled:function (disabled) {
        var me = this;

        me.items.each(function (item) {
            item.setDisabled(disabled);
        }, me);

        me.callParent(arguments);
    },

    // @private
    // TODO: look into updating the pressedButtons bookkeeping array on individual button 'toggle' events as alternative to this bruteforce way of doing it.
    refreshPressedButtons:function() {
        var me = this,
            ln = me.items.getCount(),
            pressedButtons = [],
            i = -1,
            item = null;

        for (i = 0; i < ln; i++) {
            item = me.items.getAt(i);
            if (item.pressed) {
                pressedButtons.push(item);
            }
        }

        me.setPressedButtons(pressedButtons);
    }
});