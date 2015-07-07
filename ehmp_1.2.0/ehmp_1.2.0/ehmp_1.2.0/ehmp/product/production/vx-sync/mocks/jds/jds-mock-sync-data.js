'use strict';

var completedStamp = function(jpid, dfn) {
    return {
        'icn': '5000000116V912836',
        'syncCompleted': true,
        'sourceMetaStamp': {
            '9E7A': {
                'pid': '9E7A;' + dfn,
                'localId': dfn,
                'stampTime': 20141031094920,
                'syncCompleted': true,
                'domainMetaStamp': {
                    'allergy': {
                        'domain': 'allergy',
                        'stampTime': 20141031094920,
                        'syncCompleted': true,
                        'eventMetaStamp': {
                            'urn:va:allergy:9E7A:3:1001': {
                                'stampTime': 20141031094920,
                                'stored': true
                            },
                            'urn:va:allergy:9E7A:3:1002': {
                                'stampTime': 20141031094920,
                                'stored': true
                            }
                        }
                    },
                    'vital': {
                        'domain': 'vital',
                        'stampTime': 20141031094920,
                        'syncCompleted': true,
                        'eventMetaStamp': {
                            'urn:va:vital:9E7A:3:1001': {
                                'stampTime': 20141031094920,
                                'stored': true
                            },
                            'urn:va:vital:9E7A:3:1002': {
                                'stampTime': 20141031094920,
                                'stored': true
                            }
                        }
                    }
                }
            },
            'DOD': {
                'pid': 'DOD;00001',
                'localId': '00001',
                'stampTime': 20141031094920,
                'syncCompleted': true,
                'domainMetaStamp': {
                    'lab': {
                        'domain': 'lab',
                        'stampTime': 20141031094920,
                        'syncCompleted': true,
                        'eventMetaStamp': {
                            'urn:va:lab:DOD:00001:100100': {
                                'stampTime': 20141031094920,
                                'stored': true
                            },
                            'urn:va:lab:DOD:00001:100200': {
                                'stampTime': 20141031094920,
                                'stored': true
                            }
                        }
                    },
                    'vital': {
                        'domain': 'vital',
                        'stampTime': 20141031094920,
                        'syncCompleted': true,
                        'eventMetaStamp': {}
                    }
                }
            }
        }
    };
};

var inProgress = function(jpid, dfn) {
    return {
        'icn': '5000000116V912836',
        'syncCompleted': false,
        'sourceMetaStamp': {
            '9E7A': {
                'pid': '9E7A;' + dfn,
                'localId': dfn,
                'stampTime': 20141031094950,
                'syncCompleted': true,
                'domainMetaStamp': {
                    'allergy': {
                        'domain': 'allergy',
                        'stampTime': 20141031094950,
                        'syncCompleted': true,
                        'eventMetaStamp': {
                            'urn:va:allergy:9E7A:3:1001': {
                                'stampTime': 20141031094920,
                                'stored': true
                            },
                            'urn:va:allergy:9E7A:3:1002': {
                                'stampTime': 20141031094920,
                                'stored': true
                            }
                        }
                    },
                    'vital': {
                        'domain': 'vital',
                        'stampTime': 20141031094950,
                        'syncCompleted': true,
                        'eventMetaStamp': {
                            'urn:va:vital:9E7A:3:1001': {
                                'stampTime': 20141031094920,
                                'stored': true
                            },
                            'urn:va:vital:9E7A:3:1002': {
                                'stampTime': 20141031094920,
                                'stored': true
                            }
                        }
                    }
                }
            },
            'DOD': {
                'pid': 'DOD;00001',
                'localId': '00001',
                'stampTime': 20141031094950,
                'syncCompleted': false,
                'domainMetaStamp': {
                    'lab': {
                        'domain': 'lab',
                        'stampTime': 20141031094950,
                        'syncCompleted': true,
                        'eventMetaStamp': {
                            'urn:va:lab:DOD:00001:100100': {
                                'stampTime': 20141031094950,
                                'stored': true
                            },
                            'urn:va:lab:DOD:00001:100200': {
                                'stampTime': 20141031094950,
                                'stored': true
                            }
                        }
                    },
                    'vital': {
                        'domain': 'vital',
                        'stampTime': 20141031094920,
                        'syncCompleted': false,
                        'eventMetaStamp': {
                            'urn:va:vital:DOD:00001:1003000': {
                                'stampTime': 20141031094920,
                                'stored': false
                            }
                        }
                    }
                }
            }
        }
    };
};

var syncData = function(jpid, dfn) {
    var JPID_SYNC_INPROGRESS = '21EC2020-3AEA-4069-A2DD-08002B30309D';
    var JPID_SYNC_COMPLETE = '21EC2020-3AEA-4069-A2DD-BBBBBBBBBBBB';
    var data = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20141031094945,
            'totalItems': 1,
            'currentItemCount': 1,
            'items': [{}]
        }
    };

    var completedStampResult;
    var inProgressStampResult;

    if (jpid === JPID_SYNC_INPROGRESS) {
        completedStampResult = completedStamp(jpid, dfn);
        inProgressStampResult = inProgress(jpid, dfn);
    } else if (jpid === JPID_SYNC_COMPLETE) {
        completedStampResult = completedStamp(jpid, dfn);
        inProgressStampResult = {};
    } else {
        completedStampResult = {};
        inProgressStampResult = {};
    }

    data.data.items[0].completedStamp = completedStampResult;
    data.data.items[0].inProgress = inProgressStampResult;
    data.data.items[0].jpid = jpid;

    return data;
};

module.exports = syncData;
