Ext.define('gov.va.cpe.multi.BoardPreviewWindow', {
	extend: 'Ext.window.Window',
    requires: ['gov.va.cpe.roster.RosterStore',
               'gov.va.cpe.viewdef.ViewDefGridPanel'],
	alias: 'widget.bpwindow',
	width: 1024,
    height: 600,
    src: null,
    title: 'Panel Preview',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
            padding: '5 5 5 5',
            flex: 0,
            xtype: 'combobox',
            itemId: 'mpeRosterPicker',
            queryMode: 'local',
            queryParam: 'filter',
            grow: true,
            fieldLabel: 'Select Roster for Preview',
            emptyText: '<Select Patient List>',
            typeAhead: true,
            allowBlank: false,
            forceSelection: true,
            displayField: 'name',
            valueField: 'id'
        },{
        	xtype: 'panel',
        	flex: 1,
        	layout: 'fit', 
        	items: [{
        		xtype: 'viewdefgridpanel',
                id: 'mpeViewDefPreviewPanel',
                addFilterTool: true
        	}]
        }
    ],
    tbar: {
    	items: [{
    		xtype: 'button',
    		text: 'Save',
    		handler: function(bn) {
    			// Set width properties of columns on the underlying board cols.
    			var vdgp = bn.up('bpwindow').down('viewdefgridpanel');
    			var state = vdgp.getState();
    			if(src && Ext.isFunction(src.setUIConfig)) {
    				src.setUIConfig(state);
    			}
    		}
    	}]
    },
    initComponent: function() {
    	this.callParent(arguments);
    	var me = this;
    	this.down('combobox').bindStore(Ext.getStore('rosters') ? Ext.getStore('rosters') : Ext.create('gov.va.cpe.roster.RosterStore'));
    	this.down('combobox').on('select', function(box, recs) {
    		if(recs && recs.length>0) {
    			var rec = recs[0];
                var selViewName = rec.get('name');
                var rosterId = box.getValue();
                if (rosterId && rosterId > 0) {
                    Ext.util.Cookies.set('BoardBuilderRosterPreviewID', rosterId);
                    me.down('viewdefgridpanel').setViewDef(me.selViewID, {
                        'roster.uid': rosterId
                    });
                }
    		}
    	});
    }
});