/**
 * Controls Team Management panel.
 */
Ext.define('gov.va.hmp.team.TeamManagementController', {
    extend: 'gov.va.hmp.Controller',
    requires: [
        'gov.va.hmp.team.TeamManagementPanel',
        'gov.va.hmp.UserContext',
        'gov.va.cpe.roster.RosterStore'
    ],
    refs: [
        {
            ref: 'teamList',
            selector: '#teamList'
        },
        {
            ref: 'teamForm',
            selector: '#teamEdit'
        },
        {
            ref: 'teamName',
            selector: '#teamNameField'
        },
        {
            ref: 'ownerName',
            selector: '#ownerNameField'
        },
        {
            ref: 'teamDescription',
            selector: '#teamDescriptionField'
        },
        {
            ref: 'teamCategories',
            selector: '#teamCategoriesField'
        },
        {
            ref: 'staffList',
            selector: '#staffList'
        },
        {
            ref: 'personPicker',
            selector: 'personpicker'
        }
    ],
    init: function () {
        var me = this;
        me.control({
            '#teamList': {
                selectionchange: me.onTeamSelectionChange
            },
            '#teamList actioncolumn': {
                click: me.onAction
            },
            '#staffList': {
                assignmentchange: me.onSyncDataChange,
                positionremove: me.onSyncDataChange,
                positionadd: me.onSyncDataChange,
                boardchange: me.onSyncDataChange
            },
            '#createTeamButton': {
                click: me.doNewTeam
            },
            '#removeTeamButton': {
                click: me.onRemoveTeamClick
            },
            '#setTeamPatientsButton': {
                selectionchange: me.onSelectPatientList
            },
            '#saveTeamButton': {
                click: me.publishTeam
            },
            '#teamDescriptionField': {
                blur: me.onDescriptionBlur
            },
            '#teamNameField': {
            	blur: me.onTeamNameBlur
            },
            '#teamCategoriesField': {
                select: me.onSyncDataChange,
                tagadd: me.onSyncDataChange,
                tagremove: me.onSyncDataChange
            }
        });
    },
    publishTeam: function() {
    	if(this.saving) {
    		this.afterSave = this.publishTeam;
    		return;
    	}
    	this.saving = true;
    	
    	// Remove draft, if in draft status.
    	var me = this;
    	if(me.currentTeam) {
    		if(me.currentTeam.get('draft') && me.currentTeam.get('uid')!='') {
    			Ext.Ajax.request({
    				url: '/teamMgmt/v1/team/'+me.currentTeam.get('uid'),
    				method: 'DELETE',
    				success: function() {
    					me.currentTeam.set('uid', me.currentTeam.get('draft').sourceUid);
    					me.currentTeam.set('draft', null);
    					me.saveCurrentTeam();
    				},
    				failure: function(response) {
    					console.log(response);
    				}
    			})
    		} else {
    			if(me.currentTeam.get('draft')) {
    				me.currentTeam.set('uid', me.currentTeam.get('draft').sourceUid);
    			}
    			me.currentTeam.set('draft', null);
    			me.saveCurrentTeam();
    		}
            me.refreshDraftStatus(me.currentTeam);
    	}
    },
    /**
     * Cases: 	1) Editing existing, saved, UID-populated team, that does not have a draft.
     * 			2) Editing a brand-new team.
     * 			3) Editing an existing draft.
     */
    saveDraft: function() {
    	var jsonData = this.getTeamJson();
    	var jsonText = Ext.encode(jsonData);
    	if(this.saving) {
    		this.afterSave = this.saveDraft;
    		return;
    	}
    	this.saving = true;
    	
    	if(this.currentTeam) {
        	this.savingDraft = true;
    		if(!this.currentTeam.get('draft')) {
    			this.currentTeam.set('draft', {sourceUid: this.currentTeam.get('uid')});
    			this.currentTeam.set('uid','');
    			this.currentTeam.rosterID = null;
    			this.currentTeam.set('rosterId', null);
    		}
    		this.saveCurrentTeam();
    	}
    },
    onTeamSelectionChange: function (grid, selected) {
        if (selected && selected.length>0) {
            var team = selected[0];
            var teamname = team.get('displayName');
            this.getTeamForm().show();
            this.getTeamName().setValue(teamname);
            this.getOwnerName().setValue(team.get('ownerName'));
            this.getTeamDescription().setValue(team.get('description'));

            var staff = team.staff();
            var assignments = new Array();
            staff.each(function (assignment) {
                assignments.push(assignment);
            });
            this.getStaffList().getStore().loadRecords(assignments);
            
            var cats = team.categories();
            var catz = [];
            cats.each(function (cat) {
            	catz.push(cat.data);
            });
            var tcfld = this.getTeamCategories();
            tcfld.setValue(catz);
//            this.getTeamCategories().setValue(cats.data.items);
            
            this.currentTeam = team;
        	this.saveTeamJson = this.getTeamJson();
            this.refreshDraftStatus(team);
        } else {
            this.getTeamForm().hide();
        }
    },
    doNewTeam: function () {
        var userInfo = gov.va.hmp.UserContext.getUserInfo();
        var newTeam = Ext.create('gov.va.hmp.team.Team', {
            ownerUid: userInfo.uid,
            ownerName: userInfo.displayName
        });
        var teamStore = Ext.getStore('teamsdraft');
        teamStore.add(newTeam);
        this.getTeamList().getSelectionModel().select(newTeam);
    },
    onRemoveTeamClick: function() {
        this.onDelete(this.currentTeam);
    },
    onAction:function(view,cell,row,col,e) {
        var team = this.getTeamList().getStore().getAt(row);
        this.onDelete(team);
    },
    onDelete:function(team) {
        var me = this;
        var teamName = team.get('displayName');
        Ext.Msg.show({
            title: "Remove '" + teamName + "'",
            icon: this.QUESTION,
            msg: "Are you sure you want to remove team '" + teamName + "'?",
            buttons: Ext.Msg.YESNO,
            callback: me.onConfirmDelete,
            scope: me,
            team: team
        });
    },
    onConfirmDelete:function(btn, value, opts) {
        if (btn != "yes") return;

        this.doDeleteTeam(opts.team);
    },
    doDeleteTeam: function(team) {
        var me = this;
        var teamUid = team.get('uid');
        if(teamUid) {
            Ext.Ajax.request({
                url: '/teamMgmt/v1/team/'+teamUid,
                method: 'DELETE',
                success: function(response) {
                    me.getTeamList().getStore().load();
                    var tstr = Ext.getStore('teams');
                    if(tstr!=null) {tstr.load();}
                },
                failure: function(response) {

                }
            });
        }
    },
    onTeamNameBlur: function(editor) {
        var team = this.getCurrentTeam();
        if (!team) return;
        var teamname = editor.getValue();
        team.set('displayName', teamname);
        this.saveDraft();
        this.refreshDraftStatus(team);
    },
    onDescriptionBlur: function (editor) {
        var team = this.getCurrentTeam();
        if (!team) return;
        team.set('description', editor.getValue());
        this.saveDraft();
    },
    onSyncDataChange: function(combo, records) {
    	this.syncTeamWithEditor();
        this.saveDraft();
    },
    
    /**
     * @private
     */
    syncTeamWithEditor: function () {
        var staff = this.currentTeam.staff();
        staff.suspendEvents();
        staff.removeAll();
        this.getStaffList().getStore().each(function (assignment) {
            staff.add(assignment);
        });
        this.getStaffList().getStore().commitChanges();
        staff.commitChanges();
        staff.resumeEvents();
        this.currentTeam.set('totalStaff', staff.getCount());
        
        var cats = this.currentTeam.categories();
        cats.suspendEvents();
        cats.removeAll();
        var tc = this.getTeamCategories().getValue();
        for(key in tc) {
        	var cat = tc[key];
            cats.add(cat);
        };
        cats.commitChanges();
        cats.resumeEvents();
    },
    getCurrentTeam: function () {
        return this.currentTeam;
    },
    /**
     * Returns the number to append to a new team given the number of existing new teams in the teams store.
     * <ul>
     *     <li>New Team</li>
     *     <li>New Team 1</li>
     *     <li>New Team 2</li>
     *     <li>New Team 3</li>
     * </ul>
     * @private
     */
    getNewTeamNumber: function () {
        var newTeams = Ext.getStore('teams').getNewRecords();
        return newTeams.length;
    },
    
    getTeamJson: function() {
        var team = this.currentTeam;
        
        if(team.get('draft')!=null && Ext.isString(team.get('draft'))) {
        	if(team.get('draft')=='') {
            	team.set('draft',null);
        	} else {
        		team.set('draft', Ext.decode(team.get('draft'), true));
        	}
        }
        var jsonData = team.data;
        jsonData.staff = new Array();
        team.staff().each(function (assignment) {
            jsonData.staff.push(assignment.data);
        });
        jsonData.categories = new Array();
        team.categories().each(function (cat) {
            jsonData.categories.push(cat.data);
        });
        return jsonData;
    },

    /**
     * Do not call this routine directly. All calls should go thru publishTeam() and saveDraft() so that the 
     * draft status is correctly reflected.
     *
     * @private
     */
    saveCurrentTeam: function () {
        var me = this;
    		var jsonData = me.getTeamJson();
    		me.saveTeamJson = Ext.encode(jsonData);
            var team = me.currentTeam;

    		var uid = team.get('uid');
            if (!uid) uid = 'new';

            Ext.Ajax.request({
                url: '/teamMgmt/v1/team/' + uid,
                method: 'POST',
                jsonData: jsonData,
                success: function (response) {
                    var json = Ext.decode(response.responseText);
                    team.set('uid', json.data.uid);
                    team.commit();
                    me.getTeamList().getStore().sort();
                    me.getTeamList().getView().focusRow(team);
                    if(Ext.getStore('teams')!=null) {
                    	Ext.getStore('teams').load();
                    }
                    // Hack to avoid duplicates from draft and save button at same time.
                    me.saving = false;
                    if(Ext.isFunction(me.afterSave)) {
                    	var funk = Ext.Function.bind(me.afterSave, me);
                    	me.afterSave = null;
                    	funk.call();
                    }
                },
                failure: function () {
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
            me.refreshDraftStatus(team);
    },
    refreshDraftStatus:function(team) {
        var teamname = team.get('displayName');
        var draft = team.get('draft');
        this.getTeamForm().setTitle(teamname + (draft ? ' <small>Draft</small>' : ''));
    },
    onSelectPatientList: function (combo, records) {
        var rosterId = combo.getValue();
        var team = this.getCurrentTeam();
        team.set('rosterId', rosterId);
        combo.clearValue();
        this.refreshPatientList(team);
    },
    /**
     * @private
     */
    refreshPatientList: function (team) {
        var me = this;
        var rosterId = team.get('rosterId');
    }
});