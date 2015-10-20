/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['backbone', 'jasminejquery', 'app/applets/immunizations_add_edit/utils/parseUtils'],
    function (Backbone, Jasmine, ParseUtil) {

        describe('Parse utility function for immunizations type pick list', function() {
            it('empty response should return empty array', function() {
                var pickList = ParseUtil.getImmunizationTypePickList({});
                expect(pickList).toEqual([]);
            });

            it('no items should return empty array', function(){
                var pickList = ParseUtil.getImmunizationTypePickList({data: []});
                expect(pickList).toEqual([]);
            });

            it('items with no name and uri should not get added', function(){
                var pickList = ParseUtil.getImmunizationTypePickList({data: [{uri: {value: '99999999-01'}}]});
                expect(pickList).toEqual([]);
            });

            it('items with no uri and name should not get added', function(){
                var pickList = ParseUtil.getImmunizationTypePickList({data: [{name: {value: '99999999-01'}}]});
                expect(pickList).toEqual([]);
            });

            it('items with valid name and uri should be added', function(){
                var pickList = ParseUtil.getImmunizationTypePickList({data: [{name: {value: 'DTAP'}, uri: {value: '99999999-01'}}]});
                expect(pickList.length).toEqual(1);
            });

            it('all items have data and should be parsed accordingly', function(){
                var pickList = ParseUtil.getImmunizationTypePickList(
                    {
                        data: [
                            {
                                name: {
                                    value: 'DTAP'
                                },
                                uri: {
                                    value: '9999999-01'
                                },
                                inactive_flag: {
                                    value: 'INACTIVE'
                                },
                                selectable_for_historic: {
                                    value: 'true'
                                },
                                cvx_code: {
                                    value: '75'
                                },
                                cdc_full_vaccine_name: {
                                    value: 'FULL VACCINE NAME'
                                },
                                short_name: {
                                    value: 'SHORT NAME'
                                },
                                cdc_product_name: 
                                {
                                    value: [
                                        {
                                            cdc_product_name: {
                                                value: 'CDC PRODUCT NAME'
                                            }
                                        }
                                    ]
                                },
                                vaccine_information_statement: {
                                    value: [
                                        {
                                            vaccine_information_statement: {
                                                label: 'VACCINE INFORMATION STATEMENT\/INFO STATEMENT 1'
                                            },
                                            uri: {
                                                value: '938021-99-22'
                                            }
                                        }
                                    ]
                                },
                                max__in_series: {
                                    value: '5'
                                }
                            }
                        ]
                    }
                );

                expect(pickList.length).toEqual(1);
                expect(pickList[0].label).toEqual('DTAP');
                expect(pickList[0].value).toEqual('9999999-01');
                expect(pickList[0].isInactive).toEqual(true);
                expect(pickList[0].selectableForHistoric).toEqual(true);
                expect(pickList[0].cvxCode).toEqual('75');
                expect(pickList[0].fullVaccineName).toEqual('FULL VACCINE NAME');
                expect(pickList[0].shortName).toEqual('SHORT NAME');
                expect(pickList[0].productNames.length).toEqual(1);
                expect(pickList[0].productNames[0]).toEqual('CDC PRODUCT NAME');
                expect(pickList[0].informationStatements[0].label).toEqual('INFO STATEMENT 1');
                expect(pickList[0].informationStatements[0].value).toEqual('938021-99-22');
                expect(pickList[0].maxInSeries).toEqual('5');
            });
        });

        describe('Parse utility function for matching immunizations data', function() {
            it('should not match because administered and inactive', function(){
                var substrRegex = new RegExp('hep', 'i');
                var item = new Backbone.Model({isInactive: true});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, true);
                expect(isMatch).toEqual(false);
            });

            it('should not match because historical and inactive and not selectable for historic', function(){
                var substrRegex = new RegExp('hep', 'i');
                var item = new Backbone.Model({isInactive: true, selectableForHistoric: false});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, false);
                expect(isMatch).toEqual(false);
            });

            it('should not match because nothing matches regex', function(){
                var substrRegex = new RegExp('hep', 'i');
                var item = new Backbone.Model({isInactive: false, label: 'dtp', cvxCode: '100', fullVaccineName: 'No match', shortName: 'nothing', productNames: ['wrong']});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, true);
                expect(isMatch).toEqual(false);
            });

            it('should match on label', function(){
                var substrRegex = new RegExp('hep', 'i');
                var item = new Backbone.Model({isInactive: false, label: 'hepatitis', cvxCode: '100', fullVaccineName: 'No match', shortName: 'nothing', productNames: ['wrong']});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, true);
                expect(isMatch).toEqual(true);
            });

            it('should match on cvxCode', function(){
                var substrRegex = new RegExp('100', 'i');
                var item = new Backbone.Model({isInactive: false, label: 'dtp', cvxCode: '100', fullVaccineName: 'No match', shortName: 'nothing', productNames: ['wrong']});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, true);
                expect(isMatch).toEqual(true);
            });

            it('should match on full vaccine name', function(){
                var substrRegex = new RegExp('hep', 'i');
                var item = new Backbone.Model({isInactive: false, label: 'dtp', cvxCode: '100', fullVaccineName: 'hepatitis', shortName: 'nothing', productNames: ['wrong']});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, true);
                expect(isMatch).toEqual(true);
            });

            it('should match on product name', function(){
                var substrRegex = new RegExp('hep', 'i');
                var item = new Backbone.Model({isInactive: false, label: 'dtp', cvxCode: '100', fullVaccineName: 'No match', shortName: 'nothing', productNames: ['hep-a']});
                var isMatch = ParseUtil.doesItemMatch(substrRegex, item, true);
                expect(isMatch).toEqual(true);
            });
        });

        describe('Parse utility function for getting lot numbers', function(){
            it('Getting lot number with no response should give empty array', function(){
                expect(ParseUtil.getLotNumberPickList({})).toEqual([]);
            });

            it('Getting lot number with valid response', function(){
                var response = {
                    data: [
                        {
                            lot_number: {
                                value: 'ABC123'
                            },
                            manufacturer: {
                                label: 'ABBOTT LABS',
                                value: '99999-01'
                            },
                            expiration_date: {
                                value: '2015-12-31T00:00:00Z'
                            }
                        }
                    ]
                };
                var lotNumberList = ParseUtil.getLotNumberPickList(response);
                expect(lotNumberList.length).toEqual(1);
                expect(lotNumberList[0].label).toEqual('ABC123');
                expect(lotNumberList[0].value).toEqual('ABC123');
                expect(lotNumberList[0].manufacturer).toEqual('ABBOTT LABS');
                expect(lotNumberList[0].manufacturerUri).toEqual('99999-01');
                expect(lotNumberList[0].expirationDate).toEqual('12/31/2015');
            });

            it('Getting lot number with and formatting manufacturer properly', function(){
                var response = {
                    data: [
                        {
                            lot_number: {
                                value: 'ABC123'
                            },
                            manufacturer: {
                                label: 'IMM MANUFACTURER/ABBOTT LABS',
                                value: '99999-01'
                            },
                            expiration_date: {
                                value: '2015-12-31T00:00:00Z'
                            }
                        }
                    ]
                };
                var lotNumberList = ParseUtil.getLotNumberPickList(response);
                expect(lotNumberList.length).toEqual(1);
                expect(lotNumberList[0].label).toEqual('ABC123');
                expect(lotNumberList[0].value).toEqual('ABC123');
                expect(lotNumberList[0].manufacturer).toEqual('ABBOTT LABS');
                expect(lotNumberList[0].manufacturerUri).toEqual('99999-01');
                expect(lotNumberList[0].expirationDate).toEqual('12/31/2015');
            });


        });

        describe('Parse utility function for getting manufacturers', function(){
            it('Getting manufacturers with no response should give empty array', function(){
                expect(ParseUtil.getManufacturerList({})).toEqual([]);
            });

            it('Getting manufacturer with valid response', function(){
                var response = {
                    data: [
                        {
                            uri: {
                                value: '99999-03'
                            },
                            name: {
                                value: 'ABBOTT LABORATORIES'
                            }
                        }
                    ]
                };

                var manufacturerList = ParseUtil.getManufacturerList(response);
                expect(manufacturerList.length).toEqual(1);
                expect(manufacturerList[0].label).toEqual('ABBOTT LABORATORIES');
                expect(manufacturerList[0].value).toEqual('99999-03');
            });
        });

        describe('Parse utility function for getting information sources', function(){
            it('Getting info sources with no response should give empty array', function(){
                expect(ParseUtil.getInformationSourceList({})).toEqual([]);
            });

            it('Getting info sources with valid response', function(){
                var response = {
                    data: [
                        {
                            uri: {
                                value: '99999-08'
                            },
                            source: {
                                value: 'Unspecified'
                            }
                        }
                    ]
                };

                var infoSourceList = ParseUtil.getInformationSourceList(response);
                expect(infoSourceList.length).toEqual(1);
                expect(infoSourceList[0].label).toEqual('Unspecified');
                expect(infoSourceList[0].value).toEqual('99999-08');
            });

            it('Getting info sources with valid response and proper string formatting', function(){
                var response = {
                    data: [
                        {
                            uri: {
                                value: '99999-08'
                            },
                            source: {
                                value: 'Historical information -unspecified'
                            }
                        }
                    ]
                };

                var infoSourceList = ParseUtil.getInformationSourceList(response);
                expect(infoSourceList.length).toEqual(1);
                expect(infoSourceList[0].label).toEqual('Unspecified');
                expect(infoSourceList[0].value).toEqual('99999-08');
            });

            it('Filter out info source for new immunization record', function(){
                var response = {
                    data: [
                        {
                            uri: {
                                value: '99999-01'
                            },
                            source: {
                                value: 'New immunization record'
                            }
                        }
                    ]
                };

                expect(ParseUtil.getInformationSourceList(response).length).toEqual(0);
            });
        });

        describe('Parse utility function for getting anatomic locations', function(){
            it('Getting anatomic locations with no response should give empty array', function(){
                expect(ParseUtil.getAnatomicLocationList({})).toEqual([]);
            });

            it('Getting anatomic location with valid response', function(){
                var response = {
                    data: [
                        {
                            uri: {
                                value: '99999-01'
                            },
                            site: {
                                value: 'ARM'
                            }
                        }
                    ]
                };

                var anatomicLocations = ParseUtil.getAnatomicLocationList(response);
                expect(anatomicLocations.length).toEqual(1);
                expect(anatomicLocations[0].label).toEqual('ARM');
                expect(anatomicLocations[0].value).toEqual('99999-01');
            });
        });

        describe('Parse utility function for getting routes of administration', function(){
            it('Getting routes of administration with no response should give empty array', function(){
                expect(ParseUtil.getAnatomicLocationList({})).toEqual([]);
            });

            it('Getting routes of administration with valid response', function(){
                var response = {
                    data: [
                        {
                            uri: {
                                value: '99999-09'
                            },
                            route: {
                                value: 'INTRADERMAL'
                            }
                        }
                    ]
                };

                var routesList = ParseUtil.getRouteOfAdministrationList(response);
                expect(routesList.length).toEqual(1);
                expect(routesList[0].label).toEqual('INTRADERMAL');
                expect(routesList[0].value).toEqual('99999-09');
            });
        });

        describe('Parse utility function for getting encounter locations', function(){
            it('Getting encounter locations with no response should give empty array', function(){
                expect(ParseUtil.getEncounterLocationList({})).toEqual([]);
            });

            it('Getting encounter location with valid response', function(){
                var response = {
                    data: {
                        items:
                            [
                                {
                                    displayName: 'Audiology',
                                    uid: 'urn:va:location:9E7A:1234'
                                }
                            ]
                    }
                };

                var encounterLocations = ParseUtil.getEncounterLocationList(response);
                expect(encounterLocations.length).toEqual(1);
                expect(encounterLocations[0].label).toEqual('Audiology');
                expect(encounterLocations[0].value).toEqual('urn:va:location:9E7A:1234');
            });
        });

        describe('Parse utility function for getting ordering providers', function(){
            it('Getting ordering providers with no response should give empty array', function(){
                expect(ParseUtil.getOrderingProviderList({})).toEqual([]);
            });

            it('Getting ordering provider with valid response', function(){
                var response = {
                    data: {
                        items:
                            [
                                {
                                    name: 'PROGRAMMER,ONE',
                                    uid: 'urn:va:provider:9E7A:1234'
                                }
                            ]
                    }
                };

                var orderingProviders = ParseUtil.getOrderingProviderList(response);
                expect(orderingProviders.length).toEqual(1);
                expect(orderingProviders[0].label).toEqual('PROGRAMMER,ONE');
                expect(orderingProviders[0].value).toEqual('urn:va:provider:9E7A:1234');
            });
        });

        describe('Parse utility function for getting administering providers', function(){
            it('Getting administering providers with no response should give empty array', function(){
                expect(ParseUtil.getAdministeringProviderList({})).toEqual([]);
            });

            it('Getting administering provider with valid response', function(){
                var response = {
                    data:
                        [
                            {
                                name: 'PROGRAMMER,TWO',
                                code: 'urn:va:user:9E7A:1234'
                            }
                        ]
                };

                var administeringProviders = ParseUtil.getAdministeringProviderList(response);
                expect(administeringProviders.length).toEqual(1);
                expect(administeringProviders[0].label).toEqual('PROGRAMMER,TWO');
                expect(administeringProviders[0].value).toEqual('urn:va:user:9E7A:1234');
            });
        });

        describe('Parse utility function for getting series list', function(){
            it('Getting list with no max series value should give default list', function(){
                var seriesList = ParseUtil.getSeriesList('');
                expect(seriesList.length).toEqual(3);
                expect(seriesList[0].label).toEqual('Booster');
                expect(seriesList[1].label).toEqual('Complete');
                expect(seriesList[2].label).toEqual('Partially Complete');
            });

            it('Getting list with max series value should give default list with extra values', function(){
                var seriesList = ParseUtil.getSeriesList('3');
                expect(seriesList.length).toEqual(7);
                expect(seriesList[0].label).toEqual('0');
                expect(seriesList[1].label).toEqual('1');
                expect(seriesList[2].label).toEqual('2');
                expect(seriesList[3].label).toEqual('3');
                expect(seriesList[4].label).toEqual('Booster');
                expect(seriesList[5].label).toEqual('Complete');
                expect(seriesList[6].label).toEqual('Partially Complete');
            });
        });
    });
