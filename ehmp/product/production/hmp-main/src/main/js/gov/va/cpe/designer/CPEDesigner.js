/*
 * The editor/configuration of a WidgetTabPanel
 */
Ext.define('gov.va.cpe.designer.CPEDesigner', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.cpedesigner',
	requires: ['gov.va.cpe.viewdef.ViewDefGridPanel'],
	layout: 'border',
	
	// this is a list of all the known component types/metadata.
	// TODO: In the future this will be a list of plugins?
	// TODO: additional metadata: always root/never nested inside another container
	types: {
		'dashboard': {text: 'Dashboard', type: 'dashboard', icon: '/images/icons/folder_table.png', container: true},
		'worksheet': {text: 'Worksheet', type: 'worksheet', icon: '/images/icons/layout_content.png', container: true},
		'viewdefgridpanel': {text: 'Data Grid', type: 'viewdefgridpanel', icon: '/images/icons/table.png', component: 'gov.va.cpe.designer.DataGridDetail', container: false}
	},
	initComponent: function() {
		var me = this;
		this.callParent();
		
		this.treepanel = this.down('treepanel');
		this.deleteBtn = this.down('#DeleteBtnID');
		this.addBtn = this.down('#AddBtnID');
		
		// initalize the default (empty) editor and form
		this.formCmp = this.down('form');
		this.form = this.formCmp.getForm();
		this.setEditor('gov.va.cpe.designer.PanelEditor', null);

		// populate the add button menu
		for (var t in this.types) {
			this.addBtn.menu.insert(1,this.types[t]);
		}
		
		// attach a handler to the add button
		this.down("button[text='Add']").menu.on('click', function(menu, item) {
			var node = {title: 'New ' + item.text, type: item.type, icon: item.icon, leaf: item.container !== true};
			
			// append the new node to the 'main' node (if availble)
			var parent = me.treepanel.getStore().getNodeById('main');
			if (!parent) {
				parent = me.treepanel.getRootNode();
			}
			parent.appendChild(node);
		});
		
		// attach a select listener
		this.treepanel.on('select', function(rowmodel, rec, idx, eOpts) {
			me.deleteBtn.enable();
			
			// if no editor was defined, use the default
			var type = me.types[rec.get('type')];
			if (!type || !type.component) {
				type = 'gov.va.cpe.designer.DefaultPanelEditor';
			} else if (true) {
				type = type.component;
			} else {
				type = 'Ext.tab.Panel'
			}
			
			// what configuration to pass to the editor? (usually stored in rec.cfg)
			//var cfg = rec.get('cfg');
			//cfg.title = rec.get('title');
			//cfg = new Ext.data.Model();
			me.setEditor(type, rec);
			
			// attach a change listener to the title field to update the tree
			var titlefield = me.down("textfield[name='title']");
			if (titlefield) {
				titlefield.on('change', function(field, newVal, oldVal, eOpts) {
					var rec = me.form.getRecord();
					rec.set('title', newVal);
				});
			}

		});
	},
	
	setEditor: function(type, rec) {
		var me = this;
		
		// create a new type-specific editor
		this.formCmp.removeAll(true);
		this.editorCmp = Ext.create(type);
		this.formCmp.add(this.editorCmp);
		
		// load the form with the new record (if any)
		if (rec) {
			this.form.loadRecord(rec);
		}
	},
	
	// sample data that will be stored as a param and converted into a tree
	treeData: {
		title: 'CHF Panel',
		// TODO: Maybe need some user info (public/private flag, etc)?
		panelCfg: {}, // could hold the panel viewdef config info (including the roster)?
		bannerCfg: {}, // could hold the patient banner viewdef config info
		
		// TODO: declare this as a tabpanel?
		items: [
	       {title: 'Dashboard', type: 'dashboard', cfg: {}},
	       {title: 'Worksheet', type: 'worksheet', cfg: {}},
	       {title: 'Recent Labs', type: 'viewdefgridpanel', viewID: 'gov.va.cpe.vpr.queryeng.LabViewDef', cfg: {collapsible: true}},
        ]
	},
	
	configure: function(data) {
		// convert the configuration data into tree data
		var root = {expanded: true, allowDrop: false, title: 'Root Node', children: []};
		
		root.children.push(Ext.applyIf({title: 'Pt. List', icon: '/images/icons/group.png', allowDrag: false, leaf: true}, data.panelCfg));
		root.children.push(Ext.applyIf({title: 'Pt. Banner', icon: '/images/icons/user.png', allowDrag: false, leaf: true}, data.bannerCfg));
		
		var node = {title: data.title, id: 'main', expanded: true, allowDrag: false, leaf: false, children: []};
		for (var i in data.items) {
			var item = data.items[i];
			// TODO: here is where we lookup the metadata for type and insert leaf nodes, etc.
			node.children.push(Ext.apply({}, item));
		}
		root.children.push(node);
		
		//return root;
		this.treepanel.getStore().setRootNode(root);
	},
	
	items: [
        {
        	xtype: 'treepanel',
	    	viewConfig: {
	    	    plugins: { 
	    	    	ptype: 'treeviewdragdrop',
	    	    	ddGroup: 'TabGroup',
	    		}
	    	},        	
        	minWidth: 200,
        	width: 200,
        	region: 'west',
        	hideHeaders: true,
        	rootVisible: false,
        	useArrows: true,
        	split: true,
        	tbar: [
    	       {xtype: 'combobox', queryMode: 'local', valueField: '', emptyText: 'Select a Role...', store: ['Doctor','Nurse','Case Mgr']},
    	       {xtype: 'button', text: 'load', handler: function() { var x = this.ownerCt.ownerCt.ownerCt;}}
	        ],
        	bbar: [
        	    {itemId: 'DeleteBtnID', disabled: true, icon: '/images/icons/cog_delete.png'},
        	    {itemId: 'AddBtnID', xtype: 'button', text: 'Add', menu: {
        	        items: [
        	                {text: 'Main Pages', plain: true, canActivate: false, style: {padding: '3px', fontWeight: 'bold', backgroundColor: 'silver'}},
        	                {text: 'Other/3rd Party', plain: true, canActivate: false, style: {padding: '3px', fontWeight: 'bold', backgroundColor: 'silver'}},
                            {text: 'CART-CL'}
        	            ]
        	        }
        	    }
    	    ],        	
        	columns: [{xtype: 'treecolumn', header: 'Title', flex: 1, dataIndex: 'title'}],
        	store: Ext.create('Ext.data.TreeStore', {
        		fields: ['title','type','leaf','viewID','cfg'],
        		root: {
        			expanded: true,
        			title: 'Patient Banner',
        			icon: '/images/icons/user.png',
        			children: [
	    		       {title: 'Dashboard', icon: '/images/icons/folder_table.png', type: 'dashboard', leaf: false},
	    		       {title: 'Worksheet', icon: '/images/icons/layout_content.png', type: 'worksheet', leaf: false},
	    		       {title: 'Data Grid', icon: '/images/icons/table.png', type: 'viewdefgridpanel', leaf: true},
		            ]
        		}
        	})
        },
        {
     	   xtype: 'form',
     	   region: 'center',
     	   layout: 'fit',
     	   bbar: [
             	    {xtype: 'combobox', store: [1,2,3], allowBlank: false, name: 'pid', fieldLabel: 'Preview Patient'},
             	    {xtype: 'button', text: 'Preview', handler: function() {var x = this.ownerCt.ownerCt.ownerCt; if (x.editorCmp) { x.editorCmp.onFormUpdate()}}},
           	        '->',
           	        {xtype: 'splitbutton', text: 'Save', menu: {
           	        	items: [
       	        	        {text: 'For System/Account'},
       	        	        {text: 'For Division'},
       	        	        {text: 'For Current User'}
               	        ]
           	        }, handler: function() {
           	        	var form = this.ownerCt.ownerCt.getForm();
           	        	var editor = this.ownerCt.ownerCt.ownerCt.editorCmp;
           	        	var vals = form.getValues();
           	        	var convertVals = editor.convertValues(vals); 
           	        	form.getRecord().set(convertVals);
       	        	}}, 
           	        {text: 'Cancel'}
       	        ],
     	   items: [] // items will be dynamically added/removed for different tree items.
        }
    ]
	
});