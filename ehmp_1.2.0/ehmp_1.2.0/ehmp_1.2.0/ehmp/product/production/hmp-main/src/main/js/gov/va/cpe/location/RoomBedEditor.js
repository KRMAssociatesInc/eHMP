Ext.define('gov.va.cpe.location.RoomBedEditor', {
    extend:'Ext.panel.Panel',
    itemId:'rbePanel',
    requires:[
        'gov.va.hmp.containers.GridBagLayout'
    ],
    alias:'widget.panelEditor',
    layout: 'hbox',
    width: '100%',
    height: '100%',
    padding:'5 5 5 5',
    items:[
        {
//            gridX:0, gridY:1, widthX:1, widthY:1, weightX:1, weightY:8,
        	flex: 1,
            xtype:'grid',
            padding:'5 5 5 5',
            id:'rbeLocationGrid',
            region:'west',
            title:'Locations',
            store:{
                model:'gov.va.cpe.location.LocationEditorModel',
                proxy:{
                    type:'ajax',
                    url:'/config/locations',
                    reader:{
                        type:'json',
                        root:'panels'
                    }
                }
            },
            columns:[
                {text:'Location Name', dataIndex:'name'}
            ],
            tbar:{
                items:[
                    {
                        xtype:'button',
                        ui:'link',
                        padding:'5 5 5 5',
                        text:'Create Location',
                        handler:function (bn, e) {
                            Ext.Msg.prompt('Name', 'Please enter a name for the new Location:', function (btn, text) {
                                if (btn == 'ok') {
                                    Ext.Ajax.request({
                                        url:'/config/addLocation',
                                        method:'POST',
                                        params:{name:text},
                                        success:function (response, opts) {
                                            this.store.load();
                                        },
                                        failure:function (response, opts) {},
                                        scope:this
                                    });
                                }
                            }, bn.up('#rbeLocationGrid'));
                        }
                    },
                    {
                        xtype:'button',
                        ui:'link',
                        padding:'5 5 5 5',
                        text:'Delete',
                        handler:function (bn, e) {
                            var gpanel = bn.up('#rbePanel').down('#rbeLocationGrid')
                            var gsel = gpanel.getSelectionModel().getSelection();
                            if (gsel && gsel.length > 0) {
                                var locationName = gsel[0].get('name');
        				    	Ext.Ajax.request({
        							url: '/config/dropLocation',
        							method: 'POST',
        							params: {'locationName': panelName},
        							success: function(response, opts) {
        								gpanel.getStore().load();
        							},
        							failure: function(response, opts) {},
        							scope: this
        						});
                            } else {
                                Ext.MessageBox.alert('Error Deleting', 'You must first select a Location to delete.');
                            }
                        }
                    }
                ]
            },
            listeners:{
                selectionchange:{
                    fn:function (selMdl, selData, eOpts) {
                        var rbepnl = Ext.ComponentQuery.query('#rbePanel')[0];
                        var pnl = rbepnl.down('#rbeColPanel');
                        if (selData.length > 0) {
                            var locId = selData[0].get('id');
                            var locName = selData[0].get('name');
                            var colEditor;
                            if (pnl.down('#rbeColPanelEditor') == null) {
                                colEditor = Ext.create('widget.panelColumnEditor');
                                pnl.removeAll();
                                pnl.add(colEditor);
                            } else {
                                colEditor = pnl.down('#mpeColPanelEditor');
                                colEditor.down('mpecoloptions').removeAll();
                            }
                            if (colEditor && colEditor.panelName != pnlName) {
                                colEditor.setPanelName(pnlName);
                                colEditor.setTitle('"' + pnlName + '" Column List');
                            }
                        } else {
                            pnl.removeAll();
                        }
                    }
                }
            }
        },
        {
//            gridX:1, gridY:0, widthX:1, widthY:2, weightX:4, weightY:1,
            flex: 3,
            xtype:'panel',
            padding:'5 5 5 5',
            id:'mpeColPanel',
            layout:{type:'fit', align:'stretch'}
        }
    ],
    onBoxReady: function() {
        this.callParent(arguments);
        this.down('grid').getStore().load();
    }
});