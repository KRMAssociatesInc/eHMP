define([
    'handlebars',
    "backbone",
    "marionette",
    "underscore",
    "main/components/sign/confirmationView",
    "hbs!main/components/sign/signListTemplate",
    "hbs!main/components/sign/signFooterTemplate",
    "hbs!main/components/sign/signHeaderTemplate",
    'api/ResourceService',
    'moment'
], function(Handlebars, Backbone, Marionette, _, ConfirmationView, signListTemplate, signFooterTemplate, signHeaderTemplate, ResourceService, moment) {
    'use strict';
    var CIPHER_PAD = [
        'wkEo-ZJt!dG)49K{nX1BS$vH<&:Myf*>Ae0jQW=;|#PsO`\'%+rmb[gpqN,l6/hFC@DcUa ]z~R}"V\\iIxu?872.(TYL5_3',
        'rKv`R;M/9BqAF%&tSs#Vh)dO1DZP> *fX\'u[.4lY=-mg_ci802N7LTG<]!CWo:3?{+,5Q}(@jaExn$~p\\IyHwzU"|k6Jeb',
        '\\pV(ZJk"WQmCn!Y,y@1d+~8s?[lNMxgHEt=uw|X:qSLjAI*}6zoF{T3#;ca)/h5%`P4$r]G\'9e2if_>UDKb7<v0&- RBO.',
        'depjt3g4W)qD0V~NJar\\B "?OYhcu[<Ms%Z`RIL_6:]AX-zG.#}$@vk7/5x&*m;(yb2Fn+l\'PwUof1K{9,|EQi>H=CT8S!',
        'NZW:1}K$byP;jk)7\'`x90B|cq@iSsEnu,(l-hf.&Y_?J#R]+voQXU8mrV[!p4tg~OMez CAaGFD6H53%L/dT2<*>"{\\wI=',
        'vCiJ<oZ9|phXVNn)m K`t/SI%]A5qOWe\\&?;jT~M!fz1l>[D_0xR32c*4.P"G{r7}E8wUgyudF+6-:B=$(sY,LkbHa#\'@Q',
        'hvMX,\'4Ty;[a8/{6l~F_V"}qLI\\!@x(D7bRmUH]W15J%N0BYPkrs&9:$)Zj>u|zwQ=ieC-oGA.#?tfdcO3gp`S+En K2*<',
        'jd!W5[];4\'<C$/&x|rZ(k{>?ghBzIFN}fAK"#`p_TqtD*1E37XGVs@0nmSe+Y6Qyo-aUu%i8c=H2vJ\\) R:MLb.9,wlO~P',
        '2ThtjEM+!=xXb)7,ZV{*ci3"8@_l-HS69L>]\\AUF/Q%:qD?1~m(yvO0e\'<#o$p4dnIzKP|`NrkaGg.ufCRB[; sJYwW}5&',
        'vB\\5/zl-9y:Pj|=(R\'7QJI *&CTX"p0]_3.idcuOefVU#omwNZ`$Fs?L+1Sk<,b)hM4A6[Y%aDrg@~KqEW8t>H};n!2xG{',
        'sFz0Bo@_HfnK>LR}qWXV+D6`Y28=4Cm~G/7-5A\\b9!a#rP.l&M$hc3ijQk;),TvUd<[:I"u1\'NZSOw]*gxtE{eJp|y (?%',
        'M@,D}|LJyGO8`$*ZqH .j>c~h<d=fimszv[#-53F!+a;NC\'6T91IV?(0x&/{B)w"]Q\\YUWprk4:ol%g2nE7teRKbAPuS_X',
        '.mjY#_0*H<B=Q+FML6]s;r2:e8R}[ic&KA 1w{)vV5d,$u"~xD/Pg?IyfthO@CzWp%!`N4Z\'3-(o|J9XUE7k\\TlqSb>anG',
        'xVa1\']_GU<X`|\\NgM?LS9{"jT%s$}y[nvtlefB2RKJW~(/cIDCPow4,>#zm+:5b@06O3Ap8=*7ZFY!H-uEQk; .q)i&rhd',
        'I]Jz7AG@QX."%3Lq>METUo{Pp_ |a6<0dYVSv8:b)~W9NK`(r\'4fs&wim\\kReC2hg=HOj$1B*/nxt,;c#y+![?lFuZ-5D}',
        'Rr(Ge6F Hx>q$m&C%M~Tn,:"o\'tX/*yP.{lZ!YkiVhuw_<KE5a[;}W0gjsz3]@7cI2\\QN?f#4p|vb1OUBD9)=-LJA+d`S8',
        'I~k>y|m};d)-7DZ"Fe/Y<B:xwojR,Vh]O0Sc[`$sg8GXE!1&Qrzp._W%TNK(=J 3i*2abuHA4C\'?Mv\\Pq{n#56LftUl@9+',
        '~A*>9 WidFN,1KsmwQ)GJM{I4:C%}#Ep(?HB/r;t.&U8o|l[\'Lg"2hRDyZ5`nbf]qjc0!zS-TkYO<_=76a\\X@$Pe3+xVvu',
        'yYgjf"5VdHc#uA,W1i+v\'6|@pr{n;DJ!8(btPGaQM.LT3oe?NB/&9>Z`-}02*%x<7lsqz4OS ~E$\\R]KI[:UwC_=h)kXmF',
        '5:iar.{YU7mBZR@-K|2 "+~`M%8sq4JhPo<_X\\Sg3WC;Tuxz,fvEQ1p9=w}FAI&j/keD0c?)LN6OHV]lGy\'$*>nd[(tb!#'
    ];

    var SignFooterView = Backbone.Marionette.ItemView.extend({
        template: signFooterTemplate,
        events: {
            'click #CancelSignBtn': 'cancelSign',
            'click #SignBtn': 'sign',
        },
        cancelSign: function() {
            ADK.UI.Modal.hide();
        },
        initialize: function(options) {
            this.template = options.template;
            this.model = options.model;
            this.originalModel = options.originalModel;
            this.callback = options.callback;
        },
        validateCheckboxes: function() {
            //check checkboxes values
            var check = false;
            if (this.model.attributes.groups['Medication, Outpatient']) {
                _.forEach(_.where(this.model.attributes.groups['Medication, Outpatient'], {
                    selected: true
                }), function(value, key) {
                    _.each(value, function(item) {
                        if (item === null) check = true;
                    });
                });
            }
            return check;
        },
        buildReturnModel: function(model, originalModel) {
            var selectedItems = [];
            var selectedUids = [];
            var returnItems = [];

            originalModel.set('patientInfo', model.get('patientInfo'));

            _.each(model.get('groups'), function(item) {
                selectedItems = _.union(selectedItems, _.where(item, {
                    'selected': true
                }));
            });
            selectedItems = _.map(selectedItems, function(v, k) {
                var factors = model.get('patientInfo').outpatient_med_related_to;
                var ret = {
                    'uid': v.uid
                };
                _.each(factors, function(f, key) {
                    if (!_.isUndefined(v[key])) {
                        if (!ret.factors) {
                            ret.factors = {};
                        }
                        ret.factors[key] = v[key];
                    }
                });
                return ret;
            });
            selectedUids = _.pluck(selectedItems, 'uid');
            returnItems = _.filter(originalModel.get('items'), function(item) {
                return _.contains(selectedUids, item.uid);
            });
            //adding the factors
            returnItems = _.map(returnItems, function(item) {
                item.factors = _.findWhere(selectedItems, {
                    'uid': item.uid
                }).factors;
                return item;
            });
            originalModel.set('items', returnItems);
            return originalModel;
        },
        sign: function() {
            var self = this;
            this.$('#SignBtn').addClass('disabled');
            this.$('#CancelSignBtn').addClass('disabled');
            var signatureCode = $('#SignatureCode').val();
            var encryptedSignatureCode = self.buildEncryptedParamString(signatureCode);

            var order, signOrderUrl, split, locationIEN;

            var visit = ADK.PatientRecordService.getCurrentPatient().get('visit');
            if (visit !== undefined && visit.localId !== undefined) {
                split = visit.localId.split(';');
                locationIEN = _.last(split);
            } else {
                var signAlertView = new ADK.UI.Notification({
                    title: 'Signing not complete',
                    icon: 'fa-exclamation-circle',
                    message: 'The signing failed because there was no visit set.'
                });
                ADK.UI.Modal.hide();
                signAlertView.show();
                if (this.callback) {
                    this.callback('No visit set!');
                }
                return;
            }

            split = this.originalModel.attributes.items[0].pid.split(';');
            var pid = _.last(split);
            if (this.model.attributes.groups.Documents) {

                var note = {
                    "param": {
                        "signatureCode": encryptedSignatureCode,
                        "note": this.originalModel.attributes.items[0],
                        "patientIEN": pid
                    }
                };

                var signNoteUrl = 'resource/write-health-data/writeback/notes/sign';
                $.ajax({
                    url: signNoteUrl,
                    type: 'POST',
                    data: JSON.stringify(note),
                    contentType: 'application/json',
                    dataType: 'json',
                    callback: this.callback,
                    success: function(data, statusMessage, xhr) {
                        var signAlertView = new ADK.UI.Notification({
                            title: 'Signing complete',
                            icon: 'fa-check',
                            type: 'success',
                            message: 'The signing succeded.'
                        });
                        ADK.UI.Modal.hide();
                        signAlertView.show();
                        if (this.callback) {
                            this.callback(data);
                        }
                    },
                    error: function(data) {
                        var signAlertView = new ADK.UI.Notification({
                            title: 'Signing not complete',
                            icon: 'fa-exclamation-circle',
                            message: 'The signing of the specified note failed.'
                        });
                        ADK.UI.Modal.hide();
                        signAlertView.show();
                        if (this.callback) {
                            this.callback(data);
                        }
                    }
                });



            } else {
                if (this.model.attributes.groups['Medication, Outpatient']) {
                    if (this.validateCheckboxes()) {

                        if (!confirm('There are unselected treatment factors.\nAre you sure you want to continue with signing?'))
                            return false;
                        else {
                            //perform the callback
                            order = {
                                "param": {
                                    "signatureCode": encryptedSignatureCode,
                                    "order": this.originalModel.attributes.items[0],
                                    "locationIEN": locationIEN,
                                    "patientIEN": pid
                                }
                            };
                            signOrderUrl = '/resource/write-health-data/writeback/orders/sign';

                            $.ajax({
                                url: signOrderUrl,
                                type: 'POST',
                                data: JSON.stringify(order),
                                contentType: 'application/json',
                                dataType: 'json',
                                callback: this.callback,
                                success: function(data, statusMessage, xhr) {
                                    var signAlertView = new ADK.UI.Notification({
                                        title: 'Signing complete',
                                        icon: 'fa-check',
                                        type: 'success',
                                        message: 'The signing succeded.'
                                    });
                                    ADK.UI.Modal.hide();
                                    signAlertView.show();
                                    if (this.callback) {
                                        this.callback(data);
                                    }
                                },
                                error: function(data) {
                                    var signAlertView = new ADK.UI.Notification({
                                        title: 'Signing not complete',
                                        icon: 'fa-exclamation-circle',
                                        message: 'The signing of the specified order failed.'
                                    });
                                    ADK.UI.Modal.hide();
                                    signAlertView.show();
                                    if (this.callback) {
                                        this.callback(data);
                                    }
                                }
                            });

                        }
                    }
                } else {
                    order = {
                        "param": {
                            "signatureCode": encryptedSignatureCode,
                            "order": this.originalModel.attributes.items[0],
                            "locationIEN": locationIEN,
                            "patientIEN": pid
                        }
                    };
                    signOrderUrl = '/resource/write-health-data/writeback/orders/sign';

                    $.ajax({
                        url: signOrderUrl,
                        type: 'POST',
                        data: JSON.stringify(order),
                        contentType: 'application/json',
                        dataType: 'json',
                        callback: this.callback,
                        success: function(data, statusMessage, xhr) {
                            var signAlertView = new ADK.UI.Notification({
                                title: 'Signing complete',
                                icon: 'fa-check',
                                type: 'success',
                                message: 'The signing succeded.'
                            });
                            ADK.UI.Modal.hide();
                            signAlertView.show();
                            if (this.callback) {
                                this.callback(data);
                            }
                        },
                        error: function(data) {
                            var signAlertView = new ADK.UI.Notification({
                                title: 'Signing not complete',
                                icon: 'fa-exclamation-circle',
                                message: 'The signing of the specified order failed.'
                            });
                            ADK.UI.Modal.hide();
                            signAlertView.show();
                            if (this.callback) {
                                this.callback(data);
                            }
                        }
                    });
                }
            }
        },
        buildEncryptedParamString: function(valueString, assocIndex, idIndex) {
            if (assocIndex < 0 || assocIndex >= CIPHER_PAD.length ||
                idIndex < 0 || idIndex >= CIPHER_PAD.length) {
                throw new Error(util.format('Encryption Indexes must be from 0 to %s inclusive', (CIPHER_PAD.length - 1)));
            }

            if (assocIndex === null || assocIndex === undefined || idIndex === null || idIndex === undefined) {
                assocIndex = _.random(0, 9);
                idIndex = _.random(0, 9);

                while (assocIndex === idIndex) {
                    idIndex = _.random(0, 9);
                }
            }

            var assocStr = CIPHER_PAD[assocIndex];
            var idStr = CIPHER_PAD[idIndex];

            var encryptedValue = Array.prototype.reduce.call(valueString, function(first, second) {
                var pos = assocStr.indexOf(second);
                return first + (pos === -1 ? second : idStr.charAt(pos));
            }, '');


            var encryptedString = String.fromCharCode(assocIndex + 32) + encryptedValue + String.fromCharCode(idIndex + 32);

            // return buildLiteralParamString(encryptedString);
            return encryptedString;
        }
    });

    var SignView = Backbone.Marionette.LayoutView.extend({
        fetchOptions: {},
        events: {
            'click .item-selected': 'selectRow',
            'click div[data-category]': 'checkAll',
            'input input[type=password]': 'setStateSignButton',
            'change input[type=radio]': 'changeRelatedTo',
        },
        initialize: function(options) {
            this.template = signListTemplate;
            this.model = options.model;
            this.originalModel = this.model.clone();
            this.callback = options.callback;
        },
        getHeaderView: function(model) {
            var View = Backbone.Marionette.ItemView.extend({
                template: signHeaderTemplate,
                model: model
            });
            return View;
        },
        footer: {},
        modelChangeEvent: false,
        getFooterView: function(model) {
            this.footer = new SignFooterView({
                model: this.model,
                originalModel: this.originalModel,
                template: signFooterTemplate,
                callback: this.callback
            });
            return this.footer;
        },
        modelChanged: function(model, value) {
            this.footer.model = this.model;
        },
        changeRelatedTo: function(e) {
            var $target = $(e.currentTarget);
            if ($target[0].checked) {
                var category = $target.data("category");
                var flag = $target.data("status");
                var $par = $target.parents('.each-row');
                var uid = $par.data('uid');
                var item = this.model.attributes.getItem(uid);
                item[category] = flag === 'yes';
            }
        },
        checkAll: function(e) {
            var $target = $(e.currentTarget);
            var category = $target.data("category");
            var flag = $target.data("status");
            flag = !flag;
            $target.data("status", flag);
            var found = $('.inside-row').find('[data-category=' + category + ']').not('[disabled]');

            _.forEach(this.model.attributes.groups, function(group, key) {
                if (key === 'Medication, Outpatient') {
                    _.each(group, function(item) {
                        if (item.selected === true) item[category] = flag;
                    });
                }
            });
            found.filter('[data-status]').each(function() {
                this.checked = $(this).data('status') === (flag ? 'yes' : 'no');
            });
        },
        selectRow: function(e) {
            $('#resultSignCount').text($('.item-selected:checked').length + ' / ' + this.model.attributes.totalItems);
            this.model.set('selectedItems', $('.item-selected:checked').length);

            var $chk = $(e.currentTarget);
            var $par = $chk.parents('.each-row');
            var checked = e.currentTarget.checked;
            var uid = $par.data('uid');
            var item = this.model.attributes.getItem(uid);
            item.selected = !!checked;

            if (!checked) {
                $par.addClass('disabled-row');
                $par.find('.inside-row :radio').attr('disabled', 'disabled');
            } else {
                $par.removeClass('disabled-row');
                $par.find('.inside-row :radio').removeAttr('disabled');
            }
            this.setStateSignButton();
            return true;
        },
        setStateSignButton: function(e) {
            if ($('.signature-code').val() && this.model.get('selectedItems') > 0) {
                $('button.find-it').removeAttr('disabled');
            } else {
                $('button.find-it').attr('disabled', 'disabled');
            }
        },
        onDestroy: function() {
            $('body').off('click', '.item-selected');
        },
        parseModel: function(model) {
            var patient = ResourceService.patientRecordService.getCurrentPatient();
            var parsedModel = {};
            parsedModel.patientInfo = {
                serviceConnected: patient.attributes.serviceConnected,
                scPercent: patient.attributes.scPercent,
                disabilities: [],
                outpatient_med_related_to: {
                    SC: true
                }
            };


            parsedModel.patientInfo.disabilities = _.map(patient.attributes.disability, function(dis) {
                return {
                    name: dis.name,
                    scPercent: dis.disPercent,
                    serviceConnected: dis.serviceConnected
                };
            });

            _.each(patient.attributes.exposure, function(exp) {
                switch (exp.uid) {
                    case 'urn:va:agent-orange:Y':
                        parsedModel.patientInfo.outpatient_med_related_to.AO = true;
                        break;
                    case 'urn:va:ionizing-radiation:Y':
                        parsedModel.patientInfo.outpatient_med_related_to.IR = true;
                        break;
                    case 'urn:va:sw-asia:Y':
                        parsedModel.patientInfo.outpatient_med_related_to.SWAC = true;
                        break;
                    case 'urn:va:head-neck-cancer:Y':
                        parsedModel.patientInfo.outpatient_med_related_to.HNC = true;
                        break;
                    case 'urn:va:mst:Y':
                        parsedModel.patientInfo.outpatient_med_related_to.MST = true;
                        break;
                    case 'urn:va:combat-vet:Y':
                        parsedModel.patientInfo.outpatient_med_related_to.CV = true;
                        break;
                }
            });

            var originalModel = model;
            var mappedModel = _.map(originalModel.attributes.items, function(item) {
                if (this.attributes.items.length === 1 && this.attributes.items[0].uid === undefined) {
                    item.uid = 'urn:va:document:' + item.pid + ':1';
                }
                var modifiedItem = {
                    selected: true,
                    uid: item.uid,
                    description: item.content
                };

                if (item.uid.indexOf('document') > -1)
                    modifiedItem.kind = 'Documents';
                else
                    modifiedItem.kind = item.kind;

                if (modifiedItem.kind === 'Medication, Outpatient') {
                    _.forEach(parsedModel.patientInfo.outpatient_med_related_to, function(n, key) {
                        modifiedItem[key] = null;
                    });
                } else if (modifiedItem.kind === 'Documents') {
                    modifiedItem.description = item.summary;
                    var dateToDisplay = {};
                    if (item.stampTime !== undefined) {
                        dateToDisplay = item.stampTime;
                    } else {
                        if (item.text !== undefined && item.text.length > 0 && item.text[0].dateTime !== undefined)
                            dateToDisplay = item.text[0].dateTime;
                    }
                    modifiedItem.date = moment(dateToDisplay, 'YYYYMMDDHHmmss').format('MM/DD/YYYY HH:mm');
                }

                return modifiedItem;
            }, originalModel);
            parsedModel.totalGroups = 0;
            parsedModel.totalItems = mappedModel.length;
            parsedModel.selectedItems = mappedModel.length;
            parsedModel.groups = _.groupBy(mappedModel, 'kind');
            parsedModel.getItem = function(uid) {
                var foundItem;
                for (var g in this.groups) {
                    foundItem = _.findWhere(this.groups[g], {
                        uid: uid
                    });
                    if (foundItem) {
                        break;
                    }
                }
                return foundItem;
            };

            var key;
            for (key in parsedModel.groups) {
                if (parsedModel.groups.hasOwnProperty(key)) parsedModel.totalGroups++;
            }

            var SignListModel = Backbone.Model.extend({});
            var retModel = new SignListModel({});
            _.each(parsedModel, function(item, key) {
                retModel.set(key, item);
            });
            return retModel;
        },
        onBeforeRender: function() {
            this.model = this.parseModel(this.model);
            if (!this.modelChangeEvent) {
                this.listenTo(this.model, "change", this.modelChanged);
            }
            this.footer.model = this.model;
            this.modelChangeEvent = true;
        },
        onRender: function(event) {
            var $ctx = this.$el;
            $('body').on('mouseenter focus', '#help-tooltip, .checkbox-title', function(event) {
                $ctx.find('#help-tooltip').tooltip({
                    html: true,
                    'delay': {
                        'show': 500,
                        'hide': 100
                    }
                });

                $(event.currentTarget).data('bs.tooltip').options.placement = 'right';
            });
        },
    });


    return SignView;
});