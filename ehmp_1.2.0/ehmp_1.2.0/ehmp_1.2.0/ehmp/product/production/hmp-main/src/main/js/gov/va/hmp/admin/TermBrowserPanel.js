
var termSearchStore = Ext.create('Ext.data.Store', {
	fields: ['urn', 'description', 'sab', 'code'],
	proxy: {
		type: 'ajax',
		url: '/term/search',
		reader: {
			type: 'json',
			root: 'data.items'
		}
	}
});

Ext.define('gov.va.hmp.admin.TermBrowserPanel', {
	extend : 'Ext.panel.Panel',
	requires : [ 'gov.va.hmp.admin.TermBrowserTree' ],
	itemId : 'term-browse',
	title : 'Terminology Browser',
	layout : 'border',
	items : [
	// top items
	{
		xtype : 'container',
		region : 'north',
		layout : 'hbox',
		items : [ {
			xtype : 'fieldset',
			title : 'Search',
			layout : 'hbox',
			flex : 2,
			items : [{
				xtype : 'combobox',
				itemId : 'termSearchField',
				value : 'urn:lnc:2345-7',
				fieldLabel : 'Search Concept',
				flex : 1,
				displayField: 'description',
				valueField: 'urn',
				store: termSearchStore,
				tpl: '<tpl for="."><div class="x-boundlist-item"><span class="label label-default" style="float: right;">{sab}</span>{description} ({code})</div></tpl>'
			}]
		}/*, {
			xtype : 'fieldset',
			title : 'Sources',
			flex : 1,
			items :  {
				xtype : 'combobox',
				fieldLabel : 'Sources',
			}
		}*/

		]
	}, {
		xtype : 'tabpanel',
		itemId : 'termSearchTabs',
		title: 'Search/Display Results',
		region : 'center'
	} ]
});