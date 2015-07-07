/**
 * RosterPicker is a combobox that lets selects from all rosters.
 */
Ext.define('gov.va.cpe.roster.RosterPicker', {
    extend:'Ext.form.field.ComboBox',
    requires:[
        'gov.va.cpe.roster.RosterStore'
    ],
    alias:'widget.rosterpicker',
    queryMode:'local',
    queryParam:'filter',
    grow:true,
    typeAhead:true,
    displayField:'name',
    valueField:'uid',
    initComponent:function () {
        // create the roster store (can't put this inline because it gets called at load time, before the requires clauses have all be called)
        this.store = Ext.getStore('rosters') ? Ext.getStore('rosters') : Ext.create('gov.va.cpe.roster.RosterStore');

        this.callParent(arguments);
    }
});