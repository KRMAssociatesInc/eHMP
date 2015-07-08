Ext.define('gov.va.cpe.multi.MultiPatientBar', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.roster.RosterContext',
        'gov.va.cpe.multi.BoardContext',
        'gov.va.hmp.ux.PopUpButton',
        'gov.va.hmp.ux.BoundMenuButton',
        'gov.va.hmp.EventBus',
        'gov.va.hmp.ux.PhotoPicker',
        'gov.va.hmp.team.TeamField',
        'gov.va.hmp.team.TeamPicker',
        'gov.va.hmp.ptselect.PatientSelector',
        'gov.va.hmp.team.BoardPicker',
        'gov.va.cpe.multi.BoardStore',
        'gov.va.cpe.roster.RosterStore',
        'gov.va.cpe.roster.RosterSearchableList'
    ],
    alias: 'widget.multipatientbar',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    height: 44,
    cls: 'hmp-multi-patient-bar-ct',
//    disabled:true,
    defaults: {
        cls: 'hmp-multi-patient-bar-item',
    },
    items: [
        {
            xtype: 'popupbutton',
            ui: 'transparent',
            flex: 1,
            tpl: [
                '<span class="text-muted">Board</span><h4>{boardName}</h4>'
            ],
            popUp: {
                xtype: 'boardpicker',
                listeners: {
                    selectionchange: function (list, recs, eopts) {
                        if (recs && recs.length > 0 && recs[0].get('uid')) {
                            gov.va.cpe.multi.BoardContext.setCurrentBoard(recs[0]);
                            list.up('menu').ownerButton.hideMenu();
                        }
                    }
                }
            }
        },
        {
            xtype: 'popupbutton',
            ui: 'transparent',
            flex: 1,
            tpl: '<span class="text-muted">Patient List</span><h4>{rosterName}</h4>',
            menuAlign: 'tr-br?',
            popUp: {
                xtype: 'rostersearchlist',
                listeners: {
                    selectionchange: function (list, recs, eopts) {
                        if (recs && recs.length > 0 && recs[0].get('uid')) {
                            gov.va.cpe.roster.RosterContext.setCurrentRoster(recs[0]);
                            list.up('menu').ownerButton.hideMenu();
                        }
                    }
                }
            }
        },
        {
            xtype: 'tbspacer',
            flex: 2
        }
    ],
    initComponent: function () {
        this.items[0].popUp.store = Ext.data.StoreManager.containsKey('boards') ? Ext.getStore('boards') : Ext.create('gov.va.cpe.multi.BoardStore');
        this.items[1].popUp.store = Ext.data.StoreManager.containsKey('rosters') ? Ext.getStore('rosters') : Ext.create('gov.va.cpe.roster.RosterStore');

        this.callParent(arguments);
    },
    initEvents: function () {
        this.callParent(arguments);

        this.mon(gov.va.cpe.roster.RosterContext, 'rostercontextchange', this.onRosterContextChange, this);
        this.mon(gov.va.cpe.multi.BoardContext, 'boardcontextchange', this.onBoardContextChange, this);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        var roster = gov.va.cpe.roster.RosterContext.getCurrentRoster();
        var board = gov.va.cpe.multi.BoardContext.getCurrentBoard();
        this.refresh(roster, board);
    },
    onRosterContextChange: function (newRoster, oldRoster) {
        this.refresh(newRoster, gov.va.cpe.multi.BoardContext.getCurrentBoard());
    },
    onBoardContextChange: function (newBoard, oldBoard) {
        this.refresh(gov.va.cpe.roster.RosterContext.getCurrentRoster(), newBoard);
    },
    refresh: function (roster, board) {
        var rosterName = "No Patient List Selected",
            boardName = "No Board Selected";
        if (roster) {
            rosterName = roster.get("name");
        }
        if (board) {
            boardName = board.get("name");
        }
        this.update({
            rosterName: rosterName,
            boardName: boardName
        });
    },
    update: function (htmlOrData, loadScripts, cb) {
        var me = this;
        if (Ext.isString(htmlOrData)) {
            me.callParent(arguments);
        } else {
            Ext.suspendLayouts();
            for (var i = 0; i < me.items.getCount(); i++) {
                var pnl = me.getComponent(i);
                if (pnl.tpl) {
                    pnl.update(htmlOrData);
                }
            }
            Ext.resumeLayouts();
            me.doLayout();
        }
    }
});
