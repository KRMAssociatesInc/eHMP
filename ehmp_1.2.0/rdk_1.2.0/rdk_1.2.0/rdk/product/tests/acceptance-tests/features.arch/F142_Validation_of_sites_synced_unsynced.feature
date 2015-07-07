# Archived this feature as it is currently unused, its implementation performd
# two duplicate network calls, and will need to be rewritten anyway when
# vx-sync is integrated

@synced_sites_list @US2006 @DE229
Feature: F142 Scope Item Traceability Statement: Sync completion will be reported when successful. 
         US2006:Create generic data wrapper for all data domains that will include information about 
         which sites have successfully synced and which have not
           
    
@f142_1_validation_of_synced_sites_vitals
Scenario: Client can request total successful synced sites list for vitals in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests vitals for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      
@f142_2_validation_of_synced_sites_labs 
Scenario: Client can request total successful synced sites list for labs in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests labs for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      

@f142_3_validation_of_synced_sites_allergies 
Scenario: Client can request total successful synced sites list for allergies in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests allergies for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |


@f142_4_validation_of_synced_sites_appointments
Scenario: Client can request total successful synced sites list for appointments in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests appointments for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      
         
@f142_5_validation_of_synced_sites_consults 
Scenario: Client can request total successful synced sites list for consults in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests consults for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      
    
@f142_6_validation_of_synced_sites_cpt 
Scenario: Client can request total successful synced sites list for cpt in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests cpt for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
            

@f142_7_validation_of_synced_sites_documents 
Scenario: Client can request total successful synced sites list for documents in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests documents for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
       
        
@f142_8_validation_of_synced_sites_educations 
Scenario: Client can request total successful synced sites list for educations in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests educations for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      
  
@f142_9_validation_of_synced_sites_exams 
Scenario: Client can request total successful synced sites list for exams in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests exams for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
        
        
@f142_10_validation_of_synced_sites_factors 
Scenario: Client can request total successful synced sites list for factors in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests factors for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
            

@f142_11_validation_of_synced_sites_images 
Scenario: Client can request total successful synced sites list for images in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests images for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
          
        
@f142_12_validation_of_synced_sites_immunizations 
Scenario: Client can request total successful synced sites list for immunizations in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests immunizations for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |

 
@f142_13_validation_of_synced_sites_mentalhealth 
Scenario: Client can request total successful synced sites list for mentalhealth in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests mentalhealth for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      
    
@f142_14_validation_of_synced_sites_orders 
Scenario: Client can request total successful synced sites list for orders in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests orders for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
            

@f142_15_validation_of_synced_sites_pointofvisits 
Scenario: Client can request total successful synced sites list for pointofvisits in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests pointofvisits for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      

@f142_16_validation_of_synced_sites_problems 
Scenario: Client can request total successful synced sites list for problem lists in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests problem list for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      

@f142_17_validation_of_synced_sites_procedures 
Scenario: Client can request total successful synced sites list for procedures in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests procedures for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      

@f142_18_validation_of_synced_sites_skins 
Scenario: Client can request total successful synced sites list for skin results in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests skin for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
      
      
@f142_19_validation_of_synced_sites_surgeries 
Scenario: Client can request total successful synced sites list for surgery results in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests surgery for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
  

@f142_20_validation_of_synced_sites_treatments
Scenario: Client can request total successful synced sites list for treatment results in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests treatment for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |
   

@f142_21_validation_of_synced_sites_medications 
Scenario: Client can request total successful synced sites list for medications in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests medications for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |


@f142_21_validation_of_synced_sites_observations
Scenario: Client can request total successful synced sites list for  observations in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests observations for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |


@f142_22_validation_of_synced_sites_ptf 
Scenario: Client can request total successful synced sites list for ptf in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests ptf for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |


@f142_23_validation_of_synced_sites_radiology 
Scenario: Client can request total successful synced sites list for radiology in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests radiology for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |


@f142_24_validation_of_synced_sites_visits
Scenario: Client can request total successful synced sites list for visit results in VPR RDK format
  Given a patient with pid "11016V630869" has been synced through the RDK API
  When the client requests visit for the patient "11016V630869" in RDK format
  Then a successful response is returned 
  And data sync completion will be reported when successful 
      | site_panorama | site_kodak | CDS  | Dod | DAS | VLER |
      | 9E7A          | C877       | CDS | DOD | DAS | VLER |


      
 
#As of now we are unable to test this Scenario Outline becauase the results comes back after the sync complete

