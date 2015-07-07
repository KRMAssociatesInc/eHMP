Ext.define('gov.va.cpe.viewdef.editors.PointOfCareEditor2', {
	requires: ['gov.va.cpe.store.PointOfCareStore'],
	alias: 'widget.pocedit2',
	extend: 'Ext.form.field.ComboBox',
	displayField: 'displayName',
	valueField: 'uid',
	setValue: function(val) {
		// This might be a JSON object, or it might be a UID, or it might be some random text value.
		if(Ext.isString(val)) {
			var val2 = Ext.decode(val, true);
			if(val2) {
				val = val2;
			}
		}
		if(Ext.isObject(val)) {
			if(val.uid && val.uid!="" && val.uid!="hackedUid") {
				val = val.uid;
			}
		}
		arguments[0] = val;
		this.callParent(arguments);
	},
	getValue: function() {
		var uid = this.callParent();
		var idx = this.getStore().find('uid',uid);
		if(idx>-1) {
			return this.getStore().getAt(idx).data;
		} else if(uid && !uid=="") {
			return {'uid':uid,displayName:uid,description:uid}
		}
		return {};
	},
    initComponent:function () {
        this.store = Ext.create('gov.va.cpe.store.PointOfCareStore'); // need to create store here rather than inline so that the store class is loaded
        this.callParent(arguments);
        this.store.on('load', function(store, recs) {
        	store.add({uid: 'custom', displayName: 'Other', description: 'Other'});
        });
        this.store.load();
        var me = this;
        this.on('select', function(combo, recs, eopts){
        	if(recs.length>0 && recs[0].get('uid')=='custom') {
        		me.ownerCt.cancelEdit();
        		Ext.MessageBox.prompt('Other Location','Enter other location name:', function(bnId, text, opt) {
        			if(bnId=="ok" || bnId=="yes") {
        				var selpid = gov.va.hmp.PatientContext.pid;
        				var pseudoLoc = Ext.encode({
        					uid: text,
        					displayName: text,
        					description: text
        				});
        				Ext.Ajax.request({
        					url: '/patient/location',
        					method: 'POST',
        					params: {
        						pid: selpid,
        						value: pseudoLoc
        					}
        				})
        				// Just call the Ajax rest endpoint manually from here; The UI notify will take care of the rest.
        				//me.setRawValue(Ext.encode({uid: 'hackedUid', displayName: text}));
        				//me.ownerCt.completeEdit();
        			}
        		});
        	}
        })
    }
});