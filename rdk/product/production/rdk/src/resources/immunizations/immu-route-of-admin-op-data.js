/*jslint node: true */
'use strict';

var immunizationRouteOfAdminList = [
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INTRADERMAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-1",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/INTRADERMAL",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ID",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38238",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Within of introduced between the layers of the skin.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INTRAMUSCULAR",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-2",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/INTRAMUSCULAR",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "IM",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C28161",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Within or into the substance of a muscle.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INTRAVENOUS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-3",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/INTRAVENOUS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "IV",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38276",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Administered into a vein.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NASAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-4",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/NASAL",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "NS",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38284",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Given by nose.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ORAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-5",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/ORAL",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PO",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38288",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Administered by mouth.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SUBCUTANEOUS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-6",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/SUBCUTANEOUS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SC",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38299",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Under the skin or between skin and muscles.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TRANSDERMAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-7",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/TRANSDERMAL",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TD",
            "type": "literal"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38305",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Describes something, especially a drug, that is introduced into the body through the skin.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PERCUTANEOUS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-8",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/PERCUTANEOUS",
            "sameAs": "LOCAL"
        },
        "fda_ncit": {
            "fmId": ".03",
            "fmType": "4",
            "value": "C38676",
            "type": "literal"
        },
        "definition": {
            "fmId": ".04",
            "fmType": "4",
            "value": "Made, done, or effected through the skin.",
            "type": "literal"
        }
  },
    {
        "route": {
            "fmId": ".01",
            "fmType": "4",
            "value": "OTHER/MISCELLANEOUS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_2-9",
            "type": "uri",
            "label": "IMM ADMINISTRATION ROUTE/OTHER_MISCELLANEOUS",
            "sameAs": "LOCAL"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "OTH",
            "type": "literal"
        }
  }
 ]

module.exports.immunizationRouteOfAdminList = immunizationRouteOfAdminList;
