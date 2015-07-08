@terminology @VPR @vx_sync 
Feature: F111  Normalization of Problems Data

#This feature item adds standardized coding values and descriptions for Problems. (ICD-9 to SNOMED CT (BOTH VA and DoD data))

      
@terminology_problems @VPR
Scenario: An authorized user can access VA Problem Lists and see standardized SNOMED CT values when defined
	Given a patient with "problem lists" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through VX-Sync API for "9E7A" site(s)
  	When the client requests "problem list" for the patient "10110V004877" in VPR format 
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                                                      |
      | facilityCode  | 500                                                        |
      | summary       | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      #icd Code
      | icdCode       | urn:icd:250.00                                             |
      #sno med code
      | codes.code    | EMPTY                                                      |
      | codes.system  | EMPTY                                                      |
      | codes.display | EMPTY                                                      |
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                                            |
      | facilityCode  | 500                                              |
      | summary       | Chronic Systolic Heart failure (ICD-9-CM 428.22) |
      #icd Code
      | icdCode       | urn:icd:428.22                                   |
      #sno med code
      | codes.code    | 441481004                                        |
      | codes.system  | http://snomed.info/sct                           |
      | codes.display | Chronic systolic heart failure (disorder)        |
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                             |
      | facilityCode  | 500                               |
      | summary       | Hypertension (ICD-9-CM 401.9)     |
      #icd Code
      | icdCode       | urn:icd:401.9                     |
      #sno med code
      | codes.code    | 59621000                          |
      | codes.system  | http://snomed.info/sct            |
      | codes.display | Essential hypertension (disorder) |
  	
      
@terminology_problems @VPR 
Scenario: An authorized user can access DoD Problem Lists and see standardized SNOMED CT values when defined
	Given a patient with "problem lists" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through VX-Sync API for "DoD" site(s)
  	When the client requests "problem list" for the patient "10110V004877" in VPR format 
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                     |
      | facilityCode  | DOD                       |
      | summary       | IS_SET                    |
      #icd Code
      | icdCode       | 593.9                     |
      #DOD code
      | codes.code    | 30627                     |
      | codes.system  | DOD_MEDCIN                |
      #sno med code
      | codes.code    | 90708001                  |
      | codes.system  | http://snomed.info/sct    |
      | codes.display | Kidney disease (disorder) |
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                   |
      | facilityCode  | DOD                     |
      | summary       | IS_SET                  |
      #icd Code
      | icdCode       | 724.2                   |
      #DOD code
      | codes.code    | 34447                   |
      | codes.system  | DOD_MEDCIN              |
      #sno med code
      | codes.code    | 279039007               |
      | codes.system  | http://snomed.info/sct  |
      | codes.display | Low back pain (finding) |
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                                                       |
      | facilityCode  | DOD                                                         |
      | summary       | IS_SET                                                      |
      #icd Code
      | icdCode       | 187.9                                                       |
      #DOD code
      | codes.code    | 275493                                                      |
      | codes.system  | DOD_MEDCIN                                                  |
      #sno med code
      | codes.code    | 93885006                                                    |
      | codes.system  | http://snomed.info/sct                                      |
      | codes.display | Primary malignant neoplasm of male genital organ (disorder) |
  	
      
@terminology_problems @VPR 
Scenario: An authorized user can access DoD Problem List and see standardized SNOMED CT values when defined
	Given a patient with "problem lists" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through VX-Sync API for "DoD" site(s)
  	When the client requests "problem list" for the patient "10110V004877" in VPR format 
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                                   |
      | facilityCode  | DOD                                     |
      | summary       | IS_SET                                  |
      #DOD code
      | codes.code    | 39019                                   |
      | codes.system  | DOD_MEDCIN                              |
      #sno med code
      | codes.code    | 126552007                               |
      | codes.system  | http://snomed.info/sct                  |
      | codes.display | Neoplasm of vertebral column (disorder) |
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                                               |
      | facilityCode  | DOD                                                 |
      | summary       | IS_SET                                              |
      #DOD code
      | codes.code    | 33222                                               |
      | codes.system  | DOD_MEDCIN                                          |
      #sno med code
      | codes.code    | 54160000                                            |
      | codes.system  | http://snomed.info/sct                              |
      | codes.display | Congenital aneurysm of sinus of Valsalva (disorder) |
  	Then the VPR results contain "problem lists" terminology from "(ICD-9 to SNOMED CT (BOTH))"
  	  | field         | value                   |
      | facilityCode  | DOD                     |
      | summary       | IS_SET                  |
      #DOD code
      | codes.code    | 34447                   |
      | codes.system  | DOD_MEDCIN              |
      #sno med code
      | codes.code    | 279039007               |
      | codes.system  | http://snomed.info/sct  |
      | codes.display | Low back pain (finding) |
  	

      
#TestNote: 
#	* We could not test problems in FHIR format because it's not available through FHIR.
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
	 
