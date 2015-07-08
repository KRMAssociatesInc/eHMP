/**
 * Known outstanding issues:
 * TODO: The header rows are selectable, how can we make them unselectable like group header row?
 *
 */
Ext.define('gov.va.hmp.containers.UnSignedReviewTab', {
    extend: 'gov.va.hmp.containers.OnePanelToRuleThemAll',
    requires: [
        'gov.va.cpe.patient.PatientAwareTab'
    ],
    mixins: {
        patientawaretab: 'gov.va.cpe.patient.PatientAwareTab'
    },
    alias: 'widget.unsignedreviewtab',
    title: 'Unsigned Review',
    detail: 'none',
    items: [
        {
            xtype: 'viewdefgridpanel',
            gridX: 0,
            gridY: 0,
            widthX: 1,
            widthY: 1,
            weightX: 2,
            weightY: 1,
            details: 'none',
            title: 'Unsigned Items',
            itemId: 'unsigned',
            viewID: 'gov.va.cpe.vpr.queryeng.UnsignedViewDef',
            viewParams: {
                group: 'displayGroup'
            }

//                            addFilterTool: true
        }
    ]
});

