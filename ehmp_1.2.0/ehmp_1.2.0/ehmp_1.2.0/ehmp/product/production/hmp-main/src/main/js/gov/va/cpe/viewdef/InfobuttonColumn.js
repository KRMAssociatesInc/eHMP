/*
 * TODO: is there a way to name the column, but not display a column heading?
 * -- so that in the column list it could say infobutton, but not display it in the renderered grid header?
 */
Ext.define('gov.va.cpe.viewdef.InfobuttonColumn', {
	extend: 'Ext.grid.column.Action',
	alias: 'widget.infobuttoncolumn',
	sortable: false,
	groupable: false,
	resizable: false,
	hideable: false,
	menuDisabled: true,
	width: 25,
	constructor: function(config) {
		// the ActionColumn constructor rebuilds the items array, so we have to use constructor instead of initComponent in 4.07
		Ext.apply(config, {width: this.width, renderer: this.renderer, header: '', hideable: this.hideable});
		this.callParent([config]);
	},
	
	renderer: function(val, metaData) {
		/*
		 * Only include the tdCls with the infobutton icon background if there is an infobutton url value.
		 * I tried to do this the otherway (clear/delete/change the tdCls), but it doesn't seem to work.
		 */
		if (val && val !== '') {
			metaData.tdCls = 'hmp-info-btn-cell';
		}
	},
	
	listeners: {
    	render: function(cmp) {
    		var me = this;
    		
    		// set reference to the view
    		this.view = me.up('gridpanel').getView();
    		
    		// create the tooltip
    		this.tooltip = Ext.create('Ext.tip.ToolTip', {
                target: me.view.el,
                delegate: '.hmp-info-btn-cell',
                autoHide: false,
                anchor: 'right',
                anchorToTarget: false,
                hideDelay: 1000,
                mouseOffset: [-10,0]
    		});
    		
    		this.tooltip.on('beforeshow', function updateTipBody(tip, options) {
    			tip.update('Loading...');
    			
    			// get the appropriate enclosing <tr> tag
    			var row = Ext.get(tip.triggerElement).up(".x-grid-row");
//    			Ext.log(row);
    			var vw = me.view;
    			var rec = vw.getRecord(row.dom);

                // TODO: How to make this configurable?
                // TODO: This should be the same mechanism as the detail url?
//                var urlStr = (rec) ? rec.get('infobtnurl') : null;
				 var urlStr = (rec) ? rec.get('infobtnurl') : null;
                if (!urlStr) {
                	tip.update('ERROR: no infobutton URL defined');
                	return true;
                }
                 
                 // ajax request to load the infobutton results.
                 Ext.Ajax.request({
                     url: urlStr + "&transform",
                     success: function(response) {
                     	// TODO: this is a hack, needs to be reworked.
                     	var ret = '<div>';
                     	var feeds = response.responseXML.getElementsByTagNameNS('*','feed');
                     	for (var i=0; i < feeds.length; i++) {
                     		//ret += '${it.title}: <b>${it.subtitle}</b><ul>'
                     		var title = feeds[i].getElementsByTagNameNS('*','title')[0].lastChild.nodeValue;
                     		var subtitle = feeds[i].getElementsByTagNameNS('*','subtitle')[0].lastChild.nodeValue;
                     		var entries = feeds[i].getElementsByTagNameNS('*','entry');
                     		ret += title + ': <b>' + subtitle + '</b><ul>';
                     		for (var j=0; j < entries.length; j++) {
                     			var etitle = entries[j].getElementsByTagNameNS('*','title')[0].lastChild.nodeValue;
                     			var elink = entries[j].getElementsByTagNameNS('*','link')[0].getAttribute('href');
                     			ret += '<li><a href="' + elink + '" target="_blank">' + etitle + '</a></li>';
                     		}
                     		ret += '</ul>';
                     	}
                     	ret += '</div>';
                        tip.update(ret);
                     },
                     failure: function(response) {
                     	tip.update('Error loading infobutton response...');
                     }
                 });
             });		    		
    	}
	}
});
