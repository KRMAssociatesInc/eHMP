define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'app/applets/notesTray/tray/trayView',
    'app/applets/notesTray/writeback/noteForm',
    'app/applets/notesTray/preview/preview',
    'app/applets/notesTray/tray/visitConfirmationView',
    'app/applets/notesTray/writeback/templateHelpers',
    'hbs!app/applets/notesTray/preview/previewHeaderTemplate',
    'app/applets/visit_new/writeback/addselectVisit'
], function(Backbone, Marionette, $, Handlebars, TrayView, NoteForm, PreviewModal, VisitConf, templateHelpers, previewHeaderTemplate, addselectVisit) {
    var DEBUG = false;
    var noteForm = null;
    var previewSource = null;
    var OPEN_TRAY = true;

    Handlebars.registerHelper('formatRelativeTime', templateHelpers.formatRelativeTime);

    var getFormInstance = function(obj) {
        if (!noteForm || noteForm.isDestroyed) {
            noteForm = new NoteForm({ model: obj });
        }
        return noteForm;
    };
    var PreviewHeaderView = Backbone.Marionette.ItemView.extend({
        template: previewHeaderTemplate,
        events: {
            'click #preview-close-btn': 'closePreview',
            //'mousedown #preview-close-btn': 'changeFocus',
        },
        closePreview: function() {
            //this.bodyView.save();
            event.preventDefault();
            event.stopImmediatePropagation();
            ADK.UI.Modal.hide();
            if (DEBUG) console.log("NOTES applet--->> close preview button clicked");
            channel.trigger('close:preview', this.model);
        },
        changeFocus: function() {
            $('#patientDemographic-notes').focus();
        }
    });
    var applet = {
        id: "notesTray",
        viewTypes: [{
            type: 'expanded',
            view: TrayView,
            chromeEnabled: true
        }, {
            type: 'writeback',
            view: NoteForm,
            chromeEnabled: false
        }, {
            type: 'previewModal',
            view: PreviewModal,
            chromeEnabled: false
        }],
        defaultViewType: 'expanded',

        getRootView: function() {
            return TrayView;
        },
    };
    (function initMessaging() {
        if (DEBUG) console.log("NOTES applet--->> initMessaging");
        var View = applet.getRootView();
        var currentView = new View();
        var channel = ADK.Messaging.getChannel('notesTray');
        var visitChannel = ADK.Messaging.getChannel('visit');
        var patient = ADK.ResourceService.patientRecordService.getCurrentPatient();

        channel.on('notestray:selectvisit', function() {
            var formModel = new Backbone.Model();
            var vm_formModel = new Backbone.Model({
                encounterProvider: 'Not Specified',
                encounterLocation: 'Not Specified',
                visit: {}
            });
            var workflowOptions = {
                size: "large",
                title: "Provider & Location for Current Activities",
                showProgress: false,
                keyboard: true,
                steps: []
            };

            workflowOptions.steps.push({
                view: addselectVisit,
                viewModel: vm_formModel
            });

            var workflowView = new ADK.UI.Workflow(workflowOptions);
            workflowView.show();

        });

        channel.on('addNewNote-btn', function(fshow){  // add new Note
            if(fshow){ 
                OPEN_TRAY = true;
            }else{
                OPEN_TRAY = false;
            }
            console.log('**** addNote ****');
            if(DEBUG) console.log("NOTES applet--->> new note button clicked");
            patient = ADK.ResourceService.patientRecordService.getCurrentPatient();
            if (patient.get('visit')){
                console.log('visit: %o', patient.get('visit'));
                var writebackView = ADK.utils.appletUtils.getAppletView('notesTray', 'writeback');
                var workflowOptions = {
                    title: "New Note",
                    size: "large",
                    showProgress: false,
                    keyboard: true,
                    steps: [{
                        view: writebackView,
                        stepTitle: 'Step 1',
                        showHeader: false
                    }]
                };
                var workflow = new ADK.UI.Workflow(workflowOptions);
                workflow.show();
            } else {
                var confView = new VisitConf();
                confView.showModal();
            }
        });
        channel.on('note:saved', function(uid){
            if(DEBUG) console.log("NOTES applet--->> note saved");
            ADK.UI.Workflow.hide();
            if(OPEN_TRAY) {
                channel.trigger('notestray:select', uid);
                channel.trigger('notestray:open');
            }
        });
        channel.on('show:preview', function(obj){  // add new Note
            if(DEBUG) console.log("NOTES applet--->> show preview");
            ADK.UI.Workflow.hide();
            var Preview = ADK.utils.appletUtils.getAppletView('notesTray', 'previewModal');
            var view = new Preview({model: obj});
            var header = new PreviewHeaderView({ model: obj});
            view.render();
            var options = {
                'footerView': 'none',
                'replaceContents': true,
                'callShow': true
            };
            var modal = new ADK.UI.Modal({
                view: view,
                options: options
            });
            modal.show();
        });
        channel.on('close:preview', function(obj) {
            if(DEBUG) console.log("NOTES applet--->> close preview");
            var previewSource = obj.get('previewSource');
            if(DEBUG) console.log('previewSource: %s', previewSource);
            ADK.UI.Modal.hide();
            var writebackView, workflowOptions;
            if (previewSource === 'form') {
                writebackView = ADK.utils.appletUtils.getAppletView('notesTray', 'writeback');
                var modalTitle = 'Add Note';
                if (obj.get("deriv_isEditForm") === true) {
                    modalTitle = "Edit Note";
                }
                workflowOptions = {
                    title: modalTitle,
                    size: "large",
                    showProgress: false,
                    keyboard: true,
                    steps: [{
                        view: writebackView,
                        viewModel: obj,
                        stepTitle: 'Step 1',
                    }]
                };
                var workflow = new ADK.UI.Workflow(workflowOptions);
                workflow.show();

            } else {
                channel.trigger('notestray:select', obj.get('uid'));
                channel.trigger('notestray:show', currentView);
                channel.trigger('notestray:open');
            }
        });
        channel.on('notestray:visitselect', function(){
            if(DEBUG) console.log("NOTES applet--->> visit selected");
            var writebackView = ADK.utils.appletUtils.getAppletView('notesTray', 'writeback');
            var workflowOptions = {
                size: "large",
                title: "New Note",
                showProgress: false,
                keyboard: true,
                steps: [{
                    view: writebackView,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        });
        channel.on('notestray:visitcancel', function(){
            if(DEBUG) console.log("NOTES applet--->> visit cancelled");
            channel.trigger('notestray:show', currentView);
            channel.trigger('notestray:open');
        });

        channel.on('editNote-btn', function(obj){ // edit Note
            if(DEBUG) console.log("NOTES applet--->> edit note button clicked");
            var writebackView = ADK.utils.appletUtils.getAppletView('notesTray', 'writeback');
            var workflowOptions = {
                size: "large",
                title: "Edit Note",
                showProgress: false,
                keyboard: true,
                steps: [{
                    view: writebackView,
                    viewModel: obj,
                    stepTitle: 'Step 1',
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        });
        channel.on('closeNoteForm-btn', function() { // close Note form
            if (DEBUG) console.log("NOTES applet--->> close note form button clicked");
            getFormInstance().saveNote();
        });

        channel.on('notes:init', function() {
            if (DEBUG) console.log('NOTES applet--->> init notes');
            patient = ADK.ResourceService.patientRecordService.getCurrentPatient();
            var View = applet.getRootView();
            currentView = new View();
            channel.trigger('notestray:show', currentView);
        });
        channel.on('notes:view', function() {
            if (DEBUG) console.log('NOTES applet--->> get view');
            channel.trigger('notestray:show', currentView);
        });
        channel.on('notes:sign', function(model) {
            if (DEBUG) console.log('NOTES applet--->> sign note');
            var SignListModel = Backbone.Model.extend({});
            var ordersModel = new SignListModel({});
            var arr = [];
            // ---------- TODO: should be removed after eSignature ui-component (Venus) fix
            model.set("uid", "urn:va:document:9E7A:3:114551");
            model.set("stampTime", model.get("referenceDateTime"));
            model.set("summary", model.get("localTitle")); //???
            // ----------
            arr.push(model.toJSON());
            ordersModel.set('items', arr);
            ADK.SignApi.sign( ordersModel, function(output) {
                    console.log("NOTES applet--->> signed note model");
                    console.log(output);
                });            
        });
    })();

    return applet;
});
