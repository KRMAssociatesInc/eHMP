/**
 * Singleton for tracking the current roster.
 */
Ext.define('gov.va.cpe.roster.RosterContext', {
    requires: [
        'gov.va.cpe.roster.RosterModel'
    ],
    singleton: true,
    mixins: {
        observable: 'Ext.util.Observable'
    },
    config: {
        /**
         * @cfg {gov.va.cpe.roster.RosterModel} currentRoster
         */
        currentRoster: null
    },
    constructor: function (cfg) {
        var me = this;

        me.mixins.observable.constructor.call(this);
        me.initConfig(cfg);

        me.reader = Ext.create('Ext.data.reader.Json', {
            model: 'gov.va.cpe.roster.RosterModel',
            record: 'data'
        });

        me.addEvents(
            /**
             * @event rostercontextchange
             * Fires when the current roster changes
             * @param {Object} roster
             */
            'rostercontextchange'
        );
    },
    /**
     * Called by Sencha Class system by setCurrentRoster()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    applyCurrentRoster:function(roster) {
        // ensure newTeam is a Team instance
        if (roster != null && Ext.getClassName(roster) != 'gov.va.cpe.roster.RosterModel') {
            roster = new gov.va.cpe.roster.RosterModel(roster);
        }
        return roster;
    },
    /**
     * Called by Sencha Class system by setCurrentRoster()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    updateCurrentRoster: function (newRoster, oldRoster) {
        if (newRoster && oldRoster && newRoster.getId() == oldRoster.getId()) return;
        var me = this;
        Ext.Ajax.request({
            url: '/context/roster',
            params: {
                uid: newRoster.getId()
            },
            method: 'POST',
            failure: function (resp) {
                var err = Ext.decode(resp.responseText, true);
                if(err && err.error && err.error.code=="404") {
                    console.log(err.error.message);
                }
                me.clear();
            },
            success: function (resp) {
                me.fireEvent('rostercontextchange', newRoster, oldRoster);
            }
        });
    },
    getCurrentRosterUid:function() {
        var currentRoster = this.getCurrentRoster();
        if (currentRoster == null) return null;
        return currentRoster.get('uid');
    },
    clear: function() {
        this.setCurrentRoster(null);
    }
});