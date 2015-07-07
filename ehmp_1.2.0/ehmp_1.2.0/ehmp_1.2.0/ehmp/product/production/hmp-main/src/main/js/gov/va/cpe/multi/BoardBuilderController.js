Ext.define('gov.va.cpe.multi.BoardBuilderController', {
    extend: 'gov.va.hmp.Controller',
    requires: [
        'gov.va.cpe.multi.BoardBuilderPanel',
        'gov.va.hmp.UserContext',
        'gov.va.cpe.multi.BoardStore'
    ],
    refs: [{
    	ref: 'boardName',
    	selector: '#boardName'
    },{
    	ref: 'ownerName',
    	selector: '#ownerName'
    },{
    	ref: 'boardDescription',
    	selector: '#boardDescription'
    },{
        ref: 'boardCohort',
        selector: '#boardCohortField'
    },{
    	ref: 'boardColumnList',
    	selector: '#boardColumnList'
    },{
    	ref: 'boardOption',
    	selector: '#boardcoloptionpanel'
    },{
    	ref: 'boardCategoriesField',
    	selector: '#boardCategoriesField'
    },{
    	ref: 'boardList',
    	selector: '#boardList'
    },{
    	ref: 'boardForm',
    	selector: '#boardForm'
    },{
    	ref: 'rosterPicker',
    	selector: '#mpeRosterPicker'
    },{
    	ref: 'boardPreviewPanel',
    	selector: '#boardPreviewPanel'
    }
    ],
    init: function () {
        var me = this;
        me.control({
        	'#boardName': {
        		blur: me.onBoardNameBlur
        	},
        	'#boardDescription': {
        		blur: me.onBoardDescriptionBlur
        	},
        	'#boardCohortField': {
        		blur: me.onCohortBlur
        	},
        	'#createBoardButton': {
                click: me.doNewBoard
            },
            '#saveBoardButton': {
                click: me.publishBoard
            },
            '#removeBoardButton': {
                click: me.onClickRemoveBoard
            },
            '#boardList': {
                selectionchange: me.onBoardSelectionChange
            },
            '#boardList actioncolumn': {
                click: me.onAction
            },
            '#boardColumnList': {
            	selectionchange: me.onColumnSelectionChange,
            	colchange: me.onSyncDataChange,
            	coladd: me.onSyncDataChange,
            	colremove: me.onSyncDataChange
            },
            '#boardCategoriesField': {
                select: me.onSyncDataChange,
                tagadd: me.onSyncDataChange,
                tagremove: me.onSyncDataChange
            },
            '#mpeRosterPicker': {
            	select: me.previewSelectedRoster
            }
        });
    },
    onColumnSelectionChange: function(selMdl, selData, eOpts) {
    	var optPnl = this.getBoardOption();
    	var me = this;
        if (selData.length > 0) {
            var cd = selData[0].data.appInfo.code;
            var id = selData[0].data.id;
            if (cd) {
                Ext.Ajax.request({
                    url: '/config/getColumnConfigOptions',
                    method: 'GET',
                    params: {code: cd},
                    success: function (response, opts) {
//                        optPnl.colEditor = this.up('boardColumnEditor');
                    	optPnl.colList = me.getBoardColumnList();
                        optPnl.columnClass = cd;
                        optPnl.columnId = id;
                        optPnl.setConfigOptions(Ext.decode(response.responseText));
                        optPnl.setConfigData(selData[0]);
                        optPnl.show();
                    },
                    failure: function (response, opts) {
                        console.log(response);
                    },
                    scope: this
                });
            }
        } else {
            optPnl.hide();
        }
    },
    previewSelectedRoster: function() {
        var rosterId = this.getRosterPicker().getValue();
    	var sel = this.getBoardList().getSelectionModel().getSelection();
		if(rosterId && sel.length>0) {
            Ext.util.Cookies.set('BoardBuilderRosterPreviewID', rosterId);
            var vdgp = this.getBoardPreviewPanel();
            vdgp.forceReconfigure = true;
            vdgp.setViewDef(sel[0].get('uid'), {
                'roster.uid': rosterId
            });
            vdgp.setVisible(true);
    	}
    },
    publishBoard: function() {
    	if(this.saving) {
    		this.afterSave = this.publishBoard;
    		return;
    	}
    	this.saving = true;

    	var me = this;
    	if(me.currentBoard) {
    		if(me.currentBoard.get('draft') && me.currentBoard.get('uid')!='') {
    			Ext.Ajax.request({
    				url: '/config/panel/'+me.currentBoard.get('uid'),
    				method: 'DELETE',
    				success: function() {
    					me.currentBoard.set('uid', me.currentBoard.get('draft').sourceUid);
    					me.currentBoard.set('draft', null);
    					me.saveCurrentBoard();
    				},
    				failure: function(response) {
    					console.log(response);
    				}
    			})
    		} else {
    			if(me.currentBoard.get('draft')) {
    				me.currentBoard.set('uid', me.currentBoard.get('draft').sourceUid);
    			}
    			me.currentBoard.set('draft', null);
    			me.saveCurrentBoard();
    		}
    	}
    },
    /**
     * Cases: 	1) Editing existing, saved, UID-populated team, that does not have a draft.
     * 			2) Editing a brand-new team.
     * 			3) Editing an existing draft.
     */
    saveDraft: function() {
    	if(this.saving) {
    		this.afterSave = this.saveDraft;
    		return;
    	}
    	this.saving = true;
    	
    	if(this.currentBoard) {
        	this.savingDraft = true;
    		if(!this.currentBoard.get('draft')) {
    			this.currentBoard.set('draft', {sourceUid: this.currentBoard.get('uid')});
    			this.currentBoard.set('uid','');
    			this.currentBoard.rosterID = null;
    			this.currentBoard.set('rosterId', null);
    		}
    		this.saveCurrentBoard();
    	}
    },
    refreshDraftStatus: function (board) {
        var boardname = board.get('name');
        var draft = board.get('draft');
        this.getBoardForm().setTitle(boardname + (draft ? ' <small>Draft</small>' : ''));
    },
    onBoardSelectionChange: function (grid, selected) {
        if (selected && selected.length>0) {
            var board = selected[0];
            this.getBoardName().setValue(board.get('name'));
            this.getOwnerName().setValue(board.get('ownerName'));
            this.getBoardDescription().setValue(board.get('description'));
            this.getBoardCohort().setValue(board.get('cohort'));

            var cols = board.columns();
            var coldefs = new Array();
            cols.each(function (col) {
                coldefs.push(col);
            });

            this.getBoardColumnList().getStore().loadData(coldefs);
            
            var cats = board.categories();
            var catz = [];
            cats.each(function (cat) {
            	catz.push(cat.data);
            });
            var bcfld = this.getBoardCategoriesField();
            bcfld.setValue(catz);
            
            this.currentBoard = board;
            this.refreshDraftStatus(board);
            
            this.getBoardForm().show();
            this.getRosterPicker().show();
            this.getBoardList().collapse();
        	this.previewSelectedRoster();
        } else {
            this.getBoardForm().hide();
            this.getRosterPicker().hide();
        }
    },
    doNewBoard: function () {
        var userInfo = gov.va.hmp.UserContext.getUserInfo();
        var newBoard = Ext.create('gov.va.cpe.multi.Board', {
            ownerUid: userInfo.uid,
            ownerName: userInfo.displayName
        });
        var boardStore = Ext.getStore('boardsdraft');
        boardStore.add(newBoard);
        this.getBoardList().getSelectionModel().select(newBoard);
    },
    onClickRemoveBoard:function() {
        this.removeBoard(this.currentBoard);
    },
    onAction:function(view,cell,row,col,e) {
        var board = this.getBoardList().getStore().getAt(row);
        this.removeBoard(board);
    },
    removeBoard:function(board) {
        var me = this;
        var boardName = board.get('name');
        Ext.Msg.show({
            title: "Remove '" + boardName + "'",
            icon: Ext.Msg.QUESTION,
            msg: "Are you sure you want to remove board '" + boardName + "'?",
            buttons: Ext.Msg.YESNO,
            callback: me.onConfirmRemoveBoard,
            scope: me,
            board: board
        });
    },
    onConfirmRemoveBoard:function(btn, value, opts) {
        if (btn != 'yes') return;
        this.doRemoveBoard(opts.board);
    },
    doRemoveBoard: function (board) {
        var me = this;
        var uid = board.get('uid');
        if (uid) {
            Ext.Ajax.request({
                url: '/config/panel/' + uid,
                method: 'DELETE',
                success: function (response) {
                    me.getBoardList().getStore().load();
                    Ext.getStore('boards').load();
                },
                failure: function (response) {

                }
            });
        }
    },
    onBoardNameBlur: function(editor) {
        var board = this.getCurrentBoard();
        if (!board) return;
        board.set('name', editor.getValue());
        this.saveDraft();
    },
    onBoardDescriptionBlur: function (editor) {
        var board = this.getCurrentBoard();
        if (!board) return;
        board.set('description', editor.getValue());
        this.saveDraft();
    },
    onCohortBlur: function(editor) {
    	var board = this.getCurrentBoard();
        if (!board) return;
        board.set('cohort', editor.getValue());
        this.saveDraft();
    },    
    onSyncDataChange: function(combo, records) {
    	this.syncBoardWithEditor();
        this.saveDraft();
    },

    
    /**
     * @private
     */
    syncBoardWithEditor: function () {
    	var cols = this.getBoardColumnList().getStore().data;
    	var colstore = this.currentBoard.columns();
    	colstore.suspendEvents();
    	colstore.removeAll();
    	cols.each(function(col) {
    		colstore.add(col);
    	});
    	
    	colstore.commitChanges();
    	colstore.resumeEvents();
    	
        var cats = this.currentBoard.categories();
        cats.suspendEvents();
        cats.removeAll();
        var bc = this.getBoardCategoriesField().getValue();
        for(key in bc) {
        	var cat = bc[key];
            cats.add(cat);
        };
        cats.commitChanges();
        cats.resumeEvents();
    },
    getCurrentBoard: function () {
        return this.currentBoard;
    },

    /**
     * Do not call this routine directly. All calls should go thru publishTeam() and saveDraft() so that the 
     * draft status is correctly reflected.
     */
    saveCurrentBoard: function () {
        var me = this;

        var board = me.currentBoard;
        // Fix for weird error where draft sneaks in as an empty strang.
        if(board.get('draft')!=null && Ext.isString(board.get('draft'))) {
        	if(board.get('draft')=='') {
        		board.set('draft',null);
        	} else {
        		board.set('draft', Ext.decode(board.get('draft'), true));
        	}
        }
		var uid = board.get('uid');
        if (!uid) uid = 'new';
        var panelMap = board.data;
        
        var cols = board.columns();
        var coldefs = new Array();
        cols.each(function (col) {
            coldefs.push(col.data);
        });


        var cats = board.categories();
        var catz = new Array();
        cats.each(function (cat) {
            catz.push(cat.data);
        });
        
        Ext.apply(panelMap, {columns: coldefs, categories: catz});
        var panel = Ext.encode(panelMap);

        Ext.Ajax.request({
            url: '/config/panel',
            method: 'POST',
            params: {
            	panel: panel
            },
            success: function (response) {
                var json = Ext.decode(response.responseText);
                board.set('uid', json.uid); // Unintentionally sets the UID of a draft save to the real board when a real save lines up before the draft save returns.
                board.commit();
                me.getBoardList().getStore().sort();
                me.getBoardList().getView().focusRow(board);
                if(Ext.getStore('boards')!=null) {
                	Ext.getStore('boards').load();
                }
                me.refreshDraftStatus(board);
                
                // Hack to avoid duplicates from draft and save button at same time.
                me.saving = false;
                if(Ext.isFunction(me.afterSave)) {
                	var funk = Ext.Function.bind(me.afterSave, me);
                	me.afterSave = null;
                	funk.call();
                } else {
                	me.previewSelectedRoster();
                }
            },
            failure: function (resp) {
                // Hack to avoid duplicates from draft and save button at same time.
                me.saving = false;
                if(Ext.isFunction(me.afterSave)) {
                	var funk = Ext.Function.bind(me.afterSave, me);
                	me.afterSave = null;
                	funk.call();
                }
                console.log(resp.responseText);
                Ext.MessageBox.alert('Save Failed', 'Check console log for details.');
            }
        });
    }
});