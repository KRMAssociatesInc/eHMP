
Feature: The need to exercise following features via Performance test framework and identity/remediate performance deficiencies:

F93 Return of Allergies in FHIR format
F93 Return of Demographics in FHIR format
F93 Return of Vitals in FHIR format
F93 Return of Lab (MI) Results in VPR format 
F93 Return of Lab (MI) Results in FHIR format 
F93 Return of Lab (Chem/Hem) Results in FHIR format 
F100 Access and Verify the vitals in the hmp system
F100 Return of Non-Va medication results in FHIR format
F100 Return of Non-Va medication results in VPR format  
F100 Return of inpatient medication results in FHIR format 
F100 Return of inpatient medication results in VPR format 
F100 Return of outpatient medication results in FHIR format 
F100 Return of outpatient medication results in VPR format 
F100 Return of radiology report results in FHIR format 
F100 Return of radiology report results in VPR(Ve-Api) format 
F100 Addition of reports to VistA Exchange API
F100 Return of Clinical Notes Results in VPR format 
F100 Access and Verify the demographics in the hmp system
F100 Return of Document(Discharge Summary) Results in VPR format 
F100 Return of IV medication results in VPR format 
F100 Return of Lab (Chem/Hem) Results in VPR format 
F100 Return of Problem List Results in VPR format 
F107 Return and Display of Vitals with DoD data
F107 Return and Display of Allergies with DoD data
F107 Return and display of labs with VA and DoD data
F107 Return and display of radiology procedures with VA and DoD data
F108 Create a Mock HDR to support Development/Test validation of the HDR Synchronization
F114 Integration of Orders, Immunizations, Consults into VistA Exchange API 
F116 Return and display of and outpatient medications with DoD data
F116 Return and display of and clinical notes with DoD data
F116 Access and Verify the patient problems in the hmp system with DoD data
F116 Return and display of anatomic pathology records with VA and DoD data
F116 Return and display of immunizations records with VA and DoD data
F119 Searching by patient's partial or complete last name in CPRS Default
F119 Searching for patient's medication in CPRS Default

Background:

@perf.sync
Scenario: Patient record sync process for api testing
    Given a patient with pid "10105V001065" has been synced through Admin API
#    Given a patient with pid "11016V630869" has been synced through Admin API    
    Given a patient with pid "11006V744371" has been synced through Admin API
#    Given a patient with pid "10108V420871" has been synced through Admin API
    Given a patient with pid "10110V004877" has been synced through Admin API
    Given a patient with pid "10118V572553" has been synced through Admin API  
    Given a patient with pid "10199V865898" has been synced through Admin API  
    Given a patient with pid "10146V393772" has been synced through Admin API  
    Given a patient with pid "10107V395912" has been synced through Admin API  
    Given a patient with pid "5000000009V082878" has been synced through Admin API 
    Given a patient with pid "5000000116V912836" has been synced through Admin API  
    Given a patient with pid "5000000217V519385" has been synced through Admin API      
    Given a patient with pid "9E7A;100022" has been synced through Admin API
    Given a patient with pid "9E7A;100033" has been synced through Admin API
    Given a patient with pid "9E7A;129" has been synced through Admin API
    Given a patient with pid "9E7A;737" has been synced through Admin API
    Given a patient with pid "9E7A;17" has been synced through Admin API   
    Given a patient with pid "9E7A;1" has been synced through Admin API
    Given a patient with pid "C877;737" has been synced through Admin API 
    Given a patient with pid "C877;100022" has been synced through Admin API 
    #Given a patient with pid "E168;100022" has been synced through Admin API   

@perf.ehmp_REST @perf.VPRallergies @perf.VPR
Scenario Outline: User requests direct REST call to VPR api end-points
    Given a patient with "allergies" in multiple VistAs
    When the client requests allergies from VPR for the patient, "<pid>" 
    Then a successful response is returned
    And the result is validated

    Examples:
        | pid                  |  desc         |
        | 9E7A;100022          |  High volume  |    
#        | 10108V420871         |  Med volume   |    
#        | 11016V630869         |  Sm volume    |
        | 5000000217V519385    |  DoD          |
        | C877;737             |  HDR          |

#@perf.ehmp_REST @perf.VPRallergies @perf.VPR
Scenario Outline: User requests direct REST call to VPR api end-points and retreive patient records from other VistAs
    Given a patient with "allergies" in multiple VistAs
    When the client requests allergies from VPR for the patient, "<pid>"     
    Then a successful response is returned
    And the result is validated

    Examples:
        | pid           | desc        |   
        | C877;100022   | VistaKodak  |
        | E168;100022   | VistaAlpha  |

@perf.ehmp_REST @perf.VPRvitals @perf.VPR
Scenario Outline: User requests direct REST call to VPR api end-points
    Given a patient with "vitals" in multiple VistAs
    Then the client requests vital from VPR for the patient, "<pid>" 
    And a successful response is returned    
    And the result is validated

    Examples:
        | pid                  |  desc         |
#        | 10108V420871         |  High volume  |    
#        | 11016V630869         |  Med volume   |    
        | 9E7A;100022          |  Sm volume    |
        | 5000000116V912836    |  DoD          |
        | 9E7A;737             |  HDR          |

#@perf.ehmp_REST @perf.VPRvitals @perf.VPR
Scenario Outline: User requests direct REST call to VPR api end-points and retreive patient records from other VistAs
    Given a patient with "vitals" in multiple VistAs
    Then the client requests vital from VPR for the patient, "<pid>"     
    And a successful response is returned    
    And the result is validated  

    Examples:
        | pid           | desc        |   
        | C877;100022   | VistaKodak  |
        | E168;100022   | VistaAlpha  |

@perf.ehmp_REST @perf.VPRdemographics @perf.VPR
Scenario Outline: User requests direct REST call to VPR api end-points   #Bcma,Eight
    Given a patient with "demographics" in multiple VistAs
    Then the client requests demographics from VPR for the patient, "<pid>" 
    And a successful response is returned    
    And the result is validated

    Examples:
        | pid                  |  desc                       |
        | 9E7A;100022          |  Bcma,Eight                 |    
#        | 10108V420871         |  Eight,Patient              |    
#        | 11016V630869         |  Onehundredsixteen,Patient  |
        | 10105V001065         |  Five,Patient               |            

@perf.ehmp_REST @perf.VPRsearch @perf.VPR
Scenario: Demographic data (address, gender, etc) is returned when user searches by patient's last name   
    Given a patient with "this last name exists" in multiple VistAs
    When the user searches for a patient "EIGHT,INPATIENT" in VPR format
    And a successful response is returned    
    And the result is validated

@perf.ehmp_REST @perf.VPRsearch @perf.VPR
Scenario: When a user searches by patient's last name, demographic data is transformed correctly for a sensitive patient    
    Given a patient with "this last name exists" in multiple VistAs
    When the user searches for a patient "ZZZRETIREDONEFIVE,PATIENT" in VPR format
    And a successful response is returned    
    And the result is validated

@perf.ehmp_REST @perf.VPRsearch @perf.VPR
Scenario: When a user searches by patient's complete last name, demographic summary records are returned.   
    Given a patient with "this last name exists" in multiple VistAs
    When the user searches in summary results for a patient "EIGHT,INPATIENT" in VPR format
    And a successful response is returned    
    And the result is validated

@perf.ehmp_REST @perf.VPRsearch @perf.VPR
Scenario Outline: When a user searches by patient's partial or complete last name
    Given a patient with "this last name exists" in multiple VistAs
    When the user searches for a patient "<lastname>" in VPR format
    And a successful response is returned    
    And the result is validated  
     
    Examples:
        | lastname     | 
        | EIGHT        |
        | EIG          |
        | eight        |
        | eiG          |
        | FIVE         |
        | FIVEHUNDRED  |
        | XXX          |

@perf.ehmp_REST @perf.VPRsearch @perf.VPRsearchMed @perf.VPR
Scenario Outline: When a user searches by patient's partial or complete last name
    Given a patient with "this last name exists" in multiple VistAs
    When the user searches medication for the patient "11016V630869" with the "<text>" in VPR format
    And a successful response is returned    
    And the result is validated          
    
    Examples:
      | field               | text          | 
      | med_drug_class_name | HYPOGLYCEMIC  |
      | summary             | 500MG         |
      | qualified_name      | METFORMIN     |
      | status              | DISCONTINUED  |
      | facilityName        | ABILENE       |

@perf.ehmp_REST @perf.VPRlabs @perf.VPR
Scenario Outline: Client can request lab results in VPR format
    Given a patient with "labs" in multiple VistAs
    When the client requests labs for the patient "<pid>" in VPR format
    And a successful response is returned    
    And the result is validated         

    Examples:
        | pid                  |  desc           |   
        | 11016V630869         |  Lab (Chem/Hem) |
        | 10110V004877         |  DoD            |  
        | 9E7A;737             |  Lab (MI)-HDR   |

@perf.ehmp_REST @perf.VPRproblem @perf.VPR
Scenario Outline: Client can request problem list results in VPR format
    Given a patient with "problem list" in multiple VistAs
    When the client requests problem lists for the patient "<pid>" in VPR format
    And a successful response is returned    
    And the result is validated         

    Examples:
        | pid               |  desc    |   
        | 9E7A;129          |  VA      | 
#        | 10108V420871      |  DoD     |

@perf.ehmp_REST @perf.VPRmed @perf.VPR
Scenario Outline: Client can request medication results in VPR format
    Given a patient with "medication results" in multiple VistAs
    When the client requests medications for the patient "<pid>" in VPR format       
    And a successful response is returned    
    And the result is validated    

    Examples:
        | pid           |  desc                          |   
        | 9E7A;100033   |  Inpatient medication results  |
        | 9E7A;17       |  IV medication results         |  
        | 10118V572553  |  Non-va medication results     |
        | 9E7A;1        |  Outpatient medication results |

@perf.ehmp_REST @perf.VPRdocument @perf.VPR
Scenario Outline: Client can request documents in VPR format
    Given a patient with "documents" in multiple VistAs
    When the client requests document for the patient "<pid>" in VPR format        
    And a successful response is returned    
    And the result is validated   

    Examples:
        | pid               |  desc               |   
        | 5000000009V082878 |  Clinical Notes     |
        | 10199V865898      |  Discharge Summary  |  

@perf.ehmp_REST @perf.VPRrad @perf.VPR
Scenario Outline: Client can request radiology report results in VPR format
    Given a patient with "radiology report results" in multiple VistAs
    When the client requests radiology report results for that patient "<pid>" in VPR format
    And a successful response is returned    
    And the result is validated   

    Examples:
        | pid               |  desc       |   
        | 10146V393772      |  VA         |
        | 10110V004877      |  VA & DoD   |  

@perf.ehmp_REST @perf.VPRorder @perf.VPR
Scenario: Client can request the orders results in VPR format
    Given a patient with "order results" in multiple VistAs
    When the client requests order results for that patient "5000000009V082878" in VPR format 
    And a successful response is returned    
    And the result is validated   

@perf.ehmp_REST @perf.VPRaccession @perf.VPR
Scenario: Client can request anatomic pathology
    Given a patient with "anatomic pathology" in multiple VistAs
    When the client requests anatomic pathology for the patient "10110V004877" in VPR format
    And a successful response is returned    
    And the result is validated   

@perf.ehmp_REST @perf.VPRconsult @perf.VPR
Scenario: Client can request the consult results in VPR format
    Given a patient with "consult results" in multiple VistAs
    When the client requests consult results for the patient "10107V395912" in VPR format
    And a successful response is returned    
    And the result is validated   

#@perf.ehmp_REST @perf.VPRimmunization @perf.VPR
Scenario: Client can request immunization
    Given a patient with "immunization" in multiple VistAs
    When the client requests immunization for the patient "10108V420871" in VPR format
    And a successful response is returned    
    And the result is validated  

@perf.ehmp_REST @perf.FHIRallergies @perf.FHIR
Scenario Outline: User requests direct REST call to FHIR api end-points
    Given a patient with "allergies" in multiple VistAs
    When user requests allergies in FHIR format for a patient, "<pid>" 
    Then a successful response is returned
    And the result is validated
    
    Examples:
        | pid                  |  desc         |
        | 9E7A;100022          |  High volume  |    
#        | 10108V420871         |  Med volume   |    
#        | 11016V630869         |  Sm volume    |
        | 5000000217V519385    |  DoD          |    

@perf.ehmp_REST @perf.FHIRvitals @perf.FHIR 
Scenario Outline: User requests direct REST call to FHIR api end-points
    Given a patient with "vitals" in multiple VistAs
    Then user requests vitals in FHIR format for a patient, "<pid>" 
    And a successful response is returned    
    And the result is validated    

    Examples:
        | pid                    |  desc         |
#        | 10108V420871V420871    |  High volume  |    
#        | 11016V630869           |  Med volume   |    
        | 9E7A;100022            |  Sm volume    |

@perf.ehmp_REST @perf.FHIRdemographics @perf.FHIR 
Scenario Outline: User requests direct REST call to FHIR api end-points   
    Given a patient with "demographics" in multiple VistAs
    Then user requests demographics in FHIR format for a patient, "<pid>" 
    And a successful response is returned    
    And the result is validated        

    Examples:
        | pid                      |  desc                       |
        | 9E7A;100022              |  Bcma,Eight                 |    
#        | 10108V420871             |  Eight,Patient              |    
#        | 11016V630869V630869      |  Onehundredsixteen,Patient  |
        | 10105V001065             |  Five,Patient               |  

@perf.ehmp_REST @perf.FHIRlabs @perf.FHIR 
Scenario Outline: User requests direct REST call to FHIR api end-points      
    Given a patient with "labs" in multiple VistAs
    Then user requests labs in FHIR format for a patient, "<pid>" 
    And a successful response is returned    
    And the result is validated       

    Examples:
        | pid                |  desc         |
        | 10105V001065       |  High volume  |    
        | 11016V630869       |  Med volume   |    
        | 9E7A;100022        |  Sm volume    |       


@perf.ehmp_REST @perf.FHIRmed @perf.FHIRinpa @perf.FHIR 
Scenario: User can request in-patient medication results in FHIR format
    Given a patient with "in-patient medication results" in multiple VistAs
    When the client requests in-patient medication results for that patient "9E7A;100033" in FHIR format      
    And a successful response is returned    
    And the result is validated    

@perf.ehmp_REST @perf.FHIRmed @perf.FHIRmedprep @perf.FHIR 
Scenario: User can request non-va medication results in FHIR format
    Given a patient with "non-va medication results" in multiple VistAs
    When the client requests non-va medication results for that patient "10118V572553" in FHIR format  
    And a successful response is returned    
    And the result is validated     

@perf.ehmp_REST @perf.FHIRmed @perf.FHIRoutpa @perf.FHIR 
Scenario: Client can request out-patient medication results in FHIR format
    Given a patient with "out-patient medication results" in multiple VistAs
    When the client requests out-patient medication results for the patient "5000000318" in FHIR format
    And a successful response is returned    
    And the result is validated    
 
@perf.ehmp_REST @perf.FHIRrad @perf.FHIR 
Scenario: Client can request radiology report results in FHIR format
    Given a patient with "radiology report results" in multiple VistAs
    When the client requests radiology report results for that patient "10107V395912" in FHIR format 
    And a successful response is returned    
    And the result is validated    

@perf.ehmp_REST @perf.DoDmed @perf.DoD
Scenario: Client can request outpatient meds
    Given a patient with "outpatient medications" in multiple VistAs
    When the client requests Meds for the patient "9E7A;71"
    And a successful response is returned    
    And the result is validated      

@perf.ehmp_REST @perf.DoDnotes @perf.DoD
  Scenario: Client can request notes
    Given a patient with "DoD clinical notes" in multiple VistAs
    When the client requests unfiltered documents for the patient "10108V420871"
    And a successful response is returned    
    And the result is validated  

@perf.ehmp_REST @perf.DoDproblems @perf.DoD
  Scenario: Client can request problems
    Given a patient with "problems" in multiple VistAs
    When the client requests problems for the patient "10108V420871"    
    And a successful response is returned    
    And the result is validated  

#@perf.ehmp_REST @perf.DoDdocument @perf.DoD
Scenario: Client can request complex DoD note
    Given a patient with "DoD clinical notes" in multiple VistAs
    When the client requests document "3130313038", "1000000655", "html"
    And a successful response is returned    
    And the result is validated 

@perf.ehmp_REST @perf.HDRappointments @perf.HDR    
Scenario: Client can request appointments from multiple VistAs
    Given a patient with "appointments" in multiple VistAs
    When the client requests appointments for the patient "C877;737" in VPR format
    And a successful response is returned    
    And the result is validated      

@perf.ehmp_REST @perf.HDRconsults @perf.HDR    
Scenario: Client can request consults from multiple VistAs
    Given a patient with "consults" in multiple VistAs
    When the client requests consult results for the patient "C877;737" in VPR format_HDR
    And a successful response is returned    
    And the result is validated      

@perf.ehmp_REST @perf.HDRcpt @perf.HDR   
Scenario: Client can request cpt from multiple VistAs
    Given a patient with "cpt" in multiple VistAs
    When the client requests cpt for the patient "C877;737" in VPR format
    And a successful response is returned    
    And the result is validated 

@perf.ehmp_REST @perf.HDRdocuments @perf.HDR   
Scenario: Client can request documents from multiple VistAs
    Given a patient with "documents" in multiple VistAs
    When the client requests documents for the patient "C877;737" in VPR format_HDR
    And a successful response is returned    
    And the result is validated 

@perf.ehmp_REST @perf.HDReducations @perf.HDR   
Scenario: Client can request educations from multiple VistAs in VPR format
    Given a patient with "educations" in multiple VistAs
    When the client requests educations for the patient "9E7A;737" in VPR format
    And a successful response is returned    
    And the result is validated 

@perf.ehmp_REST @perf.HDRexams @perf.HDR 
Scenario: Client can request exams from multiple VistAs in VPR format
    Given a patient with "exams" in multiple VistAs
    When the client requests exams for the patient "9E7A;737" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRfactors @perf.HDR 
Scenario: Client can request factors from multiple VistAs in VPR format
    Given a patient with "factors" in multiple VistAs
    When the client requests factors for the patient "9E7A;737" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRimages @perf.HDR 
Scenario: Client can request images from multiple VistAs in VPR format
    Given a patient with "images" in multiple VistAs
    When the client requests images for the patient "9E7A;737" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRimmunizations @perf.HDR 
Scenario: Client can request immunizations from multiple VistAs in VPR format
    Given a patient with "immunizations" in multiple VistAs
    When the client requests immunization for the patient "11016V630869" in VPR format_HDR
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRmentalhealth @perf.HDR 
Scenario: Client can request mentalhealth from multiple VistAs in VPR format
    Given a patient with "mentalhealth" in multiple VistAs
    When the client requests mentalhealth for the patient "11016V630869" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRorders @perf.HDR 
Scenario: Client can request orders from multiple VistAs in VPR format
    Given a patient with "orders" in multiple VistAs
    When the client requests order results for the patient "11016V630869" in VPR format_HDR
    Then a successful response is returned 
    And the result is validated   

@perf.ehmp_REST @perf.HDRpointofvisits @perf.HDR 
Scenario: Client can request pointofvisits from multiple VistAs in VPR format
    Given a patient with "pointofvisits" in multiple VistAs
    When the client requests pointofvisits for the patient "11016V630869" in VPR format
    Then a successful response is returned 
    And the result is validated 

@perf.ehmp_REST @perf.HDRproblems @perf.HDR 
Scenario: Client can request problems from multiple VistAs in VPR format
    Given a patient with "problems" in multiple VistAs
    When the client requests problem lists for the patient "11016V630869" in VPR format_HDR
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRprocedures @perf.HDR 
Scenario: Client can request procedures from multiple VistAs in VPR format
    Given a patient with "procedures" in multiple VistAs
    When the client requests procedure results for the patient "11016V630869" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRskins @perf.HDR 
Scenario: Client can request skins from multiple VistAs in VPR format
    Given a patient with "skins" in multiple VistAs
    When the client requests skin results for the patient "11016V630869" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRsurgeries @perf.HDR 
Scenario: Client can request surgeries from multiple VistAs in VPR format
    Given a patient with "surgeries" in multiple VistAs
    When the client requests surgery results for the patient "11016V630869" in VPR format
    Then a successful response is returned 
    And the result is validated

@perf.ehmp_REST @perf.HDRvisits @perf.HDR 
Scenario: Client can request visits from multiple VistAs in VPR format
    Given a patient with "visits" in multiple VistAs
    When the client requests visit results for the patient "11016V630869" in VPR format
    Then a successful response is returned 
    And the result is validated