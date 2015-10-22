'use strict';
var rdk = require('../../../core/rdk');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        type: {
            required: false,
            description: 'all documents if not present. Discharge summary notes if equals to \'34745-0\'. For all others use \'34765-8\' '
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        }
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        get: getPatientAssessmentData,
        permissions: [],
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'authorization']
        }
    }];
};

var apiDocs = {
    spec: {
        path: '',
        nickname: 'patient-assessment',
        summary: '',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.swagger.paramTypes.query('type', 'type', 'string', true),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getPatientAssessmentData(req, res, next) {

    var outJSON = [{
        'category': {
            'displayName': 'Well Being',
        },
        'qna': [{
                'displayText': 'On the following scales from 1-5, with 1 being miserable and 5 being great, select where you feel you are on the scale.',
                'type': 'header'
            },
            [{
                'displayText': 'Physical Well Being (1 = miserable, 5 = great)',
                'response': '2',
                'type': 'rate'
            }, {
                'displayText': 'Mental/Emotional Well Being (1 = miserable, 5 = great)',
                'response': '5',
                'type': 'rate'
            }, {
                'displayText': 'Life: how is it to live your life day to day? (1 = miserable, 5 = great)',
                'response': '3',
                'type': 'rate'
            }],
        ]
    }, {
        'category': {
            'displayName': 'Well Being',
        },
        'qna': [{
                'displayText': 'On the following scales from 1-5, how lonely do you feel you are ?',
                'type': 'header'
            },
            [{
                'displayText': 'Loneliness (1 = Robinson Crusoe, 5 = Prom Queen)',
                'response': '2',
                'type': 'rate'
            }],
        ]
    }, {
        'category': {
            'displayName': 'Working The Body'
        },
        'qna': [{
                'displayText': '"Energy and Flexibility" Includes movement and physical activities like walking, dancing, gardening, sports, lifting weights, yoga, cycling, swimming, and working out in a gym.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '2',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Sed ut perspiciatis unde omnis.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '4',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Nemo enim ipsam voluptatem.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Recharge'
        },
        'qna': [{
                'displayText': '"Sleep and Refresh" Getting enough rest, relaxation, and sleep.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '3',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Lorem ipsum dolor sit amet.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '3',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Excepteur sint occaecat.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Food And Drink'
        },
        'qna': [{
                'displayText': '"Nourish and Fuel" Eating healthy, balanced meals with plenty of fruits and vegetables each day. Drinking enough water and limiting sodas, sweetened drinks, and alcohol.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '3',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Morbi at elit dapibus.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '5',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Proin ut congue tortor.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Personal Development',
        },
        'qna': [{
                'displayText': '"Personal life and Work life" Learning and growing. Developing abilities and talents. Balancing responsibilities where you live, volunteer, and work.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '1',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Nullam at eros id mi.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '5',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Duis blandit rhoncus elit.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Family, Friends, and Co-Workers'
        },
        'qna': [{
                'displayText': '"Relationships" Feeling listened to and connected to people you love and care about. The quality of your communication with family, friends and people you work with.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '3',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'In porta lacus sed enim porta.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '4',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Pellentesque malesuada velit. ',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Spirit And Soul'
        },
        'qna': [{
                'displayText': '"Growing and Connecting" Having a sense of purpose and meaning in your life. Feeling connected to something larger than yourself. Finding strength in difficult times.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '3',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Cum sociis natoque penatibus.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '5',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Suspendisse vel porttitor justo.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Surroundings'
        },
        'qna': [{
                'displayText': '"Physical and Emotional" Feeling safe. Having comfortable, healthy spaces where you work and live. The quality of the lighting, color, air, and water. Decreasing unpleasant clutter, noises, and smells.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '2',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Donec enim leo, aliquet eu vehicula.',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '5',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': 'Duis lacinia eu sapien et pulvinar.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Power Of The Mind'
        },
        'qna': [{
                'displayText': '"Strengthen and Listen" Tapping into the power of your mind to heal and cope. Using mind-body techniques like relaxation, breathing, or guided imagery.',
                'type': 'header'
            },
            [{
                'displayText': 'Rate where you are (1 (low) to 5 (high))',
                'response': '4',
                'type': 'rate'
            }, {
                'displayText': 'What are the reasons you choose this number?',
                'response': 'Duis lacinia eu sapien et pulvinar.s',
                'type': 'string'
            }],
            [{
                'displayText': 'Where would you like to be? (1 (low) to 5 (high))',
                'response': '5',
                'type': 'rate'
            }, {
                'displayText': 'What changes could you make to help you get there?',
                'response': ' Donec enim leo, aliquet eu vehicula.',
                'type': 'string'
            }]
        ]
    }, {
        'category': {
            'displayName': 'Professional Care'
        },
        'qna': [{
                'displayText': 'Prevention: On a scale of 1-5, select the number that best describes how up to date you are on your preventive care such as a flu shot, cholesterol check, cancer screening, and dental care.',
                'type': 'header'
            },
            [{
                'displayText': 'Select the number that best describes how up to date you are on your preventive care',
                'response': '3',
                'type': 'rate'
            }, {
                'displayText': 'Are you working with a healthcare professional to treat any clinical conditions?',
                'response': 'No',
                'type': 'string'
            }]
        ]
    }];

    res.status(200).rdkSend(outJSON);
}

module.exports.getPatientAssessmentData = getPatientAssessmentData;
module.exports.getResourceConfig = getResourceConfig;
