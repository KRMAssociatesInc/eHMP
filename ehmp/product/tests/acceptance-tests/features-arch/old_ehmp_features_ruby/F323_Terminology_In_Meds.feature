@terminology @VPR @vx_sync 
Feature: F323  Normalization of Inpatient Medications Data

#This feature item adds standardized coding values and descriptions for Inpatient Medications. (VUID to RxNORM (VA), NCID to RxNORM (DoD)) 


@terminology_in_meds @VPR
Scenario: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "5000000341V359724" has been synced through VX-Sync API for "9E7A" site(s)
  When the client requests "meds" for the patient "5000000341V359724" in VPR format 
  Then the VPR results contain "medications" terminology from "RxNorm codes"
  	  | field                 | value                                            |
      | vaType                | I                                                |
      | facilityCode          | 500                                              |
      | summary               | ACETAMINOPHEN TAB (EXPIRED)\n Give: 325MG PO Q4H |
      #VA codes
      | products.suppliedCode | urn:va:vuid:4007158                              |
      #RXNORM codes
      | codes.code            | 313782                                           |
      | codes.system          | urn:oid:2.16.840.1.113883.6.88                   |
      | codes.display         | Acetaminophen 325 MG Oral Tablet                 |
  Then the VPR results contain "medications" terminology from "RxNorm codes"
  	  | field                 | value                                                                     |
      | vaType                | I                                                                         |
      | facilityCode          | 500                                                                       |
      | summary               | INSULIN NOVOLIN N(NPH) INJ (DISCONTINUED/EDIT)\n Give: 15 UNITS SC BID AC |
      #VA codes
      | products.suppliedCode | urn:va:vuid:4001483                                                       |
      #RXNORM codes
      | codes.code            | 311027                                                                    |
      | codes.system          | urn:oid:2.16.840.1.113883.6.88                                            |
      | codes.display         | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N]           |
      

# *Test Note for Rxnorm 311027 please see the below note.


@terminology_in_meds @VPR @debug
Scenario: An authorized user can access DoD inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "5000000217V519385" has been synced through VX-Sync API for "DoD" site(s)
  When the client requests "meds" for the patient "5000000217V519385" in VPR format 
  Then the VPR results contain "medications" terminology from "RxNorm codes"
  	  | field         | value                          |
      | vaType        | I                              |
      | facilityCode  | DOD                            |
      | summary       | IS_SET                         |
      #DOD codes
      | codes.code    | 3000265540                     |
      | codes.system  | DOD_NCID                       |
      #RXNORM codes
      | codes.code    | 197807                         |
      | codes.system  | urn:oid:2.16.840.1.113883.6.88 |
      | codes.display | Ibuprofen 800 MG Oral Tablet   |
  And the VPR results contain "medications" terminology from "RxNorm codes"
      | field         | value    |
      | vaType        | I        |
      | facilityCode  | DOD      |
      | summary       | IS_SET   |
      #DOD codes
      | codes.code    | 15479451 |
      | codes.system  | DOD_NCID |
      #RXNORM codes
      | codes.code    | EMPTY    |
      | codes.system  | EMPTY    |
      | codes.display | EMPTY    |
      

@terminology_in_meds @VPR
Scenario: An authorized user can access VA inpatient medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "10110V004877" has been synced through VX-Sync API for "9E7A" site(s)
  When the client requests "meds" for the patient "10110V004877" in VPR format 
  Then the VPR results contain "medications" terminology from "RxNorm codes"
      | field                 | value                   		|
      | vaType                | I   							|
      | facilityCode          | 998         					|
      #VA codes
      | products.suppliedCode | urn:va:vuid:4002369 			|
      #RXNORM codes
      | codes.code            | 310429           				|
      | codes.system          | urn:oid:2.16.840.1.113883.6.88  |
      | codes.display         | Furosemide 20 MG Oral Tablet	|


# Test Note: 
#	 * For terminology inpatient meds,  patient 5000000341V359724, vuid code=4001483, not able to find associated rxnorm code (311027) in drug worksheet of mapping table
#      but based on talk with Les, Medications first checks in the VA H2 SQL database first to see if there is a mapping.  If it finds it there, it does not look in the mapping tables at all. 
#      So most VA results (if not all) will be successfully mapped from the H2 database.  Les took a look at the H2 database for these entries and they are correct.
#      JSON from H2 database is for this vuid is updated in "JSON from H2 database" worksheet in mapping table 
#  *** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
    
