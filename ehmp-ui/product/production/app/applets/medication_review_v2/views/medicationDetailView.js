define([
    "backbone",
    "marionette",
    "hbs!app/applets/medication_review_v2/templates/medicationTemplate",
    "app/applets/medication_review_v2/views/orderDetailView",
    "hbs!app/applets/medication_review_v2/templates/orderHistoryTemplate",
    "hbs!app/applets/medication_review_v2/templates/infoButtonTemplate",
    "hbs!app/applets/medication_review_v2/templates/infoButtonTemplate2",
    "hbs!app/applets/medication_review_v2/templates/infoButtonPatientTemplate",
    "app/applets/medication_review_v2/appletHelper"
],function(Backbone, Marionette, medicationTemplate, OrderDetailView, orderHistoryTemplate, infoButtonTemplate, infoButtonTemplate2, infoButtonPatientTemplate, appletHelper) {

    var parent;
    var singleOrderView = Backbone.Marionette.ItemView.extend({
        template: orderHistoryTemplate,
        tagName: "li",
        className: "order-dates-range",
        attributes: {
            // "tabindex": 0,
            "role": "listitem"
        },
        initialize: function() {
            this.parentView = parent;
            //this.model.pickUpType = this.parentView.pickUpType;
        },
        events: {
            'click': 'updateDetailView',
            'click .order-dates': 'selectOrder',
            'keydown .order-dates': 'onEnter'
        },
        updateDetailView: function(e) {
            e.preventDefault();
            this.parentView.updateDetailView(this.model);
            this.selectOrder();
        },
        selectOrder: function() {
            $(this.parentView.$el).find('.selectedOrder').removeClass('selectedOrder');
            $(this.$el).addClass('selectedOrder');
        },
        onEnter: function(event) {
            if (event.which == 13 || event.which == 32) {
                $(event.target).click();
            }
        }

    });
    var orderHistoryView = Backbone.Marionette.CollectionView.extend({
        tagName: "ul",
        attributes: {
            "role": "list"
        },
        className: "orders-links-list",
        childView: singleOrderView,
        onRender: function() {
            $(this.$el).find('li').first().addClass('selectedOrder');
        }
    });

    var InfoButtonModel = Backbone.Model.extend({
        defaults: {
            url: ""
        },
        parse: function(response) {
            return response;
        }
    });


    var infoButtonModel = new InfoButtonModel({});

    var InfoButtonView = Backbone.Marionette.ItemView.extend({
        onRender: function() {}
    });

    var InfoButtonPatientModel = Backbone.Model.extend({
        defaults: {
            url: ""
        },
        parse: function(response) {
            return response;
        }
    });

    var InfoButtonPatientView = Backbone.Marionette.ItemView.extend({
        onRender: function() {}
    });

    var infoButtonPatientModel = new InfoButtonPatientModel({});

    var MedicationItemView = Backbone.Marionette.LayoutView.extend({
        initialize: function() {
            this._super = Backbone.Marionette.LayoutView.prototype;
            parent = this;
            if (this.model.get("submeds")) {
                this.collection = this.model.get("submeds");
            } else {
                this.collection = this.model.get("meds");
            }
            this.orderHistoryListView = new orderHistoryView({
                collection: this.collection,
                parentLayoutView: parent
            });

            this.orderDetailView = new OrderDetailView({
                model: this.collection.models[0]
            });

            var session = ADK.UserService.getUserSession();
            var oid = session.get("infoButtonOid");

            if (oid == "1.3.6.1.4.1.3768") {

                this.infoButtonView = new InfoButtonView({
                    model: infoButtonModel,
                    template: infoButtonTemplate
                });
                this.infoButtonPatientView = new InfoButtonPatientView({
                    model: infoButtonPatientModel,
                    template: infoButtonPatientTemplate
                });
            } else if (oid === undefined) {
                oid = "1.3.6.1.4.1.3768";
                this.infoButtonView = new InfoButtonView({
                    model: infoButtonModel,
                    template: infoButtonTemplate
                });
                this.infoButtonPatientView = new InfoButtonPatientView({
                    model: infoButtonPatientModel,
                    template: infoButtonPatientTemplate
                });
            } else {
                this.infoButtonView = new InfoButtonView({
                    model: infoButtonModel,
                    template: infoButtonTemplate2,
                });
                this.infoButtonPatientView = new InfoButtonPatientView({
                    model: infoButtonPatientModel,
                    template: infoButtonTemplate2
                });
            }

            var name = this.orderDetailView.model.get("name");
            //console.log("name = " + name);
            //var n = name.search(/,|[0-9]|((EXPIRED))/);
            var n = name.search(/,|[0-9]/);
            if (n > 0) {
                name = name.substr(0, n);
            }
            n = name.search(" tab");
            if (n != -1) {
                name = name.substr(0, n);
            }
            n = name.search(" cap");
            if (n != -1) {
                name = name.substr(0, n);
            }
            n = name.search(" inj");
            if (n != -1) {
                name = name.substr(0, n);
            }
            n = name.search(" soln");
            if (n != -1) {
                name = name.substr(0, n);
            }
            n = name.search(" aerosol");
            if (n != -1) {
                name = name.substr(0, n);
            }
            n = name.search(" drip");
            if (n != -1) {
                name = name.substr(0, n);
            }
            n = name.search(" oral");
            if (n != -1) {
                name = name.substr(0, n);
            }

            // remove spaces from medication
            while (name.search(" ") != -1) {
                name = name.replace(" ", "%20");
            }
            //console.log("shortName = " + name);

            // Provider infobutton request
            //var urlProv = "http://infobutton.vainnovations.us:8080/infobutton-service/infoRequest?representedOrganization.id.root=1.3.6.1.4.1.3768";
            var urlProv = "/infobutton-service/infoRequest?representedOrganization.id.root=" + oid;
            urlProv += "&taskContext.c.c=MLREV";
            urlProv += "&mainSearchCriteria.v.dn=";
            urlProv += name;
            urlProv += "&informationRecipient=PROV";
            urlProv += "&informationRecipient.languageCode.c=en";
            urlProv += "&performer=healthcareProvider";
            urlProv += "&xsltTransform=Infobutton_UI_VA";

            // Patient education infobutton request
            //var urlPat = "http://invobutton.vainnovations.us:8080/infobutton-service/infoRequest?representedOrganization.id.root=1.3.6.1.4.1.3768";
            var urlPat = "/infobutton-service/infoRequest?representedOrganization.id.root=" + oid;
            urlPat += "&taskContext.c.c=MLREV";
            urlPat += "&mainSearchCriteria.v.dn=";
            urlPat += name;
            urlPat += "&informationRecipient=PAT";
            urlPat += "&informationRecipient.languageCode.c=en";
            urlPat += "&performer=healthcareProvider";
            urlPat += "&xsltTransform=Infobutton_UI_VA";

            //console.log("url = " + url);

            // Make the actual CORS request.
            var result2;

            function makeCorsRequest(url) {
                    //console.log("inside makeCorsRequest");
                    //console.log("url = " + url);

                    var xhr = createCORSRequest('GET', url);
                    if (!xhr) {
                        //console.log('CORS not supported');
                        return;
                    }

                    function createCORSRequest(method, url) {
                        //console.log("inside createCORSRequest");
                        var xhr = new XMLHttpRequest();
                        if ("withCredentials" in xhr) {
                            //console.log("inside if withCredentials");
                            // Check if the XMLHttpRequest object has a "withCredentials" property.
                            // "withCredentials" only exists on XMLHTTPRequest2 objects.
                            xhr.open(method, url, true);
                            //console.log("after xhr.open");

                        } else if (typeof XDomainRequest != "undefined") {
                            //console.log("inside else if typeof");
                            // Otherwise, check if XDomainRequest.
                            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                            xhr = new XDomainRequest();
                            xhr.open(method, url);
                            //console.log("after xhr.open");

                        } else {
                            //console.log("inside else");

                            // Otherwise, CORS is not supported by the browser.
                            xhr = null;

                        }
                        //console.log("xhr = " + xhr);
                        return xhr;
                    }

                    //console.log ("before xhr.onload");
                    // Response handlers.
                    xhr.onload = function() {
                        //console.log("inside xhr.onload");
                        var text = xhr.responseText;
                        var subtext = text.match(/setContent\(([^)]+)\)/g);
                        if (subtext !== null) {
                            // chop off setcont(' from beginning of subtext
                            for (var i = 0; i < subtext.length; i++) {
                                subtext[i] = subtext[i].substr(12, subtext[i].length - 1);
                            }
                            // trim off ) at end of subtext
                            for (i = 0; i < subtext.length; i++) {
                                subtext[i] = subtext[i].substr(0, subtext[i].length - 2);
                                //console.log('subtext[' + i + '] = ' + subtext[i]);
                            }
                        }

                        var subtext2 = text.match(/<h3>([^<]+)/g);
                        if (subtext2 !== null) {
                            //Trim off the <h3> of subtext2
                            for (var j = 0; j < subtext2.length; j++) {
                                subtext2[j] = subtext2[j].substr(4, subtext2[j].length - 1);
                            }
                            //console.log("subtext2 = " + subtext2);
                        }
                        if (subtext !== null) {
                            result = new Array(subtext.length);
                            for (var k = 0; k < subtext.length; k++) {
                                result[k] = subtext[k];
                                //console.log('result[' + i + '] = ' + result[i]);
                            }
                            //console.log("Result = " + result);
                        }

                    };
                    xhr.onerror = function() {
                        console.log('Woops, there was an error making the request.');
                    };
                    xhr.send();
                }
                //console.log("calling MakeCorsRequest for provider info request");
                //makeCorsRequest(urlProv);

            var urls = [];
            var siteNames = [];
            urls[0] = "http://clinicalpharmacology-ip.com/Forms/search.aspx?s=" + name;
            siteNames[0] = "Clinical Pharmacology";


            urls[1] = "http://home.mdconsult.com/public/search?mdcquery=" + name;
            siteNames[1] = "MDConsult";

            urls[2] = "http://www.uptodate.com/online/content/search.do?";
            urls[2] += "searchType=HL7&amp;taskContext.c.c=MLREV&amp;taskContext.c.cs=2.16.840.1.113883.5.4";
            urls[2] += "&amp;mainSearchCriteria.v.dn=" + name;
            siteNames[2] = "UpToDate";

            urls[3] = "http://www.visualdx.com/visualdx/visualdx6/infobutton.do?";
            urls[3] += "taskContext.c.c=MLREV&taskContext.c.cs=2.16.840.1.113883.5.4";
            urls[3] += "&mainSearchCriteria.v.dn=" + name;
            siteNames[3] = "VisualDx";

            this.infoButtonView.model.set('openInfoButtonUrl1', urls[0]);
            this.infoButtonView.model.set('openInfoButtonSiteName1', siteNames[0]);
            this.infoButtonView.model.set('openInfoButtonUrl2', urls[1]);
            this.infoButtonView.model.set('openInfoButtonSiteName2', siteNames[1]);
            this.infoButtonView.model.set('openInfoButtonUrl3', urls[2]);
            this.infoButtonView.model.set('openInfoButtonSiteName3', siteNames[2]);
            this.infoButtonView.model.set('openInfoButtonUrl4', urls[3]);
            this.infoButtonView.model.set('openInfoButtonSiteName4', siteNames[3]);

            //console.log("calling MakeCorsRequest for patient info request");
            //makeCorsRequest(urlPat);

            var url5 = "http://infobutton.staywellsolutionsonline.com/infobuttonsearch.pg?";
            url5 += "mainSearchCriteria.v.dn=" + name;
            var siteName5 = "Krames StayWell";

            this.infoButtonPatientView.model.set('infoButtonPatientUrl1', url5);
            this.infoButtonPatientView.model.set('infoButtonPatientSiteName1', siteName5);
            this.infoButtonPatientView.model.set('infoButtonPatientUrl2', urls[2]);
            this.infoButtonPatientView.model.set('infoButtonPatientSiteName2', siteNames[2]);
            this.infoButtonPatientView.model.set('infoButtonPatientUrl3', urls[3]);
            this.infoButtonPatientView.model.set('infoButtonPatientSiteName3', siteNames[3]);
            this.model.set('activeCount', this.countMedStatus(this.collection, 'ACTIVE'));
            this.model.set('pendingCount', this.countMedStatus(this.collection, 'PENDING'));

            // appletHelper.sortCollection(this.orderHistoryListView.collection, "overallStart", "name", "numeric", false);
            //this._super.initialize.apply(this, arguments);
            //this._super.render.apply(this, arguments);
        },

        templateHelpers: {
            isNonVa: function() {
                if (parent.collection.models[0].get("vaType") === 'N') {
                    return true;
                } else {
                    return false;
                }
            },
            isNotDiscontinued: function() {
                if (this.vaStatus !== 'DISCONTINUED') {
                    return true;
                } else {
                    return false;
                }
            }
        },

        countMedStatus: function(collection, status) {
            var count = 0;
            collection.forEach(function(model) {
                if (model.get('standardizedVaStatus').toUpperCase() === status) {
                    count++;
                }
            });
            if (count > 1) {
                return count;
            } else {
                return null;
            }
        },
        onRender: function() {
            this.orderHistoryRegion.show(this.orderHistoryListView);
            this.orderDetailRegion.show(this.orderDetailView);
            this.infoButtonRegion.show(this.infoButtonView);
            this.infoButtonPatientRegion.show(this.infoButtonPatientView);

        },
        updateDetailView: function(newModel) {
            this.orderDetailView.model = newModel;
            this.orderDetailView.render();
            this.showHideDiscontiueBtn(newModel);
        },
        launchDiscontinueNonVaMedModal: function(event) {
            event.preventDefault();
            var discontinueNonVaMedChannel = ADK.Messaging.getChannel("medicationChannel");
            discontinueNonVaMedChannel.trigger('discontinueNonVaMed:clicked', event, this.orderDetailView.model);
        },
        launchEditNonVaMedModal: function(event) {
            event.preventDefault();
            //console.log('');
            //console.log('------------------------');
            //console.log('clicked Modify button');
            var discontinueNonVaMedChannel = ADK.Messaging.getChannel("medicationChannel");
            discontinueNonVaMedChannel.trigger('editNonVaMed:clicked', event, this.orderDetailView.model);
        },
        onOrderNavKeyDown: function(event) {
            if (event.which === 13 || event.which === 32) {
                $(event.target).click();
            }
        },
        // I couldn't find a clever way to do this with templates
        showHideDiscontiueBtn: function(newModel) {
            if (newModel.get('vaStatus') === 'DISCONTINUED') {
                $('#discontinue').hide();
            } else {
                $('#discontinue').show();
            }
        },
        template: medicationTemplate,
        regions: {
            orderHistoryRegion: "#order-history-panel",
            orderDetailRegion: "#order-detail-panel",
            infoButtonRegion: "#info-button-panel",
            infoButtonPatientRegion: "#info-button-patient-panel"

        },
        events: {
            'click #discontinue': 'launchDiscontinueNonVaMedModal',
            'click #edit': 'launchEditNonVaMedModal',
            'keydown .orderNav': 'onOrderNavKeyDown'
        }
    });

    return MedicationItemView;
});