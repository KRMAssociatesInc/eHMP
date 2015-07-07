Ext.define('gov.va.hmp.admin.AdminScreenSelector', {
    extend:'Ext.tree.Panel',
    requires:[
        'gov.va.hmp.AppContext'
    ],
    id:'adminScreenSelector',
    ui: 'sidebar',
    frame: true,
    minWidth:250,
    width:250,
    padding: '5 0',
//    stateful:true,
//    stateEvent:['select'],
    header: false,
    rootVisible:false,
    lines:false,
    useArrows:true,
    store:Ext.create('Ext.data.TreeStore', {
        storeId:'adminScreens',
        fields:['text', 'view'],
        root:{
            expanded:true,
            children:[
                {
                    text:'VPR/ODC',
                    expanded:true,
                    children:[
                        { leaf:true, text:'Sync Admin', view:'sync-vpr' },
                        { leaf:true, text:'Browse Patients', view:'vpr-patients' },
                        { leaf:true, text:'Browse Operational Data', view:'browse-odc' },
                        { leaf:true, text:'Sync Error Trap', view:'sync-errors' }
                    ]
                },
                {
                    text:'VistA RPCs',
                    expanded:true,
                    children:[
                        { leaf:true, text:"Call a VistA RPC", view:'rpc-call' },
                        { leaf:true, text:"VistA RPC Log", view:'rpc-log'}
                    ]
                },
                {
                	text:'Frames',
                	expanded:true,
                	children:[
            	        { leaf: true, text: 'List Frames', view: 'frame-list'},
            	        { leaf: true, text: 'Drools Editor', view: 'drools-edit'},
            	        { leaf: true, text: 'Terminology Browser', view: 'term-browse'}
    	            ]
                },
//                {
//                    text:'Users/Roles/Teams',
//                    expanded:true,
//                    children:[
//                        { leaf: true, text: 'User Class Management', view: 'user-classes'}
//                    ]
//                },
//                {
//                    text:'Patient Data Cache',
//                    expanded:true,
//                    children:[
//                        { leaf:true, text:"JDS Log" }
//                    ]
//                },
                {
                    text:'Plugins',
                    expanded:true,
                    children:[
                        { leaf: true, text: 'Manage Plugins', view: 'manage-plugins'}
                    ]
                },
                {
                    text:'Environment',
                    expanded:true,
                    children:[
                        {
                            leaf:true,
                            text:"Metrics",
                            view:'metrics'
                        },
                        {
                            leaf:true,
                            text:"HMP Properties",
                            view:'hmp-properties'
                        },
                        {
                            leaf:true,
                            text:"System Properties",
                            view:'system-properties'
                        },
                        {
                            leaf:true,
                            text:"Environment Variables",
                            view:'environment-variables'
                        },
                        {
                            leaf:true,
                            text:"Thread Dump",
                            view:'thread-dump'
                        },
                        {
                            leaf:true,
                            text:"Health Checks",
                            view:'health-checks'
                        }
                    ]
                },
                {
                    text:'JSON Data',
                    expanded:true,
                    children:[
                        {
                            leaf:true,
                            text:"Integrity Check",
                            view:'jsondata-integrity'
                        },
                        {
                            leaf:true,
                            text:"Patient Checksum",
                            view:'patient-checksum'

                        }
                    ]
                }
            ]
        }
    })
});