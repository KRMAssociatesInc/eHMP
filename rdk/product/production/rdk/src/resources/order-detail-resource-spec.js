'use strict';

var VistaJS = require('../VistaJS/VistaJS');
var orderDetail = require('./order-detail-resource');

describe('Order Detail Resource', function() {
    it('tests that getResourceConfig() is setup correctly for orderDetail', function() {
        var resources = orderDetail.getResourceConfig();

        expect(resources[0].name).to.equal('detail');
        expect(resources[0].path).to.equal('/detail');
        expect(resources[0].healthcheck).not.to.be.undefined();
        expect(resources[0].parameters).not.to.be.undefined();
        expect(resources[0].get).not.to.be.undefined();
    });
});

describe('Order Detail', function() {

    beforeEach(function() {
        sinon.stub(VistaJS, 'callRpc');
    });

    it('tests getOrderDetail() gets called successfully', function() {
        var req = {
            interceptorResults: {
                patientIdentifiers: {
                    dfn: 3
                }
            },
            param: function() {
                return {
                    orderId: 18068
                };
            },
            session: {
                 user: {
                    username: '9E7A;pu1234',
                    password: 'pu1234!!',
                    site: '9E7A'
                }
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
                        context: 'ORQOR DETAIL',
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
            }
        };

        var res = {
            send: function(message, error) {
                console.log(message);
                console.log(error);
                return;
            }
        };

        orderDetail.getOrderDetail(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
    });

    it('Should return Activity section', function() {
        var result = 'Order Title Text\r\n   \r\nActivity:\r\n New Order entered by VEHU,SIXTYONE\r\nOrder Text:  CARDIOLOGY Consultant\'s Choice\r\n  Nature of Order: ELECTRONICALLY ENTERED\r\n Elec Signature: VEHU,FIFTEEN\r\n   \r\n';
        var order = {
             'Title' : 'Order Title Text',
             'Activity' : {
                'Summary': 'New Order entered by VEHU,SIXTYONE',
                'Order Text': 'CARDIOLOGY Consultant\'s Choice',
                'Nature of Order': 'ELECTRONICALLY ENTERED',
                'Elec Signature': 'VEHU,FIFTEEN'
            }
        };
        //result = 'Order Title Text\r\n   \r\nActivity:\r\nSummary Text\r\n     Order Text:        UPPER GI WITH KUB\r\n     Nature of Order:   ELECTRONICALLY ENTERED\r\n     Elec Signature:    VEHU,FIFTEEN (Scholar Extraor) on 04/15/2003 17:28\r\n04/11/2007 16:35  Discontinue entered by VEHU,NINETYNINE (Scholar Extraor)\r\n     Nature of Order:   ELECTRONICALLY ENTERED\r\n     Elec Signature:    VEHU,NINETYNINE (Scholar Extraor) on 04/11/2007 16:36\r\n     Reason for DC:     Requesting Physician Cancelled\r\n   \r\nCurrent Data:\r\nTreating Specialty:           \r\nOrdering Location:            GENERAL MEDICINE\r\nStart Date/Time:              04/15/2003\r\nStop Date/Time:               04/11/2007 16:36\r\nCurrent Status:               DISCONTINUED\r\nOrder #12977\r\n   \r\nOrder:\r\nProcedure:                    UPPER GI WITH KUB \r\nClinical History:             \r\n  UGI for follow-up of esophageal dilatation\r\nCategory:                     OUTPATIENT \r\nDate Desired:                 TODAY \r\nMode of Transport:            AMBULATORY \r\nIs patient on isolation procedures? NO \r\nUrgency:                      ROUTINE \r\n   \r\n''
        expect(orderDetail.parseResult(result)).to.eql(order);
    });

    it('Should return Current Data section', function() {
        var result = 'Order Title Text\r\n   \r\nCurrent Data:\r\nTreating Specialty: \r\nOrdering Location: GENERAL MEDICINE\r\nStart Date/Time: 04/15/2003\r\nStop Date/Time: 04/11/2007 16:36\r\nCurrent Status: DISCONTINUED\r\nOrder #12977\r\n   \r\n';
        var order = {
            'Title' : 'Order Title Text',
            'Current Data' : {
                'Treating Specialty' : '',
                'Ordering Location' : 'GENERAL MEDICINE',
                'Start Date/Time' : '04/15/2003',
                'Stop Date/Time' : '04/11/2007 16:36',
                'Current Status' : 'DISCONTINUED',
                'Order#' : '12977'
            },
            'id': '12977'
        };
        expect(orderDetail.parseResult(result)).to.eql(order);
    });

    it('Should return Order section', function() {
        var result ='Order Title Text\r\n   \r\nOrder: \r\nMedication: METFORMIN TAB, SA 500 MG\r\nInstructions: 500 MG ORAL(BY MOUTH) BID\r\nSig: \r\nTAKE ONE TABLET MOUTH TWICE A DAY\r\nDays Supply: 90\r\nQuantity: 180\r\nRefills: 0\r\nPick Up: WINDOW\r\n   \r\n';
        var order = {
            'Title': 'Order Title Text',
            'Order': {
                'Medication': 'METFORMIN TAB, SA 500 MG',
                'Instructions': '500 MG ORAL(BY MOUTH) BID',
                'Sig':'\\r\\nTAKE ONE TABLET MOUTH TWICE A DAY',
                'Days Supply': '90',
                'Quantity': '180',
                'Refills' : '0',
                'Pick Up': 'WINDOW'
            }
        };
        expect(orderDetail.parseResult(result)).to.eql(order);
    });

    it('Should return Order Checks section', function() {
        var result = 'Order Title Text\r\n   \r\nOrder Checks:\r\nMODERATE: SIGNIFICANT drug-drug interaction: ASPIRIN & WARFARIN (WARFARIN TAB\r\n5MG TAKE ONE TABLET BY BY MOUTH EVERY DAY AT 1 PM  [ACTIVE])\r\n   \r\n';
        var order = {
            'Title' : 'Order Title Text',
            'Order Checks' : {
                'MODERATE': 'SIGNIFICANT drug-drug interaction: ASPIRIN & WARFARIN (WARFARIN TAB\\r\\n5MG TAKE ONE TABLET BY BY MOUTH EVERY DAY AT 1 PM  [ACTIVE])'
            }
        };
        expect(orderDetail.parseResult(result)).to.eql(order);
    });

    it('Should return Dispense section', function() {
        var result = 'Order Title Text\r\n   \r\nDispense Drugs (units/dose): METFORMIN HCL 500MG TAB,SA ()\r\nLast Filled: 2/27/10\r\nRefills Remaining: 0\r\nFilled: 2/27/10 (Window) released 2/27/10\r\nPrescription#: 500609\r\nPharmacist: PHARMACIST,ONE\r\n   \r\n';
        var order = {
            'Title' : 'Order Title Text',
            'Dispense': {
                'Dispense Drugs (units/dose)': 'METFORMIN HCL 500MG TAB,SA ()',
                'Last Filled': '2/27/10',
                'Refills Remaining': '0',
                'Filled': '2/27/10 (Window) released 2/27/10',
                'Prescription#': '500609',
                'Pharmacist': 'PHARMACIST,ONE'
            }
        };

        expect(orderDetail.parseResult(result)).to.eql(order);
    });

    it('Should return Notes section', function() {
        var result = 'Order Title Text\r\n   \r\nAdditional Notes Text\r\n   \r\n'  ;
        var order = {
            'Title' : 'Order Title Text',
            'Notes' : 'Additional Notes Text'
        };
        expect(orderDetail.parseResult(result)).to.eql(order);
    });

});
