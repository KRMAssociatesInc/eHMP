/*jslint node: true */
'use strict';

var immunizationAnatomLocList = [
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEFT UPPER ARM",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-1",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/LEFT UPPER ARM",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LA",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEFT DELTOID",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-2",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/LEFT DELTOID",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LD",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEFT GLUTEOUS MEDIUS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-3",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/LEFT GLUTEOUS MEDIUS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LG",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEFT LOWER FOREARM",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-4",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/LEFT LOWER FOREARM",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LLFA",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEFT THIGH",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-5",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/LEFT THIGH",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LT",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEFT VASTUS LATERALIS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-6",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/LEFT VASTUS LATERALIS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LVL",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RIGHT UPPER ARM",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-7",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/RIGHT UPPER ARM",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RA",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RIGHT DELTOID",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-8",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/RIGHT DELTOID",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RD",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RIGHT GLUTEOUS MEDIUS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-9",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/RIGHT GLUTEOUS MEDIUS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RG",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RIGHT LOWER FOREARM",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-10",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/RIGHT LOWER FOREARM",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RLFA",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RIGHT THIGH",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-11",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/RIGHT THIGH",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RT",
            "type": "literal"
        }
  },
    {
        "site": {
            "fmId": ".01",
            "fmType": "4",
            "value": "RIGHT VASTUS LATERALIS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_3-12",
            "type": "uri",
            "label": "IMM ADMINISTRATION SITE (BODY)/RIGHT VASTUS LATERALIS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "RVL",
            "type": "literal"
        }
  }
 ]

module.exports.immunizationAnatomLocList = immunizationAnatomLocList;
