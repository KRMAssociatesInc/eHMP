Ext.define('gov.va.hmp.tabs.OverviewPanel', {
	extend: 'gov.va.hmp.containers.OnePanelToRuleThemAll',
	requires: ['gov.va.hmp.containers.PatientAwarePanel',
        'gov.va.cpe.viewdef.ViewDefGridPanel',
        'gov.va.cpe.viewdef.GridDetailPanel',
        'gov.va.hmp.containers.OnePanelToRuleThemAll',
        'gov.va.cpe.patient.PatientAwareTab'],
    mixins: {
        patientawaretab: 'gov.va.cpe.patient.PatientAwareTab'
    },
    title: 'Condition Review',
    alias: 'widget.overviewpanel',
    detail: {height: 350},
    listeners: {
        afterrender: function () {
            var me = this;
            this.detail1 = this.items.get(2);
            this.detail2 = this.items.get(3);
            this.items.get(1).on('select', function (model, rec, idx) {
                var grid = me.items.get(2);
                var viewdef = rec.get('viewdef');
                var viewdeftitle = rec.get('viewdef_title');
                var viewparams = rec.get('viewdef_params') || {};
                if (viewdef) {
                    me.detail1.setViewDef(viewdef, viewparams);
                    if (viewdeftitle) me.detail1.setTitle(viewdeftitle);
                }
            });
        }
    },
    items: [
        {
            xtype: 'patientawarepanel',
            header: false,
            resizable: false,
            height: 35,
            minHeight: 35,
            detailURL: '/vpr/view/gov.va.cpe.vpr.queryeng.RecentViewDef?mode=/patientDomain/timeline3&pid={pid}&row.count=1000&datetime=-5Y',
            gridX: 0,
            gridY: 0,
            widthX: 2,
            widthY: 0,
            weightX: 1,
            weightY: 0            
        },
        {
            xtype: 'viewdefgridpanel',
            title: 'Condition Review',
            viewID: 'gov.va.cpe.vpr.queryeng.GoalsDueViewDef',
            rowBodyTpl: '<tpl for="comments"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{dtm}</b> ({author}):<em style="grey: b; font-weight: normal; font-style: italic; padding: 0px 0px 0px 15px;">{text}</em></p></tpl>',
            detailType: '#conditiondetailpanel2',
            viewParams: {group: 'conditions'},
            groupHeaderTpl: '{name} <span class="badge">{rows.length}</span>', // if specified, the grouping template
            tools: [
                {xtype: 'viewdeffiltertool', paramKeys: ['conditions']}
            ],
            reconfigureColumnsAlways: true,
            gridX: 0,
            gridY: 1,
            widthX: 1,
            widthY: 2,
            weightX: 1,
            weightY: 1
        },
        {
            xtype: 'viewdefgridpanel',
            viewID: 'gov.va.cpe.vpr.queryeng.MedsTabViewDef',
            tools: [
                {xtype: 'viewdeffiltertool'}
            ],
            detailType: '#conditiondetailpanel2',
            reconfigureColumnsAlways: true,
            gridX: 1,
            gridY: 1,
            widthX: 1,
            widthY: 1,
            weightX: 1,
            weightY: 1
        },
        {
            xtype: 'griddetailpanel',
            enableTrendChart: false,
            itemId: 'conditiondetailpanel2',
            gridX: 1,
            gridY: 2,
            widthX: 1,
            widthY: 1,
            weightX: 1.5,
            weightY: 1.5
        }
    ]
});