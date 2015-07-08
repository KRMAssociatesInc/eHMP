/**
 * Singleton for tracking the current board.
 */
Ext.define('gov.va.cpe.multi.BoardContext', {
    requires: [
        'gov.va.cpe.multi.Board'
    ],
    singleton: true,
    mixins: {
        observable: 'Ext.util.Observable'
    },
    config: {
        /**
         * @cfg {gov.va.cpe.multi.Board} currentBoard
         */
        currentBoard: null
    },
    constructor: function (cfg) {
        var me = this;

        me.mixins.observable.constructor.call(this);
        me.initConfig(cfg);

        me.reader = Ext.create('Ext.data.reader.Json', {
            model: 'gov.va.cpe.multi.Board',
            record: 'data'
        });

        me.addEvents(
            /**
             * @event boardcontextchange
             * Fires when the current board changes
             * @param {Object} board
             */
            'boardcontextchange'
        );
    },
    /**
     * Called by Sencha Class system by setCurrentBoard()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    applyCurrentBoard:function(board) {
        // ensure newTeam is a Team instance
        if (board != null && Ext.getClassName(board) != 'gov.va.cpe.multi.Board') {
            board = new gov.va.cpe.multi.Board(board);
        }
        return board;
    },
    /**
     * Called by Sencha Class system by setCurrentBoard()
     * @private
     * @see "http://www.sencha.com/learn/sencha-class-system"
     */
    updateCurrentBoard: function (newBoard, oldBoard) {
        if (newBoard && oldBoard && newBoard.getId() == oldBoard.getId()) return;
        var me = this;
        Ext.Ajax.request({
            url: '/context/board',
            params: {
                uid: newBoard.getId()
            },
            method: 'POST',
            failure: function (resp) {
                var err = Ext.decode(resp.responseText, true);
                if(err && err.error && err.error.code=="404") {
                    console.log(err.error.message);
                } else {
                }
                me.clear();
            },
            success: function (resp) {
                me.fireEvent('boardcontextchange', newBoard, oldBoard);
            }
        });
    },
    getCurrentBoardUid: function () {
        if (this.currentBoard)
            return this.currentBoard.get('uid');
        else
            return null;
    },
    getCurrentBoardName: function () {
        if (this.currentBoard)
            return this.currentBoard.get("name");
        else
            return null;
    },
    clear: function() {
        this.setCurrentBoard(null);
    }
});