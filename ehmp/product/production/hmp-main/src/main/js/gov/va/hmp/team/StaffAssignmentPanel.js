Ext.define('gov.va.hmp.team.StaffAssignmentPanel', {
    extend:'Ext.grid.Panel',
    requires:[
        'gov.va.hmp.ux.SegmentedButton',
        'gov.va.hmp.team.TeamAssignment',
        'gov.va.hmp.team.TeamPositionField',
        'gov.va.hmp.team.TeamPositionAddButton',
        'gov.va.hmp.team.PersonSelector'
    ],
    alias:'widget.staffeditor',
    minHeight:100,
    hideHeaders:false,
    rowLines:false,
    disableSelection:true,
    viewConfig:{
        stripeRows:false,
        listeners: {
            cellclick: function (view, col, colIndex, record, row, rowIndex, e) {
                var linkClicked = (e.target.tagName.toUpperCase() === 'A');
                if (linkClicked) {
                    var grid = view.ownerCt;
                    var cellediting = grid.getPlugin('cellediting');
                    if (colIndex == 1 || colIndex == 2) {
                        cellediting.startEditByPosition({row: rowIndex, column: colIndex});
                    }
                }
            }
        }
    },
    emptyText:'There are no staff members associated with or positions configured for this team.',
    columns:[
        {
            text:'Position',
            dataIndex:'positionName',
            minWidth: 180,
            tdCls:'text-muted',
            align: 'right',
            editor:{
                xtype:'teampositionfield'
            }
        },
        {
            xtype: 'templatecolumn',
            text:'Staff Member',
            flex:1,
            dataIndex: 'personUid',
            editor:{
                xtype:'personselector'
            },
            tpl: '<tpl if="personUid">' +
                    '<div class="media">' +
                        '<img class="media-object pull-left" src="{person.photoHRef}"  width="30" height="30">' +
                        '<div class="media-body">' +
                            '<div class="pull-left">' +
                                '<h5 class="media-heading">{person.displayName}</h5>' +
                                '<div class="text-muted">' +
                                    '<span class="pull-left"><tpl if="person.displayTitle">{person.displayTitle}<tpl else>No Title</tpl></span>&nbsp;-&nbsp;' +
                                    '<span><tpl if="person.displayService">{person.displayService}<tpl else>No Service</tpl></span></div>' +
                            '</div>' +
                            '<div class="text-muted pull-right">' +
                                '<div>{person.digitalPager}</div>' +
                                '<div>{person.voicePager}</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '<tpl else>' +
                    '<a href="#">Assign {positionName}</a>' +
                '</tpl>'
        },
        {
            xtype: 'templatecolumn',
            width:60,
            dataIndex: 'personUid',
            editor:{
                xtype:'personselector'
            },
            tpl: '<tpl if="personUid"><a href="#">Change</a></tpl>'
        },
        {
            xtype:'actioncolumn',
            width:20,
            items:[
                {
                    iconCls: 'fa-times-circle',
                    tooltip:'Remove Position',
                    handler: function(grid, rowIndex, colIndex) {
                    	var srcgrid = grid;
                    	var me = grid.up('staffeditor');
                        var rec = grid.getStore().removeAt(rowIndex);
                        me.getView().refresh();
                        me.fireEvent('positionremove', this, rec);
                    }
                }
            ]
        }
    ],
    plugins:[
        Ext.create('Ext.grid.plugin.CellEditing', {
            pluginId: 'cellediting',
            clicksToEdit:2
        })
    ],
    tools:[
        {
            xtype: 'teamPositionAddButton',
            itemId:'addPositionButton'
        }
    ],
    initComponent:function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            model:'gov.va.hmp.team.TeamAssignment',
            data:[]
        });
        me.callParent(arguments);

        me.addEvents(
            'assignmentchange',
            'positionadd',
            'positionremove',
            'boardchange'
        );
    },
    initEvents:function () {
        this.callParent(arguments);

        var cellediting = this.getPlugin('cellediting');
        this.mon(cellediting, 'edit', this.onEdit, this);
        this.mon(this.down('#addPositionButton'), 'selectionchange', this.onSelectNewPosition, this);
    },
    onEdit: function (editor, e) {
        var me = this,
            personUid = e.value,
            staffAssignment = e.record;
        if (personUid && e.colIdx == 1 || e.colIdx == 2) { // person edit
            var store = Ext.getStore('personStore');
            var person = store.getById(personUid);
            if (person) {
                staffAssignment.beginEdit();
                staffAssignment.set('personUid', personUid);
                staffAssignment['gov.va.hmp.team.PersonHasOneInstance'] = person; // Sencha docs claim there should be a generated setter for this
                staffAssignment.endEdit();
                staffAssignment.commit();

                me.fireEvent('assignmentchange', me, staffAssignment);

                me.getView().refresh();
            }
        }
    },
    onSelectNewPosition:function (cmp, records) {
        var position = records[0];
        var gridView = this.getView();
        var staffAssignment = Ext.create('gov.va.hmp.team.TeamAssignment', {
            positionUid:position.get('uid'),
            positionName:position.get('name')
        });
        this.getStore().add(staffAssignment);
        this.fireEvent('positionadd', this, position);
        gridView.refresh();
    },
    /**
     * @private
     */
    getPersonStore:function() {
       return this.down('personpicker').getStore();
    }
});