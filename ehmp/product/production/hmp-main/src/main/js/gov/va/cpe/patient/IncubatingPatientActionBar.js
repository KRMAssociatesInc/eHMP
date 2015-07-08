Ext.define('gov.va.cpe.patient.IncubatingPatientActionBar', {
    extend:'Ext.toolbar.Toolbar',
    requires:[
        'gov.va.hmp.ux.SegmentedButton',
        'gov.va.cpe.order.MedOrderButton',
        'gov.va.cpe.TaskWindow',
        'gov.va.cpe.search.SearchBar',
        'gov.va.cpe.patient.CPRSButton'
    ],
    alias:'widget.incubatingptactionbar',
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
                taskWindow.updateTaskEditPanel(null, null);
                taskWindow.showBy(bn, "tl-bl?", [0, 2]);
             }
        },
        {
            xtype: 'medorderbutton'
        },

        {
            xtype: 'button',
            ui: 'link',
            text: 'New Condition',
            disabled: true
        },
        {
            xtype: 'button',
            ui: 'link',
            text: 'New Allergy',
            disabled: true
        },
        {
            xtype: 'button',
            ui: 'link',
            text: 'New Progress Note',
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
