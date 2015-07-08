define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/addVitals/vitalRowView',
    'app/applets/addVitals/utils/modelUtils',
    'app/applets/addVitals/utils/dateTimeUtil'
], function(Backbone, Marionette, _, VitalRowView, modelUtils, dateUtil) {
    'use strict';

    var util = modelUtils;

    return Backbone.Marionette.CollectionView.extend({
        tagName: 'div',
        attributes: {
            'width' : '100%',
        },
        childView: VitalRowView,
        childViewContainer: '#vitals-tbl-container',
        initialize: function() {
            util.fetchOpData();
        }
    });
});
