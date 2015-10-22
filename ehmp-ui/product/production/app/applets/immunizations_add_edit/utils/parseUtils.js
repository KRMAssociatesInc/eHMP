define([
    'jquery'
], function($) {
    return {
        getImmunizationTypePickList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    if(item.name && item.uri){
                        var immunization = {
                            label: item.name.value,
                            value: item.uri.value,
                            isInactive: !_.isUndefined(item.inactive_flag) && item.inactive_flag.value === 'INACTIVE',
                            selectableForHistoric: !_.isUndefined(item.selectable_for_historic) ? item.selectable_for_historic.value === 'true' : false,
                            cvxCode: item.cvx_code ? item.cvx_code.value : '',
                            fullVaccineName: item.cdc_full_vaccine_name ? item.cdc_full_vaccine_name.value : '',
                            shortName: item.short_name ? item.short_name.value : '',
                            maxInSeries: item.max__in_series && item.max__in_series.value !== 'NON-SERIES' ? item.max__in_series.value : ''
                        };

                        var cdcProductNames = [];
                        if(item.cdc_product_name){
                            _.each(item.cdc_product_name.value, function(productName){
                                cdcProductNames.push(productName.cdc_product_name.value);
                            });
                        }
                        immunization.productNames = cdcProductNames;

                        var informationStatements = [];

                        if(item.vaccine_information_statement && item.vaccine_information_statement.value){
                            _.each(item.vaccine_information_statement.value, function(item){
                                var infoStatementText = item.vaccine_information_statement.label.indexOf('VACCINE INFORMATION STATEMENT\/') !== -1 ? item.vaccine_information_statement.label.replace('VACCINE INFORMATION STATEMENT\/', '') : item.vaccine_information_statement.label;
                                informationStatements.push({label: infoStatementText, value: item.uri.value });
                            });
                        }

                        immunization.informationStatements = informationStatements;
                        pickList.push(immunization);
                    }
                });
            }

            return _.sortBy(pickList, 'label');
        },
        getLotNumberPickList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    var lotNumber = {
                        label: item.lot_number.value,
                        value: item.lot_number.value,
                        manufacturer: item.manufacturer.label.indexOf('IMM MANUFACTURER/') !== -1 ? item.manufacturer.label.replace('IMM MANUFACTURER/', '') : item.manufacturer.label,
                        manufacturerUri: item.manufacturer.value,
                        expirationDate: item.expiration_date ? moment.utc(item.expiration_date.value).format('MM/DD/YYYY') : ''
                    };

                    pickList.push(lotNumber);
                });

            }

            return pickList;
        },
        getManufacturerList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    var manufacturer = {
                        label: item.name.value,
                        value: item.uri.value
                    };

                    pickList.push(manufacturer);
                });
            }

            return _.sortBy(pickList, 'label');
        },
        getInformationSourceList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    if(item.source.value !== 'New immunization record'){
                        var label = item.source.value;

                        if(label.indexOf('Historical information -') !== -1){
                            label = label.replace('Historical information -', '');
                            label = label.charAt(0).toUpperCase() + label.slice(1);
                        }
                        var informationSource = {
                            label: label,
                            value: item.uri.value
                        };
                        pickList.push(informationSource);
                    }
                });
            }

            return pickList;
        },
        getAnatomicLocationList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    var location = {
                        label: item.site.value,
                        value: item.uri.value
                    };
                    pickList.push(location);
                });
            }

            return pickList;
        },
        getEncounterLocationList: function(response){
            var pickList = [];

            if(response.data && response.data.items){
                _.each(response.data.items, function(item){
                    var location = {
                        label: item.displayName,
                        value: item.uid
                    };
                    pickList.push(location);
                });
            }

            return _.sortBy(pickList, 'label');
        },
        getOrderingProviderList: function(response){
            var pickList = [];

            if(response.data && response.data.items){
                _.each(response.data.items, function(item){
                    var provider = {
                        label: item.name,
                        value: item.uid
                    };
                    pickList.push(provider);
                });
            }

            return _.sortBy(pickList, 'label');
        },
        getAdministeringProviderList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    var provider = {
                        label: item.name,
                        value: item.code
                    };
                    pickList.push(provider);
                });
            }

            return _.sortBy(pickList, 'label');
        },
        getRouteOfAdministrationList: function(response){
            var pickList = [];

            if(response.data){
                _.each(response.data, function(item){
                    var route = {
                        label: item.route.value,
                        value: item.uri.value
                    };
                    pickList.push(route);
                });
            }

            return pickList;
        },
        getSeriesList: function(maxInSeries){
            var pickList = [];

            if(maxInSeries){
                var maxInSeriesNum = Number(maxInSeries);
                for(var i = 0; i <= maxInSeriesNum; i++){
                    pickList.push({label: i.toString(), value: i.toString()});
                }
            }

            pickList.push({label: 'Booster', value: 'Booster'});
            pickList.push({label: 'Complete', value: 'Complete'});
            pickList.push({label: 'Partially Complete', value: 'Partially Complete'});

            return pickList;
        },
        doesItemMatch: function(substringRegex, item, administered){
            var isInactive = item.get('isInactive');
            var selectableForHistoric = item.get('selectableForHistoric');
            if((administered && !isInactive) || ((!administered && !isInactive) || (!administered && isInactive && selectableForHistoric))){
                if(substringRegex.test(item.get('label'))){
                    return true;
                }

                if(substringRegex.test(item.get('cvxCode'))){
                    return true;
                }

                if(substringRegex.test(item.get('shortName'))){
                    return true;
                }

                if(substringRegex.test(item.get('fullVaccineName'))){
                    return true;
                }

                var productMatches;
                _.each(item.get('productNames'), function(productName){
                    if(substringRegex.test(productName)){
                        productMatches = true;
                    }
                });

                if(productMatches){
                    return true;
                }
            }

            return false;
        }
    };
});