Ext.define('gov.va.hmp.tabs.DocumentSearchPanel', {
    extend: 'gov.va.cpe.viewdef.ViewDefGridPanel',
    requires: [
        'gov.va.hmp.healthtime.PointInTime'
    ],
    alias: 'widget.documentsearchpanel',
    title: 'Documents (Search Results)',
    viewID: 'gov.va.cpe.vpr.queryeng.search.DocSearchViewDef',
    hideHeaders: true,
    header: false,
    height:"auto",
    detailType: 'rowbody',
    detailTitleField: 'local_title',
    detail: {actionDock: 'none', smartHeight: true, extraParams: {}, collapsible: false, collapsed: false},
    columns: [
//        {dataIndex: "local_title", text: "Title", width: 350, flex:1, sortable: false, groupable: false, hideable: false},
//        {dataIndex: 'author_display_name', text: 'Author', width: 150},
        {dataIndex: 'datetime', text: 'Date/Time', width: 125, xtype: 'healthtimecolumn'},
        // author, kind, etc.
        {xtype:'templatecolumn', text: 'Document', flex: 1, sortable: false, groupable: false, hideable: false, tpl: [
            '<div class="fa fa-pencil" data-qtip="/es/ {signer_display_name} - Signed: {[PointInTime.format(values.signed_date_time)]}"></div>',
                '<tpl if="cosigner_display_name"> ' +
                '<div class="fa fa-pencil" data-qtip="/ecs/ {cosigner_display_name} - Co-Signed: {[PointInTime.format(values.cosigned_date_time)]}"></div>' +
                '</tpl>  {author_display_name} - {facility_name}',

            // show up to 3 highlight rows (and n-more if there are more)
            '<tpl for="highlights">{% if (xindex > 3) break; %}<div class="cpe-search-result-highlight">...{.}...</div></tpl>',
            '<tpl if="highlights.length &gt; 3"><a target="">More document results &raquo;</a></tpl>'
        ]}
    ]
});


