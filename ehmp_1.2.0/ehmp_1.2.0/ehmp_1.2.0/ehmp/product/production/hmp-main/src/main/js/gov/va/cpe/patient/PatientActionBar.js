Ext.define('gov.va.cpe.patient.PatientActionBar', {
    extend:'Ext.toolbar.Toolbar',
    requires:[
        'gov.va.hmp.ux.SegmentedButton',
        'gov.va.cpe.order.MedOrderButton',
        'gov.va.cpe.TaskWindow',
        'gov.va.cpe.search.SearchBar',
        'gov.va.cpe.patient.CPRSButton'
    ],
    alias:'widget.ptactionbar',
    defaults: {
        margin: '0 3'
    },
    items:[
        /* TODO: switch to this eventually?
		{
		    xtype: 'splitbutton',
		    text: 'New Action',
		    icon: '/images/icons/add.png',
		    iconAlign: 'left',
		    menu: {
		    	items: [{text: 'New Order'},{text: 'New Task'},{text: 'New Document'},{text: 'New Worksheet'},{text: 'Etc...'}]
		    },
		    handler: function (bn) {
		        console.log('new.click', arguments);
		    }
		},
		*/
        {
            xtype: 'button',
            ui: 'link',
            text: 'New Task',
            handler: function (bn) {
                var taskWindow = Ext.getCmp('taskWindow');
                if (!taskWindow) taskWindow = Ext.create('gov.va.cpe.TaskWindow', {header:false});
                taskWindow.showBy(bn, "tl-bl?", [0, 2]);
                taskWindow.updateTaskEditPanel(null, null);
                var tep = taskWindow.down('taskeditpanel');
                tep.down('#taskNameField').focus();
             }
        },
        {
            xtype: 'medorderbutton',
            ui: 'link',
            disabled: true
        },
        {
            xtype: 'cprsbutton'
        },
		'->',
		{
		    xtype: 'searchbar',
            cls: 'search-query',
            triggerCls: 'x-form-search-trigger',
            hideTrigger: false,
		    emptyText: 'Quick Search',
            expand: false
		}
    ]
});
