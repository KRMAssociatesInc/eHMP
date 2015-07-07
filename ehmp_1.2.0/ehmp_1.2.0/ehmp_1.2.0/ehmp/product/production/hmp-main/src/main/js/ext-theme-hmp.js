// theme related overrides
Ext.define('gov.va.hmp.theme.button.Button', {
    override: 'Ext.button.Button',
    /**
     * @cfg {"extra-small"/"small"/"medium"/"large"} scale
     * The size of the Button. Three values are allowed:
     *
     * - 'extra-small' - Results in the button element being 16px high.
     * - 'small' - Results in the button element being 16px high.
     * - 'medium' - Results in the button element being 24px high.
     * - 'large' - Results in the button element being 32px high.
     */
    scale: 'medium',
    /**
     * @private
     * An array of allowed scales.
     */
    allowedScales: ['extra-small', 'small', 'medium', 'large'],
    /**
     * @cfg {Number[]} [menuOffsets] Alignment offsets as used by {@link Ext.util.Positionable#getAlignToXY}.
     * Defaults to [0, 2]
     */
    menuOffsets: [0, 2],
    /**
     * Shows this button's menu (if it has one)
     */
    showMenu: function (/* private */ fromEvent) {
        var me = this,
            menu = me.menu;

        if (me.rendered) {
            if (me.tooltip && Ext.quickTipsActive && me.getTipAttr() != 'title') {
                Ext.tip.QuickTipManager.getQuickTip().cancelShow(me.el);
            }
            if (menu.isVisible()) {
                menu.hide();
            }

            if (!fromEvent || me.showEmptyMenu || menu.items.getCount() > 0) {
                menu.showBy(me.el, me.menuAlign, me.menuOffsets);
            }
        }
        return me;
    }
});

Ext.define('gov.va.hmp.theme.Window', {
    override: 'Ext.window.Window',
    shadow: false,
    bridgeToolbars: function () {
        var me = this,
            docked = [],
            minButtonWidth = me.minButtonWidth,
            fbar, fbarDefaults;

        function initToolbar(toolbar, pos, useButtonAlign) {
            if (Ext.isArray(toolbar)) {
                toolbar = {
                    xtype: 'toolbar',
                    items: toolbar
                };
            }
            else if (!toolbar.xtype) {
                toolbar.xtype = 'toolbar';
            }
            toolbar.dock = pos;
            if (pos == 'left' || pos == 'right') {
                toolbar.vertical = true;
            }

            // Legacy support for buttonAlign (only used by buttons/fbar)
            if (useButtonAlign) {
                toolbar.layout = Ext.applyIf(toolbar.layout || {}, {
                    // default to 'end' (right-aligned) if me.buttonAlign is undefined or invalid
                    pack: { left: 'start', center: 'center' }[me.buttonAlign] || 'end'
                });
            }
            return toolbar;
        }

        // Short-hand toolbars (tbar, bbar and fbar plus new lbar and rbar):

        /**
         * @cfg {String} buttonAlign
         * The alignment of any buttons added to this panel. Valid values are 'right', 'left' and 'center' (defaults to
         * 'right' for buttons/fbar, 'left' for other toolbar types).
         *
         * **NOTE:** The prefered way to specify toolbars is to use the dockedItems config. Instead of buttonAlign you
         * would add the layout: { pack: 'start' | 'center' | 'end' } option to the dockedItem config.
         */

        /**
         * @cfg {Object/Object[]} tbar
         * Convenience config. Short for 'Top Bar'.
         *
         *     tbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'top',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.tbar) {
            docked.push(initToolbar(me.tbar, 'top'));
            me.tbar = null;
        }

        /**
         * @cfg {Object/Object[]} bbar
         * Convenience config. Short for 'Bottom Bar'.
         *
         *     bbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'bottom',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.bbar) {
            docked.push(initToolbar(me.bbar, 'bottom'));
            me.bbar = null;
        }

        /**
         * @cfg {Object/Object[]} buttons
         * Convenience config used for adding buttons docked to the bottom of the panel. This is a
         * synonym for the {@link #fbar} config.
         *
         *     buttons: [
         *       { text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'bottom',
         *         ui: 'footer',
         *         defaults: {minWidth: {@link #minButtonWidth}},
         *         items: [
         *             { xtype: 'component', flex: 1 },
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         *
         * The {@link #minButtonWidth} is used as the default {@link Ext.button.Button#minWidth minWidth} for
         * each of the buttons in the buttons toolbar.
         */
        if (me.buttons) {
            me.fbar = me.buttons;
            me.buttons = null;
        }

        /**
         * @cfg {Object/Object[]} fbar
         * Convenience config used for adding items to the bottom of the panel. Short for Footer Bar.
         *
         *     fbar: [
         *       { type: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'bottom',
         *         ui: 'footer',
         *         defaults: {minWidth: {@link #minButtonWidth}},
         *         items: [
         *             { xtype: 'component', flex: 1 },
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         *
         * The {@link #minButtonWidth} is used as the default {@link Ext.button.Button#minWidth minWidth} for
         * each of the buttons in the fbar.
         */
        if (me.fbar) {
            fbar = initToolbar(me.fbar, 'bottom', true); // only we useButtonAlign
            fbar.ui = 'footer';
            fbar.ignoreParentFrame = true;
            fbar.ignoreBorderManagement = true;

            // Apply the minButtonWidth config to buttons in the toolbar
            if (minButtonWidth) {
                fbarDefaults = fbar.defaults;
                fbar.defaults = function (config) {
                    var defaults = fbarDefaults || {},
                    // no xtype or a button instance
                        isButton = !config.xtype || config.isButton,
                        cls;

                    // Here we have an object config with an xtype, check if it's a button
                    // or a button subclass
                    if (!isButton) {
                        cls = Ext.ClassManager.getByAlias('widget.' + config.xtype);
                        if (cls) {
                            isButton = cls.prototype.isButton;
                        }
                    }
                    if (isButton && !('minWidth' in defaults)) {
                        defaults = Ext.apply({minWidth: minButtonWidth}, defaults);
                    }
                    return defaults;
                };
            }

            docked.push(fbar);
            me.fbar = null;
        }

        /**
         * @cfg {Object/Object[]} lbar
         * Convenience config. Short for 'Left Bar' (left-docked, vertical toolbar).
         *
         *     lbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'left',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.lbar) {
            docked.push(initToolbar(me.lbar, 'left'));
            me.lbar = null;
        }

        /**
         * @cfg {Object/Object[]} rbar
         * Convenience config. Short for 'Right Bar' (right-docked, vertical toolbar).
         *
         *     rbar: [
         *       { xtype: 'button', text: 'Button 1' }
         *     ]
         *
         * is equivalent to
         *
         *     dockedItems: [{
         *         xtype: 'toolbar',
         *         dock: 'right',
         *         items: [
         *             { xtype: 'button', text: 'Button 1' }
         *         ]
         *     }]
         */
        if (me.rbar) {
            docked.push(initToolbar(me.rbar, 'right'));
            me.rbar = null;
        }

        if (me.dockedItems) {
            if (!Ext.isArray(me.dockedItems)) {
                me.dockedItems = [me.dockedItems];
            }
            me.dockedItems = me.dockedItems.concat(docked);
        } else {
            me.dockedItems = docked;
        }
    }
});

Ext.define('gov.va.hmp.theme.MessageBox', {
    override: 'Ext.window.MessageBox',
    reconfigure: function (cfg) {
        var me = this;
        me.bottomTb.ignoreParentFrame = true;
        me.bottomTb.ignoreBorderManagement = true;
        me.callParent(arguments);
    }
});

Ext.define('gov.va.hmp.theme.grid.View', {
    override: 'Ext.grid.View',
    stripeRows: false
});

Ext.define('gov.va.hmp.theme.tree.Column', {
    override: 'Ext.tree.Column',
    cellTpl: [
        '<tpl for="lines">',
        '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
        '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"/>',
        '</tpl>',
        '<i class="{childCls} {elbowCls}-img {elbowCls}',
        '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></i>',
        '<tpl if="checked !== null">',
        '<input type="button" {ariaCellCheckboxAttr}',
        ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
        '</tpl>',
        '<img src="{blankUrl}" role="presentation" class="{childCls} {baseIconCls} ',
        '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
        '<tpl if="icon">style="background-image:url({icon})"</tpl>/>',
        '<tpl if="href">',
        '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
        '<tpl else>',
        '<span class="{textCls} {childCls}">{value}</span>',
        '</tpl>'
    ]
});

Ext.define('gov.va.hmp.theme.grid.column.Action', {
    override: 'Ext.grid.column.Action',
    // Renderer closure iterates through items creating an <img> or <span> element for each and tagging with an identifying
    // class name x-action-col-{n}
    defaultRenderer: function (v, meta, record, rowIdx, colIdx, store, view) {
        var me = this,
            prefix = Ext.baseCSSPrefix,
            scope = me.origScope || me,
            items = me.items,
            len = items.length,
            i = 0,
            item,
            disabled,
            tooltip;

        // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
        v = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';

        meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
        for (; i < len; i++) {
            item = items[i];

            disabled = item.disabled || (item.isDisabled ? item.isDisabled.call(item.scope || scope, view, rowIdx, colIdx, item, record) : false);
            tooltip = disabled ? null : (item.tooltip || (item.getTip ? item.getTip.apply(item.scope || scope, arguments) : null));

            // Only process the item action setup once.
            if (!item.hasActionConfiguration) {

                // Apply our documented default to all items
                item.stopSelection = me.stopSelection;
                item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                item.hasActionConfiguration = true;
            }

            // detect font awesome icon class names and use <span> elements instead of <img>s
            if (item.iconCls && item.iconCls.indexOf('fa') == 0) {
                v += '<span alt="' + (item.altText || me.altText) +
                    '" class="' + prefix + 'action-col-icon ' + prefix + 'action-col-' + String(i) + ' ' + (disabled ? prefix + 'item-disabled' : ' ') +
                    ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : 'fa ' + (item.iconCls || me.iconCls || '')) + '"' +
                    (tooltip ? ' data-qtip="' + tooltip + '"' : '') + '></span>';
            } else {
                v += '<img alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                    '" class="' + prefix + 'action-col-icon ' + prefix + 'action-col-' + String(i) + ' ' + (disabled ? prefix + 'item-disabled' : ' ') +
                    ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || scope, arguments) : (item.iconCls || me.iconCls || '')) + '"' +
                    (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' />';
            }
        }
        return v;
    }
});

Ext.define('gov.va.hmp.theme.field.Base', {
    override: 'Ext.form.field.Base',
    labelPad: 14,
    labelSeparator: '',
    labelAlign: 'right'
});

Ext.define('gov.va.hmp.theme.field.picker', {
    override: 'Ext.form.field.Picker',
    pickerOffset: [0, 2]
});

Ext.define('gov.va.hmp.theme.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',
    labelPad: 14,
    labelSeparator: '',
    labelAlign: 'right'
});

Ext.define('gov.va.hmp.theme.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',
    labelPad: 14,
    labelSeparator: '',
    labelAlign: 'right'
});

Ext.define('gov.va.hmp.theme.FieldContainer', {
    override: 'Ext.form.FieldContainer',
    labelPad: 14,
    labelSeparator: '',
    labelAlign: 'right'
});

//Ext.define('gov.va.hmp.theme.field.Spinner', {
//    override: 'Ext.form.field.Spinner',
//    triggerTpl: '<td style="{triggerStyle}">' +
//     '<div class="' + Ext.baseCSSPrefix + 'trigger-index-0 ' + Ext.baseCSSPrefix + 'form-trigger ' + Ext.baseCSSPrefix + 'form-spinner-up {spinnerUpCls}" role="button"><i class="icon icon-sort-up"></i></div>' +
//     '<div class="' + Ext.baseCSSPrefix + 'trigger-index-1 ' + Ext.baseCSSPrefix + 'form-trigger ' + Ext.baseCSSPrefix + 'form-spinner-down {spinnerDownCls}" role="button"><i class="icon icon-sort-down"></i></div>' +
//     '</td>' +
//     '</tr>'
//});

Ext.define('gov.va.hmp.theme.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',
    shadow: false
});

Ext.define('gov.va.hmp.theme.LoadMask', {
    override: 'Ext.LoadMask',
    renderTpl: [
            '<div id="{id}-iconEl" class="' + Ext.baseCSSPrefix + 'mask-icon' + '"><i class="pull-center"></i></div>',
        '<div id="{id}-msgEl" role="{role}"',
        '<tpl if="ariaAttr"> {ariaAttr}</tpl>',
        ' class="{[values.$comp.msgCls]} ',
        Ext.baseCSSPrefix, 'mask-msg-inner{childElCls}">',
        '<div id="{id}-msgTextEl" class="', Ext.baseCSSPrefix , 'mask-msg-text',
        '{childElCls}"></div>',
        '</div>'
    ],
    floating: {
        shadow: false
    }
});

Ext.define('gov.va.hmp.theme.Menu', {
    override: 'Ext.menu.Menu',
    shadow: false,
    showSeparator: false
});

Ext.define('gov.va.hmp.theme.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    ui: 'paging'
});

Ext.define('gov.va.hmp.theme.tip.Tip', {
    override: 'Ext.tip.Tip',
    shadow: false
});

Ext.define('gov.va.hmp.theme.tip.ToolTip', {
    override: 'Ext.tip.ToolTip',
    anchor: 'top',
    dismissDelay: 0
});

Ext.define('gov.va.hmp.theme.panel.Tool', {
    override: 'Ext.panel.Tool',
    renderTpl: [
        '<i id="{id}-toolEl" class="{baseCls}-img {baseCls}-{type} {childElCls}" role="presentation"></i>'
    ]
});

Ext.define('gov.va.hmp.theme.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',
    toggleTargetCmp: function (e, t) {
        // NOOP: disable collapsible button in splitter
    }
});