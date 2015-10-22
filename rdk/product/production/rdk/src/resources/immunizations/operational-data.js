'use strict';


var routeOfAdministrationList = [
    {
        route: 'INTRADERMAL',
        hl7Code: 'ID',
        fdanCIT: 'C38238',
        definition: 'Within of introduced between the layers of the skin.'
    },
    {
        route: 'INTRAMUSCULAR',
        hl7Code: 'IM',
        fdanCIT: 'C28161',
        definition: 'Within or into the substance of a muscle.'
    },
    {
        route: 'INTRAVENOUS',
        hl7Code: 'IV',
        fdanCIT: 'C38276',
        definition: 'Administered into a vein.'
    },
    {
        route: 'NASAL',
        hl7Code: 'NS',
        fdanCIT: 'C38284',
        definition: 'Given by nose.'
    },
    {
        route: 'ORAL',
        hl7Code: 'PO',
        fdanCIT: 'C38288',
        definition: 'Administered by mouth.'
    },
    {
        route: 'OTHER/MISCELLANEOUS',
        hl7Code: 'OTH',
        fdanCIT: '',
        definition: ''
    },
    {
        route: 'PERCUTANEOUS',
        hl7Code: '',
        fdanCIT: 'C38676',
        definition: 'Made, done, or effected through the skin.'
    },
    {
        route: 'SUBCUTANEOUS',
        hl7Code: 'SC',
        fdanCIT: 'C38299',
        definition: 'Under the skin or between skin and muscles.'
    },
    {
        route: 'TRANSDERMAL',
        hl7Code: 'TD',
        fdanCIT: 'C38305',
        definition: 'Describes something, especially a drug, that is introduced into the body through the skin.'
    }
];
var vaccineInformationStatementList = [
    {
        name: 'ADENOVIRUS VIS',
        language: 1,
        date: '07-14-11',
        status: 'HISTORIC',
        vaccines: [
            {
                name: 'ADENOVIRUS TYPES 4 AND 7'
            }]
    },
    {
        name: 'ADENOVIRUS VIS',
        language: 1,
        date: '06-11-14',
        status: 'CURRENT',
        vaccines: [
        {
            name: 'ADENOVIRUS TYPES 4 AND 7'
        }]
    },
    {
        name: 'ANTHRAX VIS',
        language: 1,
        date: '03-10-10',
        status: 'CURRENT'
    },
    {
        name: 'DIPHTHERIA/TETANUS/PERTUSSIS (DTAP) VIS',
        language: 1,
        date: '05-17-07',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'DTAP, 5 PERTUSSIS ANTIGENS'
            },
            {
                name: 'DTAP-HEP B-IPV'
            },
            {
                name: 'DTAP-HIB-IPV'
            },
            {
                name: 'DTAP-IPV'
            },
            {
                name: 'DTAP'
            }
        ]
    },
    {
        name: 'HAEMOPHILUS INFLUENZAE TYPE B VIS',
        language: 1,
        date: '12-19-68',
        status: 'HISTORIC',
        vaccines: [
            {
                name: 'DTAP-HIB-IPV'
            },
            {
                name: 'MENINGOCOCCAL C_Y-HIB PRP'
            },
            {
                name: 'HIB (PRP-OMP)'
            },
            {
                name: 'HIB (PRP-T)'
            },
            {
                name: 'HIB-HEP B'
            }
        ]
    },
    {
        name: 'HAEMOPHILUS INFLUENZAE TYPE B VIS',
        language: 1,
        date: '02-04-14',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'DTAP-HIB-IPV'
            },
            {
                name: 'MENINGOCOCCAL C_Y-HIB PRP'
            },
            {
                name: 'HIB (PRP-OMP)'
            },
            {
                name: 'HIB (PRP-T)'
            },
            {
                name: 'HIB-HEP B'
            }
        ]
    },
    {
        name: 'HEPATITIS A VIS',
        language: 1,
        date: '10-25-11',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'HEP A, ADULT'
            },
            {
                name: 'HEP A, PED_ADOL, 2 DOSE'
            },
            {
                name: 'HEP A-HEP B'
            },
            {
                name: 'HEP A, ADULT'
            },
            {
                name: 'HEP A, PED_ADOL, 2 DOSE'
            }
        ]
    },
    {
        name: 'HEPATITIS B VIS',
        language: 1,
        date: '02-02-12',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'HEP B, ADOLESCENT OR PEDIATRIC'
            },
            {
                name: 'HEP B, ADOLESCENT_HIGH RISK INFANT'
            },
            {
                name: 'HEP B, DIALYSIS'
            },
            {
                name: 'DTAP-HEP B-IPV'
            },
            {
                name: 'HEP B, ADULT'
            },
            {
                name: 'HEP A-HEP B'
            },
            {
                name: 'HIB-HEP B'
            }
        ]
    },
    {
        name: 'HUMAN PAPILLOMAVIRUS VACCINE (CERVARIX) VIS',
        language: 1,
        date: ' 05-03-11',
        status: 'CURRENT',
        vaccines:[
            {
                name: 'HPV, BIVALENT'
            }
        ]
    },
    {
        name: 'HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS',
        language: 1,
        date: ' 07-02-12',
        status: 'HISTORIC',
        vaccines:[
            {
                name: 'HPV, BIVALENT'
            }
        ]
    },
    {
        name: 'HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS',
        language: 1,
        date: '05-17-13',
        status: 'CURRENT',
        vaccines:[
            {
                name: 'HPV, BIVALENT'
            }
        ]
    },
    {
        name: 'INFLUENZA VACCINE - INACTIVATED VIS',
        language: 1,
        date: '07-02-12',
        status: 'HISTORIC',
        vaccines: [
            {
                name: 'INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE'
            },
            {
                name: 'INFLUENZA, SEASONAL, INJECTABLE'
            },
            {
                name: 'INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE'
            },
            {
                name: 'INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE'
            }
        ]
    },
    {
        name: 'INFLUENZA VACCINE - INACTIVATED VIS',
        language: 1,
        date: '07-26-13',
        status: 'HISTORIC',
        vaccines: [
            {
                name: 'INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE'
            },
            {
                name: 'INFLUENZA, SEASONAL, INJECTABLE'
            },
            {
                name: 'INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE'
            },
            {
                name: 'INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE'
            }
        ]
    },
    {
        name: 'INFLUENZA VACCINE - INACTIVATED VIS',
        language: 1,
        date: '08-19-14',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE'
            },
            {
                name: 'INFLUENZA, SEASONAL, INJECTABLE'
            },
            {
                name: 'INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE'
            },
            {
                name: 'INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE'
            }
        ]
    },
    {
        name: 'INFLUENZA VACCINE - LIVE, INTRANASAL VIS',
        language: 1,
        date: '07-02-12',
        status: 'HISTORIC',
        vaccines: [
            {
                name: 'INFLUENZA, LIVE, INTRANASAL'
            },
            {
                name: 'INFLUENZA, LIVE, INTRANASAL, QUADRIVALENT'
            },
            {
                name: 'INFLUENZA, LIVE, INTRANASAL'
            }
        ]
    },
    {
        name: 'INFLUENZA VACCINE - LIVE, INTRANASAL VIS',
        language: 1,
        date: '07-26-13',
        status: 'HISTORIC',
        vaccines: [
        {
            name: 'INFLUENZA, LIVE, INTRANASAL'
        },
        {
            name: 'INFLUENZA, LIVE, INTRANASAL, QUADRIVALENT'
        },
        {
            name: 'INFLUENZA, LIVE, INTRANASAL'
        }
    ]
    },
    {
        name: 'HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS',
        language: 1,
        date: '08-19-14',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'HPV, QUADRIVALENT'
            }
        ]
    },
    {
        name: 'JAPANESE ENCEPHALITIS VIS',
        language: 1,
        date: '12-07-11',
        status: 'HISTORIC',
        vaccines: [
            {
                name: 'JAPANESE ENCEPHALITIS IM'
            }
        ]
    },
    {
        name: 'JAPANESE ENCEPHALITIS VIS',
        language: 1,
        date: '01-24-14',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'JAPANESE ENCEPHALITIS IM'
            }
        ]
    },
    {
        name: 'MEASLES/MUMPS/RUBELLA VIS',
        language: 1,
        date: '04-20-12',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'MMR'
            }
        ]
    },
    {
        name: 'MENINGOCOCCAL VIS',
        language: 1,
        date: '10-14-11',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'MENINGOCOCCAL MPSV4'
            },
            {
                name: 'MENINGOCOCCAL MCV4P'
            },
            {
                name: 'MENINGOCOCCAL MCV4O'
            },
            {
                name: 'MENINGOCOCCAL MPSV4'
            }
        ]
    },
    {
        name: 'MULTIPLE VACCINES VIS',
        language: 1,
        date: '11-16-12',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'MENINGOCOCCAL MCV4O'
            }
        ]
    },
    {
        name: 'PNEUMOCOCCAL CONJUGATE (PCV13) VIS',
        language: 1,
        date: '02-27-13',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'PNEUMOCOCCAL CONJUGATE PCV 13'
            }
        ]
    },
    {
        name: 'PNEUMOCOCCAL POLYSACCHARIDE VIS',
        language: 1,
        date: '10-06-09',
        status: 'CURRENT'
    },
    {
        name: 'POLIO VIS',
        language: 1,
        date: '11-08-11',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'IPV'
            }
        ]
    },
    {
        name: 'RABIES VIS',
        language: 1,
        date: '10-06-09',
        status: 'CURRENT',
        vaccines: [
            {
                name: 'RABIES, INTRAMUSCULAR INJECTION'
            }
        ]
    },
    {
        name: 'ROTAVIRUS VIS',
        language: 1,
        date: '12-06-10',
        status: 'HISTORIC',
        vaccine: [
            {
                name: 'ROTAVIRUS, MONOVALENT'
            },
            {
                name: 'ROTAVIRUS, PENTAVALENT'
            }
        ]
    },
    {
        name: 'ROTAVIRUS VIS',
        language: 1,
        date: '08-26-13',
        status: 'CURRENT',
        vaccine: [
        {
            name: 'ROTAVIRUS, MONOVALENT'
        },
        {
            name: 'ROTAVIRUS, PENTAVALENT'
        }
    ]
    },
    {
        name: 'SHINGLES VIS',
        language: 1,
        date: '10-06-09',
        status: 'CURRENT',
        vaccine: [
            {
                name: 'ZOSTER'
            }
        ]
    },
    {
        name: 'TETANUS/DIPHTHERIA (TD) VIS',
        language: 1,
        date: '02-04-14',
        status: 'CURRENT',
        vaccine: [
            {
                name: 'TETANUS TOXOID, NOT ADSORBED'
            },
            {
                name: 'TD (ADULT), ADSORBED'
            },
            {
                name: 'TETANUS TOXOID, ADSORBED'
            },
            {
                name: 'TD (ADULT) PRESERVATIVE FREE'
            },
            {
                name: 'TD (ADULT)'
            }
        ]
    },
    {
        name: 'TETANUS/DIPHTHERIA/PERTUSSIS (TDAP) VIS',
        language: 1,
        date: '05-09-13',
        status: 'CURRENT',
        vaccine: [
            {
                name: 'TDAP'
            }
        ]
    },
    {
        name: 'TETANUS/DIPHTHERIA/PERTUSSIS (TDAP/TD) VIS',
        language: 1,
        date: '01-24-12',
        status: 'HISTORIC',
        vaccine: [
            {
                name: 'TDAP'
            }
        ]
    },
    {
        name: 'TYPHOID VIS',
        language: 1,
        date: '05-29-12',
        status: 'CURRENT',
        vaccine: [
            {
                name: 'TYPHOID, ORAL'
            },
            {
                name: 'TYPHOID, PARENTERAL'
            },
            {
                name: 'TYPHOID, VICPS'
            }
        ]
    },
    {
        name: 'VARICELLA (CHICKENPOX) VIS',
        language: 1,
        date: '03-13-08',
        status: 'CURRENT',
        vaccine: [
            {
                name: 'VARICELLA'
            }
        ]
    }
];
var infoSourceList = [
    {
        source: 'Historical information -from birth certificate',
        hl7Code: '"06',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -from other provider',
        hl7Code: '"02',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -from other registry',
        hl7Code: '"05',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -from parent\'s recall',
        hl7Code: '"04',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -from parent\'s written record',
        hl7Code: '"03',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -from public agency',
        hl7Code: '"08',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -from school record',
        hl7Code: '"07',
        status: 'ACTIVE'
    },
    {
        source: 'Historical information -source unspecified',
        hl7Code: '"01',
        status: 'ACTIVE'
    }
];
var anatomicLocationList = [
    {
        site: 'LEFT DELTOID',
        hl7Code: 'LD'
    },
    {
        site: 'LEFT GLUTEOUS MEDIUS',
        hl7Code: 'LG'
    },
    {
        site: 'LEFT LOWER FOREARM',
        hl7Code: 'LLFA'
    },
    {
        site: 'LEFT THIGH',
        hl7Code: 'LT'
    },
    {
        site: 'LEFT UPPER ARM',
        hl7Code: 'LA'
    },
    {
        site: 'LEFT VASTUS LATERALIS',
        hl7Code: 'LVL'
    },
    {
        site: 'RIGHT DELTOID',
        hl7Code: 'RD'
    },
    {
        site: 'RIGHT GLUTEOUS MEDIUS',
        hl7Code: 'RG'
    },
    {
        site: 'RIGHT LOWER FOREARM',
        hl7Code: 'RLFA'
    },
    {
        site: 'RIGHT THIGH',
        hl7Code: 'RT'
    },
    {
        site: 'RIGHT UPPER ARM',
        hl7Code: 'RA'
    },
    {
        site: 'RIGHT VASTUS LATERALIS',
        hl7Code: 'RVL'
    }
];
var lotNumberList = [
    {
        lotNumber: 'EHMP0001',
        manufacturer: 'ABBOTT LABORATORIES',
        status: 'ACTIVE',
        vaccine: 'INFLUENZA, HIGH DOSE SEASONAL',
        expirationDate: 'Dec 01, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0001'
    },
    {
        lotNumber: 'EHMP0002',
        manufacturer: 'ABBOTT LABORATORIES',
        status: 'ACTIVE',
        vaccine: 'INFLUENZA, LIVE, INTRANASAL',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0001'
    },
    {
        lotNumber: 'EHMP0003',
        manufacturer: 'ABBOTT LABORATORIES',
        status: 'ACTIVE',
        vaccine: 'INFLUENZA, LIVE, INTRANASAL',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10
    },
    {
        lotNumber: 'EHMP0004',
        manufacturer: 'ABBOTT LABORATORIES',
        status: 'ACTIVE',
        vaccine: 'INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0004'
    },
    {
        lotNumber: 'EHMP0005',
        manufacturer: 'AKORN, INC',
        status: 'ACTIVE',
        vaccine: 'INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0005'
    },
    {
        lotNumber: 'EHMP0006',
        manufacturer: 'ALPHA THERAPEUTIC CORPORATION',
        status: 'ACTIVE',
        vaccine: 'HEP A-HEP B',
        vaccine_2: 'HEP A, ADULT',
        vaccine_3: 'HEP B, ADOLESCENT OR PEDIATRIC',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0006'
    },
    {
        lotNumber: 'EHMP0007',
        manufacturer: 'BARR LABORATORIES',
        status: 'ACTIVE',
        vaccine: 'HEP B, ADULT',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0007'
    },
    {
        lotNumber: 'EHMP0008',
        manufacturer: 'BAXTER HEALTHCARE CORPORATION',
        status: 'ACTIVE',
        vaccine: 'TETANUS TOXOID, ADSORBED',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP0008'
    },
    {
        lotNumber: 'EHMP0009',
        manufacturer: 'BERNA PRODUCTS CORPORATION',
        status: 'ACTIVE',
        vaccine: 'DTAP-HIB',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200
    },
    {
        lotNumber: 'EHMP00010EXP',
        manufacturer: 'CRUCELL',
        status: 'EXPIRED',
        vaccine: 'MMR',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200,
        lowSupplyAlter: 10,
        lotNumberForExport: 'EHMP00010EXP'
    },
    {
        lotNumber: 'EHMP00011',
        manufacturer: 'PNEUMOCOCCAL POLYSACCHARIDE PPV23',
        status: 'ACTIVE',
        vaccine: 'MMR',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200
    },
    {
        lotNumber: 'EHMP00012',
        manufacturer: 'CSL BEHRING, INC',
        status: 'ACTIVE',
        vaccine: 'PNEUMOCOCCAL CONJUGATE PCV 13',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200
    },
    {
        lotNumber: 'EHMP00013',
        manufacturer: 'CSL BEHRING, INC',
        status: 'ACTIVE',
        vaccine: 'DTAP, 5 PERTUSSIS ANTIGENS',
        expirationDate: 'Dec 31, 2015',
        doseUnused: 200,
        startingCount: 200
    }
];
var reactionList = [
    {
        Value: '1',
        DisplayText: 'FEVER'
    },
    {
        Value: '2',
        DisplayText: 'IRRITABILITY'
    },
    {
        Value: '3',
        DisplayText: 'LOCAL REACTION OR SWELLING'
    },
    {
        Value: '4',
        DisplayText: 'VOMITING'
    },
    {
        Value: '5',
        DisplayText: 'RASH OR ITCHING'
    },
    {
        Value: '6',
        DisplayText: 'LETHARGY'
    },
    {
        Value: '7',
        DisplayText: 'CONVULSIONS'
    },
    {
        Value: '8',
        DisplayText: 'ARTHRITIS OR ARTHRALGIAS'
    },
    {
        Value: '9',
        DisplayText: 'ANAPHYLAXIS OR COLLAPSE'
    },
    {
        Value: '10',
        DisplayText: 'RESPIRATORY DISTRESS'
    },
    {
        Value: '11',
        DisplayText: 'OTHER'
    },
    {
        Value: '0',
        DisplayText: 'NONE'
    }
];
var seriesList = [
    {
        Value: 'P',
        DisplayText: 'PARTIALLY COMPLETE'
    },
    {
        Value: 'C',
        DisplayText: 'COMPLETE'
    },
    {
        Value: 'B',
        DisplayText: 'BOOSTER'
    },
    {
        Value: '1',
        DisplayText: 'SERIES 1'
    },
    {
        Value: '2',
        DisplayText: 'SERIES 2'
    },
    {
        Value: '3',
        DisplayText: 'SERIES 3'
    },
    {
        Value: '4',
        DisplayText: 'SERIES 4'
    },
    {
        Value: '5',
        DisplayText: 'SERIES 5'
    },
    {
        Value: '6',
        DisplayText: 'SERIES 6'
    },
    {
        Value: '7',
        DisplayText: 'SERIES 7'
    },
    {
        Value: '8',
        DisplayText: 'SERIES 8'
    }
];

var completeOperationalData = {
    //vaccineInformationStatement: vaccineInformationStatementList,
    //lotNumbers : lotNumberList,
    routeOfAdministration: routeOfAdministrationList,
    infoSource: infoSourceList,
    anatomicLocation: anatomicLocationList,
    reaction: reactionList,
    series : seriesList
};

var staticOperationalData = {
    routeOfAdministration: routeOfAdministrationList,
    infoSource: infoSourceList,
    anatomicLocation: anatomicLocationList,
    reaction: reactionList,
    series : seriesList
};

var immunizations = [
{
    localId: '1',
    mnemonic: 'SMALLPOX',
    name: 'VACCINIA (SMALLPOX)',
    uid: 'urn:va:immunization-list:9E7A:1'
},
{
    localId: '10',
    mnemonic: 'HEP B',
    name: 'HEP B, ADULT',
    uid: 'urn:va:immunization-list:9E7A:10'
},
{
    localId: '1008',
    mnemonic: '',
    name: 'HEP B, ADOLESCENT OR PEDIATRIC',
    uid: 'urn:va:immunization-list:9E7A:1008'
},
{
    localId: '1009',
    mnemonic: '',
    name: 'TD (ADULT), ADSORBED',
    uid: 'urn:va:immunization-list:9E7A:1009'
},
{
    localId: '1010',
    mnemonic: '',
    name: 'IPV',
    uid: 'urn:va:immunization-list:9E7A:1010'
},
{
    localId: '1020',
    mnemonic: '',
    name: 'DTAP',
    uid: 'urn:va:immunization-list:9E7A:1020'
},
{
    localId: '1032',
    mnemonic: '',
    name: 'MENINGOCOCCAL MPSV4',
    uid: 'urn:va:immunization-list:9E7A:1032'
},
{
    localId: '1035',
    mnemonic: '',
    name: 'TETANUS TOXOID, ADSORBED',
    uid: 'urn:va:immunization-list:9E7A:1035'
},
{
    localId: '1039',
    mnemonic: '',
    name: 'JAPANESE ENCEPHALITIS SC',
    uid: 'urn:va:immunization-list:9E7A:1039'
},
{
    localId: '1044',
    mnemonic: '',
    name: 'HEP B, DIALYSIS',
    uid: 'urn:va:immunization-list:9E7A:1044'
},
{
    localId: '1050',
    mnemonic: '',
    name: 'DTAP-HIB',
    uid: 'urn:va:immunization-list:9E7A:1050'
},
{
    localId: '1062',
    mnemonic: '',
    name: 'HPV, QUADRIVALENT',
    uid: 'urn:va:immunization-list:9E7A:1062'
},
{
    localId: '1100',
    mnemonic: '',
    name: 'PNEUMOCOCCAL CONJUGATE PCV 7',
    uid: 'urn:va:immunization-list:9E7A:1100'
},
{
    localId: '1101',
    mnemonic: '',
    name: 'TYPHOID, VICPS',
    uid: 'urn:va:immunization-list:9E7A:1101'
},
{
    localId: '1106',
    mnemonic: '',
    name: 'DTAP, 5 PERTUSSIS ANTIGENS',
    uid: 'urn:va:immunization-list:9E7A:1106'
},
{
    localId: '1110',
    mnemonic: '',
    name: 'DTAP-HEP B-IPV',
    uid: 'urn:va:immunization-list:9E7A:1110'
},
{
    localId: '1113',
    mnemonic: '',
    name: 'TD (ADULT) PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:9E7A:1113'
},
{
    localId: '1114',
    mnemonic: '',
    name: 'MENINGOCOCCAL MCV4P',
    uid: 'urn:va:immunization-list:9E7A:1114'
},
{
    localId: '1115',
    mnemonic: '',
    name: 'TDAP',
    uid: 'urn:va:immunization-list:9E7A:1115'
},
{
    localId: '1116',
    mnemonic: '',
    name: 'ROTAVIRUS, PENTAVALENT',
    uid: 'urn:va:immunization-list:9E7A:1116'
},
{
    localId: '1118',
    mnemonic: '',
    name: 'HPV, BIVALENT',
    uid: 'urn:va:immunization-list:9E7A:1118'
},
{
    localId: '1119',
    mnemonic: '',
    name: 'ROTAVIRUS, MONOVALENT',
    uid: 'urn:va:immunization-list:9E7A:1119'
},
{
    localId: '1120',
    mnemonic: '',
    name: 'DTAP-HIB-IPV',
    uid: 'urn:va:immunization-list:9E7A:1120'
},
{
    localId: '1121',
    mnemonic: '',
    name: 'ZOSTER',
    uid: 'urn:va:immunization-list:9E7A:1121'
},
{
    localId: '1130',
    mnemonic: '',
    name: 'DTAP-IPV',
    uid: 'urn:va:immunization-list:9E7A:1130'
},
{
    localId: '1134',
    mnemonic: '',
    name: 'JAPANESE ENCEPHALITIS IM',
    uid: 'urn:va:immunization-list:9E7A:1134'
},
{
    localId: '1136',
    mnemonic: '',
    name: 'MENINGOCOCCAL MCV4O',
    uid: 'urn:va:immunization-list:9E7A:1136'
},
{
    localId: '1138',
    mnemonic: '',
    name: 'TD (ADULT)',
    uid: 'urn:va:immunization-list:9E7A:1138'
},
{
    localId: '1140',
    mnemonic: '',
    name: 'INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:9E7A:1140'
},
{
    localId: '1141',
    mnemonic: '',
    name: 'INFLUENZA, SEASONAL, INJECTABLE',
    uid: 'urn:va:immunization-list:9E7A:1141'
},
{
    localId: '1142',
    mnemonic: '',
    name: 'TETANUS TOXOID, NOT ADSORBED',
    uid: 'urn:va:immunization-list:9E7A:1142'
},
{
    localId: '1143',
    mnemonic: '',
    name: 'ADENOVIRUS TYPES 4 AND 7',
    uid: 'urn:va:immunization-list:9E7A:1143'
},
{
    localId: '1144',
    mnemonic: '',
    name: 'INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:9E7A:1144'
},
{
    localId: '1148',
    mnemonic: '',
    name: 'MENINGOCOCCAL C/Y-HIB PRP',
    uid: 'urn:va:immunization-list:9E7A:1148'
},
{
    localId: '1149',
    mnemonic: '',
    name: 'INFLUENZA, LIVE, INTRANASAL, QUADRIVALENT',
    uid: 'urn:va:immunization-list:9E7A:1149'
},
{
    localId: '1150',
    mnemonic: '',
    name: 'INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:9E7A:1150'
},
{
    localId: '1153',
    mnemonic: '',
    name: 'INFLUENZA, INJECTABLE, MDCK, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:9E7A:1153'
},
{
    localId: '1155',
    mnemonic: '',
    name: 'INFLUENZA, RECOMBINANT, INJECTABLE, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:9E7A:1155'
},
{
    localId: '1158',
    mnemonic: '',
    name: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
    uid: 'urn:va:immunization-list:9E7A:1158'
},
{
    localId: '1160',
    mnemonic: '',
    name: 'INFLUENZA A MONOVALENT (H5N1), ADJUVANTED-2013',
    uid: 'urn:va:immunization-list:9E7A:1160'
},
{
    localId: '14',
    mnemonic: 'RUBELLA',
    name: 'RUBELLA',
    uid: 'urn:va:immunization-list:9E7A:14'
},
{
    localId: '15',
    mnemonic: 'MUMPS',
    name: 'MUMPS',
    uid: 'urn:va:immunization-list:9E7A:15'
},
{
    localId: '17',
    mnemonic: 'MMR',
    name: 'MMR',
    uid: 'urn:va:immunization-list:9E7A:17'
},
{
    localId: '1801',
    mnemonic: '',
    name: 'AS03 ADJUVANT',
    uid: 'urn:va:immunization-list:9E7A:1801'
},
{
    localId: '20',
    mnemonic: 'YELLOW FEV',
    name: 'YELLOW FEVER',
    uid: 'urn:va:immunization-list:9E7A:20'
},
{
    localId: '23',
    mnemonic: 'DT-PEDS',
    name: 'DT (PEDIATRIC)',
    uid: 'urn:va:immunization-list:9E7A:23'
},
{
    localId: '28',
    mnemonic: 'VARCELLA',
    name: 'VARICELLA',
    uid: 'urn:va:immunization-list:9E7A:28'
},
{
    localId: '34',
    mnemonic: 'MMR&V',
    name: 'MMRV',
    uid: 'urn:va:immunization-list:9E7A:34'
},
{
    localId: '35',
    mnemonic: 'PLAGUE',
    name: 'PLAGUE',
    uid: 'urn:va:immunization-list:9E7A:35'
},
{
    localId: '41',
    mnemonic: 'ANT SC',
    name: 'ANTHRAX',
    uid: 'urn:va:immunization-list:9E7A:41'
},
{
    localId: '42',
    mnemonic: 'BCG P',
    name: 'BCG',
    uid: 'urn:va:immunization-list:9E7A:42'
},
{
    localId: '45',
    mnemonic: 'HEPA AD',
    name: 'HEP A, ADULT',
    uid: 'urn:va:immunization-list:9E7A:45'
},
{
    localId: '46',
    mnemonic: 'HEPA PED/ADOL-2',
    name: 'HEP A, PED/ADOL, 2 DOSE',
    uid: 'urn:va:immunization-list:9E7A:46'
},
{
    localId: '48',
    mnemonic: 'HEPA/HEPB AD',
    name: 'HEP A-HEP B',
    uid: 'urn:va:immunization-list:9E7A:48'
},
{
    localId: '500007',
    mnemonic: 'PNEUMOVAX',
    name: 'PNEUMOCOCCAL POLYSACCHARIDE PPV23',
    uid: 'urn:va:immunization-list:9E7A:500007'
},
{
    localId: '51',
    mnemonic: 'HIB PRP-OMP',
    name: 'HIB (PRP-OMP)',
    uid: 'urn:va:immunization-list:9E7A:51'
},
{
    localId: '52',
    mnemonic: 'HIB PRP-T',
    name: 'HIB (PRP-T)',
    uid: 'urn:va:immunization-list:9E7A:52'
},
{
    localId: '55',
    mnemonic: 'FLU NAS',
    name: 'INFLUENZA, LIVE, INTRANASAL',
    uid: 'urn:va:immunization-list:9E7A:55'
},
{
    localId: '58',
    mnemonic: 'RAB',
    name: 'RABIES, INTRAMUSCULAR INJECTION',
    uid: 'urn:va:immunization-list:9E7A:58'
},
{
    localId: '59',
    mnemonic: 'RAB ID',
    name: 'RABIES, INTRADERMAL INJECTION',
    uid: 'urn:va:immunization-list:9E7A:59'
},
{
    localId: '61',
    mnemonic: 'TYP ORAL',
    name: 'TYPHOID, ORAL',
    uid: 'urn:va:immunization-list:9E7A:61'
},
{
    localId: '612013',
    mnemonic: 'FLU,HI DOS',
    name: 'INFLUENZA, HIGH DOSE SEASONAL',
    uid: 'urn:va:immunization-list:9E7A:612013'
},
{
    localId: '63',
    mnemonic: 'TYP H-P-SC/ID',
    name: 'TYPHOID, PARENTERAL',
    uid: 'urn:va:immunization-list:9E7A:63'
},
{
    localId: '64',
    mnemonic: 'TYP AKD-SC',
    name: 'TYPHOID, PARENTERAL, AKD (U.S. MILITARY)',
    uid: 'urn:va:immunization-list:9E7A:64'
},
{
    localId: '66',
    mnemonic: 'HEPB/HIB',
    name: 'HIB-HEP B',
    uid: 'urn:va:immunization-list:9E7A:66'
},
{
    localId: '67',
    mnemonic: 'PNEU PCV13',
    name: 'PNEUMOCOCCAL CONJUGATE PCV 13',
    uid: 'urn:va:immunization-list:9E7A:67'
},
{
    localId: '1',
    mnemonic: 'SMALLPOX',
    name: 'VACCINIA (SMALLPOX)',
    uid: 'urn:va:immunization-list:C877:1'
},
{
    localId: '10',
    mnemonic: 'HEP B',
    name: 'HEP B, ADULT',
    uid: 'urn:va:immunization-list:C877:10'
},
{
    localId: '1008',
    mnemonic: '',
    name: 'HEP B, ADOLESCENT OR PEDIATRIC',
    uid: 'urn:va:immunization-list:C877:1008'
},
{
    localId: '1009',
    mnemonic: '',
    name: 'TD (ADULT), ADSORBED',
    uid: 'urn:va:immunization-list:C877:1009'
},
{
    localId: '1010',
    mnemonic: '',
    name: 'IPV',
    uid: 'urn:va:immunization-list:C877:1010'
},
{
    localId: '1020',
    mnemonic: '',
    name: 'DTAP',
    uid: 'urn:va:immunization-list:C877:1020'
},
{
    localId: '1032',
    mnemonic: '',
    name: 'MENINGOCOCCAL MPSV4',
    uid: 'urn:va:immunization-list:C877:1032'
},
{
    localId: '1035',
    mnemonic: '',
    name: 'TETANUS TOXOID, ADSORBED',
    uid: 'urn:va:immunization-list:C877:1035'
},
{
    localId: '1039',
    mnemonic: '',
    name: 'JAPANESE ENCEPHALITIS SC',
    uid: 'urn:va:immunization-list:C877:1039'
},
{
    localId: '1044',
    mnemonic: '',
    name: 'HEP B, DIALYSIS',
    uid: 'urn:va:immunization-list:C877:1044'
},
{
    localId: '1050',
    mnemonic: '',
    name: 'DTAP-HIB',
    uid: 'urn:va:immunization-list:C877:1050'
},
{
    localId: '1062',
    mnemonic: '',
    name: 'HPV, QUADRIVALENT',
    uid: 'urn:va:immunization-list:C877:1062'
},
{
    localId: '1100',
    mnemonic: '',
    name: 'PNEUMOCOCCAL CONJUGATE PCV 7',
    uid: 'urn:va:immunization-list:C877:1100'
},
{
    localId: '1101',
    mnemonic: '',
    name: 'TYPHOID, VICPS',
    uid: 'urn:va:immunization-list:C877:1101'
},
{
    localId: '1106',
    mnemonic: '',
    name: 'DTAP, 5 PERTUSSIS ANTIGENS',
    uid: 'urn:va:immunization-list:C877:1106'
},
{
    localId: '1110',
    mnemonic: '',
    name: 'DTAP-HEP B-IPV',
    uid: 'urn:va:immunization-list:C877:1110'
},
{
    localId: '1113',
    mnemonic: '',
    name: 'TD (ADULT) PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:C877:1113'
},
{
    localId: '1114',
    mnemonic: '',
    name: 'MENINGOCOCCAL MCV4P',
    uid: 'urn:va:immunization-list:C877:1114'
},
{
    localId: '1115',
    mnemonic: '',
    name: 'TDAP',
    uid: 'urn:va:immunization-list:C877:1115'
},
{
    localId: '1116',
    mnemonic: '',
    name: 'ROTAVIRUS, PENTAVALENT',
    uid: 'urn:va:immunization-list:C877:1116'
},
{
    localId: '1118',
    mnemonic: '',
    name: 'HPV, BIVALENT',
    uid: 'urn:va:immunization-list:C877:1118'
},
{
    localId: '1119',
    mnemonic: '',
    name: 'ROTAVIRUS, MONOVALENT',
    uid: 'urn:va:immunization-list:C877:1119'
},
{
    localId: '1120',
    mnemonic: '',
    name: 'DTAP-HIB-IPV',
    uid: 'urn:va:immunization-list:C877:1120'
},
{
    localId: '1121',
    mnemonic: '',
    name: 'ZOSTER',
    uid: 'urn:va:immunization-list:C877:1121'
},
{
    localId: '1130',
    mnemonic: '',
    name: 'DTAP-IPV',
    uid: 'urn:va:immunization-list:C877:1130'
},
{
    localId: '1134',
    mnemonic: '',
    name: 'JAPANESE ENCEPHALITIS IM',
    uid: 'urn:va:immunization-list:C877:1134'
},
{
    localId: '1136',
    mnemonic: '',
    name: 'MENINGOCOCCAL MCV4O',
    uid: 'urn:va:immunization-list:C877:1136'
},
{
    localId: '1138',
    mnemonic: '',
    name: 'TD (ADULT)',
    uid: 'urn:va:immunization-list:C877:1138'
},
{
    localId: '1140',
    mnemonic: '',
    name: 'INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:C877:1140'
},
{
    localId: '1141',
    mnemonic: '',
    name: 'INFLUENZA, SEASONAL, INJECTABLE',
    uid: 'urn:va:immunization-list:C877:1141'
},
{
    localId: '1142',
    mnemonic: '',
    name: 'TETANUS TOXOID, NOT ADSORBED',
    uid: 'urn:va:immunization-list:C877:1142'
},
{
    localId: '1143',
    mnemonic: '',
    name: 'ADENOVIRUS TYPES 4 AND 7',
    uid: 'urn:va:immunization-list:C877:1143'
},
{
    localId: '1144',
    mnemonic: '',
    name: 'INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:C877:1144'
},
{
    localId: '1148',
    mnemonic: '',
    name: 'MENINGOCOCCAL C/Y-HIB PRP',
    uid: 'urn:va:immunization-list:C877:1148'
},
{
    localId: '1149',
    mnemonic: '',
    name: 'INFLUENZA, LIVE, INTRANASAL, QUADRIVALENT',
    uid: 'urn:va:immunization-list:C877:1149'
},
{
    localId: '1150',
    mnemonic: '',
    name: 'INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:C877:1150'
},
{
    localId: '1153',
    mnemonic: '',
    name: 'INFLUENZA, INJECTABLE, MDCK, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:C877:1153'
},
{
    localId: '1155',
    mnemonic: '',
    name: 'INFLUENZA, RECOMBINANT, INJECTABLE, PRESERVATIVE FREE',
    uid: 'urn:va:immunization-list:C877:1155'
},
{
    localId: '1158',
    mnemonic: '',
    name: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
    uid: 'urn:va:immunization-list:C877:1158'
},
{
    localId: '1160',
    mnemonic: '',
    name: 'INFLUENZA A MONOVALENT (H5N1), ADJUVANTED-2013',
    uid: 'urn:va:immunization-list:C877:1160'
},
{
    localId: '14',
    mnemonic: 'RUBELLA',
    name: 'RUBELLA',
    uid: 'urn:va:immunization-list:C877:14'
},
{
    localId: '15',
    mnemonic: 'MUMPS',
    name: 'MUMPS',
    uid: 'urn:va:immunization-list:C877:15'
},
{
    localId: '17',
    mnemonic: 'MMR',
    name: 'MMR',
    uid: 'urn:va:immunization-list:C877:17'
},
{
    localId: '1801',
    mnemonic: '',
    name: 'AS03 ADJUVANT',
    uid: 'urn:va:immunization-list:C877:1801'
},
{
    localId: '20',
    mnemonic: 'YELLOW FEV',
    name: 'YELLOW FEVER',
    uid: 'urn:va:immunization-list:C877:20'
},
{
    localId: '23',
    mnemonic: 'DT-PEDS',
    name: 'DT (PEDIATRIC)',
    uid: 'urn:va:immunization-list:C877:23'
},
{
    localId: '28',
    mnemonic: 'VARCELLA',
    name: 'VARICELLA',
    uid: 'urn:va:immunization-list:C877:28'
},
{
    localId: '34',
    mnemonic: 'MMR&V',
    name: 'MMRV',
    uid: 'urn:va:immunization-list:C877:34'
},
{
    localId: '35',
    mnemonic: 'PLAGUE',
    name: 'PLAGUE',
    uid: 'urn:va:immunization-list:C877:35'
},
{
    localId: '41',
    mnemonic: 'ANT SC',
    name: 'ANTHRAX',
    uid: 'urn:va:immunization-list:C877:41'
},
{
    localId: '42',
    mnemonic: 'BCG P',
    name: 'BCG',
    uid: 'urn:va:immunization-list:C877:42'
},
{
    localId: '45',
    mnemonic: 'HEPA AD',
    name: 'HEP A, ADULT',
    uid: 'urn:va:immunization-list:C877:45'
},
{
    localId: '46',
    mnemonic: 'HEPA PED/ADOL-2',
    name: 'HEP A, PED/ADOL, 2 DOSE',
    uid: 'urn:va:immunization-list:C877:46'
},
{
    localId: '48',
    mnemonic: 'HEPA/HEPB AD',
    name: 'HEP A-HEP B',
    uid: 'urn:va:immunization-list:C877:48'
},
{
    localId: '500007',
    mnemonic: 'PNEUMOVAX',
    name: 'PNEUMOCOCCAL POLYSACCHARIDE PPV23',
    uid: 'urn:va:immunization-list:C877:500007'
},
{
    localId: '51',
    mnemonic: 'HIB PRP-OMP',
    name: 'HIB (PRP-OMP)',
    uid: 'urn:va:immunization-list:C877:51'
},
{
    localId: '52',
    mnemonic: 'HIB PRP-T',
    name: 'HIB (PRP-T)',
    uid: 'urn:va:immunization-list:C877:52'
},
{
    localId: '55',
    mnemonic: 'FLU NAS',
    name: 'INFLUENZA, LIVE, INTRANASAL',
    uid: 'urn:va:immunization-list:C877:55'
},
{
    localId: '58',
    mnemonic: 'RAB',
    name: 'RABIES, INTRAMUSCULAR INJECTION',
    uid: 'urn:va:immunization-list:C877:58'
},
{
    localId: '59',
    mnemonic: 'RAB ID',
    name: 'RABIES, INTRADERMAL INJECTION',
    uid: 'urn:va:immunization-list:C877:59'
},
{
    localId: '61',
    mnemonic: 'TYP ORAL',
    name: 'TYPHOID, ORAL',
    uid: 'urn:va:immunization-list:C877:61'
},
{
    localId: '612013',
    mnemonic: 'FLU,HI DOS',
    name: 'INFLUENZA, HIGH DOSE SEASONAL',
    uid: 'urn:va:immunization-list:C877:612013'
},
{
    localId: '63',
    mnemonic: 'TYP H-P-SC/ID',
    name: 'TYPHOID, PARENTERAL',
    uid: 'urn:va:immunization-list:C877:63'
},
{
    localId: '64',
    mnemonic: 'TYP AKD-SC',
    name: 'TYPHOID, PARENTERAL, AKD (U.S. MILITARY)',
    uid: 'urn:va:immunization-list:C877:64'
},
{
    localId: '66',
    mnemonic: 'HEPB/HIB',
    name: 'HIB-HEP B',
    uid: 'urn:va:immunization-list:C877:66'
},
{
    localId: '67',
    mnemonic: 'PNEU PCV13',
    name: 'PNEUMOCOCCAL CONJUGATE PCV 13',
    uid: 'urn:va:immunization-list:C877:67'
}
];

module.exports.routeOfAdministrationList = routeOfAdministrationList;
module.exports.vaccineInformationStatementList = vaccineInformationStatementList;
module.exports.infoSourceList = infoSourceList;
module.exports.anatomicLocationList = anatomicLocationList;
module.exports.lotNumberList = lotNumberList;
module.exports.reactionList = reactionList;
module.exports.seriesList = seriesList;
module.exports.immunizations = immunizations;

module.exports.completeOperationalData = completeOperationalData;
module.exports.staticOperationalData = staticOperationalData;
