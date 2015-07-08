Ext.define('gov.va.cpe.viewdef.FacilityColumn', {
    extend : 'Ext.grid.column.Column',
    requires: [
        'gov.va.hmp.UserContext'
    ],
    alias : 'widget.facilitycolumn',
    text: '<i class="fa fa-cloud" title="Displays an icon if the originating Facility is different than the one you are signed into."></i>',
    maxWidth: 32,
    dataIndex: 'facilityName',
    hideable: false,
    menuDisabled: true,
    defaultRenderer: function(value, metaData, record){
        var facilityCode = record.get('facilityCode');
        var facilityName = record.get('facilityName');
        if (!gov.va.hmp.UserContext.isCurrentUserFacilityCode(facilityCode)) {
            return '<i class="fa fa-cloud text-muted" title="Originated at ' + facilityName + '"></i>';
        } else {
            return '';
        }
    }
});