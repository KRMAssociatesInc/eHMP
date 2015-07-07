Ext.define('gov.va.cpe.PatientWikiPanel',{
	extend: 'Ext.panel.Panel',
	alias: 'widget.patientwikipanel',
     title: "Clinical Wiki/Note",
     height: 450,
     layout: 'fit',
     mixins: {
 		patientaware: 'gov.va.hmp.PatientAware'
 	 },				     
     bbar: ['->', 
            'draft auto saved x min ago', 
            {xtype: 'button', text: 'Save/Submit Note', handler: function() {
	    	 var panel = this.up('patientwikipanel');
	    	 panel.saveDraft();
            }
     }],
     items: [{xtype: 'htmleditor'}],
     listeners: {
    	 patientchange: function(pid) {
    		 var me = this;
    		 this.pid = pid;
    		 
    		 if (this.pid !== null) {
	    		 Ext.Ajax.request({
	    			 url: '/param/get/WORKSHEET DRAFT',
	    			 params: {instance: this.pid},
	    			 success: function(resp) {
	    				 var data = Ext.JSON.decode(resp.responseText);
	    				 Ext.log('load.success', data.vals);
	    				 if (data.vals.data) {
	    					 me.editor.setValue(data.vals.data);
	    				 }
	    			 }
	    		 });
    		 }
    	 },
    	 afterrender: function() {
             Ext.log(Ext.getClassName(this) + " afterrender event");

             var me = this;
    		 this.editor = this.down('htmleditor');
    		 
	    	 // setup a timer to save the draft
	    	 this.timer = {
    			 interval: 30 * 1000,
	    		 run: function() {
	    			me.saveDraft();
	    		 }
	    	 };
	    	 Ext.TaskManager.start(this.timer);
    		 
    		 // make this a DD target
    		 var ddTarget = Ext.create('Ext.dd.DropTarget', this.editor.el, {
    			 ddGroup: 'WorksheetGroup',
    			 notifyDrop: function(ddSrc, e, data) {
    				 var rec = data.records[0];
    				 var grid = ddSrc.view.ownerCt;
    				 var value = grid.getDetailTitle(rec);
    				 me.editor.setValue(me.editor.getValue() + '<li><a href="">' + value + '</a></li>');
    			 }
    		 });
    	 }
     },
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
    },
    saveDraft: function() {
        try {
            var data = this.editor.getValue();
        } catch (ex) {
        }

        Ext.log('saving draft: ', this.pid, data);
        // TODO: update the draft saved message
        if (this.pid !== null) {
            Ext.Ajax.request({
                url: '/param/set/WORKSHEET DRAFT',
                params: {instance: this.pid, data: data},
                success: function() {
                    Ext.log('success', arguments);
                }
            });
        }
    }
});