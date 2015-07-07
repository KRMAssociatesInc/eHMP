define([
    'backbone',
    'backgrid'
], function(Backbone) {
    'use strict';
    var HeaderCell = Backgrid.HeaderCell.extend({
        attributes: {
            "tabindex": "0",
            "scope": "col"
        },
        render: function() {
            HeaderCell.__super__.render.apply(this, arguments);
            this.el.id = this.column.get('appletId') + '-' + this.column.get('name');
            return this;
        }
    });
    return HeaderCell;
});
