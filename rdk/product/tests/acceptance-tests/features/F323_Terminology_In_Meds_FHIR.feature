 @terminology
 Feature: F323  Normalization of Inpatient Medications Data

 #This feature item adds standardized coding values and descriptions for Inpatient Medications. (VUID to RxNORM (VA), NCID to RxNORM (DoD))

 @terminology_in_meds_1 @FHIR
 Scenario: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
   Given a patient with "Medications" in multiple VistAs
   #And a patient with pid "5000000341V359724" has been synced through the RDK API
   When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
   Then a successful response is returned
   And the FHIR results contain "Medication from RxNorm codes"
       | field                                   | value                            |
       | resource.contained.contained.code.text             | Acetaminophen 325 MG Oral Tablet |
       #VA codes
       | resource.extension.valueString | urn:va:vuid:4007158              |
       #RXNORM codes
       | resource.contained.contained.code.coding.code      | 313782                           |
       | resource.contained.contained.code.coding.system    | urn:oid:2.16.840.1.113883.6.88   |
       | resource.contained.contained.code.coding.display   | Acetaminophen 325 MG Oral Tablet |
   And the FHIR results contain "Medication from RxNorm codes"
       | field                                   | value                                                           |
       | resource.contained.contained.code.text             | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N] |
       #VA codes
       | resource.extension.valueString | urn:va:vuid:4001483                                             |
       #RXNORM codes
       | resource.contained.contained.code.coding.code      | 311027                                                          |
       | resource.contained.contained.code.coding.system    | urn:oid:2.16.840.1.113883.6.88                                  |
       | resource.contained.contained.code.coding.display   | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N] |


 # *Test Note for Rxnorm 311027 please see the below note.


 @terminology_in_meds_2 @FHIR
 Scenario: An authorized user can access DoD inpatient medications and see standardized RxNorm values when defined
   Given a patient with "Medications" in multiple VistAs
  # And a patient with pid "5000000217V519385" has been synced through the RDK API
   When the client requests in-patient medication results for the patient "5000000217V519385" in FHIR format
   Then a successful response is returned
   And the FHIR results contain "Medication from RxNorm codes"
       | field                                 | value                          |
       | resource.contained.contained.name           | IBUPROFEN, 800 MG, TABLET, ORAL |
       #DOD codes
       | resource.contained.contained.code.coding.code    | 3000265540                     |
       | resource.contained.contained.code.coding.system  | DOD_NCID                       |
          
   And the FHIR results contain "Medication from RxNorm codes"
       | field                                 | value    |
       | resource.contained.contained.name           | Acetaminophen 100mg/mL, Solution, Oral, 0.8mL |
       #DOD codes
       | resource.contained.contained.code.coding.code    | 15479451 |
       | resource.contained.contained.code.coding.system  | DOD_NCID |
      
 @terminology_in_meds_3 @FHIR
 Scenario: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
   Given a patient with "Medications" in multiple VistAs
 #  And a patient with pid "10110V004877" has been synced through the RDK API
   When the client requests in-patient medication results for the patient "10110V004877" in FHIR format
   Then a successful response is returned
   And the FHIR results contain "Medication from RxNorm codes"
       | field                                   | value                          |
       | resource.contained.contained.code.text             | Furosemide 20 MG Oral Tablet |
       | resource.extension.valueString | urn:va:vuid:4002369            |
       | resource.contained.contained.code.coding.code      | 310429                         |
       | resource.contained.contained.code.coding.system    | urn:oid:2.16.840.1.113883.6.88 |
       | resource.contained.contained.code.coding.display   | Furosemide 20 MG Oral Tablet   |


 # Test Note:
 #	 * For terminology inpatient meds,  patient 5000000341V359724, vuid code=4001483, not able to find associated rxnorm code (311027) in drug worksheet of mapping table
 #      but based on talk with Les, Medications first checks in the VA H2 SQL database first to see if there is a mapping.  If it finds it there, it does not look in the mapping tables at all.
 #      So most VA results (if not all) will be successfully mapped from the H2 database.  Les took a look at the H2 database for these entries and they are correct.
 #      JSON from H2 database is for this vuid is updated in "JSON from H2 database" worksheet in mapping table
 #  *** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling

