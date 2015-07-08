Ext.define('gov.va.cpe.multi.BoardsApp', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.ErrorHandler',
        'gov.va.hmp.PatientContext',
        'gov.va.cpe.roster.RosterContext',
        'gov.va.cpe.multi.BoardContext',
        'gov.va.cpe.multi.MultiPatientBar',
        'gov.va.cpe.viewdef.BoardGridPanel'
    ],
    init: function () {
        var me = this;
    },
    launch: function () {
        var appInfo = gov.va.hmp.AppContext.getAppInfo();
        if (Ext.isDefined(appInfo.contexts)) {             // context integration stuff
            // restore patient context
            var params = Ext.Object.fromQueryString(window.location.search);
            if (params && params.pid) {
                gov.va.hmp.PatientContext.setPatientContext(params.pid);
            } else if (Ext.isDefined(appInfo.contexts.pid) && appInfo.contexts.pid != null) {
                gov.va.hmp.PatientContext.setPatientContext(appInfo.contexts.pid);
            }

//            RosterContext integration
            if (Ext.isDefined(appInfo.contexts.roster) && appInfo.contexts.roster) {
                gov.va.cpe.roster.RosterContext.setCurrentRoster(appInfo.contexts.roster);
                delete appInfo.contexts.roster;
            }

//            BoardContext integration
            if (Ext.isDefined(appInfo.contexts.board) && appInfo.contexts.board) {
                gov.va.cpe.multi.BoardContext.setCurrentBoard(appInfo.contexts.board);
                delete appInfo.contexts.board;
                delete appInfo.contexts.boardUid;
            }
            // TODO: LocationContext integration
        }

//        this.mon(gov.va.cpe.roster.RosterContext, "rostercontextchange", this.saveContexts, this);
        Ext.create('gov.va.hmp.Viewport', {
            cls: 'hmp-workspace',
            items: [
                {
                    xtype: 'container',
                    region: 'center',
                    padding: 5,
                    cls: 'hmp-context-bar-ct',
                    layout: 'border',
                    items: [
                        {
                            xtype: 'multipatientbar',
                            region: 'north'
                        },
                        {
                            xtype: 'boardgridpanel',
                            region: 'center',
                            padding: '0 0 10 0'
                        }
                    ]
                }
            ]
        });
    }
});