/**
 * Singleton for tracking the current team.
 */
Ext.define('gov.va.hmp.team.TeamContext', {
    requires: [
        'gov.va.hmp.team.Team',
        'gov.va.hmp.UserContext'
    ],
    singleton: true,
    mixins: {
        observable: 'Ext.util.Observable'
    },
    config: {
        /**
         * @cfg {gov.va.hmp.team.Team} currentTeam
         */
        currentTeam: null
    },
    constructor: function (cfg) {
        var me = this;

        me.mixins.observable.constructor.call(this);
        me.initConfig(cfg);

        me.reader = Ext.create('Ext.data.reader.Json', {
            model: 'gov.va.hmp.team.Team',
            record: 'data'
        });

        me.addEvents(
            /**
             * @event teamcontextchange
             * Fires when the current team changes
             * @param {Object} team
             */
            'teamcontextchange'
        );
    },
    /**
     * Called by Sencha Class system by setCurrentTeam()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    applyCurrentTeam:function(team) {
        // ensure newTeam is a Team instance
        if (team != null && Ext.getClassName(team) != 'gov.va.hmp.team.Team') {
            team = new gov.va.hmp.team.Team(team);
        }
        return team;
    },
    /**
     * Called by Sencha Class system by setCurrentTeam()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    updateCurrentTeam: function (newTeam, oldTeam) {
        if (newTeam && oldTeam && newTeam.getId() == oldTeam.getId()) return;
        this.fireEvent('teamcontextchange', newTeam, oldTeam);
    },
    getCurrentTeamUid: function () {
        if (this.currentTeam)
            return this.currentTeam.get('uid');
        else
            return null;
    },
    getCurrentUsersPositionName: function () {
        var me = this;
        if (!me.currentTeam) return null;
        var assignment = me.getCurrentUsersStaffAssignment();
        if (assignment) {
            return assignment.positionName;
        }
        return "unknown";
    },
    getCurrentUsersBoardUid: function () {
        var me = this;
        if (!me.currentTeam) return null;
        var assignment = me.getCurrentUsersStaffAssignment();
        if (assignment) {
            return assignment.boardUid;
        }
        return null;
    },
    getCurrentUsersBoardName: function () {
        var me = this;
        if (!me.currentTeam) return null;
        var assignment = me.getCurrentUsersStaffAssignment();
        if (assignment) {
            return assignment.boardName;
        }
        return "unknown";
    },
    getCurrentUsersStaffAssignment: function() {
        var me = this;
        if (!me.currentTeam) return null;
        var numstaff = me.currentTeam.raw.staff ? me.currentTeam.raw.staff.length : 0;
        for (var i=0; i < numstaff; i++) {
            var personUid = me.currentTeam.raw.staff[i].personUid;
            if (gov.va.hmp.UserContext.getUserInfo().uid == personUid) {
                return me.currentTeam.raw.staff[i];
            }
        }
        return null;
    }
});