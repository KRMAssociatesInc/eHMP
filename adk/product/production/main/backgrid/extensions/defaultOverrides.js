define([
    'backgrid',
    'backgrid-moment-cell',
    'main/backgrid/extensions/screenReaderCell'
], function(backgrid, backgridMomentCell, screenReaderCell) {
    'use strict';

    //Custom Cells
    Backgrid.HandlebarsCell = Backgrid.Cell.extend({
        className: 'handlebars-cell',
        render: function() {
            this.$el.empty();
            // todo: temporarily commenting this out to fix the build
            //screenReaderCell.setTemplateWithScreenReaderText(this);
            this.$el.html(this.column.get('template')(this.model.toJSON()));
            this.delegateEvents();
            return this;
        }
    });

    // todo: temporarily commenting this out to fix the build
    // Backgrid.StringCell = Backgrid.Cell.extend({
    //     render: function() {
    //         this.$el.empty();
    //         screenReaderCell.setModelValueWithScreenReader(this);
    //         this.delegateEvents();
    //         return this;
    //     }
    // });

});
