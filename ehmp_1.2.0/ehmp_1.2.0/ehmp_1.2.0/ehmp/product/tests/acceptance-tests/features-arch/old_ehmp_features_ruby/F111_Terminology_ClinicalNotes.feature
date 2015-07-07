@terminology @VPR 
Feature: F111  Normalization of Clinical Notes Document Data

#This feature item adds standardized coding values and descriptions for Clinical Notes Documents. (VUID to LOINC (VA data), NCID to LOINC (DoD data))

  Background: Make sure the required patient is synced
    Given a patient with pid "10108V420871" has been synced through Admin API

  @terminology_clinical_notes @VPR
  Scenario Outline: An authorized user can access DoD Notes and see standardized LOINC values when defined
    Given a patient with "Notes" in multiple VistAs
    When the client requests document for the patient "10108V420871" in VPR format
    Then a successful response is returned
    And the VPR results contain Document from "LOINC codes"
      | field         | value           |
      | facilityCode  | <facility_code> |
      | summary       | <summary_value> |
      #DOD codes
      | codes.code    | <dod_ncid_code> |
      | codes.system  | <dod_system>    |
      #LOINC codes
      | codes.code    | <loinc_code>   |
      | codes.system  | <codes_system>  |
      | codes.display | <loinc_text>   |

  Examples:
    | facility_code | dod_ncid_code | dod_system | loinc_code  | loinc_text                                  | codes_system                   | summary_value |
    | DOD           | 15149135      | DOD_NCID   | 28570-0     | Provider-unspecified Procedure note         | http://loinc.org               | IS_SET        |
    | DOD           | 15148780      | DOD_NCID   | 18752-6     | Exercise stress test study                  | http://loinc.org               | IS_SET        |
    | DOD           | 15149947      | DOD_NCID   | 11502-2     | Laboratory report                           | http://loinc.org  			  | IS_SET        |

#TestNote:
#  * We could not test notes/documents in FHIR format because it's not available through FHIR.
#  * VUID->LOINC mapping table is quite limited and test patient with a note vuid that could be mapped to VUID->LOINC mapping table could not be found.
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
