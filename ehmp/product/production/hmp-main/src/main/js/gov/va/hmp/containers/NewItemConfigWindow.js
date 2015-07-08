/**
 * pnl will be the target panel to which to add the newly configured component.
 * cmp will be the new component to which to add the properties before adding to the pnl.
 */
Ext.define('gov.va.hmp.containers.NewItemConfigWindow', {
    pnl: null,
    extend: 'Ext.window.Window',
    alias: 'widget.gbconfwnd',
    setValues: function(cfg)
    {
        this.down('numberfield[name="gridX"]').setValue(cfg.gridX);
        this.down('numberfield[name="gridY"]').setValue(cfg.gridY);
        this.down('numberfield[name="widthX"]').setValue(cfg.widthX);
        this.down('numberfield[name="widthY"]').setValue(cfg.widthY);
        this.down('numberfield[name="weightX"]').setValue(cfg.weightX);
        this.down('numberfield[name="weightY"]').setValue(cfg.weightY);
    },
    items: [
        {
            xtype: 'numberfield',
            anchor: '100%',
            name: 'gridX',
            fieldLabel: 'Grid X:',
            value: 0,
            maxValue: 99,
            minValue: 0
        },{
            xtype: 'numberfield',
            anchor: '100%',
            name: 'gridY',
            fieldLabel: 'Grid Y:',
            value: 0,
            maxValue: 99,
            minValue: 0
        },{
            xtype: 'numberfield',
            anchor: '100%',
            name: 'widthX',
            fieldLabel: 'Col span:',
            value: 0,
            maxValue: 99,
            minValue: 0
        },{
            xtype: 'numberfield',
            anchor: '100%',
            name: 'widthY',
            fieldLabel: 'Row span:',
            value: 0,
            maxValue: 99,
            minValue: 0
        },{
            xtype: 'numberfield',
            anchor: '100%',
            name: 'weightX',
            fieldLabel: 'Weight X:',
            value: 0,
            maxValue: 99,
            minValue: 0
        },{
            xtype: 'numberfield',
            anchor: '100%',
            name: 'weightY',
            fieldLabel: 'Weight Y:',
            value: 0,
            maxValue: 99,
            minValue: 0
        },{
            xtype: 'button',
            text: 'Add Item',
            handler: function(bn, e) {
                var cnt = bn.ownerCt;
                var x = cnt.items.items[0].getValue();
                var y = cnt.items.items[1].getValue();
                var dx = cnt.items.items[2].getValue();
                var dy = cnt.items.items[3].getValue();
                var wx = cnt.items.items[4].getValue();
                var wy = cnt.items.items[5].getValue();
                Ext.apply(cnt.cmp, {gridX: x, gridY: y, widthX: dx, widthY: dy, weightX: wx, weightY: wy});
                cnt.pnl.add(cnt.cmp);
                cnt.pnl.doLayout();
                cnt.hide();
            }
        }
    ]
});