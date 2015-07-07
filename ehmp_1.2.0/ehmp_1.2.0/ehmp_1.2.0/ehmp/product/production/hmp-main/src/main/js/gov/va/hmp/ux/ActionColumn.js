/**
 * Patch for {@link Ext.grid.column.Action} to enable it to fire 'actionclick' events.
 */
Ext.define('gov.va.hmp.ux.ActionColumn', {
    override: 'Ext.grid.column.Action',
    draggable: false,
    hideable: false,
    menuDisabled: true,
    fixed: true,
    /**
     * @cfg {String} hideIndex
     * The name of the field in the grid's {@link Ext.data.Store}'s {@link Ext.data.Model} definition from
     * which to draw the value to hide the action.
     */
    hideIndex: null,
    hiddenCls: Ext.baseCSSPrefix + 'action-col-img-noaction',
    autoWidth: true,
    iconWidth: 22,
    constructor: function(config) {
        var cfg = Ext.apply({}, config),
            items = cfg.items || [this];

        for (var index = 0; index < items.length; index++){
            var item = items[index];
            if (Ext.isDefined(item.hideIndex)) {
                var cls = item.iconCls || '';
                var tip = item.tooltip || '';
                delete item.iconCls;
                delete item.tooltip;
                Ext.apply(item, {
                    getClass: function(v, meta, record) {
                        var mtch = v.match(/<img/g);
                        var i = mtch?mtch.length:0;
                        if (!record.get(this.items[i].hideIndex)) {
                            this.items[i].tooltip = tip;
                            return cls;
                        } else {
                            this.items[i].tooltip = '';
                            return this.hiddenCls;
                        }
                    }
                });
            }
        }
        cfg.itemCount = items.length;
        this.callOverridden([cfg]);
    },
    initComponent: function(){
        if (this.autoWidth) {
            this.width = (this.iconWidth * this.itemCount);
        }
        this.callParent();
        this.addEvents(
            /**
             * @event actionclick
             * grid, store, record, action (iconCls)
             * Fires after a Component had been added to a Container.
             * @param {Ext.grid.Panel} grid
             * @param {Ext.data.Store} store Parent Container
             * @param {Ext.data.Model} record The record that belongs to the item
             * @param {String} action The CSS class name of the action element x-action-col-{n}
             */
            'actionclick'
        );
    },
    initEvents:function() {
        this.callParent(arguments);

        var gridView = this.up('tablepanel').getView();
        gridView.on('highlightitem', this.onHighlightItem, this);
        gridView.on('unhighlightitem',this.onUnhighlightItem, this);
    },
    defaultRenderer:function(v, meta, record, rowIdx, colIdx, store, view) {
        var v = this.callParent(arguments);
        v = v.replace(/x-action-col-icon/i,'x-action-col-icon x-hide-display'); // initially hidden
        return v;
    },
    processEvent: function(type, view, cell, recordIndex, cellIndex, e){
        if (type == 'click') {
            var match = e.getTarget().className.match(this.actionIdRe);
            if (match) {
                var tmp = Ext.String.trim(e.getTarget().className).split(' ');
                var action = tmp[tmp.length - 1];
                if (action != '' && action != this.hiddenCls) {
                    this.fireEvent('actionclick', view.ownerCt, view.getStore(), view.getStore().getAt(recordIndex), action);
                }
            }
        }
        return this.callParent(arguments);
    },
    onDestroy: function() {
    	var vdgp = this.up('tablepanel');
    	if(vdgp) {
            var gridView = vdgp.getView();
            gridView.un('highlightitem', this.onHighlightItem, this);
            gridView.un('unhighlightitem',this.onUnhighlightItem, this);
    	}

        this.callParent(arguments);
    },
    onHighlightItem: function (view, node, eOpts) {
        var rowEl = Ext.get(node);
        if (Ext.isEmpty(rowEl))
            return;

        var actions = rowEl.query('[class~="x-action-col-icon"]');
        if (Ext.isEmpty(actions))
            return;

        for (var i = 0, len = actions.length; i < len; i++) {
            var el = Ext.get(actions[i]);
            if (!Ext.isEmpty(el) && el.hasCls('x-hide-display'))
                el.removeCls('x-hide-display');
        }
    },
    onUnhighlightItem: function (view, node, eOpts) {
        var rowEl = Ext.get(node);
        if (Ext.isEmpty(rowEl))
            return;

        var actions = rowEl.query('[class~="x-action-col-icon"]');
        if (Ext.isEmpty(actions))
            return;

        for (var i = 0, len = actions.length; i < len; i++) {
            var el = Ext.get(actions[i]);
            if (!Ext.isEmpty(el) && !el.hasCls('x-hide-display'))
                el.addCls('x-hide-display');
        }
    }
});