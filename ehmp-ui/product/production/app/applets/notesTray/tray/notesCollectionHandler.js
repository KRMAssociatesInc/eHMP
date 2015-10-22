 define([
     "backbone",
     "marionette",
     "underscore",
     "api/SessionStorage",
     'api/ResourceService',
     "main/Utils",
     "moment"

 ], function(Backbone, Marionette, _, SessionStorage, ResourceService, utils, moment) {
     'use strict';
     var UNSIGNED = 'unsigned';
     var UNCOSIGNED = 'uncosigned';
     var SIGNED = 'signed';
     var NotesCollection = Backbone.Collection.extend();

     var unsignedNotes = new NotesCollection();
     unsignedNotes.comparator = function(left, right) {
        //var l = left.get('updated') ? getDate(left.get('updated')) : getDate(left.get('entered'));
        //var r = right.get('updated') ? getDate(right.get('updated')) : getDate(right.get('entered'));
        var l = getComparatorValue(left);
        var r = getComparatorValue(right);
        if(l === r) {
            return 0;
        }
        else if(l < r) return 1;
        else return -1;
    };
    function getComparatorValue(model) {
        //"entered":"2015 07 16 1958 13",
        //"referenceDateTime":"2015 07 16 1958",
        //need to sort notes without a reference date before notes with a reference date
        if (model.get('referenceDateTime')) {
            return moment(model.get('referenceDateTime'), ['YYYYMMDDHHmm']).format('YYYYMMDDHHmmss');
        } else {
            //multiply the entered date by 10 so it will sort before the reference dates.
            return moment(model.get('entered'), ['YYYYMMDDHHmm']).format('YYYYMMDDHHmmss') * 10;
        }
    }
    function getDate (str) {
        //20150710065502
        //2015-07-09T15:34:57.495Z
        var ret = moment(str, ['YYYYMMDDHHmmss', moment.ISO_8601]).format('YYYYMMDDHHmmssSSS');
        return ret;
    }
     var uncosignedNotes = new NotesCollection();
     var signedNotes = new NotesCollection();
     var vistaUnsignedNotes;
     var ecrudDone = false;
     var vistaDone = false;
     var signedDone = -1;
     var unsignedDone = -1;
     var uncosignedDone = 0;

     var Title = Backbone.Model.extend({});

     var Titles = Backbone.Collection.extend({
         model: Title
     });

     var Type = Backbone.Model.extend({});

     var Types = Backbone.Collection.extend({
         model: Type
     });

     var vistaUnsignedFilter = function() {
         var duz = ADK.UserService.getUserSession().get('duz') &&
             ADK.UserService.getUserSession().get('duz')[ADK.UserService.getUserSession().get('site')];
         return 'eq("status","UNSIGNED"),eq("documentClass","PROGRESS NOTES"),like("authorUid","%' + duz + '")';
     };

     var vistaUnsignedNotesFetchOptions = {
         resourceTitle: 'patient-record-document',
         criteria: {},
         onError: function(model, resp) {
             console.log("error: " + resp.responseText);
             vistaDone = true;
         },

         onSuccess: function(model, resp) {
             vistaUnsignedNotes = model;
             vistaDone = true;
         }
     };


     var signedNotesFetchOptions = {
         resourceTitle: 'patient-record-document',
         criteria: {
            order:  'signedDateTime DESC'
         },
         onError: function(model, resp) {
             console.log("error: " + resp.responseText);
             signedDone = 0;
         },

         onSuccess: function(model, resp) {
             var count = 0;
             var ary = model.toJSON();
             _.each(ary, function(item, index, all) {
                 item.count = count;
                 count = count + 1;
                 item.id = item.uid;
                 item.app = 'ehmp';
                 item.documentDefUidUnique = item.documentDefUid + '_' + item.localTitle + '_all';
             });
             signedNotes.reset(ary);
             signedDone = count;
         }
     };

     function addVistaNotes() {
         var items = vistaUnsignedNotes.toJSON();
         var count = unsignedNotes.length;
         _.each(items, function(item, index, all) {
             item.count = count;
             count = count + 1;
             item.id = item.uid;
             item.app = 'vista';
             item.documentDefUidUnique = item.documentDefUid + '_' + item.localTitle + '_all';
             var note = unsignedNotes.find(function(model) {
                return model.get('noteUid') === item.uid;
             });
             if (!note) { // only add the note if it's not a vista stub note
                unsignedNotes.add(item);
             }
         });
         unsignedNotes.sort();
         unsignedDone = count;

     }

     var util = {
         getModel: function() {
             var utype = new Type({
                 'id': 'unsigned',
                 'name': 'Unsigned',
                 'notes': unsignedNotes
             });
             var ctype = new Type({
                 'id': 'uncosigned',
                 'name': 'Un-Cosigned',
                 'notes': uncosignedNotes
             });
             var stype = new Type({
                 'id': 'signed',
                 'name': 'Recently Signed',
                 'notes': signedNotes
             });
             var types = new Types([utype, ctype, stype]);
             return types;
         },

         initNotes: function(inModel) {
            ecrudDone = false;
            vistaDone = false;
            signedDone = -1;
            unsignedDone = -1;
            uncosignedDone = 0;
            unsignedNotes.reset();
            uncosignedNotes.reset();
            signedNotes.reset();
            var ready;
            var that = this;
            ready = setInterval(function() {
                if (vistaDone && ecrudDone) {
                    if (unsignedDone == -1) {
                        addVistaNotes();
                    }
                    else if (signedDone != -1 && uncosignedDone != -1) {
                        clearInterval(ready);
                        var total = unsignedDone + signedDone + uncosignedDone;
                        ADK.Messaging.getChannel('notesTray').trigger('notes:retrieved', total);
                    }
                }
            }, 200);

            //signed date witing past 30 days
            this.initEcrudUnsignedNotes(inModel);
            this.initVistaUnsignedNotes(inModel);
            this.initUncosignedNotes(inModel);
            this.initSignedNotes(inModel);
         },

         getUnsignedNotes: function() {
             return unsignedNotes;
         },

         getUncosignedNotes: function() {
             return uncosignedNotes;
         },

         getSignedNotes: function() {
             return signedNotes;
         },

         initEcrudUnsignedNotes: function(inModel) {
             var patient = ResourceService.patientRecordService.getCurrentPatient();

             // TODO: undo this once this resource is available by name to use fetchCollection
             unsignedNotes.url = '/resource/write-health-data/patient/' + patient.get('pid') + '/notes?pid='+patient.get('icn');
             unsignedNotes.fetch({
                 error: function(collection, resp) {
                     console.log("error: " + resp.responseText);
                     unsignedNotes.reset();
                     ecrudDone = true;
                 },

                 success: function(collection, resp) {
                     var ary = resp.data.notes;
                     var count = 0;
                     _.each(ary, function(item, index, all) {
                         item.count = count;
                         count = count + 1;
                         item.id = item.uid = item.localId.toString();
                         item.app = 'ehmp';
                         item.documentDefUidUnique = item.documentDefUid + '_' + item.localTitle + '_all';
                     });
                     unsignedNotes.reset(ary);
                     ecrudDone = true;

                 }
             });
         },

         initVistaUnsignedNotes: function(inModel) {
             var patient = ResourceService.patientRecordService.getCurrentPatient();
             var param = {
                 "pid": patient.get('pid'),
             };
             vistaUnsignedNotesFetchOptions.criteria.param = JSON.stringify(param);
             vistaUnsignedNotesFetchOptions.criteria.filter = vistaUnsignedFilter();
             ADK.PatientRecordService.fetchCollection(vistaUnsignedNotesFetchOptions);
         },

         initUncosignedNotes: function(inModel) {
             return new Backbone.Collection();
         },

         initSignedNotes: function(inModel) {
            var patient = ResourceService.patientRecordService.getCurrentPatient();
            var param = {
                "pid": patient.get('pid'),
            };

            var dateFilter = this.getDateFilter();
            var filterText = 'eq("status","COMPLETED"),eq("documentClass","PROGRESS NOTES"),' +dateFilter;
            signedNotesFetchOptions.criteria.filter = filterText;
            signedNotesFetchOptions.criteria.param = JSON.stringify(param);
            ADK.PatientRecordService.fetchCollection(signedNotesFetchOptions);
         },

         getDateFilter: function() {
            var toDate = moment().format("MM/DD/YYYY");
            var fromDate = moment().subtract('days', 30).format('MM/DD/YYYY');
            var dateField = 'signedDateTime';
            fromDate = '"' + utils.formatDate(fromDate, 'YYYYMMDD', 'MM/DD/YYYY') + '"';
            toDate = '"' + utils.formatDate(toDate, 'YYYYMMDD', 'MM/DD/YYYY') + '235959"';
            return 'between(' + dateField + ',' + fromDate + ',' + toDate + ')';
         },

        getModelByUid: function(uid) {
            var modelTypes = this.getModel();
            for (var i = 0; i < modelTypes.models.length; i++) {
                var noteModels = modelTypes.models[i].get('notes').models;
                for (var k = 0; k < noteModels.length; k++) {
                    var noteModel = noteModels[k];
                    if (noteModel.get('uid') === uid.toString()) {
                        return noteModel;
                    }
                }
            }
            return null;
        }
     };

     return util;
 });
