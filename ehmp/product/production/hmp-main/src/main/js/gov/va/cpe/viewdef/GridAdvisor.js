/*
 * The idea here is that the actual grid columns (not data field) would be defined by the Advisor,
 * which would eliminate the field/column confusion in the ViewDef.
 * 
 * Could also have many other responsibilities:
 * - Helping the editor out with rendering custom fields.
 * - Custom detail formats/widgets/etc.
 */
Ext.define('gov.va.cpe.viewdef.GridAdvisor', {
    requires: [
        'gov.va.hmp.UserContext',
        'gov.va.cpe.viewdef.GridEditors',
        'gov.va.cpe.viewdef.GridRenderers'
    ],
    grid: null, // set at construction time.
    columnsConf: null, // This will be populated by any saved column specifications the user may have provided.
    gridColMetaData: null,
    me: null,
    defineColumns: function (grid, metadata) {
        // TODO: Use this to populate the editors sort/group combobox's, detail title fields, etc.
        this.gridColMetaData = metadata;
        this.me = this;
        var me = this;
        var cols = [];
//        console.log("GridAdvisor.defineColumns", metadata, this.columnsConf);
        if (Ext.isArray(metadata.columns)) {
            if (this.columnsConf && this.columnsConf.length > 0) {
                for (key in this.columnsConf) {
                    var col = this.columnsConf[key];
                    var found = false;
                    for (var n = 0; n < metadata.columns.length && !found; n++) {
                        var mcol = metadata.columns[n];
                        if (mcol.text == col.text) {
                            cols.push(mcol);
                            mcol.width = col.width;
                            mcol.hidden = col.hidden;
                            found = true;
                            metadata.columns.splice(n, 1);
                        }
                    }
                }
            }


            // configure and append metadata columns
            cols = Ext.Array.push(cols, this.configColumns(metadata.columns, grid))
        }

        if (Ext.isArray(grid.extraColumns)) {
            cols.push(grid.extraColumns);
        }

        /*
         * If the grid is defined with a "maxWidth" field, this snippet will chop off any columns that exceed the col's maxWidth.
         * This should come after columns have been intelligently sized by their data content (?)
         * Actually this code comes long before we have data to show, right?
         */
        var maxWidth = grid.maxWidth;
        if (maxWidth) {
            if (maxWidth === 'auto') {
                maxWidth = grid.width;
            }
            var width = 0;
            for (var i = 0; i < cols.length; i++) {
                if (cols[i].width + width <= maxWidth) {
                    width = width + cols[i].width;
                }
                else {
                    cols.splice(i--, 1);
                }
            }
        }

        /*
         * Initial hook for board, when it is done rendering on initial store response / col metadata, we're ready to pick up all subsequent col data.
         * This routine continues to call itself until the board is fully loaded.
         */
        if (metadata.boardReqId) {
            grid.requestOnBoardId(metadata.boardReqId);
        }

        return cols;
    },

    /**
     * @private
     * Configure each column the same, no matter if its grid defind, advisor defined or metadata defined
     */
    configColumns: function (cols, grid) {
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            if (col.editOpt != null) {
                gov.va.cpe.viewdef.GridEditors.applyEditOpt(grid, col, col.editOpt);
            }
            if (col.deferred && col.deferred.renderClass) {
                var rc = col.deferred.renderClass;
                var fn = gov.va.cpe.viewdef.GridRenderers.getRenderClassFunction(rc);
                Ext.apply(col, {renderer: fn});
            }
            if (col.rendererFnType != null) {
                gov.va.cpe.viewdef.GridRenderers.applyCustomRendererFn(grid, col, col.rendererFnType);
            }
            col[i] = col;
        }
        return cols;
    },

    getToolbars: function () {
        // return a list of available toolbars,
        // user config preferences will put them on the top/bottom/left/right/etc.
        // this function would probably be mostly used by the editor.
    }
});
