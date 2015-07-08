define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/backgrid/dataGridTemplate"
], function(Backbone, Marionette, _, dataGridTemplate) {
    'use strict';

    var dataGridView = Backbone.Marionette.LayoutView.extend({
        template: dataGridTemplate,
        regions: {
            dataGridHeaderLeft: '.data-grid-header-left',
            dataGridHeaderRight: '.data-grid-header-right',
            dataGrid: '.data-grid'
        }
    });

    return dataGridView;
});
