Ext.define('gov.va.cpe.roster.RosterBuilderController', {
	extend: 'gov.va.hmp.Controller',
	refs: [
	       {
	    	   ref: 'rosterEditor',
	    	   selector: '#rosterEditor'
	       },{
	    	   ref: 'rosterNameEdit',
	    	   selector: '#rosterNameEdit'
	       },{
	    	   ref: 'rosterList',
	    	   selector: '#rosterList'
	       },{
	    	   ref: 'rosterWindowSrcGrid',
	    	   selector: '#rosterWindowSrcGrid'
	       },{
	    	   ref: 'createRosterButton',
	    	   selector: '#createRosterButton'
	       }
	       ],
	       init: function () {
	    	   var me = this;
	    	   me.control({
	    		   '#rosterNameEdit': {
	    			   blur: me.onRosterNameBlur
	    		   },
	    		   '#rosterList': {
//	    			   select: me.onSelectRoster,
	    			   selectionchange: me.onSelectRoster,
	    			   rosterremove: me.removeRoster
	    		   },
	    		   '#rosterWindowSrcGrid': {
	    			   addPatient: me.addPatient,
	    			   deleteSource: me.deleteSource,
	    			   addSource: me.addSource
	    		   },
//	    		   '#addRowToSrcGridButton': {
//	    		   click: me.addRosterSrcRow
//	    		   },
	    		   '#createRosterButton': {
	    			   click: me.createRoster
	    		   }
	    	   });
	       },
	       deleteSource: function(srcSequence) {
	    	   var me = this;
	    	   if(this.currentRoster) {
	    		   var sources = this.currentRoster.sources();
	    		   sources.each(function(src){
	    			   if(src) {
	    				   if(src.get('sequence')==srcSequence) {
		    				   sources.remove(src);
		    				   me.save();
			    			   var grid = me.getRosterWindowSrcGrid();
			    			   grid.setRoster(me.currentRoster);
		    			   }
	    			   }
	    		   });
	    	   }
	       },
	       addSource: function(src) {
	    	   if(src && this.currentRoster) {
	    		   var srcstore = this.currentRoster.sources();
	    		   srcstore.add({name: src.get('name'), localId: src.get('localId'), source: src.get('src'), action: 'UNION'});
				   this.save();
    			   var grid = this.getRosterWindowSrcGrid();
    			   grid.setRoster(this.currentRoster);
	    	   }
	       },
	       addPatient: function(patient) {
	    	   if(patient && this.currentRoster) {
	    		   var srcstore = this.currentRoster.sources();
	    		   var dfn = patient.get('dfn');
	    		   if(!dfn) {
	    			   dfn = patient.get('uid').split(':')[4];
	    		   }
	    		   srcstore.add({name: patient.get('displayName'), localId: dfn, source: 'Patient', action: 'UNION'});
				   this.save();
    			   var grid = this.getRosterWindowSrcGrid();
    			   grid.setRoster(this.currentRoster);
	    	   }
	       },
	       onRosterNameBlur: function(editor) {
	    	   var roster = this.currentRoster;
	    	   if (!roster) return;
	    	   roster.set('name', editor.getValue());
	    	   this.save();
	       },
	       createRoster: function() {
	    	   if(this.currentRoster) {
	    		   this.save();
	    	   }
	    	   var grid = this.getRosterList();
	    	   var newRoster = grid.getStore().add({name: 'New Roster', patients: [], sources: []});
	    	   grid.getSelectionModel().select(newRoster);
	    	   var srcgrid = this.getRosterWindowSrcGrid();
			   srcgrid.setRoster(this.currentRoster);
	       },
	       save: function() {
	    	   var me = this;
	    	   if(this.currentRoster) {
	    		   var crost = this.currentRoster;
	    		   var ptgrid = this.getRosterWindowSrcGrid();
	    		   var ret = {id: this.currentRoster.get('localId')||0, prefs: {}};
	    		   var rosterid = this.currentRoster.get('localId');
	    		   if (!rosterid || rosterid == 0 || rosterid === '0') {
	    			   // no id specified, should be blank;
	    			   rosterid = '';
	    		   }
	    		   var nm = this.currentRoster.get('name');
	    		   ret.def = [[nm, rosterid, nm, '', 1804].join('^')];

	    		   var found = false;
	    		   crost.sources().each(function(rec) {
	    			   if (rec.get('localId')) {
	    				   found = true;
	    				   ret.def.push([rec.get('source')||'patient', 'UNION', rec.get('localId')||rec.get('id')].join('^'));
	    			   }
	    		   });
	    		   
	    		   if(found) {
	    			   var saveDat = Ext.encode(ret);
	    			   Ext.Ajax.request({
	    				   url: '/roster/updateOne',
	    				   method: 'POST',
	    				   params: {
	    					   set: saveDat
	    				   },
	    				   success: function (resp) {
	    					   var rslt = Ext.decode(resp.responseText);
	    					   var patients = crost.patients();
	    					   patients.removeAll();
	    					   for(pk in rslt.patients) {
	    						   patients.add(rslt.patients[pk]);
	    					   }
	    					   var sources = crost.sources();
	    					   sources.removeAll();
	    					   for(sk in rslt.sources) {
	    						   sources.add(rslt.sources[sk]);
	    					   }
	    					   if(crost===me.currentRoster) {
		    					   me.getRosterWindowSrcGrid().setRoster(crost);
		    					   if (rslt && rslt.localId && !crost.get("localId")) {
		    						   crost.set('localId', rslt.localId);
		    					   }
	    					   }
	    		               if(Ext.getStore('rosters')!=null) {
	    		            	   Ext.getStore('rosters').load();
	    		               }
	    				   },
	    				   failure: function (resp) {
	    					   // Hack to avoid duplicates from draft and save button at same time.
	    					   me.saving = false;
	    					   if(Ext.isFunction(me.afterSave)) {
	    						   var funk = Ext.Function.bind(me.afterSave, me);
	    						   me.afterSave = null;
	    						   funk.call();
	    					   }
	    					   console.log(resp);
	    					   Ext.MessageBox.alert('Save Failed', 'Check console log for details.');
	    				   }
	    			   });
	    		   }

	    	   }

	       },
	       onSelectRoster: function(grid, record, index) {
	    	   var formCmp = this.getRosterEditor();
	    	   var me = this;
	    	   if(Ext.isArray(record)) {
	    		   if(record.length==0) {
	    			   formCmp.form.reset();
	    			   this.getRosterWindowSrcGrid().down('#addPatientToRosterButton').disable();
	    			   this.getRosterWindowSrcGrid().down('#addClinicToRosterButton').disable();
	    			   this.getRosterWindowSrcGrid().down('#addWardToRosterButton').disable();
	    			   this.getRosterWindowSrcGrid().down('#addPCMMToRosterButton').disable();
	    			   this.getRosterWindowSrcGrid().down('#addPXRMToRosterButton').disable();
	    			   this.getRosterWindowSrcGrid().down('#addSpecialtyToRosterButton').disable();
	    			   this.getRosterWindowSrcGrid().down('#addProviderToRosterButton').disable();
//	    			   this.getRosterWindowSrcGrid().tools[0].disable();
	    			   this.currentRoster = null;
	    			   this.getRosterWindowSrcGrid().hide();
	    		   } else {
	    			   this.currentRoster = record[0];
	    			   var grid = this.getRosterWindowSrcGrid();
	    			   grid.setRoster(this.currentRoster);
	    			   grid.show();
	    			   grid.down('#addPatientToRosterButton').enable();
	    			   grid.down('#addClinicToRosterButton').enable();
	    			   grid.down('#addWardToRosterButton').enable();
	    			   grid.down('#addPCMMToRosterButton').enable();
	    			   grid.down('#addPXRMToRosterButton').enable();
	    			   grid.down('#addSpecialtyToRosterButton').enable();
	    			   grid.down('#addProviderToRosterButton').enable();
//	    			   grid.tools[0].enable();
	    			   formCmp.setTitle(record[0].get('name'));
	    			   formCmp.setDisabled(false);
	    			   var form = formCmp.getForm();
	    			   form.loadRecord(record[0]);
	    		   }
	    	   }
	       },
	       removeRoster: function(cmp, rec, b, c) {
	    	   var me = this;
	    	   var uid = rec.get('uid');
	    	   Ext.Ajax.request({
	    		   url: '/roster/delete',
	    		   params: {
	    			   uid: rec.get('uid')
	    		   },
	    		   success: function(resp) {
	    			   me.getRosterList().getStore().load();
	    			   Ext.getStore('rosters').load();
	    		   }
	    	   });
	       }
});