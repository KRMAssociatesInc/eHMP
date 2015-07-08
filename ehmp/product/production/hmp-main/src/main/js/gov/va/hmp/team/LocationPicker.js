Ext.define('gov.va.hmp.team.LocationPicker', {
    extend:'Ext.form.field.ComboBox',
    alias:'widget.locationpicker',
    displayField: 'name',
    valueField: 'uid',
    initComponent:function () {
//        var personStore = Ext.getStore('persons');
//        if (!personStore) {
//            personStore = Ext.create('gov.va.hmp.team.PersonStore');
//        }
//        this.store = personStore;

        this.callParent(arguments);
    }
});