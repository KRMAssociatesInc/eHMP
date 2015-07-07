Ext.define('gov.va.hmp.tabs.LabReviewPanel', {
	extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
	alias: 'widget.labreviewpanel',
    title: 'Lab Review2',
    viewID: 'gov.va.cpe.vpr.queryeng.LabProfileViewDef2',
    viewParams: {group: 'group'},
    tools: [{xtype: 'viewdeffiltertool', paramKeys: ['range', 'filter.profiles']}],
	hideHeaders: true,
	groupHeaderTpl: "{name}",
    detailType: 'rowbody',
	addFilterTool: true,
	reconfigureColumnsAlways: true,
    detail: {actionDock: 'left', smartHeight: true}
});