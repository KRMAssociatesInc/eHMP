/*jslint node: true */
'use strict';

var immunizationInfoSourceList = [
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "New immunization record",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-1",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/New immunization record"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "00",
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
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -source unspecified",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-2",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -source unspecified"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "01",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from other provider",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-3",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from other provider"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "02",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from parent's written record",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-4",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from parent's written record"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "03",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from parent's recall",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-5",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from parent's recall"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "04",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from other registry",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-6",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from other registry"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "05",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from birth certificate",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-7",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from birth certificate"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "06",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from school record",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-8",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from school record"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "07",
            "type": "literal"
        }
  },
    {
        "source": {
            "fmId": ".01",
            "fmType": "4",
            "value": "Historical information -from public agency",
            "type": "literal"
        },
        "uri": {
            "fmId": ".01",
            "fmType": "7",
            "value": "920_1-9",
            "type": "uri",
            "label": "IMMUNIZATION INFO SOURCE/Historical information -from public agency"
        },
        "hl7_code": {
            "fmId": ".02",
            "fmType": "4",
            "value": "08",
            "type": "literal"
        }
  }
]

module.exports.immunizationInfoSourceList = immunizationInfoSourceList;
