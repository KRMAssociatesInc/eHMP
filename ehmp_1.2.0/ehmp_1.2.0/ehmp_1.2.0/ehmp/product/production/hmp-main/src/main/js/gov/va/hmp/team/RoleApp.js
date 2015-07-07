Ext.define('gov.va.hmp.team.RoleApp', {
    extend:'gov.va.hmp.Application',
    requires:[
        'gov.va.hmp.team.VistaUserClass',
        'gov.va.hmp.team.MyTreeReader'
    ],
    autoCreateViewport:true,
    launch:function () {
        var store = Ext.create('Ext.data.TreeStore', {
            storeId:'userClassHierarchy',
            model:'gov.va.hmp.team.VistaUserClass',
            proxy:{
                type:'ajax',
                url:'/js/gov/va/hmp/team/user-class-hierarchy.json',
                reader:{
//                    type:'jsonctree',
                    root:'subclasses'
                }
            },

            listeners:{

                // Each demo.UserModel instance will be automatically
                // decorated with methods/properties of Ext.data.NodeInterface
                // (i.e., a "node"). Whenever a UserModel node is appended
                // to the tree, this TreeStore will fire an "append" event.
                append:function (thisNode, newChildNode, index, eOpts) {
//                    console.log("bar");
//                    console.log(newChildNode);
                    // If the node that's being appended isn't a root node, then we can
                    // assume it's one of our UserModel instances that's been "dressed
                    // up" as a node
                    if (!newChildNode.isRoot()) {
                        var associatedData = newChildNode.getAssociatedData()
                        if (associatedData.subclasses && associatedData.subclasses.length > 0) {
//                            newChildNode.set('expanded', true);
                            newChildNode.set('leaf', false);
                        } else {
                            newChildNode.set('leaf', true);
                        }

////                        newChildNode.set('expanded', true);
                        newChildNode.set('text', newChildNode.get('displayName'));
////                        newChildNode.set('icon', newChildNode.get('profile_image_url'));
                    }
                }
            }
        });

        var viewport = Ext.ComponentQuery.query('viewport')[0];
        viewport.add(Ext.create('Ext.tree.Panel', {
            region:'center',
            title:'Roles',
            padding:10,
            rootVisible:false,
            useArrows:true,
            store:store,
            columns:[
                {
                    xtype:'treecolumn', //this is so we know which column will show the tree
                    text:'Role',
                    dataIndex:'displayName',
                    flex:2
                },
                {
                    xtype:'checkcolumn',
                    text:'Inactive',
                    dataIndex:'inactive'
                },
                {
                    text:'Abbreviation',
                    dataIndex:'abbreviation'
                },
                {
                    text:'Person Class',
                    dataIndex:'personClass',
                    flex:1
                },
                {
                    xtype:'checkcolumn',
                    text:'Private',
                    dataIndex:'private'
                }
            ]
        }));
        viewport.add(Ext.create('Ext.grid.Panel', {
            region:'west',
            split:true,
            title:'Person Classes',
            padding:10,
            width:'40%',
            store:Ext.create('gov.va.hmp.team.PersonClassStore', {
                autoLoad:true
            }),
            columns:[
                {
                    text:'Classification',
                    dataIndex:'classification',
                    flex:1
                },
                {
                    text:'Area Of Specialization',
                    dataIndex:'areaOfSpecialization',
                    flex:1
                }
            ],
            features:[
                {
                    ftype:'grouping',
                    startCollapsed:true,
                    groupHeaderTpl: '{name}'
                }
            ]
        }));
        store.load();
    }
});