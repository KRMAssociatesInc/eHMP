/*jslint node: true */
'use strict';

var writebackmedoperationaldata = require('../resources/writebackmed/operationaldataResource');
var VistaJS = require('../VistaJS/VistaJS');
var rdk = require('../rdk/rdk');

var mock_session = {
                    user: {
                        username: '9E7A;pu1234',
                        password: 'pu1234!!',
                        duz: {
                            '9E7A': '10000000226'
                        },
                        site: '9E7A'
                    }
                };

describe('writebackmed_operationaldataResource', function(test) {
    describe('call function performSearch', function() {
        var req = {};

        beforeEach(function() {
            req = {};
            spyOn(VistaJS, 'callRpc');
        });

        it('with searchParam set to \'alc\'', function() {
            var searchParameter = 'alc';

            var req = {
                param: function(string) {
                    return searchParameter;
                },
                logger: {
                    info: function(log) {
                        return log;
                    },
                    debug: function(debug) {
                        return debug;
                    }
                },
                app: {
                    config: {
                        rpcConfig: {
                            context: 'HMP UI CONTEXT',
                            siteHash: '9E7A'
                        },
                        vistaSites: {
                            '9E7A': {
                                name: 'PANORAMA',
                                division: '500',
                                host: '10.2.2.101',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            },
                            'C877': {
                                name: 'KODAK',
                                division: '500',
                                host: '10.2.2.102',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            }
                        }
                    }
                },
                session: mock_session
            };

            var res = {
                send: function(message, error) {
                    return;
                }
            };

            writebackmedoperationaldata._performSearch(req, res);
            expect(VistaJS.callRpc).toHaveBeenCalled();
        });
    });

    describe('call function getMedSearchList', function() {
        var req = {};

        beforeEach(function() {
            req = {};
            spyOn(rdk.utils.http, 'fetch');
        });

        it('with search set to \'alc\', ' +
            'count set to \'10\'', function() {
                var medListParam = {
                    filter: 'and(ilike(name,%22%25bac%25%22),eq(%22types%5B%5D.type%22,%22NON-VA%20MEDS%22))'
                };

                var req = {
                    param: function(string) {
                        return JSON.stringify(medListParam);
                    },
                    logger: {
                        info: function(log) {
                            return log;
                        },
                        debug: function(debug) {
                            return debug;
                        }
                    },
                    app: {
                        config: {
                            rpcConfig: {
                                context: 'HMP UI CONTEXT',
                                siteHash: '9E7A'
                            },
                            vistaSites: {
                                '9E7A': {
                                    name: 'PANORAMA',
                                    division: '500',
                                    host: '10.2.2.101',
                                    port: 9210,
                                    production: false,
                                    accessCode: 'pu1234',
                                    verifyCode: 'pu1234!!'
                                },
                                'C877': {
                                    name: 'KODAK',
                                    division: '500',
                                    host: '10.2.2.102',
                                    port: 9210,
                                    production: false,
                                    accessCode: 'pu1234',
                                    verifyCode: 'pu1234!!'
                                }
                            }
                        }
                    },
                    session: mock_session
                };

                var res = {
                    send: function(message, error) {
                        return;
                    }
                };

                writebackmedoperationaldata._getMedSearchList(req, res);
                expect(rdk.utils.http.fetch).toHaveBeenCalled();
            });
    });

    describe('call function getMedSchedule', function() {
        var req = {};

        beforeEach(function() {
            req = {};
            spyOn(rdk.utils.http, 'fetch');
        });

        it('with dfn set to \'100695\', ' +
            'end locien to \'0\'', function() {
                var medScheduleParam = {
                    dfn: 100695,
                    locien: 0
                };

                var req = {
                    param: function(string) {
                        return JSON.stringify(medScheduleParam);
                    },
                    logger: {
                        info: function(log) {
                            return log;
                        },
                        debug: function(debug) {
                            return debug;
                        }
                    },
                    app: {
                        config: {
                            rpcConfig: {
                                context: 'HMP UI CONTEXT',
                                siteHash: '9E7A'
                            },
                            vistaSites: {
                                '9E7A': {
                                    name: 'PANORAMA',
                                    division: '500',
                                    host: '10.2.2.101',
                                    port: 9210,
                                    production: false,
                                    accessCode: 'pu1234',
                                    verifyCode: 'pu1234!!'
                                },
                                'C877': {
                                    name: 'KODAK',
                                    division: '500',
                                    host: '10.2.2.102',
                                    port: 9210,
                                    production: false,
                                    accessCode: 'pu1234',
                                    verifyCode: 'pu1234!!'
                                }
                            }
                        }
                    },
                    session: mock_session,
                    audit: {}
                };

                var res = {
                    send: function(message, error) {
                        return;
                    }
                };

                writebackmedoperationaldata._getMedSchedule(req, res);
                expect(rdk.utils.http.fetch).toHaveBeenCalled();
            });
    });

    describe('call function getDaysSupply', function() {
        beforeEach(function() {
            spyOn(VistaJS, 'callRpc');
        });

        it('with patientIEN set to \'149\', ' +
        'end locien to \'0\'', function() {
            var getDaysSupplyParam = {
                patientIEN: 149,
                drugIEN: 108,
                medIEN: 3524,
                locien: 0
            };

            var req = {
                param: function(string) {
                    return JSON.stringify(getDaysSupplyParam);
                },
                logger: {
                    info: function(log) {
                        return log;
                    },
                    debug: function(debug) {
                        return debug;
                    }
                },
                app: {
                    config: {
                        rpcConfig: {
                            context: 'HMP UI CONTEXT',
                            siteHash: '9E7A'
                        },
                        vistaSites: {
                            '9E7A': {
                                name: 'PANORAMA',
                                division: '500',
                                host: '10.2.2.101',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            },
                            'C877': {
                                name: 'KODAK',
                                division: '500',
                                host: '10.2.2.102',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            }
                        }
                    }
                },
                session: mock_session,
                audit: {}
            };

            var res = {
                send: function(message, error) {
                    return;
                }
            };

            writebackmedoperationaldata._getDaysSupply(req, res);
            expect(VistaJS.callRpc).toHaveBeenCalled();
        });
    });

    describe('call function getMedDefaults', function() {
        var req = {};

        beforeEach(function() {
            req = {};
            spyOn(VistaJS, 'callRpc');
        });

        it('with dlg set to \'PSH OERR\', ', function() {
            var medDefaultsParam = {
                oi: '1348',
                pstype: 'X',
                orvp: 100695,
                needpi: 'Y',
                pkiactiv: 'Y'
            };

            var req = {
                param: function(string) {
                    return JSON.stringify(medDefaultsParam);
                },
                logger: {
                    info: function(log) {
                        return log;
                    },
                    debug: function(debug) {
                        return debug;
                    }
                },
                app: {
                    config: {
                        rpcConfig: {
                            context: 'HMP UI CONTEXT',
                            siteHash: '9E7A'
                        },
                        vistaSites: {
                            '9E7A': {
                                name: 'PANORAMA',
                                division: '500',
                                host: '10.2.2.101',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            },
                            'C877': {
                                name: 'KODAK',
                                division: '500',
                                host: '10.2.2.102',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            }
                        }
                    }
                },
                session: mock_session
            };
            var res = {
                send: function(message, error) {
                    return;
                }
            };

            writebackmedoperationaldata._getMedDefaults(req, res);
            expect(VistaJS.callRpc).toHaveBeenCalled();
        });
    });

    describe('call function getDialogFormat', function() {
        var req = {};

        beforeEach(function() {
            req = {};
            spyOn(VistaJS, 'callRpc');
        });

        it('with dlg set to \'PSH OERR\', ', function() {
            var medDialogParam = {
                dlg: 'PSH OERR',
            };

            var req = {
                param: function(string) {
                    return JSON.stringify(medDialogParam);
                },
                logger: {
                    info: function(log) {
                        return log;
                    },
                    debug: function(debug) {
                        return debug;
                    }
                },
                app: {
                    config: {
                        rpcConfig: {
                            context: 'HMP UI CONTEXT',
                            siteHash: '9E7A'
                        },
                        vistaSites: {
                            '9E7A': {
                                name: 'PANORAMA',
                                division: '500',
                                host: '10.2.2.101',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            },
                            'C877': {
                                name: 'KODAK',
                                division: '500',
                                host: '10.2.2.102',
                                port: 9210,
                                production: false,
                                accessCode: 'pu1234',
                                verifyCode: 'pu1234!!'
                            }
                        }
                    }
                },
                session: mock_session
            };

            var res = {
                send: function(message, error) {
                    return;
                }
            };

            writebackmedoperationaldata._getDialogFormat(req, res);
            expect(VistaJS.callRpc).toHaveBeenCalled();
        });
    });

    describe('Test Helper Methods', function() {
        it('Test buildMedResultList', function() {
            var input = '9^A.P.L.     <GONADOTROPIN,CHORIONIC INJ >\r\n2883^ALCAIN     <PROPARACAINE SOLN,OPH >';
            var expected_output = {
                data: {
                    items: [{
                        IEN: '9',
                        name: 'A.P.L.',
                        desc: '<GONADOTROPIN,CHORIONIC INJ >'
                    }, {
                        IEN: '2883',
                        name: 'ALCAIN',
                        desc: '<PROPARACAINE SOLN,OPH >'
                    }],
                    'success': true
                }
            };
            expect(writebackmedoperationaldata._buildMedResultList(input)).toEqual(expected_output);
        });

        it('Test buildMedSchedules', function() {
            var input = 'BID^TWICE A DAY^C^09-17\r\nQ2H^EVERY 2 HOURS^C^04-06-08-10-12-14-16-18-20-22-24';
            var expected_output = {
                data: {
                    items: [{
                        name: 'BID',
                        desc: 'TWICE A DAY',
                        code: 'C',
                        time: '09-17'
                    }, {
                        name: 'Q2H',
                        desc: 'EVERY 2 HOURS',
                        code: 'C',
                        time: '04-06-08-10-12-14-16-18-20-22-24'
                    }],
                    'success': true
                }
            };
            expect(writebackmedoperationaldata._buildMedSchedules(input)).toEqual(expected_output);
        });

        it('Test buildMedDefaults', function() {
            var input = '~Medication\r\nd1348^ACETAMINOPHEN TAB \r\n~Verb\r\ndTAKE\r\n~Preposition\r\ndBY\r\n~PtInstr\r\n~AllDoses\r\ni325MG^5591^325&MG&1&TABLET&325MG&5591&325&MG\r\ni500MG^213^500&MG&1&TABLET&500MG&213&500&MG\r\ni650MG^5591^650&MG&2&TABLETS&650MG&5591&325&MG\r\ni1000MG^213^1000&MG&2&TABLETS&1000MG&213&500&MG\r\n~Dosage\r\niACETAMINOPHEN 325MG TAB^325MG^^325&MG&1&TABLET&325MG&5591&325&MG^325MG^0.0029^^TAB\r\niACETAMINOPHEN 500MG TAB^500MG^^500&MG&1&TABLET&500MG&213&500&MG^500MG^0.0062^^TAB\r\niACETAMINOPHEN 325MG TAB^325MG^^650&MG&2&TABLETS&650MG&5591&325&MG^650MG^0.0058^^TAB\r\niACETAMINOPHEN 500MG TAB^500MG^^1000&MG&2&TABLETS&1000MG&213&500&MG^1000MG^0.0124^^TAB\r\n~Dispense\r\ni213^500^MG^ACETAMINOPHEN 500MG TAB^0\r\ni5591^325^MG^ACETAMINOPHEN 325MG TAB^0\r\n~Route\r\ni1^ORAL (BY MOUTH)^PO^MOUTH^0\r\nd1^ORAL (BY MOUTH)\r\n~Schedule\r\ndQ6H PRN\r\n~Guideline\r\n~Message\r\n~DEASchedule\r\nd\r\n';
            var expected_output = {
                'data': {
                    'items': [{
                        'internal': {
                            'AllDoses': [{
                                'dose': '325MG',
                                'drugien': '5591',
                                'dose_desc': '325&MG&1&TABLET&325MG&5591&325&MG'
                            }, {
                                'dose': '500MG',
                                'drugien': '213',
                                'dose_desc': '500&MG&1&TABLET&500MG&213&500&MG'
                            }, {
                                'dose': '650MG',
                                'drugien': '5591',
                                'dose_desc': '650&MG&2&TABLETS&650MG&5591&325&MG'
                            }, {
                                'dose': '1000MG',
                                'drugien': '213',
                                'dose_desc': '1000&MG&2&TABLETS&1000MG&213&500&MG'
                            }],
                            'Dosage': [{
                                'drugname': 'ACETAMINOPHEN 325MG TAB',
                                'drugien': '325MG',
                                'nf': '',
                                'dose_desc': '325&MG&1&TABLET&325MG&5591&325&MG',
                                'qty': '325MG',
                                'price_per_dispensed_unit': '0.0029',
                                'maxrefills': '',
                                'dispunits': 'TAB'
                            }, {
                                'drugname': 'ACETAMINOPHEN 500MG TAB',
                                'drugien': '500MG',
                                'nf': '',
                                'dose_desc': '500&MG&1&TABLET&500MG&213&500&MG',
                                'qty': '500MG',
                                'price_per_dispensed_unit': '0.0062',
                                'maxrefills': '',
                                'dispunits': 'TAB'
                            }, {
                                'drugname': 'ACETAMINOPHEN 325MG TAB',
                                'drugien': '325MG',
                                'nf': '',
                                'dose_desc': '650&MG&2&TABLETS&650MG&5591&325&MG',
                                'qty': '650MG',
                                'price_per_dispensed_unit': '0.0058',
                                'maxrefills': '',
                                'dispunits': 'TAB'
                            }, {
                                'drugname': 'ACETAMINOPHEN 500MG TAB',
                                'drugien': '500MG',
                                'nf': '',
                                'dose_desc': '1000&MG&2&TABLETS&1000MG&213&500&MG',
                                'qty': '1000MG',
                                'price_per_dispensed_unit': '0.0124',
                                'maxrefills': '',
                                'dispunits': 'TAB'
                            }],
                            'Dispense': [{
                                'drugien': '213',
                                'strength': '500',
                                'unit': 'MG',
                                'name': 'ACETAMINOPHEN 500MG TAB',
                                'split': '0'
                            }, {
                                'drugien': '5591',
                                'strength': '325',
                                'unit': 'MG',
                                'name': 'ACETAMINOPHEN 325MG TAB',
                                'split': '0'
                            }],
                            'Route': [{
                                'routeien': '1',
                                'route': 'ORAL (BY MOUTH)',
                                'latin_abbr': 'PO',
                                'outpatient_expansion': 'MOUTH',
                                'iv_flag': '0'
                            }],
                        },
                        'display': {
                            'Medication': [{
                                'medien': '1348',
                                'value': 'ACETAMINOPHEN TAB '
                            }],
                            'Verb': [{
                                'value': 'TAKE'
                            }],
                            'Preposition': [{
                                'value': 'BY'
                            }],
                            'Route': [{
                                'routeien': '1',
                                'route': 'ORAL (BY MOUTH)'
                            }],
                            'Schedule': [{
                                'value': 'Q6H PRN'
                            }],
                            'DEASchedule': [{
                                'type': ''
                            }]
                        }
                    }],
                    'success': true
                }
            };
            expect(writebackmedoperationaldata._buildMedDefaults(input)).toEqual(expected_output);
        });


        it('Test getOrderPresets', function() {
            var input = '~4^1^ORDERABLE\r\ni1883\r\nePROPARACAINE SOLN,OPH \r\n~6^1^START\r\niOct 20,2014\r\neOct 20,2014\r\n~15^1^COMMENT\r\ntTest\r\n~136^1^INSTR\r\ni1 DROP 0.5%\r\ne1 DROP 0.5%\r\n~137^1^ROUTE\r\ni20\r\neRIGHT EYE\r\n~138^1^DRUG\r\ni746\r\nePROPARACAINE HCL 0.5% OPH SOLN\r\n~170^1^SCHEDULE\r\ni3ID\r\ne3ID\r\n~384^1^STRENGTH\r\ni0.5%\r\ne0.5%\r\n~385^1^SIG\r\ntINSTILL 1 DROP IN RIGHT EYE 3ID\r\n~386^1^DOSE\r\ni&%&&&1 DROP&746&0.5&%\r\ne&%&&&1 DROP&746&0.5&%\r\n~1615^1^STATEMENTS\r\nt\r\ntNon-VA medication not recommended by VA provider.  \r\n';
            var expected_output = {
                'data': {
                    'items': [{
                        'orderable': {
                            'entryien': '4',
                            'instance': '1',
                            'values': {
                                'internal': '1883',
                                'external': 'PROPARACAINE SOLN,OPH '
                            },
                            'displayvalue': 'PROPARACAINE SOLN,OPH '
                        },
                        'start': {
                            'entryien': '6',
                            'instance': '1',
                            'values': {
                                'internal': 'Oct 20,2014',
                                'external': 'Oct 20,2014'
                            },
                            'displayvalue': 'Oct 20,2014'
                        },
                        'comment': {
                            'entryien': '15',
                            'instance': '1',
                            'values': {
                                'text': 'Test'
                            },
                            'displayvalue': 'Test'
                        },
                        'instr': {
                            'entryien': '136',
                            'instance': '1',
                            'values': {
                                'internal': '1 DROP 0.5%',
                                'external': '1 DROP 0.5%'
                            },
                            'displayvalue': '1 DROP 0.5%'
                        },
                        'route': {
                            'entryien': '137',
                            'instance': '1',
                            'values': {
                                'internal': '20',
                                'external': 'RIGHT EYE'
                            },
                            'displayvalue': 'RIGHT EYE'
                        },
                        'drug': {
                            'entryien': '138',
                            'instance': '1',
                            'values': {
                                'internal': '746',
                                'external': 'PROPARACAINE HCL 0.5% OPH SOLN'
                            },
                            'displayvalue': 'PROPARACAINE HCL 0.5% OPH SOLN'
                        },
                        'schedule': {
                            'entryien': '170',
                            'instance': '1',
                            'values': {
                                'internal': '3ID',
                                'external': '3ID'
                            },
                            'displayvalue': '3ID'
                        },
                        'strength': {
                            'entryien': '384',
                            'instance': '1',
                            'values': {
                                'internal': '0.5%',
                                'external': '0.5%'
                            },
                            'displayvalue': '0.5%'
                        },
                        'sig': {
                            'entryien': '385',
                            'instance': '1',
                            'values': {
                                'text': 'INSTILL 1 DROP IN RIGHT EYE 3ID'
                            },
                            'displayvalue': 'INSTILL 1 DROP IN RIGHT EYE 3ID'
                        },
                        'dose': {
                            'entryien': '386',
                            'instance': '1',
                            'values': {
                                'internal': '&%&&&1 DROP&746&0.5&%',
                                'external': '&%&&&1 DROP&746&0.5&%'
                            },
                            'displayvalue': '&%&&&1 DROP&746&0.5&%'
                        },
                        'statements': {
                            'entryien': '1615',
                            'instance': '1',
                            'values': {
                                'text': 'Non-VA medication not recommended by VA provider.  '
                            },
                            'displayvalue': 'Non-VA medication not recommended by VA provider.  '
                        }
                    }],
                    'success': true
                }
            };
            expect(writebackmedoperationaldata._buildOrderPresets(input)).toEqual(expected_output);
        });

        it('Test buildDialogFormats', function() {
            var input = 'ORDERABLE^4^1^@1350^^^^^^384~\r\nSTRENGTH^384^^@1350^^^^^^^1\r\nNAME^1350^1.5';
            var expected_output = {
                'data': {
                    'items': [{
                        'ORDERABLE': {
                            'prmtien': '4',
                            'fmtseq': '1',
                            'fmt': '@1350',
                            'omit': '',
                            'lead': '',
                            'trail': '',
                            'nwln': '',
                            'wrap': '',
                            'child': '384~'
                        },
                        'STRENGTH': {
                            'prmtien': '384',
                            'fmtseq': '',
                            'fmt': '@1350',
                            'omit': '',
                            'lead': '',
                            'trail': '',
                            'nwln': '',
                            'wrap': '',
                            'child': '',
                            'ischild': '1'
                        },
                        'NAME': {
                            'prmtien': '1350',
                            'fmtseq': '1.5'
                        }
                    }],
                    'success': true
                }
            };
            expect(writebackmedoperationaldata._buildDialogFormat(input)).toEqual(expected_output);
        });

    });

    var requestParameters = {
        'supply': 30,
        'dose': '1^',
        'schedule': 'QDAY',
        'duration': '~^',
        'patientIEN': 3,
        'drugIEN': 461
    };

    describe('getDayToQuantity Verification', function() {
        var result;
        afterEach(function(){
            requestParameters.supply = 60;
            requestParameters.dose = '1^';
            requestParameters.schedule = 'QDAY';
            requestParameters.duration = '~^';
            requestParameters.patientIEN = 3;
            requestParameters.drugIEN = 461;
        });
        it('tests for valid supply', function() {
            result = writebackmedoperationaldata._verifyDayToQuantity(requestParameters);
            expect(result.length).toEqual(0);
        });
        it('test for valid dose', function(){
            delete requestParameters.dose;
            result = writebackmedoperationaldata._verifyDayToQuantity(requestParameters);
            expect(result).toEqual('There was no \'dose\' string in the request.\n');
        });
        it('test for valid schedule', function(){
            delete requestParameters.schedule;
            result = writebackmedoperationaldata._verifyDayToQuantity(requestParameters);
            expect(result).toEqual('There was no \'schedule\' string in the request.\n');
        });

    });
});
