define([], function () {
    /**
     * A module that provides helper methods for the CDS Advice applet views.
     * @module cds_advice/util
     */
    'use strict';

    var Util = {};

    var ADVICE_TYPE = {
        REMINDER: 'reminder',
        ADVICE: 'advice',
        PROPOSAL: 'proposal'
    };

    var TYPE_MAP = {};
    TYPE_MAP[ADVICE_TYPE.REMINDER] = 'Reminder';
    TYPE_MAP[ADVICE_TYPE.ADVICE] = 'Advice';
    TYPE_MAP[ADVICE_TYPE.PROPOSAL] = 'Proposal';

    /**
     * Returns the user-displayable type text.
     *
     * @param {string} type The advice object's type code.
     * @return {string} The type text.
     */
    Util.getTypeText = function (type) {
        return TYPE_MAP[type] ? TYPE_MAP[type] : '';
    };

    /**
     * Returns the user-displayable priority text.
     *
     * @param {number} priority The advice object's priority code.
     * @return {string} The priority text.
     */
    Util.getPriorityText = function (priority) {
        var text;

        // Critical
        if (priority > 80) {
            text = 'Critical';
        } else if (priority > 60) {
            text = 'High';
        } else if (priority > 40) {
            text = 'Moderate';
        } else if (priority > 20) {
            text = 'Low';
        } else if (priority > 0) {
            text = 'Very Low';
        } else {
            text = 'None';
        }
        return text;
    };
    /**
     * Returns a CSS class name based on the priority. This allows color coding priority levels.
     *
     * @param {number} priority The advice object's priority code.
     * @return {string} A CSS class name corresponding to the priority.
     */
    Util.getPriorityCSS = function (priority) {
        return priority > 80 ? 'critical' : '';
    };

    /**
     * Formats date into a user-displayable string.
     *
     * @param {date} date Date to format.
     * @return {string} A string representing the date.
     */
    Util.formatDate = function (date) {
        if (date) {
            return ADK.utils.formatDate(date, 'M/D/YYYY', 'YYYYMMDDHHmmss');
        } else {
            return '';
        }
    };

    /**
     * Advice Type 'constants'. This mitigates typos.
     *
     */
    Util.ADVICE_TYPE = ADVICE_TYPE;

    return Util;
});
