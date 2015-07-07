Ext.define('gov.va.cpe.viewdef.HealthTimeColumn', {
    extend : 'Ext.grid.column.Column',
    requires: [
        'gov.va.hmp.healthtime.PointInTime'
    ],
	alias : 'widget.healthtimecolumn',
    /**
     * @cfg {String} format
     * A formatting string as used by {@link PointInTime#format} to format PointInTimes/Dates for this Column.
     */

    /**
     * @cfg {Object} renderer
     * @hide
     */

    /**
     * @cfg {Object} scope
     * @hide
     */

    initComponent: function(){
        if (!this.format) {
            this.format = gov.va.hmp.healthtime.PointInTime.getDefaultPattern();
        }

        this.callParent(arguments);
    },

    defaultRenderer: function(value){
    	var rslt = PointInTime.format(value, this.format);
        return rslt;
    }
});