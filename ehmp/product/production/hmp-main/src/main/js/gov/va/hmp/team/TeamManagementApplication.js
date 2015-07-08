Ext.define('gov.va.hmp.team.TeamManagementApplication', {
    extend:'gov.va.hmp.Application',
    requires:[
        "Ext.util.History",
        'gov.va.hmp.Viewport',
        'gov.va.hmp.team.TeamManagementPanel',
        'gov.va.hmp.team.TeamPositionPanel',
        'gov.va.cpe.roster.RosterBuilderPanel',
        'gov.va.cpe.multi.BoardBuilderPanel',
        'gov.va.hmp.team.TeamCategoriesPanel',
        'gov.va.hmp.setup.PointOfCarePanel',
        'gov.va.hmp.team.TeamManagementController',
        'gov.va.hmp.team.TeamPositionController',
        'gov.va.hmp.team.TeamCategoriesController',
        'gov.va.cpe.roster.RosterBuilderController',
        'gov.va.cpe.multi.BoardBuilderController',
        'gov.va.hmp.setup.PointOfCareController'
    ],
    controllers:[
        'gov.va.hmp.team.TeamManagementController',
        'gov.va.hmp.team.TeamPositionController',
        'gov.va.hmp.team.TeamCategoriesController',
        'gov.va.cpe.roster.RosterBuilderController',
        'gov.va.cpe.multi.BoardBuilderController',
        'gov.va.hmp.setup.PointOfCareController'
    ],
    init:function () {
        Ext.util.History.init();
    },
    launch:function () {
        var me = this;

        var viewport = Ext.create('gov.va.hmp.Viewport', {
            items:[
                {
                    xtype:'tabpanel',
//                    ui: 'pills',
                    itemId:'screens',
                    region:'center',
                    height:'100%',
                    width:'100%',
                    padding: 10,
                    bodyPadding: '6 0 0 0',
                    items:[
                        Ext.create('gov.va.hmp.team.TeamManagementPanel', {
                            itemId:'team-config',
                            title: 'Configure Teams'
                        }),
                        Ext.create('gov.va.hmp.team.TeamPositionPanel', {
                            itemId:'position-config',
                            title: 'Configure Team Positions'
                        }),
                        Ext.create('gov.va.hmp.team.TeamCategoriesPanel', {
                            itemId:'category-config',
                            title: 'Configure Team Categories'
                        }),
                        Ext.create('gov.va.cpe.roster.RosterBuilderPanel', {
                            itemId:'roster-config',
                            title: 'Configure Patient Lists'
                        }),
                        {
                            xtype:'boardEditor',
                            title: 'Configure Boards'
                        },
                        Ext.create('gov.va.hmp.setup.PointOfCarePanel', {
                        	itemId:'poc-config',
                            title: 'Configure Locations'
                        })
                    ]
                }
            ]
        });
        
        // hold reference for convenience
        me.screens = viewport.down('#screens');
        me.screens.on('tabchange',
            function (tabPanel, newCard, oldCard) {
                me.setActiveScreen(newCard.getItemId());
            });

        // initially select page as stored in history
        var token = Ext.util.History.getToken();
        if (token && token.length > 0) {
            me.screens.setActiveTab(token);
        }
    },
    setActiveScreen:function (view) {
//        Ext.log("setActiveScreen(" + view + ")");
        if (view.length > 0) {
            var child = this.screens.down('#' + view);
            if (child) {
                this.screens.setActiveTab(child);
            }
        }
//        Ext.log("history add(" + view + ")");
        Ext.util.History.add(view);
    }
});