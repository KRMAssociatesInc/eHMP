Ext.define('gov.va.cpe.coversheet.ActiveProblems', {
    extend: 'gov.va.cprs.coversheet.ActiveProblems',
    ui: 'underlined-title-condensed',
    rowLines: false,
    detailTitleTpl: '{[gov.va.cpe.coversheet.ActiveProblems.formatSummary(values.summary)]}',
    columns: [
        {
            xtype: 'templatecolumn',
            tpl: "{[gov.va.cpe.coversheet.ActiveProblems.formatSummary(values.summary)]}&nbsp;<tpl if='acuityCode == \"urn:va:prob-acuity:a\"'><span class='label label-well'>acute</span></tpl>",
            flex: 1
        },
        {
            xtype: 'facilitycolumn'
        }
    ],
    statics: {
        formatSummary: function (summary) {
            return summary.replace(/\(ICD-9-CM .*\)|\(SCT .*\)/, function (match) {
                return '<span class="text-muted">' + match.slice(1, -1) + '</span>';
            });
        }
    }
});