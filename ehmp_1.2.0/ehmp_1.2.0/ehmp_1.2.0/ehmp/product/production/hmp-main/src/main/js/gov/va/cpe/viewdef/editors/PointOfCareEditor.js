Ext.define('gov.va.cpe.viewdef.editors.PointOfCareEditor', {
	requires: ['gov.va.cpe.store.PointOfCareStore'],
	alias: 'widget.pocedit',
	extend: 'Ext.form.field.ComboBox',
    displayField: 'displayName',
	valueField: 'uid',
    initComponent:function () {
        this.store = Ext.StoreManager.get('pocStore') || Ext.create('gov.va.cpe.store.PointOfCareStore'); // need to create store here rather than inline so that the store class is loaded
        this.callParent(arguments);
        this.store.on('load', function(store, recs) {
            // this class looks like need to be Singleton ...
            if (!store.findRecord('uid', 'custom'))   {
                store.add({uid: 'custom', displayName: 'Other', description: 'Other'});
            }
        });
        this.store.load();
        var me = this;
        this.on('select', function(combo, recs, eopts){
        	if(recs.length>0 && recs[0].get('uid')=='custom') {
        		Ext.MessageBox.prompt('Other Location','Enter other location name:', function(bnId, text, opt) {
        			if(bnId=="ok" || bnId=="yes") {
        				me.setValue(text);
        			}
        		});
        	}
        })
    }
});