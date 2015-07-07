/**
 * Anchored popup that contains a {@link gov.va.cpe.roster.RosterSource}
 */
Ext.define('gov.va.cpe.roster.RosterSourceSelector', {
    extend: 'gov.va.hmp.ux.PopUpButton',
    requires: [
        "gov.va.cpe.roster.RosterSourcePicker"
    ],
    alias: "widget.rostersourceselector",
    text: 'Select Source',
    popUp: {
        xtype: 'rostersourcepicker',
        itemId: 'sourcepicker',
        padding: '6 0 6 6',
        width: 600,
        height: 360,
        sourceType: 'Clinic'
    },
    initComponent: function () {
    	this.popUp.sourceType = this.sourceType;
        this.callParent(arguments);
        this.addEvents('select');
    },
    initEvents:function () {
        this.callParent(arguments);
        this.mon(this.menu.getComponent(0), 'selectionchange', this.onSelect, this);
    },
    onSelect: function (picker, records) {
        if (records && records.length > 0) {
            this.fireEvent("select", this, records[0]);
        }
        picker.deselectAll(true);
        this.hideMenu(1);
    }
});