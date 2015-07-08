Ext.define('gov.va.hmp.admin.TermBrowserTree', {
	extend:'Ext.tree.Panel',
	alias: 'widget.termbrowsertree',
	searchText: '', // the main search/selection criteria
	displayURN: '',
	rootVisible: true,
	columnsXXX: [
        {text: 'id', dataIndex: 'text'},
        {text: 'val', dataIndex: 'value'}
    ],
	initComponent: function() {
		var me = this;
		this.store = Ext.create('Ext.data.TreeStore', {
			/*
			displayField: 'description',
			proxy: {
				type: 'ajax',
				url: '/term/search/' + me.searchText,
				reader: {
					type: 'json',
					root: 'data.items'
				}
			},
			 */
			root: {
				text: 'Searching....',
				expanded: false,
				leaf: true
			}
		});
		this.callParent(arguments);
		
		if (this.searchText) {
			Ext.Ajax.request({url: '/term/search/' + me.searchText, success: function(resp) { me.processSearchResults(resp); }});
		} else if (this.displayURN) {
			this.store.setRootNode({text: this.displayURN});
		}
	},
	processSearchResults: function(resp) {
		var data = Ext.JSON.decode(resp.responseText);
//		console.log(data);
		var root = {text: 'Results For: ' + this.searchText, expanded:true, leaf:false, children: []};
		for (var i in data.data.items) {
			var item = data.data.items[i];
			console.log(item);
			var concept = {text: item.description, leaf: false, children: []}
			var attrs = [];
			for (var j in item.attributes) {
				attrs.push({text: j, value: item.attributes[j], leaf:true})
			}
			concept.children.push({text: 'Attributes', leaf: false, children: attrs})
			root.children.push(concept);
		}
		this.store.setRootNode(root);
	}
});