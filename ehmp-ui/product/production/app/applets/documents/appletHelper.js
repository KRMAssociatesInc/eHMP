define([
    "backbone",
    "marionette",
    "underscore",
    "app/applets/documents/debugFlag"
], function(Backbone, Marionette, _, DEV) {
    var DEBUG = DEV.flag;

    var DETAIL_CHILD_DOC_SORT_FIELD = 'localTitle';

    var appletHelper = {

        isComplexDoc: function(docType) {
            // var docType = data.kind;
            if (docType.toLowerCase() == "surgery" || docType.toLowerCase() == "consult" || docType.toLowerCase() == "procedure" ||  docType.toLowerCase() == "imaging" || docType.toLowerCase() == "radiology report") {  //docType.toLowerCase() == "radiology" ||
                return true;
            } else {
                return false;
            }
        },
        hasChildDocs: function(data) {
            return (data.get('isInterdisciplinary') === true || data.get('isInterdisciplinary') === 'true') && data.get('interdisciplinaryType').toLowerCase() === 'parent';
        },
        isRadiology: function(docType) {
            if(docType.toLowerCase() == "radiology"){
                return true;
            }else{return false;}
        },
        isImaging: function(docType) {
            if(docType.toLowerCase() == "imaging"){ //||(docType == "Radiology"))
                return true;
            }else{return false;}
        },
        isConsult: function(docType) {
            if(docType.toLowerCase() == "consult"){
                return true;
            }else{return false;}
        },

        isSurgery : function(docType) {
            if(docType.toLowerCase() == "surgery"){
                return true;
            }else{return false;}
        },

        hasAddenda: function(data) {
            if (data.text !== undefined && data.text.length > 1) {
                // console.log("hasAddenda is true for " + data.documentDefUid);
                return true;
            } else {
                return false;
            }
        },

        formatAddenda: function(data) {
            if (data.kind == "Progress Note" && this.hasAddenda(data)) {
                var addendaText = [];
                for (var i = 1; i < data.text.length; i++) {
                    if (data.text[i].dateTime) {
                        data.text[i].addendaDateTime = this.formatDateTime(data.text[i].dateTime, 'YYYYMMDDHHmmssSSS', 'datetime');
                    } else {
                        data.text[i].addendaDateTime = false;
                    }
                    addendaText.push(data.text[i]);
                }
                return addendaText;
            } else {
                return false;
            }
        },

        formatDateTime: function(dateTime, source, display) {
            if (display == "datetime") {
                display = 'MM/DD/YYYY - HH:mm';
            } else if (display == "date") {
                display = 'MM/DD/YYYY';
            }
            return moment(dateTime, source).format(display);
        },

        getResultsFromUid: function(data) {
            var resultDocCollection = new Backbone.Collection();

            if (this.isComplexDoc(data.get('kind')) && data.get('results') && !data.get('dodComplexNoteUri')) {
                if (data.get('results').length > 0) {
                    var resultUids = _.map(data.get('results'), function(result) {
                        return result.uid;
                    });

                    var fetchOptions = {
                        resourceTitle: 'patient-record-document',
                        viewModel:  {
                            parse: function(response) {
                                return appletHelper.parseDocResponse(response);
                            }
                        },
                        criteria: {
                            filter: 'in("uid",' + JSON.stringify(resultUids) + ')',
                            order: DETAIL_CHILD_DOC_SORT_FIELD + ' ASC'
                        },
                        onSuccess: function(response) {
                            resultDocCollection.reset(response.models);
                            if(DEBUG) {
                                console.log("Fetch Success");
                                console.log(resultDocCollection);
                            }
                        },
                        onError: function(model, resp) {
                            if (DEBUG) console.log("Fetch Error");
                        }
                    };

                    ADK.PatientRecordService.fetchCollection(fetchOptions);
                }
            }
            return resultDocCollection;
        },

        getChildDocs: function(data) {
            if (this.hasChildDocs(data)) {
                var childDocCollection = new Backbone.Collection();
                // query documents index for other docs that have a parentUid equal to this document's UID
                var fetchOptions = {
                    resourceTitle: 'patient-record-document',
                    viewModel:  {
                        parse: function(response) {
                            return appletHelper.parseDocResponse(response);
                        }
                    },
                    criteria: {
                        filter: 'eq(parentUid,"' + data.get('uid') + '")',
                        order: DETAIL_CHILD_DOC_SORT_FIELD + ' ASC'
                    },
                    onSuccess: function(response) {
                        childDocCollection.reset(response.models);
                    }
                };

                ADK.PatientRecordService.fetchCollection(fetchOptions);
                return childDocCollection;
            }
            return null;
        },

        parseDocResponse: function(response) {

            if (response.kind) {
                response.kind = response.kind;
                response.complexDoc = appletHelper.isComplexDoc(response.kind);
                response.surgeryBool = appletHelper.isSurgery(response.kind);
                response.consultBool = appletHelper.isConsult(response.kind);
                response.imagingBool = appletHelper.isImaging(response.kind);
                response.radiologyBool = appletHelper.isRadiology(response.kind);

                if ((response.kind == "Radiology")||(response.kind == "Imaging")) {
                    if (response.typeName) {
                        response.localTitle = response.typeName;
                    }
                    if (response.dateTime) {
                        response.referenceDateTime = response.dateTime;
                    }
                    if (response.providerDisplayName) {
                        response.authorDisplayName = response.providerDisplayName;
                    }
                }

                if (response.kind == "Surgery") {
                    if (response.typeName) {
                        response.localTitle = response.typeName;
                    }
                    if (response.dateTime) {
                        response.referenceDateTime = response.dateTime;
                    }
                    if (response.providerDisplayName) {
                        response.authorDisplayName = response.providerDisplayName;
                    }
                }

                if (response.kind == "Consult") {
                    if (response.typeName) {
                        response.localTitle = response.typeName; //verified
                    }
                    if (response.dateTime) {
                        response.referenceDateTime = response.dateTime;
                    }
                    if (response.providerDisplayName) {
                        response.authorDisplayName = response.providerDisplayName; //check CprsClassicConsultsViewDev.java for more precise author name
                    }
                    if (response.results && response.results[0].localTitle){
                        response.resultsTitle = response.results[0].localTitle;
                    }
                }

                if(response.kind == "Imaging") {
                    if(response.dateTime) {
                        response.referenceDateTime = response.dateTime;
                    }
                }

                if (response.kind == "Procedure") {
                    if (response.typeName) {
                        response.localTitle = response.typeName;
                    } else if (response.summary) {
                        response.localTitle = response.summary;
                    } else if (response.name) {
                        response.localTitle = response.name;
                    }
                    if (response.referenceDateTime) {
                        response.referenceDateTime = response.referenceDateTime;
                    } else if (response.dateTime) {
                        response.referenceDateTime = response.dateTime;
                    }
                    if (response.providerDisplayName) {
                        response.authorDisplayName = response.providerDisplayName;
                    }
                }

                response.radiologyReportBool = response.kind.toLowerCase() === "radiology report";
            }

            if (response.authorDisplayName === undefined || response.authorDisplayName === "") {
                response.authorDisplayName = "None";
            }


            if (response.localTitle) {
                response.displayTitle = response.localTitle.toLowerCase();
            }

            if (response.referenceDateTime) {
                response.dateDisplay = appletHelper.formatDateTime(response.referenceDateTime, 'YYYYMMDDHHmmssSSS', 'date');
                response.dateTimeDisplay = appletHelper.formatDateTime(response.referenceDateTime, 'YYYYMMDDHHmmssSSS', 'datetime');
            }

            if (response.text !== undefined && response.text && response.text[0]) {
                if (response.text[0].authorDisplayName) {
                    response.textAuthor = response.text[0].authorDisplayName;
                }
                if (response.text[0].content) {
                    response.content = response.text[0].content;
                } else {
                    response.content = "No Content";
                }
                if (response.text[0].dateTime) {
                    response.textDateTime = appletHelper.formatDateTime(response.text[0].dateTime, 'YYYYMMDDHHmmssSSS', 'datetime');
                }
                if (response.text[0].authorDisplayName) {
                    response.textAuthor = response.text[0].authorDisplayName;
                }
            } else if (response.facilityCode && response.facilityCode.toLowerCase() === 'dod') {
                response.content = "No Document Found";
            } else {
                response.text = false;
            }

            if (response.statusDisplayName) {
                var sdn = response.statusDisplayName.toLowerCase();
                if (sdn === 'completed') {
                    response.statusDisplayClass = 'text-success';
                } else if (sdn === 'rejected') {
                    response.statusDisplayClass = 'text-danger';
                }
            }

            if (response.statusName) {
                var sn = response.statusName.toLowerCase();
                if (sn === 'complete' || sn === 'completed') {
                    response.statusClass = 'text-success';
                }
            }

            if ((response.isInterdisciplinary === 'true' || response.isInterdisciplinary === true) && response.interdisciplinaryType === 'parent') {
                response.interdisciplinaryBool = true;
            } else {
                response.interdisciplinaryBool = false;
            }

            response.addendaText = appletHelper.formatAddenda(response);

            return response;
        },
        globalFilterStatus: function(date){
            if((date.attributes.fromDate !== null)&&(date.attributes.toDate !== null)) return true;
            return false;
        },
        hideAppFilter: function(){
            if (DEBUG) console.log($("#grid-filter-documents").find("form").find("input").val());
            if (DEBUG) console.log($("form.form-search").find("input").val());
            if($("#grid-filter-documents").hasClass("collapse in")){
                $("#grid-filter-button-documents").click();
            }
            $("#grid-filter-button-documents").hide();
            if($("form.form-search").find("input").val().length > 0) $("#grid-filter-documents").find(".clear").click();
        },
        showAppFilter: function(){
            $("#grid-filter-button-documents").show();
        },
        scrollToResultDoc: function($clickedLink, $targetResult) {
            var $scrollRegion = this.getScrollParent($clickedLink, false);

            if ($targetResult.length > 0) {
                // scroll to the selected result document
                var targetOffset = 0,
                    elem = $targetResult,
                    count = 0,
                    body = $(document.body);

                while (!elem.is(body) && !elem.is($scrollRegion) && count++ < 100) {
                    targetOffset += elem.position().top;
                    elem = elem.offsetParent();
                }
                var targetTop = $scrollRegion.scrollTop() + targetOffset;
                $scrollRegion.scrollTop(targetTop);
            }
        },
        getScrollParent: function($elem, includeHidden) {
            // this method copied from jqueryui 1.11.2
            var position = $elem.css( "position" ),
                excludeStaticParent = position === "absolute",
                overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                scrollParent = $elem.parents().filter( function() {
                   var parent = $( this );
                   if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
                      return false;
                   }
                   return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
                }).eq( 0 );

            return position === "fixed" || !scrollParent.length ? $( $elem[ 0 ].ownerDocument || document ) : scrollParent;
        }
    };
    return appletHelper;
});
