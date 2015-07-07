@synced_immediate @unstable
Feature: F142 VX Cache Management and Expiration/Sync Stabilization
           
    
@f142_1_immediate @US2585
Scenario: Client can request sync with immediate response in VPR RDK format
  Given the client requests that the patient with pid "11016V630869" be cleared through the RDK API
  Then a successful response is returned
  When the client requests sync with immediate response within 30 second for the patient "11016V630869" in RDK format
  Then the sync immediate response will be reported the sync status without waiting for sync to completed  
      | site_panorama | site_kodak | HDR  | Dod | DAS | VLER |
      | 9E7A          | C877       | HDR | DOD | DAS | VLER |

  Given the client requests that the patient with pid "9E7A;71" be cleared through the RDK API
  Then a successful response is returned
  When the client requests sync with immediate response within 30 second for the patient "9E7A;71" in RDK format
  Then the sync immediate response will be reported the sync status without waiting for sync to completed  
      | site_panorama |
      | 9E7A          |
  
  Given the client requests that the patient with pid "C877;71" be cleared through the RDK API
  Then a successful response is returned     
  When the client requests sync with immediate response within 30 second for the patient "C877;71" in RDK format
  Then the sync immediate response will be reported the sync status without waiting for sync to completed  
      | site_kodak |
      | C877       |