@terminology @debug @DE1010
Feature: F323  Normalization of Vitals Data

#This feature item adds standardized coding values and descriptions for Vitals. (VUID to LOINC (VA data), NCID to LOINC (DoD data))


@terminology_vitals @FHIR 
Scenario: An authorized user can access VA Vitals and see standardized LOINC values when defined
  Given a patient with "vitals" in multiple VistAs
  And a patient with pid "5000000341V359724" has been synced through the RDK API
  When the client requests vitals for the patient "5000000341V359724" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "vitals terminology from VUID to LOINC (VA)"
      | field                       | value                   |
      #Loinc code
      | content.name.coding.code    | 8480-6                  |
      | content.name.coding.system  | http://loinc.org        |
      | content.name.coding.display | Systolic blood pressure |
  And the FHIR results contain "vitals terminology from VUID to LOINC (VA)"
      | field                       | value                    |
      #Loinc code
      | content.name.coding.code    | 8462-4                   |
      | content.name.coding.system  | http://loinc.org         |
      | content.name.coding.display | Diastolic blood pressure |

          
@terminology_vitals1 @FHIR  
Scenario: An authorized user can access DOD Vitals and see standardized LOINC values when defined
  Given a patient with "vitals" in multiple VistAs
  And a patient with pid "10110V004877" has been synced through the RDK API
  When the client requests vitals for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "vitals terminology from DOD Ncid, VUID to LOINC (VA)"
      | field                       | value                |
      #Loinc code
      | content.name.coding.code    | 3141-9               |
      | content.name.coding.system  | http://loinc.org     |
      | content.name.coding.display | Body weight Measured |
      #DOD code
      | content.name.coding.system  | http://loinc.org     |
      | content.name.coding.system  | DOD_NCID             |
      | content.name.coding.code    | 2178                 |
     
  And the FHIR results contain "vitals terminology from DOD Ncid, VUID to LOINC (VA)"
      | field                       | value            |
      #Loinc code
      | content.name.coding.code    | 8310-5           |
      | content.name.coding.system  | http://loinc.org |
      | content.name.coding.display | Body temperature |
      #DOD code
      | content.name.coding.system  | DOD_NCID         |
      | content.name.coding.code    | 2154             |
  

    
 #  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
    
