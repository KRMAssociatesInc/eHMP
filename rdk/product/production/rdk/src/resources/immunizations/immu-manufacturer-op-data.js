/*jslint node: true */
'use strict';

var immunizationManufacturersList = [
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ABBOTT LABORATORIES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-1",
            "type": "uri",
            "label": "IMM MANUFACTURER/ABBOTT LABORATORIES",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "AB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes Ross Products Division, Solvay",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ACAMBIS, INC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-2",
            "type": "uri",
            "label": "IMM MANUFACTURER/ACAMBIS, INC",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ACA",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired by sanofi in sept 2008",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ADAMS LABORATORIES, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-3",
            "type": "uri",
            "label": "IMM MANUFACTURER/ADAMS LABORATORIES, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "AD",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ALPHA THERAPEUTIC CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-4",
            "type": "uri",
            "label": "IMM MANUFACTURER/ALPHA THERAPEUTIC CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ALP",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ARMOUR",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-5",
            "type": "uri",
            "label": "IMM MANUFACTURER/ARMOUR",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "AR",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "part of CSL",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "AVENTIS BEHRING L.L.C.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-6",
            "type": "uri",
            "label": "IMM MANUFACTURER/AVENTIS BEHRING L.L.C.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "AVB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "part of CSL",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "AVIRON",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-7",
            "type": "uri",
            "label": "IMM MANUFACTURER/AVIRON",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "AVI",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired by Medimmune",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BAXTER HEALTHCARE CORPORATION-INACTIVE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-8",
            "type": "uri",
            "label": "IMM MANUFACTURER/BAXTER HEALTHCARE CORPORATION-INACTIVE",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BA",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BAXTER HEALTHCARE CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-9",
            "type": "uri",
            "label": "IMM MANUFACTURER/BAXTER HEALTHCARE CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BAH",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes Hyland Immuno, Immuno International AG,and North American Vaccine, Inc./acquired some assets from alpha therapeutics",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BAYER CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-10",
            "type": "uri",
            "label": "IMM MANUFACTURER/BAYER CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BAY",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Bayer Biologicals now owned by Talecris",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BERNA PRODUCTS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-11",
            "type": "uri",
            "label": "IMM MANUFACTURER/BERNA PRODUCTS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BP",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BERNA PRODUCTS CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-12",
            "type": "uri",
            "label": "IMM MANUFACTURER/BERNA PRODUCTS CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BPC",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes Swiss Serum and Vaccine Institute Berne",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BIOTEST PHARMACEUTICALS CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-13",
            "type": "uri",
            "label": "IMM MANUFACTURER/BIOTEST PHARMACEUTICALS CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BTP",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "New owner of NABI HB as of December 2007, Does NOT replace NABI Biopharmaceuticals in this code list.",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "EMERGENT BIODEFENSE OPERATIONS LANSING",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-14",
            "type": "uri",
            "label": "IMM MANUFACTURER/EMERGENT BIODEFENSE OPERATIONS LANSING",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MIP",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "A unit of Emergent BioSolutions, Bioport renamed. Formerly Michigan Biologic Products Institute",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CSL BEHRING, INC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-15",
            "type": "uri",
            "label": "IMM MANUFACTURER/CSL BEHRING, INC",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CSL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "CSL Biotherapies renamed to CSL Behring",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CANGENE CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-16",
            "type": "uri",
            "label": "IMM MANUFACTURER/CANGENE CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CNJ",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Purchased by Emergent Biosolutions",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CELLTECH MEDEVA PHARMACEUTICALS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-17",
            "type": "uri",
            "label": "IMM MANUFACTURER/CELLTECH MEDEVA PHARMACEUTICALS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CMP",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of Novartis",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CENTEON L.L.C.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-18",
            "type": "uri",
            "label": "IMM MANUFACTURER/CENTEON L.L.C.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CEN",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CHIRON CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-19",
            "type": "uri",
            "label": "IMM MANUFACTURER/CHIRON CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CHI",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of Novartis",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CONNAUGHT",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-20",
            "type": "uri",
            "label": "IMM MANUFACTURER/CONNAUGHT",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CON",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired by Merieux",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "DYNPORT VACCINE COMPANY, LLC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-21",
            "type": "uri",
            "label": "IMM MANUFACTURER/DYNPORT VACCINE COMPANY, LLC",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "DVC",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "EVANS MEDICAL LIMITED",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-22",
            "type": "uri",
            "label": "IMM MANUFACTURER/EVANS MEDICAL LIMITED",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "EVN",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of Novartis",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "GEOVAX LABS, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-23",
            "type": "uri",
            "label": "IMM MANUFACTURER/GEOVAX LABS, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "GEO",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "GLAXOSMITHKLINE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-24",
            "type": "uri",
            "label": "IMM MANUFACTURER/GLAXOSMITHKLINE",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SKB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes SmithKline Beecham and Glaxo Wellcome",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "GREER LABORATORIES, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-25",
            "type": "uri",
            "label": "IMM MANUFACTURER/GREER LABORATORIES, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "GRE",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "IMMUNO INTERNATIONAL AG",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-26",
            "type": "uri",
            "label": "IMM MANUFACTURER/IMMUNO INTERNATIONAL AG",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "IAG",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of Baxter",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "IMMUNO-U.S., INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-27",
            "type": "uri",
            "label": "IMM MANUFACTURER/IMMUNO-U.S., INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "IUS",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "INTERCELL BIOMEDICAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-28",
            "type": "uri",
            "label": "IMM MANUFACTURER/INTERCELL BIOMEDICAL",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "INT",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "KOREA GREEN CROSS CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-29",
            "type": "uri",
            "label": "IMM MANUFACTURER/KOREA GREEN CROSS CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "KGC",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "LEDERLE",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-30",
            "type": "uri",
            "label": "IMM MANUFACTURER/LEDERLE",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "LED",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "became a part of WAL, now owned by Pfizer",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MASSACHUSETTS BIOLOGIC LABORATORIES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-31",
            "type": "uri",
            "label": "IMM MANUFACTURER/MASSACHUSETTS BIOLOGIC LABORATORIES",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MBL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "formerly Massachusetts Public Health Biologic Laboratories",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MASSACHUSETTS PUBLIC HEALTH BIOLOGIC LABORATORIES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-32",
            "type": "uri",
            "label": "IMM MANUFACTURER/MASSACHUSETTS PUBLIC HEALTH BIOLOGIC LABORATORIES",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MA",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MEDIMMUNE, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-33",
            "type": "uri",
            "label": "IMM MANUFACTURER/MEDIMMUNE, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MED",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquisitions of U.S. Bioscience in 1999 and Aviron in 2002, as well as the integration with Cambridge Antibody Technology and the strategic alignment with our new parent company, AstraZeneca, in 2007.",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MERCK AND CO., INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-34",
            "type": "uri",
            "label": "IMM MANUFACTURER/MERCK AND CO., INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MSD",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MERIEUX",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-35",
            "type": "uri",
            "label": "IMM MANUFACTURER/MERIEUX",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "IM",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of sanofi",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "MILES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-36",
            "type": "uri",
            "label": "IMM MANUFACTURER/MILES",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "MIL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NABI",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-37",
            "type": "uri",
            "label": "IMM MANUFACTURER/NABI",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "NAB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "formerly North American Biologicals, Inc.",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NEW YORK BLOOD CENTER",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-38",
            "type": "uri",
            "label": "IMM MANUFACTURER/NEW YORK BLOOD CENTER",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "NYB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NORTH AMERICAN VACCINE, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-39",
            "type": "uri",
            "label": "IMM MANUFACTURER/NORTH AMERICAN VACCINE, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "NAV",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "part of Baxter",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NOVARTIS PHARMACEUTICAL CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-40",
            "type": "uri",
            "label": "IMM MANUFACTURER/NOVARTIS PHARMACEUTICAL CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "NOV",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes Chiron, PowderJect Pharmaceuticals, Celltech Medeva Vaccines and Evans Limited, Ciba-Geigy Limited and Sandoz Limited",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "NOVAVAX, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-41",
            "type": "uri",
            "label": "IMM MANUFACTURER/NOVAVAX, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "NVX",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ORGANON TEKNIKA CORPORATION",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-42",
            "type": "uri",
            "label": "IMM MANUFACTURER/ORGANON TEKNIKA CORPORATION",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "OTC",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ORTHO-CLINICAL DIAGNOSTICS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-43",
            "type": "uri",
            "label": "IMM MANUFACTURER/ORTHO-CLINICAL DIAGNOSTICS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ORT",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "a J & J company (formerly Ortho Diagnostic Systems, Inc.)",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PARKEDALE PHARMACEUTICALS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-44",
            "type": "uri",
            "label": "IMM MANUFACTURER/PARKEDALE PHARMACEUTICALS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PD",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "no website and no news articles (formerly Parke-Davis)",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "POWDERJECT PHARMACEUTICALS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-45",
            "type": "uri",
            "label": "IMM MANUFACTURER/POWDERJECT PHARMACEUTICALS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PWJ",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "See Novartis",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PRAXIS BIOLOGICS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-46",
            "type": "uri",
            "label": "IMM MANUFACTURER/PRAXIS BIOLOGICS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PRX",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "became a part of WAL, now owned by Pfizer",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "THE RESEARCH FOUNDATION FOR MICROBIAL DISEASES OF OSAKA UNIVERSITY (BIKEN)",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-47",
            "type": "uri",
            "label": "IMM MANUFACTURER/THE RESEARCH FOUNDATION FOR MICROBIAL DISEASES OF OSAKA UNIVERSITY (BIKEN)",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "JPN",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SANOFI PASTEUR",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-48",
            "type": "uri",
            "label": "IMM MANUFACTURER/SANOFI PASTEUR",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PMC",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "formerly Aventis Pasteur, Pasteur Merieux Connaught; includes Connaught Laboratories and Pasteur Merieux. Acquired ACAMBIS.",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SCLAVO, INC.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-49",
            "type": "uri",
            "label": "IMM MANUFACTURER/SCLAVO, INC.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SCL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SOLVAY PHARMACEUTICALS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-50",
            "type": "uri",
            "label": "IMM MANUFACTURER/SOLVAY PHARMACEUTICALS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SOL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of Abbott",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "SWISS SERUM AND VACCINE INST.",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-51",
            "type": "uri",
            "label": "IMM MANUFACTURER/SWISS SERUM AND VACCINE INST.",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "SI",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Part of Berna",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "TALECRIS BIOTHERAPEUTICS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-52",
            "type": "uri",
            "label": "IMM MANUFACTURER/TALECRIS BIOTHERAPEUTICS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "TAL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes Bayer Biologicals",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "UNITED STATES ARMY MEDICAL RESEARCH AND MATERIAL COMMAND",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-53",
            "type": "uri",
            "label": "IMM MANUFACTURER/UNITED STATES ARMY MEDICAL RESEARCH AND MATERIAL COMMAND",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "USA",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "VAXGEN",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-54",
            "type": "uri",
            "label": "IMM MANUFACTURER/VAXGEN",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "VXG",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired by Emergent Biodefense Operations Lansing, Inc",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "WYETH-AYERST",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-55",
            "type": "uri",
            "label": "IMM MANUFACTURER/WYETH-AYERST",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "WA",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "became WAL, now owned by Pfizer",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "WYETH",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-56",
            "type": "uri",
            "label": "IMM MANUFACTURER/WYETH",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "WAL",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired by Pfizer 10/15/2009",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ZLB BEHRING",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-57",
            "type": "uri",
            "label": "IMM MANUFACTURER/ZLB BEHRING",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "ZLB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "INACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired by CSL",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "OTHER MANUFACTURER",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-58",
            "type": "uri",
            "label": "IMM MANUFACTURER/OTHER MANUFACTURER",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "OTH",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "UNKNOWN MANUFACTURER",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-59",
            "type": "uri",
            "label": "IMM MANUFACTURER/UNKNOWN MANUFACTURER",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "UNK",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "AKORN, INC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-60",
            "type": "uri",
            "label": "IMM MANUFACTURER/AKORN, INC",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "AKR",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PFIZER, INC",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-61",
            "type": "uri",
            "label": "IMM MANUFACTURER/PFIZER, INC",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PFR",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "includes Wyeth-Lederle Vaccines and Pediatrics, Wyeth Laboratories, Lederle Laboratories, and Praxis Biologics,",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "BARR LABORATORIES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-62",
            "type": "uri",
            "label": "IMM MANUFACTURER/BARR LABORATORIES",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "BRR",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "Subsidiary of Teva Pharmaceuticals",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "JOHNSON AND JOHNSON",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-63",
            "type": "uri",
            "label": "IMM MANUFACTURER/JOHNSON AND JOHNSON",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "JNJ",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired CRUCELL which acquired Berna",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "PROTEIN SCIENCES",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-64",
            "type": "uri",
            "label": "IMM MANUFACTURER/PROTEIN SCIENCES",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "PSC",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "ID BIOMEDICAL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-65",
            "type": "uri",
            "label": "IMM MANUFACTURER/ID BIOMEDICAL",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "IDB",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "GRIFOLS",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-66",
            "type": "uri",
            "label": "IMM MANUFACTURER/GRIFOLS",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "GRF",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "CRUCELL",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-67",
            "type": "uri",
            "label": "IMM MANUFACTURER/CRUCELL",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "CRU",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired Berna,  now a J & J company",
            "type": "literal"
        }
  },
    {
        "name": {
            "fmId": ".01",
            "fmType": "4",
            "value": "KEDRIAN BIOPHARMA",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "9999999_04-68",
            "type": "uri",
            "label": "IMM MANUFACTURER/KEDRIAN BIOPHARMA",
            "sameAs": "LOCAL"
        },
        "mvx_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "KED",
            "type": "literal"
        },
        "status": {
            "fmId": ".03",
            "fmType": "3",
            "value": "ACTIVE",
            "type": "literal"
        },
        "cdc_notes": {
            "fmId": "201",
            "fmType": "4",
            "value": "acquired Rho(D) from Ortho",
            "type": "literal"
        }
  }
 ]

module.exports.immunizationManufacturersList = immunizationManufacturersList;