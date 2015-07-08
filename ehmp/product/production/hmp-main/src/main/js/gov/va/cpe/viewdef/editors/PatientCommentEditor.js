Ext.define('gov.va.cpe.viewdef.editors.PatientCommentEditor', {
	alias: 'widget.patientcomment',
	extend: 'Ext.panel.Panel',
	minWidth: 330,
	height: 180,
	layout: 'border',
	items: [{
		xtype: 'form',
		region: 'center',
		layout: {type: 'vbox', align: 'stretch'},
		items: [{
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
		this.down('form').getForm().reset();
		this.down('form').getForm().setValues(json);
		this.srcJson = json;
	},
	getValue: function() {
		var vals = this.down('form').getForm().getValues();
		return vals;
	},
	isValid: function() {
		return true;
	},
	statics: {
		editRecord: function(evt, pid, idx, forCurrentVisit) {
			var pid = pid;
			var idx = idx;
			var forCurrentVisit = forCurrentVisit;
			
			// This part should be somehow generalized. This is for placing the component in the grid correctly and constricting so it can't be dragged off screen.
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
					xtype: 'patientcomment' 
				}],
                height: 130,
                width: 350,
				constrainTo: constrainToComponent,
				constrainHeader: true,
				bbar: {items:[{
					xtype: 'button',
					text: 'Submit',
					handler: function(bn) {
						var rt = bn.up('window').down('patientcomment');
						var val = rt.getValue().comment;
						var pwnd = bn.up('window');
						var params = {
							comments: val, 
							pid: pid
						};
						if(idx>-1) {
							params.idx = idx;
						}
						if(forCurrentVisit) {
							params.forCurrentVisit = forCurrentVisit;
						}
						Ext.Ajax.request({
							url: '/patient/comments',
							method: 'POST',
							params: params,
							success: function(resp) {
								pwnd.close();
							},
							failure: function(resp) {
								Ext.MessageBox.alert('Save Failed','Could not save Comment: '+resp.responseText);
							}
						})
					}
				}]}
			});
			if(idx>-1) {
				Ext.Ajax.request({
					url: '/patient/comments',
					method: 'GET',
					params: {
						pid: pid,
						forCurrentVisit: forCurrentVisit || false
					},
					success: function(resp) {
						var rec = Ext.decode(resp.responseText);
						if(rec && rec.comments && rec.comments.length>idx) {
							wnd.down('patientcomment').setValue(rec.comments[idx]);
							wnd.showAt(cX, cY);
						}
					},
					failure: function(resp) {

					}
				});
			}
			else {
                wnd.showAt(cX, cY);
			}
		},
		deleteRecord: function(evt, pid, idx, forCurrentVisit) {
			Ext.Ajax.request({
				url: '/patient/comments/'+pid+'/'+idx+"/"+forCurrentVisit,
				method: 'DELETE',
				success: function(resp) {
					
				},
				failure: function(resp) {
					
				}
			})
		}
	}
});