define([
    "backbone",
    "marionette",
    "underscore",
    "moment",
    "app/applets/orders/writeback/filemanDateUtil"
], function(Backbone, Marionette, _, Moment, FilemanDateUtil) {
    //constants
    var AVAILABLE_LAB_TEST = '4';
    var COLLECTION_DATE_TIME = '6';
    var COMMENTS = '15';
    var COLLECTION_TYPE = '28';
    var HOW_OFTEN = '29';
    var HOW_LONG = '153';
    var COLLECTION_SAMPLES = '126';
    var SPECIMEN = '127';
    var URGENCY = '180';

    var componentList = {};

    function updatePickList(form, controlType, controlName, pickList) {
        form.model.unset(controlName);
        form.callControlFunction({
            controlType: controlType,
            controlName: controlName,
            functionName: 'setPickList',
            options: {
                pickList: pickList
            }
        });
    }

    function splitDateTime(dateTimeString) {
        var dateTime = dateTimeString.split(' ');
        var date = '';
        var time = '0:00';
        if (dateTime.length > 0) {
            date = dateTime[0];
        }
        if (dateTime.length > 1) {
            time = dateTime[1];
        }
        return { date: date, time: time };
    }

    var writebackUtils = {
        resetForm: function(form) {
            //reset availableLabTests
            //form.model.unset('availableLabTests');
            form.model.unset('labTestText');
            //reset collection sample
            form.model.unset('collectionSample');
            form.model.unset('collectionSampleText');
            form.model.unset('collectionSampleListCache');
            updatePickList(form, 'select', 'collectionSample', []);
            form.model.unset('otherCollectionSample');
            //reset specimen
            form.model.unset('specimen');
            form.model.unset('specimenListCache');
            updatePickList(form, 'select', 'specimen');
            form.model.unset('otherSpecimen');
            form.model.unset('specimenText');
            //reset urgency
            form.model.unset('urgency');
            form.model.unset('urgencyText');
            updatePickList(form, 'select', 'urgency', []);
            //reset howOften, howLong
            form.model.unset('howOften');
            form.model.unset('howLong');
            form.model.unset('howOftenText');
            updatePickList(form, 'select', 'howOften', []);
            //reset collectionType
            form.model.unset('collectionType');
            updatePickList(form, 'select', 'collectionType', []);
            //reset collectionDateTimePicklist
            form.model.unset('collectionDateTimePicklist');
            updatePickList(form, 'select', 'collectionDateTimePicklist', []);
            //reset dynamic fields
            form.model.unset('sampleDrawnAt');
            form.model.unset('additionalComments');
            form.model.unset('anticoagulant');
            form.model.unset('anticoagulantText');
            form.model.unset('orderComment');
            form.model.unset('orderCommentText');
            form.model.unset('doseDate');
            form.model.unset('doseTime');
            form.model.unset('drawDate');
            form.model.unset('drawTime');
            form.model.unset('doseDrawText');
            form.model.unset('forTest');

            form.model.unset('labCanCollect');
            form.model.unset('alertMessage');
            form.model.unset('savedTime');
            form.$(form.ui.acceptDrpDwnContainer).find('button').attr('disabled', true).addClass('disabled');
            form.hideAll();
        },
        resetRequiredFields: function(form) {
            form.$(form.ui.collectionDate).trigger('control:required', false);
            form.$(form.ui.collectionTime).trigger('control:required', false);
            form.$(form.ui.collectionDateTimePicklist).trigger('control:required', false);
            form.$(form.ui.otherCollectionSample).trigger('control:required', false);
            form.$(form.ui.otherSpecimen).trigger('control:required', false);
            form.$(form.ui.futureLabCollectDate).trigger('control:required', false);
            form.$(form.ui.futureLabCollectTime).trigger('control:required', false);
        },
        setInitialCollectionDateTimeValues: function(form) {
            form.model.set('collectionDate', moment().format('MM/DD/YYYY'));
            form.model.set('collectionTime', '0:00');
            form.model.set('immediateCollectionTime', '0:00');
            form.model.set('collectionDateTime', 'TODAY');
        },
        disableAllFields: function(form, setDisabled) {
            form.$(form.ui.availableLabTests).trigger('control:disabled', setDisabled);
            form.$(form.ui.urgency).trigger('control:disabled', setDisabled);
            form.$(form.ui.howOften).trigger('control:disabled', setDisabled);
            form.$(form.ui.howLong).trigger('control:disabled', setDisabled);
            form.$(form.ui.collectionType).trigger('control:disabled', setDisabled);
            form.$(form.ui.collectionDateTimePicklist).trigger('control:disabled', setDisabled);
            form.$(form.ui.collectionDate).trigger('control:disabled', setDisabled);
            form.$(form.ui.collectionTime).trigger('control:disabled', setDisabled);
            form.$(form.ui.specimen).trigger('control:disabled', setDisabled);
            form.$(form.ui.otherSpecimen).trigger('control:disabled', setDisabled);
            form.$(form.ui.collectionSample).trigger('control:disabled', setDisabled);
            form.$(form.ui.otherCollectionSample).trigger('control:disabled', setDisabled);
            form.$(form.ui.anticoagulant).trigger('control:disabled', setDisabled);
            form.$(form.ui.sampleDrawnAt).trigger('control:disabled', setDisabled);
            form.$(form.ui.additionalComments).trigger('control:disabled', setDisabled);
            //form.$(form.ui.additionalComments).find('textarea').attr('disabled', setDisabled);
            form.$(form.ui.immediateCollection).trigger('control:disabled', setDisabled);
            form.$(form.ui.immediateCollectionDate).trigger('control:disabled', setDisabled);
            form.$(form.ui.immediateCollectionTime).trigger('control:disabled', setDisabled);
            form.$(form.ui.orderComment).trigger('control:disabled', setDisabled);
            form.$(form.ui.doseDate).trigger('control:disabled', setDisabled);
            form.$(form.ui.doseTime).trigger('control:disabled', setDisabled);
            form.$(form.ui.drawDate).trigger('control:disabled', setDisabled);
            form.$(form.ui.drawTime).trigger('control:disabled', setDisabled);
        },
        save: function(model, saveCallback) {
            var attributes = {
                contentType: "application/json"
            };
            if ($('#acceptDrpDwnContainer').attr('action') === 'edit'){
                var siteCode = ADK.UserService.getUserSession().get('site');
                model.url = '/resource/write-health-data/patient/' + model.get("pid") + '/orders/' + model.get('orderId') + '?site=' + siteCode + '&pid=' + model.get("pid");
                //set dummy id to trigger backbone http PUT request
                model.set('id', 1);
            }else{
                //hard coded url for now
                model.url = '/resource/write-health-data/patient/' + model.get('pid') + '/orders?pid=' + model.get('pid');
            }
            model.save(attributes, saveCallback);
        },
        discontinue: function(model) {
            var attributes = {
              contentType: "application/json",
              data: JSON.stringify({
                kind: "Laboratory",
                location: model.get('location'),
                orderId: model.get('orderId'),
                pid: model.get('pid'),
                provider: model.get('provider')
              })
            };
            model.destroy(attributes);
        },
        processExistingLabOrder: function(form) {
            var existingOrder = form.model.get('existingOrder');
            if (existingOrder && existingOrder.length > 0) {
                var collecitonTypeId;
                var howOftenId;
                var howLong;
                var collectionSampleId;
                var specimenId;
                var urgencyId;
                existingOrder.forEach(function(entry){
                    switch(entry.keyId) {
                        case COLLECTION_DATE_TIME:
                            if (entry.valueName === 'TODAY') {
                                form.model.set('collectionDate', moment().format('MM/DD/YYYY'));
                                form.model.set('collectionTime', '0:00');
                                form.model.set('collectionDateTime', 'TODAY');
                            }
                            else {
                                var dateTime = splitDateTime(entry.valueName);
                                form.model.set('collectionDate', dateTime.date);
                                form.model.set('collectionTime', dateTime.time);
                            }
                        break;
                        case COMMENTS:
                            var parsedComments = entry.valueName.split('\r\n');
                            if (parsedComments && parsedComments.length > 0) {
                                var dynamicFieldType = '';
                                parsedComments.forEach(function(comment) {
                                    if (comment !== '') {
                                        if (comment.indexOf('~For Test:') !== -1) {
                                            form.model.set('forTest', comment);
                                        }
                                        else if (comment.indexOf('~Last dose:') !== -1) {
                                            //todo: parse out the date time
                                            var doseDrawDateTime = comment.replace('~Last dose: ', '').split(' draw time: ');
                                            if (doseDrawDateTime.length > 0) {
                                                var doseString = doseDrawDateTime[0];
                                                var doseDateTime = splitDateTime(doseString);
                                                form.model.set('doseDate', doseDateTime.date);
                                                form.model.set('doseTime', doseDateTime.time);
                                            }
                                            if (doseDrawDateTime.length > 1) {
                                                var drawString = doseDrawDateTime[1];
                                                var drawDateTime = splitDateTime(drawString);
                                                form.model.set('drawDate', drawDateTime.date);
                                                form.model.set('drawTime', drawDateTime.time);
                                            }
                                        }
                                        else if (comment.indexOf('~ANTICOAGULANT:') !== -1) {
                                            form.model.set('anticoagulant', comment.replace('~ANTICOAGULANT: ', ''));
                                        }
                                        else if (comment.indexOf('~Dose is expected to be at') !== -1) {
                                            form.model.set('sampleDrawnAt', comment);
                                            dynamicFieldType = 'sampleDrawnAt';
                                        }
                                        else if (dynamicFieldType === 'sampleDrawnAt') {
                                            form.model.set('additionalComments', comment);
                                        }
                                        else {
                                            form.model.set('orderComment', comment.substring(1));
                                        }
                                    }
                                });
                            }

                        break;
                        case COLLECTION_TYPE:
                            collectionTypeId = entry.valueId;
                        break;
                        case HOW_OFTEN:
                            howOftenId = entry.valueId;
                        break;
                        case HOW_LONG:
                            howLong = entry.valueId;
                        break;
                        case COLLECTION_SAMPLES:
                            collectionSampleId = entry.valueId;
                        break;
                        case SPECIMEN:
                            specimenId = entry.valueId;
                        break;
                        case URGENCY:
                            urgencyId = entry.valueId;
                        break;
                    }
                });
                if (collectionTypeId) {
                    form.model.set('collectionType', collectionTypeId);
                }
                if (urgencyId) {
                    form.model.set('urgency', urgencyId);
                }
                if (howOftenId) {
                    form.model.set('howOften', howOftenId);
                }
                if (howLong) {
                    form.model.set('howLong', howLong);
                }
                if (collectionSampleId) {
                    if (form.model.get('collectionSample') === '-1') {
                        form.model.set('otherCollectionSample', collectionSampleId);
                    }
                    else {
                        form.model.set('collectionSample', collectionSampleId);
                    }
                }
                if (specimenId) {
                    if (form.model.get('specimen') === '-1') {
                        form.model.set('otherSpecimen', specimenId);
                    }
                    else {
                        form.model.set('specimen', specimenId);
                    }
                }
                form.$(form.ui.availableLabTests).trigger('control:disabled', false);
                form.model.unset('existingOrder');
            }
        },
        retrieveCollectionTypesUrgencyAndSchedules: function(form) {
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    resp.data.forEach(function(entry) {
                        switch(entry.categoryName) {
                            case "Collection Types":
                                form.model.set('collectionTypeListCache', entry.values);
                            break;
                            case "Default Urgency":
                                var urgencyList = [];
                                entry.values.forEach(function(urgency){
                                    urgencyList.push({ien: urgency.code, name: urgency.name});
                                });
                                form.model.set('urgencyListCache', urgencyList);
                                form.model.set('urgencyDefaultCache', entry.default.code);
                            break;
                            case "Schedules":
                                form.model.set('howOftenListCache', entry.values);
                                form.model.set('howOftenDefaultCache', entry.default.code);
                            break;
                            case "Lab Collection Times":
                                form.model.set('collectionDateTimeLC', entry.values);
                            break;
                            case "Ward Collection Times":
                                form.model.set('collectionDateTimeWC', entry.values);
                            break;
                            case "Send Patient Times":
                                form.model.set('collectionDateTimeSP', entry.values);
                            break;
                        }
                    });
                }
            };

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-pick-list?site=' + siteCode + '&type=lab-order-dialog-def';
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveOrderableItems: function(form) {
            form.$(form.ui.availableLabTests).trigger('control:disabled', true);
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    updatePickList(form, 'typeahead', 'availableLabTests', resp.data);
                    if (!form.model.get('orderId')) {
                        form.$(form.ui.availableLabTests).trigger('control:disabled', false);
                    }
                }
            };

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-pick-list?type=lab-order-orderable-items&labType=S.LAB&site=' + siteCode;
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveExisting: function(form) {
            form.$(form.ui.acceptDrpDwnContainer).find('button').attr('disabled', true).addClass('disabled');
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    form.model.set('existingOrder', resp.data.items);
                    var availableLabTestIen;
                    resp.data.items.forEach(function(entry){
                        switch(entry.keyId) {
                            case AVAILABLE_LAB_TEST:
                                availableLabTestIen = entry.valueId;
                            break;
                        }
                    });
                    $('#acceptDrpDwnContainer').attr('action', 'edit');
                    form.model.set('availableLabTests', availableLabTestIen);
                }
            };

            var pid = ADK.PatientRecordService.getCurrentPatient().get("pid");
            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-health-data/patient/' + pid + '/orders/' + form.model.get('orderId') + '?site=' + siteCode;
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveIen:function(form){
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    var orderType = _.find(resp.data, function(order){
                        return order.name == form.model.get('orderName');
                    });
                    form.model.set('ien', orderType.ien);
                    form.model.set('availableLabTests', orderType.ien);
                    form.model.set('collectionSample', form.model.orderModel.attributes.collectionSample);
                    // form.model.set('specimenText', form.model.orderModel.attributes.collectionSpecimen);
                }
            };

            var modelUrl = '/app/applets/orders/assets/orderableLabTests.json';
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                    return data.data;
                }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveOrderableItemLoad: function(form, ien) {
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                    form.hideInProgress();
                },
                success: function(model, resp) {
                    var selectedLabInfo = resp.data;
                    var collectionSampleListFound = false;
                    var specimenListFound = false;
                    var collectionSampleDefault;
                    var uniqueCollectionSample = false;
                    var urgencyListFound = false;
                    var specimenDefault;
                    var urgencyDefault;
                    var reqCom;

                    selectedLabInfo.forEach(function(entry) {
                        switch(entry.categoryName) {
                            case 'Test Name':
                                form.model.set('labTestText', entry.default.name);
                            break;
                            case 'Unique CollSamp':
                                uniqueCollectionSample = true;
                            break;
                            case 'Default CollSamp':
                                collectionSampleDefault = entry.default.value;
                            break;
                            case 'Lab CollSamp':
                                form.model.set('labCanCollect', entry.default.value);
                            break;
                            case 'CollSamp':
                                var collectionSampleList = [];
                                var previousEntry;
                                var text = '';
                                entry.values.forEach(function(entry){
                                    if (entry.text) {
                                        text += entry.text;
                                    }
                                    else if (entry.ien) {
                                        if (previousEntry) {
                                            if (text !== '') {
                                                previousEntry.text = text;
                                                text = '';
                                            }
                                            collectionSampleList.push(previousEntry);
                                        }
                                        previousEntry = entry;
                                    }
                                });
                                if (text !== '') {
                                    previousEntry.text = text;
                                }
                                collectionSampleList.push(previousEntry);
                                form.model.set('collectionSampleListCache', collectionSampleList);
                                updatePickList(form, 'select', 'collectionSample', collectionSampleList);
                                form.$(form.ui.collectionSample).trigger('control:disabled', false);
                                collectionSampleListFound = true;
                            break;
                            case 'Specimens':
                                form.model.set('specimenListCache', entry.values);
                                updatePickList(form, 'select', 'specimen', entry.values);
                                specimenListFound = true;
                            break;
                            case 'Default Urgency':
                                urgencyDefault = entry.default.ien;
                                break;
                            case 'Urgencies':
                                form.model.set('urgencyList', entry.values);
                                urgencyListFound = true;
                            break;
                            case 'OIMessage':
                                if (entry.values.length > 0) {
                                    form.model.set('alertMessage', entry.values[0].text0);
                                }
                            break;
                            case 'ReqCom':
                                reqCom = entry.default.name;
                            break;
                        }
                    });

                    //check collectionType
                    var collectionTypes = form.model.get('collectionTypeListCache');
                    if (!form.model.get('labCanCollect')) {
                        var modifiedCollectionTypes = [];
                        collectionTypes.forEach(function(entry){
                            if (entry.code !== 'LC' && entry.code !== 'I') {
                                modifiedCollectionTypes.push(entry);
                            }
                        });
                        updatePickList(form, 'select', 'collectionType', modifiedCollectionTypes);
                    } else {
                        updatePickList(form, 'select', 'collectionType', collectionTypes);
                    }
                    form.model.set('collectionType', 'SP'); //TODO: check if inpatient, then set as 'LC'
                    form.$(form.ui.collectionType).trigger('control:disabled', false);

                    //check reqCom
                    if (reqCom) {
                        that.handleReqCom(form, reqCom);
                    }

                    if (collectionSampleListFound) {
                        var collectionSampleListCache = form.model.get('collectionSampleListCache');
                        if (collectionSampleDefault) {
                            var selectedCollectionSample = $.grep(collectionSampleListCache, function(e) {
                                return e.n == collectionSampleDefault;
                            });
                            form.model.set('collectionSample', selectedCollectionSample[0].ien);
                        }
                        else {
                            form.model.set('collectionSample', collectionSampleListCache[0].ien);
                        }
                        form.$(form.ui.otherCollectionSampleContainer).trigger('control:hidden', true);
                    }
                    else {
                        updatePickList(form, 'select', 'collectionSample', [{ ien: '-1', name: 'Other'}]);
                        form.$(form.ui.otherCollectionSampleContainer).trigger('control:hidden', false);
                        form.$(form.ui.collectionSample).trigger('control:disabled', false);
                        form.$(form.ui.otherCollectionSample).trigger('control:required', true);
                        form.model.set('collectionSample','-1');

                    }
                    if (uniqueCollectionSample) {
                        form.$(form.ui.collectionSample).trigger('control:disabled', true);
                    }

                    if (specimenListFound) {
                        if (specimenDefault) {
                            form.model.set('specimen', specimenDefault);
                        }
                        form.$(form.ui.otherSpecimenContainer).trigger('control:hidden', true);
                    }

                    //check urgency
                    if (!urgencyListFound) {
                        form.model.set('urgencyList', form.model.get('urgencyListCache'));
                    }
                    updatePickList(form, 'select', 'urgency', form.model.get('urgencyList'));
                    if (urgencyDefault) {
                        form.model.set('urgency', urgencyDefault);
                    }
                    else {
                        form.model.set('urgency', form.model.get('urgencyDefaultCache'));
                    }
                    form.$(form.ui.urgency).trigger('control:disabled', false);

                    //check schedules
                    updatePickList(form, 'select', 'howOften', form.model.get('howOftenListCache'));
                    form.$(form.ui.howOften).trigger('control:disabled', false);
                    if (form.model.get('howOftenDefaultCache')) {
                        form.model.set('howOften', form.model.get('howOftenDefaultCache'));
                    }

                    form.$(form.ui.specimen).trigger('control:disabled', false);
                    if (form.model.get('existingOrder')) {
                        that.processExistingLabOrder(form);
                    }
                    form.hideInProgress();
                    form.$(form.ui.acceptDrpDwnContainer).find('button').attr('disabled', false).removeClass('disabled');
                }
            };

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-pick-list?site=' + siteCode + '&type=lab-sample-specimen-urgency&labTestIEN=' + ien;
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                async: false,
                parse: function(data) {
                    return data.data;
                }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveAllCollectionSamples: function(form) {
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    resp.data.forEach(function(entry) {
                        if (entry.categoryName === 'CollSamp'){
                            updatePickList(form, 'typeahead', 'otherCollectionSample', entry.values);
                            form.$(form.ui.otherCollectionSample).trigger('control:disabled', false);
                        }
                    });
                }
            };

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-pick-list?site=' + siteCode +'&type=lab-all-samples';
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveAllSpecimens: function(form) {
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    updatePickList(form, 'typeahead', 'otherSpecimen', resp.data);
                    form.$(form.ui.otherSpecimen).trigger('control:disabled', false);
                }
            };

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-pick-list?site=' + siteCode + '&type=lab-order-specimens';
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        retrieveImmediateCollection: function(form) {
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    console.log("Immediate Collection:");
                    console.log(resp);
                    var immediateCollection = [];
                    var count = 0;
                    resp.data.forEach(function(entry) {
                        if (entry['text' + count]) {
                            immediateCollection.push(entry['text' + count]);
                        }
                        count++;
                    });
                    form.model.set('immediateCollection', immediateCollection);
                }
            };

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-pick-list?site=' + siteCode + '&type=lab-collect-times';
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        generateInputList: function(model) {
            var collectionSample = model.get('collectionSample').toString() !== "-1" ? model.get('collectionSample').toString() : model.get('otherCollectionSample').toString();
            var specimen = model.get('specimen').toString() !== "-1" ? model.get('specimen').toString() : model.get('otherSpecimen').toString();

            var collectionDateTime = model.get('collectionDateTime');
            var collectionDate = model.get('collectionDate');
            var collectionTime = model.get('collectionTime');

            if (collectionDateTime !== 'TODAY') {
                if (collectionTime !== '0:00' && collectionTime !== '00:00') {
                    collectionDateTime = FilemanDateUtil.getFilemanDateTime(new Date(collectionDate + ' ' + collectionTime));
                }
                else {
                    collectionDateTime = FilemanDateUtil.getFilemanDate(new Date(collectionDate));
                }
            }

            if (model.get('collectionType').toString() === 'LC' && model.get('collectionDateTimePicklist') === 'LO') {
                var futureLabCollectDateTime = model.get('futureLabCollectDate') + ' ' + model.get('futureLabCollectTime');
                collectionDateTime = FilemanDateUtil.getFilemanDateTime(new Date(futureLabCollectDateTime));
            }
            else if (model.get('collectionType').toString() === 'LC') {
                collectionDateTime = model.get('collectionDateTimePicklist').length > 0 ? model.get('collectionDateTimePicklist').substr(1) : "";
            }
            else if (model.get('collectionType').toString() === 'I') {
                var immediateCollectionDateTime = model.get('immediateCollectionDate') + ' ' + model.get('immediateCollectionTime');
                collectionDateTime = FilemanDateUtil.getFilemanDateTime(new Date(immediateCollectionDateTime));
            }

            var inputList = [
                { 'inputKey': AVAILABLE_LAB_TEST, 'inputValue': model.get('availableLabTests').toString() }, //lab test
                { 'inputKey': COLLECTION_SAMPLES, 'inputValue': collectionSample }, //collection sample??
                { 'inputKey': SPECIMEN, 'inputValue': specimen }, //specimen
                { 'inputKey': URGENCY, 'inputValue': model.get('urgency').toString() }, //urgency
                { 'inputKey': COLLECTION_TYPE, 'inputValue': model.get('collectionType').toString()}, //collection type
                { 'inputKey': COLLECTION_DATE_TIME, 'inputValue': collectionDateTime }, //collection date time
                { 'inputKey': HOW_OFTEN, 'inputValue': model.get('howOften').toString() } //frequency
            ];

            if (model.get("howLong") && model.get("howLong")!== ''){
                inputList.push({ 'inputKey': HOW_LONG, 'inputValue': model.get('howLong').toString() }); //frequency)
            }
            return inputList;
        },
        generateCommentList: function(form) {
            var commentList = [];
            if (form.model.get('forTest')) {
                commentList.push({comment: form.model.get('forTest')});
            }
            if (form.model.get('sampleDrawnAt')) {
                commentList.push({comment: form.model.get('sampleDrawnAt')});
            }
            if (form.model.get('additionalComments')) {
                commentList.push({comment: form.model.get('additionalComments')});
            }
            if (form.model.get('anticoagulantText')) {
                commentList.push({comment: form.model.get('anticoagulantText')});
            }
            if (form.model.get('orderCommentText')) {
                commentList.push({comment: form.model.get('orderCommentText')});
            }
            if (form.model.get('doseDrawText')) {
                commentList.push({comment: form.model.get('doseDrawText')});
            }
            return commentList;
        },
        setSpecimenToOther: function(form) {
            updatePickList(form, 'select', 'specimen', [{ ien: '-1', name: 'Other'}]);
            form.model.set('specimen','-1');
            form.$(form.ui.otherSpecimenContainer).trigger('control:hidden', false);
            form.$(form.ui.otherSpecimen).trigger('control:required', true);
        },
        processMaxDays: function(form) {
            //TODO: check location and process max days to disable or enable howOften
        },
        handleCollectionType: function(form) {
            form.$(form.ui.immediateCollectionContainer).trigger('control:hidden', true);
            form.$(form.ui.collectionDateTimePicklist).trigger('control:hidden', true);
            form.$(form.ui.collectionDate).trigger('control:hidden', true);
            form.$(form.ui.collectionTime).trigger('control:hidden', true);
            form.$(form.ui.collectionDate).trigger('control:required', false);
            form.$(form.ui.collectionTime).trigger('control:required', false);
            form.$(form.ui.collectionDateTimePicklist).trigger('control:required', false);
            form.$(form.ui.futureLabCollectTimesContainer).trigger('control:hidden', true);
            switch(form.model.get('collectionType')) {
                case 'WC':
                    form.$(form.ui.collectionDate).trigger('control:hidden', false);
                    form.$(form.ui.collectionTime).trigger('control:hidden', false);
                    form.$(form.ui.collectionDate).trigger('control:disabled', false);
                    form.$(form.ui.collectionTime).trigger('control:disabled', false);
                    form.$(form.ui.collectionDate).trigger('control:required', true);
                    form.$(form.ui.collectionTime).trigger('control:required', true);
                    /* FIGURE OUT WHEN TO USE PICKLIST ON WC
                    if (form.model.get('collectionDateTimeWC') && form.model.get('collectionDateTimeWC').length > 0) {
                        updatePickList(form, 'select', 'collectionDateTime', form.model.get('collectionDateTimeWC'));
                        form.model.set('collectionDateTime', form.model.get('collectionDateTimeWC')[0].code);
                    }
                    */
                break;
                case 'LC':
                    if (form.model.get('collectionDateTimeLC') && form.model.get('collectionDateTimeLC').length > 0) {
                        updatePickList(form, 'select', 'collectionDateTimePicklist', form.model.get('collectionDateTimeLC'));
                        form.model.set('collectionDateTimePicklist', form.model.get('collectionDateTimeLC')[0].code);
                    }
                    form.$(form.ui.collectionDateTimePicklist).trigger('control:hidden', false);
                    form.$(form.ui.collectionDateTimePicklist).trigger('control:disabled', false);
                    form.$(form.ui.collectionDateTimePicklist).trigger('control:required', true);
                break;
                case 'SP':
                    form.$(form.ui.collectionDate).trigger('control:hidden', false);
                    form.$(form.ui.collectionTime).trigger('control:hidden', false);
                    form.$(form.ui.collectionDate).trigger('control:disabled', false);
                    form.$(form.ui.collectionTime).trigger('control:disabled', false);
                    form.$(form.ui.collectionDate).trigger('control:required', true);
                    form.$(form.ui.collectionTime).trigger('control:required', true);
                    /*
                    if (form.model.get('collectionDateTimeSP') && form.model.get('collectionDateTimeSP').length > 0) {
                        updatePickList(form, 'select', 'collectionDateTime', form.model.get('collectionDateTimeSP'));
                        form.model.set('collectionDateTime', form.model.get('collectionDateTimeSP')[0].code);
                    }
                    */
                break;
                case 'I':
                    form.$(form.ui.immediateCollectionContainer).trigger('control:hidden', false);
                    form.$(form.ui.immediateCollection).trigger('control:disabled', false);
                    form.$(form.ui.immediateCollectionDate).trigger('control:disabled', false);
                    form.$(form.ui.immediateCollectionTime).trigger('control:disabled', false);
                break;
            }
        },
        handleCollectionDateTime: function(form) {
            var collectionDateTime = form.model.get('collectionDate');
            if (form.model.get('collectionTime') !== '0:00' && form.model.get('collectionTime') !== '00:00') {
                collectionDateTime += ' ' + form.model.get('collectionTime');
            }
            var filemanDateTime = FilemanDateUtil.getFilemanDateTime(new Date(collectionDateTime));
            form.model.set('collectionDateTime', filemanDateTime);
        },
        handleFutureLabCollectDate: function(form) {
            var that = this;
            var callback = {
                error: function(model, resp) {
                    console.log(resp);
                },
                success: function(model, resp) {
                    form.$(form.ui.futureLabCollectInProgress).trigger('control:hidden', true);
                    var picklist = [];
                    var firstEntry;
                    resp.data.forEach(function(entry){
                        if (entry.indexOf('-1') !== -1) {
                            form.model.set('futureLabCollectErrorMessage', entry.replace('-1^', ''));
                        }
                        else {
                            form.$(form.ui.futureLabCollectTime).trigger('control:hidden', false);
                            var hour = entry.substr(0,2);
                            var minute = entry.substr(2,2);
                            var time = hour + ':' + minute;
                            var label = ' Collection: ' + time;
                            if (parseInt(hour) < 12) {
                                label = 'AM' + label;
                            }
                            else {
                                label = 'PM' + label;
                            }
                            picklist.push({label: label, value: time});
                            if (!firstEntry) {
                                firstEntry = time;
                            }
                        }
                    });
                    updatePickList(form, 'select', 'futureLabCollectTime', picklist);
                    form.model.set('futureLabCollectTime', firstEntry);
                    form.$(form.ui.futureLabCollectTime).trigger('control:size', picklist.length);
                }
            };
            form.model.unset('futureLabCollectErrorMessage');
            updatePickList(form, 'select', 'futureLabCollectTime', []);
            form.$(form.ui.futureLabCollectTime).trigger('control:size', 1);
            form.$(form.ui.futureLabCollectInProgress).trigger('control:hidden', false);
            var dateSelected = FilemanDateUtil.getFilemanDate(new Date(form.model.get('futureLabCollectDate')));

            var siteCode = ADK.UserService.getUserSession().get('site');
            var modelUrl = '/resource/write-health-data/labSupportData?site=' + siteCode + '&type=lab-collect-times&dateSelected=' + dateSelected + '&location=' + form.model.get('location');
            var retrieveModel = Backbone.Model.extend({
                url: modelUrl,
                parse: function(data) {
                return data.data;
              }
            });
            var model = new retrieveModel();
            model.fetch(callback);
        },
        handleCollectionDateTimePicklist: function(form) {
            form.$(form.ui.futureLabCollectTimesContainer).trigger('control:hidden', true);
            form.$(form.ui.futureLabCollectTime).trigger('control:hidden', true);
            form.$(form.ui.futureLabCollectDate).trigger('control:required', false);
            form.$(form.ui.futureLabCollectTime).trigger('control:required', false);
            if (form.model.get('collectionDateTimePicklist') === 'LO') {
                form.$(form.ui.futureLabCollectTimesContainer).trigger('control:hidden', false);
                form.$(form.ui.futureLabCollectDate).trigger('control:required', true);
                form.$(form.ui.futureLabCollectTime).trigger('control:required', true);
                form.model.set('futureLabCollectDate', moment().format('MM/DD/YYYY'));
            }
        },
        handleUrgency: function(form) {
            if (form.model.get('urgencyList')) {
                var selectedUrgency = $.grep(form.model.get('urgencyList'), function(e) {
                    return e.ien === form.model.get('urgency') || e.code === form.model.get('urgency');
                });
                if (selectedUrgency && selectedUrgency[0]){
                    form.model.set('urgencyText', selectedUrgency[0].name);
                }
            }
        },
        handleSpecimen: function(form) {
            this.updateSpecimenText(form);
        },
        handleCollectionSample: function(form) {
            var collectionSampleListCache =  form.model.get('collectionSampleListCache');
            if (collectionSampleListCache) {
                var selectedCollectionSample = $.grep(collectionSampleListCache, function(e) {
                    return e.ien == form.model.get('collectionSample');
                });
                if (selectedCollectionSample.length > 0) {
                    if (selectedCollectionSample[0].text) {
                        form.model.set('alertMessage', selectedCollectionSample[0].text);
                    }
                    if (selectedCollectionSample[0].unused1 && selectedCollectionSample[0].unused1 !== '') {
                        this.handleReqCom(form, selectedCollectionSample[0].unused1);
                    }
                    if (selectedCollectionSample[0].unused2 && selectedCollectionSample[0].unused2 !== '') {
                        this.handleReqCom(form, selectedCollectionSample[0].unused2);
                    }
                    if (selectedCollectionSample[0].unused3 && selectedCollectionSample[0].unused3 !== '') {
                        this.handleReqCom(form, selectedCollectionSample[0].unused3);
                    }

                    var specimenListCache = form.model.get('specimenListCache');
                    if (selectedCollectionSample[0].specPtr === '') {
                        this.setSpecimenToOther(form);
                    }
                    else if (specimenListCache) {
                        updatePickList(form, 'select', 'specimen', specimenListCache);
                        form.model.set('specimen', selectedCollectionSample[0].specPtr);
                        form.model.set('specimenText', selectedCollectionSample[0].specName);
                        form.$(form.ui.otherSpecimenContainer).trigger('control:hidden', true);
                    }
                    else {
                        updatePickList(form, 'select', 'specimen', [{ ien: selectedCollectionSample[0].specPtr, name: selectedCollectionSample[0].specName}]);
                        form.model.set('specimen', selectedCollectionSample[0].specPtr);
                        form.model.set('specimenText', selectedCollectionSample[0].specName);
                        form.$(form.ui.otherSpecimenContainer).trigger('control:hidden', true);
                    }
                }
                this.updateCollectionSampleText(form);
            }
            else {
                this.setSpecimenToOther(form);
            }

        },
        handleHowOften: function(form) {
            var selectedHowOften = $.grep(form.model.get('howOftenListCache'), function(e) {
                return e.code === form.model.get('howOften');
            });
            if (selectedHowOften && selectedHowOften[0]) {
                if (selectedHowOften[0].frequencyType === "O") {
                    form.$(form.ui.howLong).trigger('control:disabled', true);
                    form.model.unset('howLong');
                } else {
                    form.$(form.ui.howLong).trigger('control:disabled', false);
                }
                form.model.set('howOftenText', selectedHowOften[0].name);
            }
        },
        handleReqCom: function(form, reqCom) {
            switch (reqCom) {
                case 'ANTICOAGULATION':
                    form.$(form.ui.anticoagulant).trigger('control:hidden', false);
                    form.$(form.ui.anticoagulant).trigger('control:disabled', false);
                break;
                case 'TDM (PEAK-TROUGH)':
                    form.$(form.ui.sampleDrawnAtContainer).trigger('control:hidden', false);
                    form.$(form.ui.sampleDrawnAt).trigger('control:disabled', false);
                    form.$(form.ui.additionalCommentsContainer).trigger('control:hidden', false);
                    form.$(form.ui.additionalComments).trigger('control:disabled', false);
                break;
                case 'DOSE/DRAW TIMES':
                    form.$(form.ui.doseContainer).trigger('control:hidden', false);
                    form.$(form.ui.doseDate).trigger('control:disabled', false);
                    form.$(form.ui.doseTime).trigger('control:disabled', false);
                    form.model.set('doseTime', '0:00');
                    form.$(form.ui.drawContainer).trigger('control:hidden', false);
                    form.$(form.ui.drawDate).trigger('control:disabled', false);
                    form.$(form.ui.drawTime).trigger('control:disabled', false);
                    form.model.set('drawTime', '0:00');
                break;
                case 'ORDER COMMENT':
                    form.$(form.ui.orderComment).trigger('control:hidden', false);
                    form.$(form.ui.orderComment).trigger('control:disabled', false);
                break;
            }
        },
        handleDoseDrawTimes: function(form, doseDrawTimes) {
            var doseText = "";
            var drawText = "";
            if (form.model.get('doseDate')) {
                form.model.set('forTest', '~For Test: ' + form.model.get('labTestText'));
                doseText = "~Last dose: " + form.model.get('doseDate') + " " + form.model.get('doseTime');
            }
            if (form.model.get('drawDate')) {
                form.model.set('forTest', '~For Test: ' + form.model.get('labTestText'));
                drawText = "  draw time: " + form.model.get('drawDate') + " " + form.model.get('drawTime');
            }
            else if (form.model.get('doseDate')) {
                drawText = "  draw time: UNKNOWN";
            }
            form.model.set('doseDrawText', doseText + drawText);
        },
        handleOrderComment: function(form) {
            form.model.set('forTest', '~For Test: ' + form.model.get('labTestText'));
            form.model.set('orderCommentText', '~' + form.model.get('orderComment'));
        },
        handleSampleDrawnAt: function(form) {
            form.model.set('forTest', '~For Test: ' + form.model.get('labTestText'));
        },
        handleAnticoagulant: function(form) {
            form.model.set('forTest', '~For Test: ' + form.model.get('labTestText'));
            form.model.set('anticoagulantText', '~ANTICOAGULANT: ' + form.model.get('anticoagulant'));
        },
        handleAlertMessage: function(form, message) {
            if (message) {
                form.model.set('alertMessage', message);
            }
        },
        updateSpecimenText: function(form) {
            if (form.model.get('specimen') && form.model.get('specimen') != -1) {
                form.model.set('specimenText', form.$(form.ui.specimen).find('select').find(":selected").text());
            }
            else {
                form.model.set('specimenText', form.$(form.ui.otherSpecimen).find('#otherSpecimen').val());
            }
        },
        updateCollectionSampleText: function(form) {
            if (form.model.get('collectionSample') && form.model.get('collectionSample') !== '-1') {
                form.model.set('collectionSampleText', form.$(form.ui.collectionSample).find('select').find(":selected").text());
            }
            else {
                form.model.set('collectionSampleText', form.$(form.ui.otherCollectionSample).find('#otherCollectionSample').val());
            }
        }
    };

    return writebackUtils;
});
