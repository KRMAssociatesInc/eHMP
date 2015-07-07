Ext.define('gov.va.cpe.viewdef.editors.RoadTripEditor', {
	requires: ['gov.va.cpe.viewdef.editors.PointOfCareEditor',
	           'gov.va.cpe.viewdef.editors.PointOfCareForm',
	           'gov.va.hmp.healthtime.PointInTime'],
	alias: 'widget.roadtrip',
	extend: 'Ext.panel.Panel',
	minWidth: 330,
	height: 180,
	layout: 'border',
	items: [{
		xtype: 'form',
		region: 'center',
		layout: {type: 'vbox', align: 'stretch'},
		items: [{
			xtype: 'pocedit',
			fieldLabel: 'Location',
			allowBlank: false,
			name: 'locationUid',
		},{
			xtype: 'datefield',
			fieldLabel: 'Date',
			name: 'day'
		},{
			xtype: 'textfield',
			fieldLabel: 'Time',
			name: 'time'
		},{
			xtype: 'textfield',
			fieldLabel: 'Comment',
			name: 'comment'
		}]
	}],
	reset: function(a, b, c) {
		this.down('form').getForm().reset();
	},
	setValue: function(val) {
		var json = val;
		if(!Ext.isObject(val)) {
			json = Ext.decode(val);
		}
		if(json.data && json.data.length>0) {
			json = json.data[0];
		}
		if(json.day) {
			json.day = PointInTime.format(json.day, 'm/d/Y');
		}
		if(json.location && json.location.uid && !json.locationUid) {
			json.locationUid = json.location.uid;
		}
		if(json.locationUid) {
			var store = Ext.StoreManager.get('pocStore') || Ext.create('gov.va.cpe.store.PointOfCareStore');
			var recdex = store.find('uid',json.locationUid);
			if(recdex==-1 && json.location && json.location.displayName && !(json.location.displayName == json.locationUid)) {
				// Broken link.
				json.locationUid = json.location.displayName;
			}
		}
		
		this.down('form').getForm().reset();
		this.down('form').getForm().setValues(json);
		this.srcJson = json;
	},
	getValue: function() {
		// Get full blown location object from location UID to send to back-end
		var vals = this.down('form').getForm().getValues();
		if(vals.locationUid) {
			
			var store = Ext.StoreManager.get('pocStore') || Ext.create('gov.va.cpe.store.PointOfCareStore');
			store.each(function(rec){
				if(rec.get('uid')==vals.locationUid) {
					vals.location = rec.data;
				}
			});
			if(!vals.location) {
				vals.location = {
					uid: vals.locationUid,
					displayName: vals.locationUid, 
					description: vals.locationUid
				}
			}
		}
		
		if(vals.day) {
			vals.day = Ext.Date.format(new Date(vals.day), Ext.Date.patterns.HL7);
		}
		
		if(this.srcJson && this.srcJson.uid) {
			vals.uid = this.srcJson.uid;
		}
		return vals;
	},
	isValid: function() {
		return true;
	},
	statics: {
		editRecord: function(evt, pid, uid) {
			var pid = pid;
			var cmp = null;
			var boards = Ext.ComponentQuery.query('boardgridpanel');
			if(boards && boards.length>0) {
				for(bdex in boards) {
					var board = boards[bdex];
					if(board && board.isVisible && board.el && board.el.dom) {
						var tcmp = evt.target;
						var cont = tcmp.compareDocumentPosition(board.el.dom);
						if(cont==10) {
							cmp = board;
							break;
						}
					}
				}
			}
			
			var cX = evt.clientX;
			var cY = evt.clientY;
			var wdth = 350;
			var ht = 200;
			if(cmp) {
				if(cmp.getWidth()<(cX+wdth)) {
					cX = cmp.getWidth()-wdth;
				}
				if(cmp.getHeight()<(cY+ht)) {
					cY = cmp.getHeight()-ht;
				}
			}
			var constrainToComponent = null;
			if(cmp && cmp.el) {
				constrainToComponent = cmp.el;
			}
			
			var wnd = Ext.create('Ext.window.Window', {
				layout: 'fit',
				header: 'false',
				items: [{
					xtype: 'roadtrip' 
				}],
				constrainTo: constrainToComponent,
				constrainHeader: true,
				bbar: {items:[{
					xtype: 'button',
					itemId: "acceptBtn",
					disabled: true,
					text: 'Submit',
					handler: function(bn) {
						var rt = bn.up('window').down('roadtrip');
						var val = rt.getValue();
						var pwnd = bn.up('window');
						Ext.Ajax.request({
							url: '/patientDomain/roadTrip',
							method: 'POST',
							params: {value: Ext.encode(val), pid: pid},
							success: function(resp) {
								pwnd.close();
							},
							failure: function(resp) {
								Ext.MessageBox.alert('Save Failed','Could not save Transport: '+resp.responseText);
							}
						})
					}
				}]},
			    onBoxReady: function () {
			        var me = this;

			        me.transport = me.down('roadtrip');
			        me.form = me.transport.down('form');
			        me.form.on('validitychange', function(form, isValid) {
			        	var savebtn = me.down('#acceptBtn');
			        	if (isValid) {
			        		savebtn.enable();
			        	} else {
			        		savebtn.disable();
			        	}
			        });
			    }
			});
			if(uid && !uid=='') {
				Ext.Ajax.request({
					url: '/patientDomain/findOne/'+uid,
					method: 'GET',
					success: function(resp) {
						var rec = Ext.decode(resp.responseText);
						if(rec && rec.uid) {
							wnd.down('roadtrip').setValue(rec);
							wnd.setPosition(cX, cY);
							wnd.setSize(350, 220);
							wnd.show();
						}
					},
					failure: function(resp) {

					}
				});
			}
			else {
				wnd.setPosition(cX, cY);
				wnd.setSize(350, 220);
				wnd.show();
			}
		},
		deleteRecord: function(evt, pid, uid) {
			Ext.Ajax.request({
				url: '/editor/submitFieldValue',
				method: 'POST',
				params: {
					fieldName: 'removed',
					value: 'true',
					pid: pid,
					uid: uid
				},
				success: function(resp) {
					
				},
				failure: function(resp) {
					
				}
			})
		}
	}
});