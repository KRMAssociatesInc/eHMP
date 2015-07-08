Ext.define('gov.va.cprs.Reports', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.cprs.CPRSReportPanel'
    ],
    title: 'Reports',
    layout: 'border',
    items: [
        {xtype: 'cprsreportpanel', region: 'center', itemId: 'contentarea'}
    ],
    
    initComponent: function() {
    	this.callParent();
		var me = this;
    	this.store = Ext.create('Ext.data.TreeStore', {
    	    root: {
    	        expanded: true,
    	        children: []
    	    }
    	});
    	this.add({xtype: 'treepanel', region: 'west', split: true, title: 'Available Reports', store: this.store, rootVisible: false, width: 200});
		this.disp = me.down("#contentarea");
		this.tree = me.down('treepanel');
		this.tree.on('beforeselect', function(panel, rec, idx) {
			if (rec.raw.disabled === true) return false;
		});
		this.tree.on('select', function(panel, rec, idx) {
			if (rec.raw.rpcurl && rec.raw.reportType == 'R') {
				var title = rec.raw.title || 'Report';
				me.disp.setTitle(title);
				me.disp.loadRPC(rec.raw.rpcurl);
			} else if (rec.raw.reportType == 'V') {
				me.disp.loadTableCols(rec.raw.reportID, rec.raw.rpcurl);
			}
		});
		
		// first get the tree of reports
		this.initReportTree();
    },
    
    initReportTree: function() {
    	var me = this;
		var url = '/rpc/execute?context=VPR UI CONTEXT&name=ORWRP3 EXPAND COLUMNS&params=REPORTS';
		Ext.Ajax.request({
			url: url,
			success: function(resp) {
				var lines = resp.responseText.split("\n");
				var node = me.store.getRootNode();
				
				for (i in lines) {
					var line = lines[i];
					var comps = line.split('^');
					var disabled = !(comps[7] == 'R' || comps[7] == 'V');
					var cls = (disabled) ? 'x-menu-item-disabled' : '';
					
					if (comps[0] == '[PARENT START]') {
						node = node.appendChild({ text: comps[2], leaf: false});
					} else if (comps[0] == '[PARENT END]') {
						node = node.parentNode;
					} else if (comps[0].trim() == '[REPORT LIST]' || comps[0].trim() == '$$END' || comps[0].trim() == "") {
						// ignore
					} else {
						node.appendChild({
							text: comps[1], 
							cls: cls, 
							leaf: true, 
							title: comps[1], 
							disabled: disabled, 
							reportType: comps[7],
							reportID: comps[10],
							rpcurl: me.buildReportURL(comps)
						});
					}
				}
			}
		});
    },
    
    buildReportURL: function(comps) {
    	var ret = "/rpc/execute?context=OR CPRS GUI CHART&name=" + comps[9];
    	var param2 = comps[0] + ':' + comps[1].toUpperCase() + '~' + comps[3] + ';' + comps[2].split(';')[2]; // OR_BADR:ALLERGIES~ADR;ORDV01;73;10
    	var params=['{dfn}',param2,'','','','3130522','3130529'];
    	return ret + "&params=" + params.join(',');
    }
});