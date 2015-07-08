Ext.define('gov.va.hmp.tabs.InfobuttonSearchPanel', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    alias: 'widget.infobuttonsearchpanel',
    title: 'Infobutton Search Results',
    viewID: 'gov.va.cpe.vpr.queryeng.search.InfobuttonSearchViewDef',
    viewParams: {url:''},
    detailType: 'none',
    header: false,
    columns: [
          // Maps with these keys: title, subtitle, etitle, href, ehint
        {
        	xtype: 'templatecolumn', dataIndex: 'title', text: 'Source', width: 150,
        	sortable: false, groupable: false, hidable: false,
        	tpl: '<i class="fa fa-external-link">&nbsp;{title}</i>'
    	},
//        {dataIndex: 'subtitle', text: 'Site', width: 125},
        {dataIndex: 'etitle', text: 'Topic', flex: 1}
    ],
    listeners: {
    	select: function(rowModel, rec, idx, e) {
    		console.log('window.open', rec);
    		var href = rec.get('href');
    		window.open(href, 'infobtnwin');
    	}
    }
});