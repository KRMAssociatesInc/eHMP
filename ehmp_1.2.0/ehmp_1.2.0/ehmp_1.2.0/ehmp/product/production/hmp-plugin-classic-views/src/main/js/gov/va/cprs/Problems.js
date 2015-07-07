Ext.define('gov.va.cprs.Problems', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    requires: [
        'gov.va.cpe.viewdef.HealthTimeColumn',
        'gov.va.cpe.viewdef.FacilityColumn'
    ],
    title: 'Problems',
    viewID: 'gov.va.cprs.ClassicProblemsViewDef',
    viewParams: {
        filter_status: 'urn:va:sct:5561003' //TODO: these SNOMED codes are silly here; use named queries
    },
    detailType: 'bottom',
    detailTitleField: 'summary',
    detail: {
        minHeight: '220'
    },
    columns: [
        {
            text: "Stat/Ver",
            xtype: 'templatecolumn',
            width: 60,
            tpl: "{[values.statusName.charAt(0)]}<tpl if='acuityCode == \"urn:va:prob-acuity:a\"'>&nbsp;*</tpl><tpl if='unverified'>&nbsp;(u)</tpl>"
        },
        {text: "Description", dataIndex: 'summary', flex: 1},
        {text: "Onset Date", xtype: 'healthtimecolumn', dataIndex: 'onset'},
        {text: "Last Updated", xtype: 'healthtimecolumn', dataIndex: 'updated'},
        {text: "Location", dataIndex: 'locationDisplayName', width: 120},
        {text: "Facility", xtype: 'facilitycolumn'}
    ],
    tbarConfig: [
        {
            xtype: 'segmentedbutton',
            itemId: 'filters',
            ui: 'pill',
            allowDepress: true,
            items: [
                {
                    text: 'Active',
                    pressed: true,
                    viewParams: {
                        filter_status: 'urn:va:sct:5561003',
                        filter_removed: false
                    }
                },
                {
                    text: 'Inactive',
                    viewParams: {
                        filter_status: 'urn:va:sct:73425007',
                        filter_removed: false
                    }
                },
                {
                    text: 'Both active and inactive',
                    viewParams: {
                        filter_status: ['urn:va:sct:5561003','urn:va:sct:73425007'],
                        filter_removed: false
                    }
                },
                {
                    text: 'Removed',
                    viewParams: {
                        filter_status: [],
                        filter_removed: true
                    }
                }
            ]
        }
    ],
    initEvents: function() {
        var me = this;
        me.callParent(arguments);
        var filterBtns = this.down('#filters');
        this.mon(filterBtns, 'toggle', function (container, btn, pressed) {
            if (pressed) {
                var newparams = Ext.apply(me.curViewParams, btn.viewParams);
                me.setViewDef(me.curViewID, newparams, true);
            }
        });
    }
});