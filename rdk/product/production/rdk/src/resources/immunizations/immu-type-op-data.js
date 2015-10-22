/*jslint node: true */
'use strict';

var immunizationTypesList = [
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VACCINIA (SMALLPOX)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1",
            "type": "uri",
            "label": "IMMUNIZATION/VACCINIA (SMALLPOX)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SMALLPOX",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "75",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Vaccinia (smallpox) vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ACAM2000",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ACAM2000"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "DRYVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/DRYVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TD(ADULT) UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-2",
            "type": "uri",
            "label": "IMMUNIZATION/TD(ADULT) UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TD-ADULT",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "139",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Td(adult) unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_2",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTP",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-3",
            "type": "uri",
            "label": "IMMUNIZATION/DTP",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DPT",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "01",
            "type": "literal"
        },
        "max__in_series": {
            "fmId": ".05",
            "fmType": "3",
            "value": "5",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria, tetanus toxoids and pertussis vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_3",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90701",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_3",
                                    "type": "uri",
                                    "label": "CODE/90701"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TETANUS TOXOID, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-4",
            "type": "uri",
            "label": "IMMUNIZATION/TETANUS TOXOID, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TET TOX",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "112",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus toxoid, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_4",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "TT",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHOID, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-5",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHOID, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TYPHOID",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "91",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Typhoid vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_5",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90714",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_5",
                                    "type": "uri",
                                    "label": "CODE/90714"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "OPV",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-6",
            "type": "uri",
            "label": "IMMUNIZATION/OPV",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SABIN/OPV",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "02",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Poliovirus vaccine, live, oral"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_6",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90712",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_6",
                                    "type": "uri",
                                    "label": "CODE/90712"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ORIMUNE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_6",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ORIMUNE"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "POLIO, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-7",
            "type": "uri",
            "label": "IMMUNIZATION/POLIO, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SALK",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "89",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Poliovirus vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_7",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SWINE FLU MONO (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-8",
            "type": "uri",
            "label": "IMMUNIZATION/SWINE FLU MONO (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SWINE MONO",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SWINE FLU BIVAL (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-9",
            "type": "uri",
            "label": "IMMUNIZATION/SWINE FLU BIVAL (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SWINE BIVA",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP B, ADULT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-10",
            "type": "uri",
            "label": "IMMUNIZATION/HEP B, ADULT",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEP B",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "43",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis B vaccine, adult dosage"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_10",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90746",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_10",
                                    "type": "uri",
                                    "label": "CODE/90746"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90743",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_10",
                                    "type": "uri",
                                    "label": "CODE/90743"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_10",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ENGERIX-B-ADULT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_10",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ENGERIX-B-ADULT"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "RECOMBIVAX-ADULT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_10",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/RECOMBIVAX-ADULT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MEASLES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-11",
            "type": "uri",
            "label": "IMMUNIZATION/MEASLES",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MEASLES",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "05",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Measles virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_11",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90705",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_11",
                                    "type": "uri",
                                    "label": "CODE/90705"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ATTENUVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_11",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ATTENUVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-12",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "INFLUENZA",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "88",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza virus vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_12",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90724",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_12",
                                    "type": "uri",
                                    "label": "CODE/90724"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CHOLERA",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-13",
            "type": "uri",
            "label": "IMMUNIZATION/CHOLERA",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CHOLERA",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "26",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Cholera vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_13",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90725",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_13",
                                    "type": "uri",
                                    "label": "CODE/90725"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RUBELLA",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-14",
            "type": "uri",
            "label": "IMMUNIZATION/RUBELLA",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RUBELLA",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "06",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rubella virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_14",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90706",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_14",
                                    "type": "uri",
                                    "label": "CODE/90706"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MERUVAX II",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_14",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MERUVAX II"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MUMPS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-15",
            "type": "uri",
            "label": "IMMUNIZATION/MUMPS",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MUMPS",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "07",
            "type": "literal"
        },
        "max__in_series": {
            "fmId": ".05",
            "fmType": "3",
            "value": "6",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Mumps virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_15",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90704",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_15",
                                    "type": "uri",
                                    "label": "CODE/90704"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MUMPSVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_15",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MUMPSVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BCG (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-16",
            "type": "uri",
            "label": "IMMUNIZATION/BCG (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BCG",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "19",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MMR",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-17",
            "type": "uri",
            "label": "IMMUNIZATION/MMR",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MMR",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "03",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Measles, mumps and rubella virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_17",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90707",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_17",
                                    "type": "uri",
                                    "label": "CODE/90707"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-17",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MEASLES_MUMPS_RUBELLA VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_17",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MEASLES_MUMPS_RUBELLA VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "M-M-R II",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_17",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/M-M-R II"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "MMR",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "M/R",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-18",
            "type": "uri",
            "label": "IMMUNIZATION/M_R",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MR",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "04",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Measles and rubella virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_18",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90708",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_18",
                                    "type": "uri",
                                    "label": "CODE/90708"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PNEUMOCOCCAL, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-19",
            "type": "uri",
            "label": "IMMUNIZATION/PNEUMOCOCCAL, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PNEUMO-VAC",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "109",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Pneumococcal vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_19",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "YELLOW FEVER",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-20",
            "type": "uri",
            "label": "IMMUNIZATION/YELLOW FEVER",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "YELLOW FEV",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "37",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Yellow fever vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_20",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90717",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_20",
                                    "type": "uri",
                                    "label": "CODE/90717"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-31",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/YELLOW FEVER VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_20",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/YELLOW FEVER VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "YF-VAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_20",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/YF-VAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHUS, HISTORICAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-21",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHUS, HISTORICAL",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TYPHUS",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "131",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Historical record of a typhus vaccination"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_21",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RABIES, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-22",
            "type": "uri",
            "label": "IMMUNIZATION/RABIES, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RABIES",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "90",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rabies vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_22",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90726",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_22",
                                    "type": "uri",
                                    "label": "CODE/90726"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DT (PEDIATRIC)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-23",
            "type": "uri",
            "label": "IMMUNIZATION/DT (PEDIATRIC)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DT-PEDS",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "28",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria and tetanus toxoids, adsorbed for pediatric use"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_23",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90702",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_23",
                                    "type": "uri",
                                    "label": "CODE/90702"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "DT(GENERIC)",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_23",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/DT(GENERIC)"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DT",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA B (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-24",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA B (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HIB",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP A, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-25",
            "type": "uri",
            "label": "IMMUNIZATION/HEP A, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEP A",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "85",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis A vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_25",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90730",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_25",
                                    "type": "uri",
                                    "label": "CODE/90730"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepA",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-26",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MENING.",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "108",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_26",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ENCEPHALITIS (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-27",
            "type": "uri",
            "label": "IMMUNIZATION/ENCEPHALITIS (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ENCEPH.",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ZOSTER",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-28",
            "type": "uri",
            "label": "IMMUNIZATION/ZOSTER",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "VARCELLA",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "121",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Zoster vaccine, live"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_28",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90716",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_28",
                                    "type": "uri",
                                    "label": "CODE/90716"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90736",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_28",
                                    "type": "uri",
                                    "label": "CODE/90736"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-30",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/VARICELLA (CHICKENPOX) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_28",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/VARICELLA (CHICKENPOX) VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-27",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/SHINGLES VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_28",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/SHINGLES VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "VARIVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_28",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/VARIVAX"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ZOSTAVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_28",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ZOSTAVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HZV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-29",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DTaP",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "107",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria, tetanus toxoids and acellular pertussis vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_29",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RUBELLA/MUMPS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-30",
            "type": "uri",
            "label": "IMMUNIZATION/RUBELLA_MUMPS",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RUB-MUMPS",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "38",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rubella and mumps virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_30",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "BIAVAX II",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_30",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/BIAVAX II"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DIPHTHERIA (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-31",
            "type": "uri",
            "label": "IMMUNIZATION/DIPHTHERIA (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DIPHTHERIA",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTB/HIB (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-32",
            "type": "uri",
            "label": "IMMUNIZATION/DTB_HIB (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DTB/HIB",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTP, POLIO (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-33",
            "type": "uri",
            "label": "IMMUNIZATION/DTP, POLIO (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DTP POLIO",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MMRV",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-34",
            "type": "uri",
            "label": "IMMUNIZATION/MMRV",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MMR&V",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "94",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Measles, mumps, rubella, and varicella virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_34",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90710",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_34",
                                    "type": "uri",
                                    "label": "CODE/90710"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-18",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MEASLES_MUMPS_RUBELLA_VARICELLA VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_34",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MEASLES_MUMPS_RUBELLA_VARICELLA VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PROQUAD",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_34",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PROQUAD"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "MMRV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PLAGUE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-35",
            "type": "uri",
            "label": "IMMUNIZATION/PLAGUE",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PLAGUE",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "23",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Plague vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_35",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90727",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_35",
                                    "type": "uri",
                                    "label": "CODE/90727"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "GAMMA GLOBULIN (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-36",
            "type": "uri",
            "label": "IMMUNIZATION/GAMMA GLOBULIN (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ISG",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "UNLISTED (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-37",
            "type": "uri",
            "label": "IMMUNIZATION/UNLISTED (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "UNLISTED",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SHERI (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-38",
            "type": "uri",
            "label": "IMMUNIZATION/SHERI (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SLB",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "mnemonic": {
            "fmId": "8801",
            "fmType": "4",
            "value": "SLB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ADENOVIRUS, TYPE 4",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-39",
            "type": "uri",
            "label": "IMMUNIZATION/ADENOVIRUS, TYPE 4",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ADEN TYP4",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "54",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Adenovirus vaccine, type 4, live, oral"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_39",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90476",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_39",
                                    "type": "uri",
                                    "label": "CODE/90476"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ADENOVIRUS, TYPE 7",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-40",
            "type": "uri",
            "label": "IMMUNIZATION/ADENOVIRUS, TYPE 7",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ADEN TYP7",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "55",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Adenovirus vaccine, type 7, live, oral"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_40",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90477",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_40",
                                    "type": "uri",
                                    "label": "CODE/90477"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ANTHRAX",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-41",
            "type": "uri",
            "label": "IMMUNIZATION/ANTHRAX",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ANT SC",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "24",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Anthrax vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_41",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90581",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_41",
                                    "type": "uri",
                                    "label": "CODE/90581"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "BIOTHRAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_41",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/BIOTHRAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BCG",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-42",
            "type": "uri",
            "label": "IMMUNIZATION/BCG",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BCG P",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "19",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Bacillus Calmette-Guerin vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_42",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90585",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_42",
                                    "type": "uri",
                                    "label": "CODE/90585"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MYCOBAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_42",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MYCOBAX"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TICE BCG",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_42",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TICE BCG"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BCG,INTRAVESICAL (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-43",
            "type": "uri",
            "label": "IMMUNIZATION/BCG,INTRAVESICAL (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BCG I",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CHOLERA, ORAL (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-44",
            "type": "uri",
            "label": "IMMUNIZATION/CHOLERA, ORAL (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CHOL ORAL",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "26",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP A, ADULT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-45",
            "type": "uri",
            "label": "IMMUNIZATION/HEP A, ADULT",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPA AD",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "52",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis A vaccine, adult dosage"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_45",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90632",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_45",
                                    "type": "uri",
                                    "label": "CODE/90632"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-4",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS A VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_45",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS A VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "HAVRIX-ADULT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_45",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/HAVRIX-ADULT"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "VAQTA-ADULT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_45",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/VAQTA-ADULT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepA",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP A, PED/ADOL, 2 DOSE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-46",
            "type": "uri",
            "label": "IMMUNIZATION/HEP A, PED_ADOL, 2 DOSE",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPA PED/ADOL-2",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "83",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis A vaccine, pediatric/adolescent dosage, 2 dose schedule"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_46",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90633",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_46",
                                    "type": "uri",
                                    "label": "CODE/90633"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-4",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS A VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_46",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS A VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "HAVRIX-PEDS",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_46",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/HAVRIX-PEDS"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "VAQTA-PEDS",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_46",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/VAQTA-PEDS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepA",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP A, PED/ADOL, 3 DOSE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-47",
            "type": "uri",
            "label": "IMMUNIZATION/HEP A, PED_ADOL, 3 DOSE",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPA PED/ADOL-3",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "84",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis A vaccine, pediatric/adolescent dosage, 3 dose schedule"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_47",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90634",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_47",
                                    "type": "uri",
                                    "label": "CODE/90634"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepA",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP A-HEP B",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-48",
            "type": "uri",
            "label": "IMMUNIZATION/HEP A-HEP B",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPA/HEPB AD",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "104",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis A and hepatitis B vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_48",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90636",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_48",
                                    "type": "uri",
                                    "label": "CODE/90636"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-4",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS A VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_48",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS A VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_48",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TWINRIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_48",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TWINRIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepA-HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HIB (HBOC)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-49",
            "type": "uri",
            "label": "IMMUNIZATION/HIB (HBOC)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HIB,HBOC",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "47",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Haemophilus influenzae type b vaccine, HbOC conjugate"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_49",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90645",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_49",
                                    "type": "uri",
                                    "label": "CODE/90645"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "HIBTITER",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_49",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/HIBTITER"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HIB (PRP-D)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-50",
            "type": "uri",
            "label": "IMMUNIZATION/HIB (PRP-D)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HIB PRP-D",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "46",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Haemophilus influenzae type b vaccine, PRP-D conjugate"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_50",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90646",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_50",
                                    "type": "uri",
                                    "label": "CODE/90646"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PROHIBIT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_50",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PROHIBIT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HIB (PRP-OMP)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-51",
            "type": "uri",
            "label": "IMMUNIZATION/HIB (PRP-OMP)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HIB PRP-OMP",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "49",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Haemophilus influenzae type b vaccine, PRP-OMP conjugate"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_51",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90647",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_51",
                                    "type": "uri",
                                    "label": "CODE/90647"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-6",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_51",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-7",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_51",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PEDVAXHIB",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_51",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PEDVAXHIB"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "PRP-OMP",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HIB (PRP-T)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-52",
            "type": "uri",
            "label": "IMMUNIZATION/HIB (PRP-T)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HIB PRP-T",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "48",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Haemophilus influenzae type b vaccine, PRP-T conjugate"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_52",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90648",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_52",
                                    "type": "uri",
                                    "label": "CODE/90648"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-6",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_52",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-7",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_52",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ACTHIB",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_52",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ACTHIB"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "HIBERIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_52",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/HIBERIX"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "OMNIHIB",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-3_52",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/OMNIHIB"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "PRP-T",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-53",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, UNSPECIFIED FORMULATION (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "INFLUENZA",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "88",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza virus vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_53",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90724",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_53",
                                    "type": "uri",
                                    "label": "CODE/90724"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, WHOLE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-54",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, WHOLE",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "FLU WHOLE",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "16",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza virus vaccine, whole virus"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_54",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90659",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_54",
                                    "type": "uri",
                                    "label": "CODE/90659"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, LIVE, INTRANASAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-55",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, LIVE, INTRANASAL",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "FLU NAS",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "111",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza virus vaccine, live, attenuated, for intranasal use"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_55",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90660",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_55",
                                    "type": "uri",
                                    "label": "CODE/90660"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-11",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_55",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-12",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_55",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-37",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_55",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUMIST",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_55",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUMIST"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "LAIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LYME DISEASE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-56",
            "type": "uri",
            "label": "IMMUNIZATION/LYME DISEASE",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LYME",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "66",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Lyme disease vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_56",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90665",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_56",
                                    "type": "uri",
                                    "label": "CODE/90665"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PNEUMOCOCCAL,PED (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-57",
            "type": "uri",
            "label": "IMMUNIZATION/PNEUMOCOCCAL,PED (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PNEUMO-PED",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "109",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RABIES, INTRAMUSCULAR INJECTION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-58",
            "type": "uri",
            "label": "IMMUNIZATION/RABIES, INTRAMUSCULAR INJECTION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RAB",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "18",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rabies vaccine, for intramuscular injection"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_58",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90675",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_58",
                                    "type": "uri",
                                    "label": "CODE/90675"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-24",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/RABIES VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_58",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/RABIES VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "IMOVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_58",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/IMOVAX"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "RABAVERT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_58",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/RABAVERT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RABIES, INTRADERMAL INJECTION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-59",
            "type": "uri",
            "label": "IMMUNIZATION/RABIES, INTRADERMAL INJECTION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RAB ID",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "40",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rabies vaccine, for intradermal injection"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_59",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90676",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_59",
                                    "type": "uri",
                                    "label": "CODE/90676"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "IMOVAX ID",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_59",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/IMOVAX ID"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "RABAVERT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_59",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/RABAVERT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ROTAVIRUS, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-60",
            "type": "uri",
            "label": "IMMUNIZATION/ROTAVIRUS, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ROTO ORAL",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "122",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rotavirus vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_60",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHOID, ORAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-61",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHOID, ORAL",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TYP ORAL",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "25",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Typhoid vaccine, live, oral"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_61",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90690",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_61",
                                    "type": "uri",
                                    "label": "CODE/90690"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-29",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TYPHOID VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_61",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TYPHOID VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "VIVOTIF BERNA",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_61",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/VIVOTIF BERNA"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHOID, UNSPECIFIED FORMULATION (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-62",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHOID, UNSPECIFIED FORMULATION (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TYP",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "91",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Typhoid vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_62",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90714",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_62",
                                    "type": "uri",
                                    "label": "CODE/90714"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHOID, PARENTERAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-63",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHOID, PARENTERAL",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TYP H-P-SC/ID",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "41",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Typhoid vaccine, parenteral, other than acetone-killed, dried"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_63",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90692",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_63",
                                    "type": "uri",
                                    "label": "CODE/90692"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-29",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TYPHOID VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_63",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TYPHOID VIS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHOID, PARENTERAL, AKD (U.S. MILITARY)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-64",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHOID, PARENTERAL, AKD (U.S. MILITARY)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TYP AKD-SC",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "53",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Typhoid vaccine, parenteral, acetone-killed, dried (U.S. military)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_64",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90693",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_64",
                                    "type": "uri",
                                    "label": "CODE/90693"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TYPHOID-AKD",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_64",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TYPHOID-AKD"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP B, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-65",
            "type": "uri",
            "label": "IMMUNIZATION/HEP B, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPB ILL",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "45",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis B vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_65",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90731",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_65",
                                    "type": "uri",
                                    "label": "CODE/90731"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HIB-HEP B",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-66",
            "type": "uri",
            "label": "IMMUNIZATION/HIB-HEP B",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPB/HIB",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "51",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Haemophilus influenzae type b conjugate and Hepatitis B vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_66",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90748",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_66",
                                    "type": "uri",
                                    "label": "CODE/90748"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-6",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_66",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-7",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_66",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_66",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "COMVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_66",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/COMVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "Hib-HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PNEUMOCOCCAL CONJUGATE PCV 13",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-67",
            "type": "uri",
            "label": "IMMUNIZATION/PNEUMOCOCCAL CONJUGATE PCV 13",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PNEU PCV13",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "133",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Pneumococcal conjugate vaccine, 13 valent"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_67",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90670",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_67",
                                    "type": "uri",
                                    "label": "CODE/90670"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-20",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/PNEUMOCOCCAL CONJUGATE (PCV13) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_67",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/PNEUMOCOCCAL CONJUGATE (PCV13) VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-21",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/PNEUMOCOCCAL CONJUGATE (PCV13) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_67",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/PNEUMOCOCCAL CONJUGATE (PCV13) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PREVNAR 13",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_67",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PREVNAR 13"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "PCV13",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP B, ADOLESCENT OR PEDIATRIC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1008",
            "type": "uri",
            "label": "IMMUNIZATION/HEP B, ADOLESCENT OR PEDIATRIC",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "08",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis B vaccine, pediatric or pediatric/adolescent dosage"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1008",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90744",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1008",
                                    "type": "uri",
                                    "label": "CODE/90744"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1008",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ENGERIX B-PEDS",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1008",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ENGERIX B-PEDS"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "RECOMBIVAX-PEDS",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1008",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/RECOMBIVAX-PEDS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TD (ADULT), ADSORBED",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1009",
            "type": "uri",
            "label": "IMMUNIZATION/TD (ADULT), ADSORBED",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "09",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus and diphtheria toxoids, adsorbed, for adult use"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1009",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90718",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1009",
                                    "type": "uri",
                                    "label": "CODE/90718"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-34",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1009",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TD(GENERIC)",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1009",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TD(GENERIC)"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TD, (ADULT)",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1009",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TD, (ADULT)"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "Td",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "IPV",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1010",
            "type": "uri",
            "label": "IMMUNIZATION/IPV",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "10",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Poliovirus vaccine, inactivated"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1010",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90713",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1010",
                                    "type": "uri",
                                    "label": "CODE/90713"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-23",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1010",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "IPOL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1010",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/IPOL"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IPV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PERTUSSIS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1011",
            "type": "uri",
            "label": "IMMUNIZATION/PERTUSSIS",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "11",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Pertussis vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1011",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, SPLIT (INCL. PURIFIED SURFACE ANTIGEN)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1015",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, SPLIT (INCL. PURIFIED SURFACE ANTIGEN)",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "15",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza virus vaccine, split virus (incl. purified surface antigen)-retired CODE"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1015",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HIB, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1017",
            "type": "uri",
            "label": "IMMUNIZATION/HIB, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "17",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Haemophilus influenzae type b vaccine, conjugate unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1017",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90737",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1017",
                                    "type": "uri",
                                    "label": "CODE/90737"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1020",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "20",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria, tetanus toxoids and acellular pertussis vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1020",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90700",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1020",
                                    "type": "uri",
                                    "label": "CODE/90700"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-3",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1020",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ACEL-IMUNE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1020",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ACEL-IMUNE"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CERTIVA",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1020",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/CERTIVA"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "INFANRIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-3_1020",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/INFANRIX"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TRIPEDIA",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-4_1020",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TRIPEDIA"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTP-HIB",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1022",
            "type": "uri",
            "label": "IMMUNIZATION/DTP-HIB",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "22",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "DTP-Haemophilus influenzae type b conjugate vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1022",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90720",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1022",
                                    "type": "uri",
                                    "label": "CODE/90720"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TETRAMUNE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1022",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TETRAMUNE"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP A, PEDIATRIC, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1031",
            "type": "uri",
            "label": "IMMUNIZATION/HEP A, PEDIATRIC, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "31",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis A vaccine, pediatric dosage, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1031",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepA",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL MPSV4",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1032",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL MPSV4",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "32",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal polysaccharide vaccine (MPSV4)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1032",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90733",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1032",
                                    "type": "uri",
                                    "label": "CODE/90733"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-19",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MENINGOCOCCAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1032",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MENINGOCOCCAL VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MENOMUNE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1032",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MENOMUNE"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "MPSV4",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TETANUS TOXOID, ADSORBED",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1035",
            "type": "uri",
            "label": "IMMUNIZATION/TETANUS TOXOID, ADSORBED",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "35",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus toxoid, adsorbed"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1035",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90703",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1035",
                                    "type": "uri",
                                    "label": "CODE/90703"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-34",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1035",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TETANUS TOXOID (GENERIC)",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1035",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TETANUS TOXOID (GENERIC)"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "JAPANESE ENCEPHALITIS SC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1039",
            "type": "uri",
            "label": "IMMUNIZATION/JAPANESE ENCEPHALITIS SC",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "39",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Japanese Encephalitis Vaccine SC"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1039",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90735",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1039",
                                    "type": "uri",
                                    "label": "CODE/90735"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "JE-VAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1039",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/JE-VAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP B, ADOLESCENT/HIGH RISK INFANT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1042",
            "type": "uri",
            "label": "IMMUNIZATION/HEP B, ADOLESCENT_HIGH RISK INFANT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "42",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis B vaccine, adolescent/high risk infant dosage"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1042",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90745",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1042",
                                    "type": "uri",
                                    "label": "CODE/90745"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1042",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEP B, DIALYSIS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1044",
            "type": "uri",
            "label": "IMMUNIZATION/HEP B, DIALYSIS",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "44",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Hepatitis B vaccine, dialysis patient dosage"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1044",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90740",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1044",
                                    "type": "uri",
                                    "label": "CODE/90740"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90747",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_1044",
                                    "type": "uri",
                                    "label": "CODE/90747"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1044",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "RECOMBIVAX-DIALYSIS",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1044",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/RECOMBIVAX-DIALYSIS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HepB",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP-HIB",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1050",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP-HIB",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "50",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "DTaP-Haemophilus influenzae type b conjugate vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1050",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90721",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1050",
                                    "type": "uri",
                                    "label": "CODE/90721"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TRIHIBIT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1050",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TRIHIBIT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HPV, QUADRIVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1062",
            "type": "uri",
            "label": "IMMUNIZATION/HPV, QUADRIVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "62",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Human papilloma virus vaccine, quadrivalent"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1062",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90649",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1062",
                                    "type": "uri",
                                    "label": "CODE/90649"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-9",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1062",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-10",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1062",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HUMAN PAPILLOMAVIRUS VACCINE (GARDASIL) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "GARDASIL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1062",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/GARDASIL"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HPV4",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PARAINFLUENZA-3",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1069",
            "type": "uri",
            "label": "IMMUNIZATION/PARAINFLUENZA-3",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "69",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Parainfluenza-3 virus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1069",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ROTAVIRUS, TETRAVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1074",
            "type": "uri",
            "label": "IMMUNIZATION/ROTAVIRUS, TETRAVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "74",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rotavirus, live, tetravalent vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1074",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "STAPHYLOCOCCUS BACTERIO LYSATE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1076",
            "type": "uri",
            "label": "IMMUNIZATION/STAPHYLOCOCCUS BACTERIO LYSATE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "76",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Staphylococcus bacteriophage lysate"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1076",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TICK-BORNE ENCEPHALITIS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1077",
            "type": "uri",
            "label": "IMMUNIZATION/TICK-BORNE ENCEPHALITIS",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "77",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tick-borne encephalitis vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1077",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TULAREMIA VACCINE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1078",
            "type": "uri",
            "label": "IMMUNIZATION/TULAREMIA VACCINE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "78",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tularemia vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1078",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VEE, LIVE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1080",
            "type": "uri",
            "label": "IMMUNIZATION/VEE, LIVE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "80",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Venezuelan equine encephalitis, live, attenuated"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1080",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VEE, INACTIVATED",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1081",
            "type": "uri",
            "label": "IMMUNIZATION/VEE, INACTIVATED",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "81",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Venezuelan equine encephalitis, inactivated"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1081",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ADENOVIRUS, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1082",
            "type": "uri",
            "label": "IMMUNIZATION/ADENOVIRUS, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "82",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Adenovirus vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1082",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VEE, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1092",
            "type": "uri",
            "label": "IMMUNIZATION/VEE, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "92",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Venezuelan equine encephalitis vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1092",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PNEUMOCOCCAL CONJUGATE PCV 7",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1100",
            "type": "uri",
            "label": "IMMUNIZATION/PNEUMOCOCCAL CONJUGATE PCV 7",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "100",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Pneumococcal conjugate vaccine, 7 valent"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1100",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90669",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1100",
                                    "type": "uri",
                                    "label": "CODE/90669"
                                }
        }
       ]
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PREVNAR 7",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1100",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PREVNAR 7"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "PCV7",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TYPHOID, VICPS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1101",
            "type": "uri",
            "label": "IMMUNIZATION/TYPHOID, VICPS",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "101",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Typhoid Vi capsular polysaccharide vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1101",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90691",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1101",
                                    "type": "uri",
                                    "label": "CODE/90691"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-29",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TYPHOID VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1101",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TYPHOID VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TYPHIM VI",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1101",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TYPHIM VI"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTP-HIB-HEP B",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1102",
            "type": "uri",
            "label": "IMMUNIZATION/DTP-HIB-HEP B",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "102",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "DTP- Haemophilus influenzae type b conjugate and hepatitis b vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1102",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL C CONJUGATE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1103",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL C CONJUGATE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "103",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal C conjugate vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1103",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VACCINIA (SMALLPOX) DILUTED",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1105",
            "type": "uri",
            "label": "IMMUNIZATION/VACCINIA (SMALLPOX) DILUTED",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "105",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Vaccinia (smallpox) vaccine, diluted"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1105",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP, 5 PERTUSSIS ANTIGENS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1106",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP, 5 PERTUSSIS ANTIGENS",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "106",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria, tetanus toxoids and acellular pertussis vaccine, 5 pertussis antigens"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1106",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90700",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1106",
                                    "type": "uri",
                                    "label": "CODE/90700"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-3",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1106",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "DAPTACEL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1106",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/DAPTACEL"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP-HEP B-IPV",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1110",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP-HEP B-IPV",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "110",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "DTaP-hepatitis B and poliovirus vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1110",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90723",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1110",
                                    "type": "uri",
                                    "label": "CODE/90723"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-3",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1110",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-5",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1110",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HEPATITIS B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-23",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1110",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PEDIARIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1110",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PEDIARIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP-HepB-IPV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TD (ADULT) PRESERVATIVE FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1113",
            "type": "uri",
            "label": "IMMUNIZATION/TD (ADULT) PRESERVATIVE FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "113",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus and diphtheria toxoids, adsorbed, preservative free, for adult use"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1113",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90714",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1113",
                                    "type": "uri",
                                    "label": "CODE/90714"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-34",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1113",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "DECAVAC",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1113",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/DECAVAC"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "TENIVAC",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1113",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/TENIVAC"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "Td",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL MCV4P",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1114",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL MCV4P",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "114",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal polysaccharide (groups A, C, Y and W-135) diphtheria toxoid conjugate vaccine (MCV4P)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1114",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90734",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1114",
                                    "type": "uri",
                                    "label": "CODE/90734"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-19",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MENINGOCOCCAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1114",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MENINGOCOCCAL VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MENACTRA",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1114",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MENACTRA"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "MCV4P",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TDAP",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1115",
            "type": "uri",
            "label": "IMMUNIZATION/TDAP",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "115",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adsorbed"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1115",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90715",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1115",
                                    "type": "uri",
                                    "label": "CODE/90715"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-33",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA_PERTUSSIS (TDAP) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1115",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA_PERTUSSIS (TDAP) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ADACEL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1115",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ADACEL"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "BOOSTRIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1115",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/BOOSTRIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "Tdap",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ROTAVIRUS, PENTAVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1116",
            "type": "uri",
            "label": "IMMUNIZATION/ROTAVIRUS, PENTAVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "116",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rotavirus, live, pentavalent vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1116",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90680",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1116",
                                    "type": "uri",
                                    "label": "CODE/90680"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-25",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1116",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-26",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1116",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ROTATEQ",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1116",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ROTATEQ"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "RV5",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HPV, BIVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1118",
            "type": "uri",
            "label": "IMMUNIZATION/HPV, BIVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "118",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Human papilloma virus vaccine, bivalent"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1118",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90650",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1118",
                                    "type": "uri",
                                    "label": "CODE/90650"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-8",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HUMAN PAPILLOMAVIRUS VACCINE (CERVARIX) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1118",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HUMAN PAPILLOMAVIRUS VACCINE (CERVARIX) VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CERVARIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1118",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/CERVARIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HPV2",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ROTAVIRUS, MONOVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1119",
            "type": "uri",
            "label": "IMMUNIZATION/ROTAVIRUS, MONOVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "119",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Rotavirus, live, monovalent vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1119",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90681",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1119",
                                    "type": "uri",
                                    "label": "CODE/90681"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-25",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1119",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-26",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1119",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ROTAVIRUS VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ROTARIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1119",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ROTARIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "RV1",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP-HIB-IPV",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1120",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP-HIB-IPV",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "120",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria, tetanus toxoids and acellular pertussis vaccine, Haemophilus influenzae type b conjugate, and poliovirus vaccine, inactivated (DTaP-Hib-IPV)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1120",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90698",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1120",
                                    "type": "uri",
                                    "label": "CODE/90698"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-3",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1120",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-6",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1120",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-7",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1120",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-23",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-4_1120",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PENTACEL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1120",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PENTACEL"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP-IPV/Hib",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ZOSTER (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1121",
            "type": "uri",
            "label": "IMMUNIZATION/ZOSTER (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "121",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Zoster vaccine, live"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1121",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90736",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1121",
                                    "type": "uri",
                                    "label": "CODE/90736"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-27",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/SHINGLES VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1121",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/SHINGLES VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ZOSTAVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1121",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ZOSTAVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "HZV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, H5N1-1203",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1123",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, H5N1-1203",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "123",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza virus vaccine, H5N1, A/Vietnam/1203/2004 (national stockpile)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1123",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NOVEL INFLUENZA-H1N1-09, NASAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1125",
            "type": "uri",
            "label": "IMMUNIZATION/NOVEL INFLUENZA-H1N1-09, NASAL",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "125",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Novel Influenza-H1N1-09, live virus for nasal administration"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1125",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90664",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1125",
                                    "type": "uri",
                                    "label": "CODE/90664"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NOVEL INFLUENZA-H1N1-09, PRESERVATIVE-FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1126",
            "type": "uri",
            "label": "IMMUNIZATION/NOVEL INFLUENZA-H1N1-09, PRESERVATIVE-FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "126",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Novel influenza-H1N1-09, preservative-free, injectable"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1126",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90666",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1126",
                                    "type": "uri",
                                    "label": "CODE/90666"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NOVEL INFLUENZA-H1N1-09",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1127",
            "type": "uri",
            "label": "IMMUNIZATION/NOVEL INFLUENZA-H1N1-09",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "127",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Novel influenza-H1N1-09, injectable"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1127",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90668",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1127",
                                    "type": "uri",
                                    "label": "CODE/90668"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "JAPANESE ENCEPHALITIS, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1129",
            "type": "uri",
            "label": "IMMUNIZATION/JAPANESE ENCEPHALITIS, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "129",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Japanese Encephalitis vaccine, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1129",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP-IPV",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1130",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP-IPV",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "130",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Diphtheria, tetanus toxoids and acellular pertussis vaccine, and poliovirus vaccine, inactivated"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1130",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90696",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1130",
                                    "type": "uri",
                                    "label": "CODE/90696"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-3",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1130",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/DIPHTHERIA_TETANUS_PERTUSSIS (DTAP) VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-23",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1130",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/POLIO VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "KINRIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1130",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/KINRIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP-IPV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DTAP-IPV-HIB-HEP B, HISTORICAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1132",
            "type": "uri",
            "label": "IMMUNIZATION/DTAP-IPV-HIB-HEP B, HISTORICAL",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "132",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Historical record of vaccine containing: * diphtheria, tetanus toxoids and acellular pertussis, * poliovirus, inactivated, * Haemophilus influenzae type b conjugate, * Hepatitis B (DTaP-Hib-IPV)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1132",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "DTaP-HepB-IPV",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "JAPANESE ENCEPHALITIS IM",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1134",
            "type": "uri",
            "label": "IMMUNIZATION/JAPANESE ENCEPHALITIS IM",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "134",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Japanese Encephalitis vaccine for intramuscular administration"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1134",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90738",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1134",
                                    "type": "uri",
                                    "label": "CODE/90738"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-15",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/JAPANESE ENCEPHALITIS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1134",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/JAPANESE ENCEPHALITIS VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-16",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/JAPANESE ENCEPHALITIS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1134",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/JAPANESE ENCEPHALITIS VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "IXIARO",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1134",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/IXIARO"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL MCV4O",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1136",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL MCV4O",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "136",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal oligosaccharide (groups A, C, Y and W-135) diphtheria toxoid conjugate vaccine (MCV4O)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1136",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90734",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1136",
                                    "type": "uri",
                                    "label": "CODE/90734"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-19",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MENINGOCOCCAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1136",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/MENINGOCOCCAL VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MENVEO",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1136",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MENVEO"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "MCV4O",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HPV, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1137",
            "type": "uri",
            "label": "IMMUNIZATION/HPV, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "137",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "HPV, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1137",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TD (ADULT)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1138",
            "type": "uri",
            "label": "IMMUNIZATION/TD (ADULT)",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "138",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus and diphtheria toxoids, not adsorbed, for adult use"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1138",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-34",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1138",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1140",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, SEASONAL, INJECTABLE, PRESERVATIVE FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "140",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, seasonal, injectable, preservative free"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1140",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90656",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1140",
                                    "type": "uri",
                                    "label": "CODE/90656"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90655",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_1140",
                                    "type": "uri",
                                    "label": "CODE/90655"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1140",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1140",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1140",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "AFLURIA, PRESERVATIVE FREE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1140",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/AFLURIA, PRESERVATIVE FREE"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "AGRIFLU",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1140",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/AGRIFLU"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUARIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-3_1140",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUARIX"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUVIRIN-PRESERVATIVE FREE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-4_1140",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUVIRIN-PRESERVATIVE FREE"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUZONE-PRESERVATIVE FREE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-5_1140",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUZONE-PRESERVATIVE FREE"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, SEASONAL, INJECTABLE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1141",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, SEASONAL, INJECTABLE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "141",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, seasonal, injectable"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1141",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90658",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1141",
                                    "type": "uri",
                                    "label": "CODE/90658"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90657",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_1141",
                                    "type": "uri",
                                    "label": "CODE/90657"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1141",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1141",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1141",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "AFLURIA",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1141",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/AFLURIA"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUAVAL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1141",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUAVAL"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUVIRIN",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-3_1141",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUVIRIN"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUZONE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-4_1141",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUZONE"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TETANUS TOXOID, NOT ADSORBED",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1142",
            "type": "uri",
            "label": "IMMUNIZATION/TETANUS TOXOID, NOT ADSORBED",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "142",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Tetanus toxoid, not adsorbed"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1142",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-34",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1142",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/TETANUS_DIPHTHERIA (TD) VIS"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ADENOVIRUS TYPES 4 AND 7",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1143",
            "type": "uri",
            "label": "IMMUNIZATION/ADENOVIRUS TYPES 4 AND 7",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "143",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Adenovirus, type 4 and type 7, live, oral"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1143",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-1",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ADENOVIRUS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1143",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ADENOVIRUS VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-35",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ADENOVIRUS VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1143",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/ADENOVIRUS VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "ADENOVIRUS TYPES 4 AND 7",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1143",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/ADENOVIRUS TYPES 4 AND 7"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1144",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, SEASONAL, INTRADERMAL, PRESERVATIVE FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "144",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Seasonal influenza, intradermal, preservative free"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1144",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90654",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1144",
                                    "type": "uri",
                                    "label": "CODE/90654"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1144",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1144",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1144",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUZONE, INTRADERMAL",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1144",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUZONE, INTRADERMAL"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL MCV4, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1147",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL MCV4, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "147",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal, MCV4, unspecified formulation(groups A, C, Y and W-135)"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1147",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MENINGOCOCCAL C/Y-HIB PRP",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1148",
            "type": "uri",
            "label": "IMMUNIZATION/MENINGOCOCCAL C_Y-HIB PRP",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "148",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Meningococcal Groups C and Y and Haemophilus b Tetanus Toxoid Conjugate Vaccine"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1148",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90644",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1148",
                                    "type": "uri",
                                    "label": "CODE/90644"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-6",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1148",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-7",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1148",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/HAEMOPHILUS INFLUENZAE TYPE B VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "MENHIBRIX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1148",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/MENHIBRIX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "Hib-MenCY",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, LIVE, INTRANASAL, QUADRIVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1149",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, LIVE, INTRANASAL, QUADRIVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "149",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, live, intranasal, quadrivalent"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1149",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90672",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1149",
                                    "type": "uri",
                                    "label": "CODE/90672"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-11",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1149",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-12",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1149",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-37",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1149",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - LIVE, INTRANASAL VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUMIST QUADRIVALENT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1149",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUMIST QUADRIVALENT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "LAIV4",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1150",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, INJECTABLE, QUADRIVALENT, PRESERVATIVE FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "150",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, injectable, quadrivalent, preservative free"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1150",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90686",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1150",
                                    "type": "uri",
                                    "label": "CODE/90686"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90685",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_1150",
                                    "type": "uri",
                                    "label": "CODE/90685"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1150",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1150",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1150",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUARIX, QUADRIVALENT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1150",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUARIX, QUADRIVALENT"
                    }
     },
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUZONE, QUADRIVALENT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-2_1150",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUZONE, QUADRIVALENT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IIV4",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA NASAL, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1151",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA NASAL, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "151",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza nasal, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1151",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PNEUMOCOCCAL CONJUGATE, UNSPECIFIED FORMULATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1152",
            "type": "uri",
            "label": "IMMUNIZATION/PNEUMOCOCCAL CONJUGATE, UNSPECIFIED FORMULATION",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "152",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Pneumococcal Conjugate, unspecified formulation"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1152",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, INJECTABLE, MDCK, PRESERVATIVE FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1153",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, INJECTABLE, MDCK, PRESERVATIVE FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "153",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, injectable, Madin Darby Canine Kidney, preservative free"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1153",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90661",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1153",
                                    "type": "uri",
                                    "label": "CODE/90661"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1153",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1153",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1153",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUCELVAX",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1153",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUCELVAX"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "ccIIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, RECOMBINANT, INJECTABLE, PRESERVATIVE FREE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1155",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, RECOMBINANT, INJECTABLE, PRESERVATIVE FREE",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "155",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Seasonal, trivalent, recombinant, injectable influenza vaccine, preservative free"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1155",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90673",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1155",
                                    "type": "uri",
                                    "label": "CODE/90673"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1155",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1155",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1155",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUBLOK",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1155",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUBLOK"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "RIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, INJECTABLE, QUADRIVALENT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1158",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, INJECTABLE, QUADRIVALENT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "158",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, injectable, quadrivalent, contains preservative"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1158",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90688",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_1158",
                                    "type": "uri",
                                    "label": "CODE/90688"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_1158",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_1158",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_1158",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLULAVAL QUADRIVALENT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1158",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLULAVAL QUADRIVALENT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IIV4",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA A MONOVALENT (H5N1), ADJUVANTED-2013",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1160",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA A MONOVALENT (H5N1), ADJUVANTED-2013",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "160",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza A monovalent (H5N1), adjuvanted, National stockpile 2013"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1160",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "INFLUENZA A (H5N1) -2013",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_1160",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/INFLUENZA A (H5N1) -2013"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "AS03 ADJUVANT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-1801",
            "type": "uri",
            "label": "IMMUNIZATION/AS03 ADJUVANT",
            "sameAs": "LOCAL"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "801",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "AS03 Adjuvant"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_1801",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VOODOO SHOT (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500001",
            "type": "uri",
            "label": "IMMUNIZATION/VOODOO SHOT (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "V D SHOT",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VOODOO SHOT1 (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500002",
            "type": "uri",
            "label": "IMMUNIZATION/VOODOO SHOT1 (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "V D SHOT1",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "HEPATITIS B (NEWBORN TO 12) (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500003",
            "type": "uri",
            "label": "IMMUNIZATION/HEPATITIS B (NEWBORN TO 12) (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "HEPB NBORN",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SBY-INFLUENZA (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500004",
            "type": "uri",
            "label": "IMMUNIZATION/SBY-INFLUENZA (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "INFLUENZA",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "FLU SHOT 2000 (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500005",
            "type": "uri",
            "label": "IMMUNIZATION/FLU SHOT 2000 (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "FLU2000",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MIKES INFLUENZA (HISTORICAL)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500006",
            "type": "uri",
            "label": "IMMUNIZATION/MIKES INFLUENZA (HISTORICAL)",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "INFLUENZA",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "LOCAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PNEUMOCOCCAL POLYSACCHARIDE PPV23",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-500007",
            "type": "uri",
            "label": "IMMUNIZATION/PNEUMOCOCCAL POLYSACCHARIDE PPV23",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PNEUMOVAX",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "33",
            "type": "literal"
        },
        "max__in_series": {
            "fmId": ".05",
            "fmType": "3",
            "value": "NON-SERIES",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Pneumococcal polysaccharide vaccine, 23 valent"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_500007",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90732",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_500007",
                                    "type": "uri",
                                    "label": "CODE/90732"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-22",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/PNEUMOCOCCAL POLYSACCHARIDE VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_500007",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/PNEUMOCOCCAL POLYSACCHARIDE VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "PNEUMOVAX 23",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_500007",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/PNEUMOVAX 23"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "PPSV23",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NOVEL INFLUENZA-H1N1-09, ALL FORMULATIONS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-612006",
            "type": "uri",
            "label": "IMMUNIZATION/NOVEL INFLUENZA-H1N1-09, ALL FORMULATIONS",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "FLU H1N1",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "128",
            "type": "literal"
        },
        "max__in_series": {
            "fmId": ".05",
            "fmType": "3",
            "value": "2",
            "type": "literal"
        },
        "inactive_flag": {
            "fmId": ".07",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Novel influenza-H1N1-09, all formulations"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_612006",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90663",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_612006",
                                    "type": "uri",
                                    "label": "CODE/90663"
                                }
        },
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90470",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-2_1_612006",
                                    "type": "uri",
                                    "label": "CODE/90470"
                                }
        }
       ]
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INFLUENZA, HIGH DOSE SEASONAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_14-612013",
            "type": "uri",
            "label": "IMMUNIZATION/INFLUENZA, HIGH DOSE SEASONAL",
            "sameAs": "LOCAL"
        },
        "short_name": {
            "fmId": ".02",
            "fmType": "4",
            "value": "FLU,HI DOS",
            "type": "literal"
        },
        "cvx_code": {
            "fmId": ".03",
            "fmType": "4",
            "value": "135",
            "type": "literal"
        },
        "combination_immunization_y_n": {
            "fmId": ".2",
            "fmType": "12",
            "value": "false",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        },
        "cdc_full_vaccine_name": {
            "fmId": "2",
            "fmType": "5",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
            "value": "Influenza, high dose seasonal, preservative-free"
        },
        "coding_system": {
            "fmId": "3",
            "type": "cnodes",
            "file": "9999999_143",
            "value": [
                {
                    "coding_system": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "CPT",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_143-1_612013",
                        "type": "uri",
                        "label": "CODING SYSTEM/CPT"
                    },
                    "code": {
                        "fmId": ".02",
                        "type": "cnodes",
                        "file": "9999999_1431",
                        "list": true,
                        "value": [
                            {
                                "code": {
                                    "fmId": ".01",
                                    "fmType": "4",
                                    "value": "90662",
                                    "type": "literal"
                                },
                                "uri": {
                                    "fmId": ".01",
                                    "fmType": "7",
                                    "value": "9999999_1431-1_1_612013",
                                    "type": "uri",
                                    "label": "CODE/90662"
                                }
        }
       ]
                    }
     }
    ]
        },
        "vaccine_information_statement": {
            "fmId": "4",
            "type": "cnodes",
            "file": "9999999_144",
            "list": true,
            "value": [
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-13",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-1_612013",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-14",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-2_612013",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     },
                {
                    "vaccine_information_statement": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "920-36",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS",
                        "sameAs": "LOCAL"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_144-3_612013",
                        "type": "uri",
                        "label": "VACCINE INFORMATION STATEMENT/INFLUENZA VACCINE - INACTIVATED VIS"
                    }
     }
    ]
        },
        "cdc_product_name": {
            "fmId": "5",
            "type": "cnodes",
            "file": "9999999_145",
            "list": true,
            "value": [
                {
                    "cdc_product_name": {
                        "fmId": ".01",
                        "fmType": "4",
                        "value": "FLUZONE-HIGH DOSE",
                        "type": "literal"
                    },
                    "uri": {
                        "fmId": ".01",
                        "fmType": "7",
                        "value": "9999999_145-1_612013",
                        "type": "uri",
                        "label": "CDC PRODUCT NAME/FLUZONE-HIGH DOSE"
                    }
     }
    ]
        },
        "class": {
            "fmId": "100",
            "fmType": "3",
            "value": "NATIONAL",
            "type": "literal"
        },
        "mnemonic": {
            "fmId": "8801",
            "fmType": "4",
            "value": "FLU",
            "type": "literal"
        },
        "acronym": {
            "fmId": "8802",
            "fmType": "4",
            "value": "IIV3",
            "type": "literal"
        },
        "selectable_for_historic": {
            "fmId": "8803",
            "fmType": "12",
            "value": "true",
            "type": "typed-literal",
            "datatype": "xsd:boolean"
        }
  }
 ]

module.exports.immunizationTypesList = immunizationTypesList;
