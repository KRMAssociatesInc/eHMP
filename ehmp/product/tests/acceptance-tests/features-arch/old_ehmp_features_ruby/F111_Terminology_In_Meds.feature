@terminology @VPR 
Feature: F111  Normalization of Inpatient Medications Data

#This feature item adds standardized coding values and descriptions for Inpatient Medications. (VUID to RxNORM (VA), NCID to RxNORM (DoD)) 


@f111_1_terminology_in_meds @VPR
Scenario Outline: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  Given a patient with pid "5000000341V359724" has been synced through Admin API
  When the client requests medications for the patient "5000000341V359724" in VPR format
  Then a successful response is returned  
  And the VPR results contain Medication from "RxNorm codes"
      | field                 | value                   |
      | vaType                | <vatype_code>   		|
      | facilityCode          | <facility_code>         |
      | summary               | <summary_value>         |
      #VA codes
      | products.suppliedCode | urn:va:vuid:<vuid_code> |
      #RXNORM codes
      | codes.code            | <rxnorm_code>           |
      | codes.system          | <codes_system>          |
      | codes.display         | <rxnorm_text>           |

    Examples: 
      | vatype_code | facility_code | vuid_code | rxnorm_code | rxnorm_text                                                          | codes_system                   | summary_value                         	 |
      | I           | 500           | 4007158   | 313782      | Acetaminophen 325 MG Oral Tablet                                     | urn:oid:2.16.840.1.113883.6.88 | ACETAMINOPHEN TAB (EXPIRED)\n Give: 325MG PO Q4H |
      | I           | 500           | 4001483   | 311027      | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N]      | urn:oid:2.16.840.1.113883.6.88 | INSULIN NOVOLIN N(NPH) INJ (DISCONTINUED/EDIT)\n Give: 15 UNITS SC BID AC |
# *Test Note for Rxnorm 311027 please see the below note.


@f111_2_terminology_in_meds @VPR 
Scenario Outline: An authorized user can access DoD inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  Given a patient with pid "5000000217V519385" has been synced through Admin API
  When the client requests medications for the patient "5000000217V519385" in VPR format
  Then a successful response is returned  
  And the VPR results contain Medication from "RxNorm codes"
      | field         | value           |
      | vaType        | <vatype_code>   |
      | facilityCode  | <facility_code> |
      | summary       | <summary_value> |
      #DOD codes
      | codes.code    | <dod_ncid_code> |
      | codes.system  | <dod_system>    |
      #RXNORM codes
      | codes.code    | <rxnorm_code>   |
      | codes.system  | <codes_system>  |
      | codes.display | <rxnorm_text>   |
     
    Examples: 
      | vatype_code | facility_code | dod_ncid_code | dod_system | rxnorm_code | rxnorm_text                                 | codes_system                   | summary_value |
      | I           | DOD           | 3000265540    | DOD_NCID   | 197807      | Ibuprofen 800 MG Oral Tablet                | urn:oid:2.16.840.1.113883.6.88 | IS_SET        |
      | I           | DOD           | 15479451      | DOD_NCID   | EMPTY       | EMPTY                                       | EMPTY                          | IS_SET        |


@f111_3_terminology_in_meds @VPR
Scenario Outline: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  Given a patient with pid "10110V004877" has been synced through Admin API
  When the client requests medications for the patient "10110V004877" in VPR format
  Then a successful response is returned  
  And the VPR results contain Medication from "RxNorm codes"
      | field                 | value                   |
      | vaType                | <vatype_code>   |
      | facilityCode          | <facility_code>         |
      #VA codes
      | products.suppliedCode | urn:va:vuid:<vuid_code> |
      #RXNORM codes
      | codes.code            | <rxnorm_code>           |
      | codes.system          | <codes_system>          |
      | codes.display         | <rxnorm_text>           |

    Examples: 
      | vatype_code | facility_code | vuid_code | rxnorm_code | rxnorm_text                                                      | codes_system                   | 
      | I           | 998           | 4002369   | 310429      | Furosemide 20 MG Oral Tablet                                     | urn:oid:2.16.840.1.113883.6.88 | 


@f111_4_terminology_in_meds @FHIR 
Scenario Outline: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  Given a patient with pid "5000000341V359724" has been synced through Admin API
  When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                         | value                   |
      | content.contained.type.text                   | <vatype_code>           |
      #VA codes
      | content.contained.extension.valueString       | urn:va:vuid:<vuid_code> |
      #RXNORM codes
      | content.contained.code.coding.code            | <rxnorm_code>           |
      | content.contained.code.coding.system          | <codes_system>          |
      | content.contained.code.coding.display         | <rxnorm_text>           |

    Examples: 
      | vatype_code | facility_code | vuid_code | rxnorm_code | rxnorm_text                                                          | codes_system                   | summary_value                            |
      | I           | 500           | 4007158   | 313782      | Acetaminophen 325 MG Oral Tablet                                     | urn:oid:2.16.840.1.113883.6.88 | CONTAINS ACETAMINOPHEN TAB TAB (EXPIRED) |
      | I           | 500           | 4001483   | 311027      | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N]      | urn:oid:2.16.840.1.113883.6.88 | CONTAINS INSULIN NOVOLIN               |
# *Test Note for Rxnorm 311027 please see the below note.


@f111_5_terminology_in_meds @FHIR 
Scenario Outline: An authorized user can access DoD inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  Given a patient with pid "5000000217V519385" has been synced through Admin API
  When the client requests in-patient medication results for the patient "5000000217V519385" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                         | value                   |
      | content.contained.type.text                   | <vatype_code>           |
      #DOD codes
      | content.contained.code.coding.code            | <dod_ncid_code>         |
      | content.contained.code.coding.system          | <dod_system>            |
      #RXNORM codes
      | content.contained.code.coding.code            | <rxnorm_code>           |
      | content.contained.code.coding.system          | <codes_system>          |
      | content.contained.code.coding.display         | <rxnorm_text>           |
     
    Examples: 
      | vatype_code | facility_code | dod_ncid_code | dod_system | rxnorm_code | rxnorm_text                                 | codes_system                   | summary_value |
      | I           | DOD           | 3000265540    | DOD_NCID   | 197807      | Ibuprofen 800 MG Oral Tablet                | urn:oid:2.16.840.1.113883.6.88 | IS_SET        |
      | I           | DOD           | 15479451      | DOD_NCID   | EMPTY       | EMPTY                                       | EMPTY                          | IS_SET        |


@f111_6_terminology_in_meds @FHIR
Scenario Outline: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  Given a patient with pid "10110V004877" has been synced through Admin API
  When the client requests in-patient medication results for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                         | value                   |
      | content.contained.type.text                   | <vatype_code>           |
      #VA codes
      | content.contained.extension.valueString       | urn:va:vuid:<vuid_code> |
      #RXNORM codes
      | content.contained.code.coding.code            | <rxnorm_code>           |
      | content.contained.code.coding.system          | <codes_system>          |
      | content.contained.code.coding.display         | <rxnorm_text>           |

    Examples: 
      | vatype_code | facility_code | vuid_code | rxnorm_code | rxnorm_text                                                      | codes_system                   | summary_value               |
      | I           | 998           | 4002369   | 310429      | Furosemide 20 MG Oral Tablet                                     | urn:oid:2.16.840.1.113883.6.88 | CONTAINS FUROSEMIDE TAB TAB |


# Test Note: 
#	 * For terminology inpatient meds,  patient 5000000341V359724, vuid code=4001483, not able to find associated rxnorm code (311027) in drug worksheet of mapping table
#      but based on talk with Les, Medications first checks in the VA H2 SQL database first to see if there is a mapping.  If it finds it there, it does not look in the mapping tables at all. 
#      So most VA results (if not all) will be successfully mapped from the H2 database.  Les took a look at the H2 database for these entries and they are correct.
#      JSON from H2 database is for this vuid is updated in "JSON from H2 database" worksheet in mapping table 
#  *** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
    
