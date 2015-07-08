Feature: F142 VX Cache Management and Expiration

@f142_1_errormessage_attribute_added_no_error_message
Scenario: User accesses patient data is synchronized in VX
  When a patient with pid "5000000217V519385" has been synced through Admin API  
  When the client requests the sync status for patient with pid "5000000217V519385"
  Then a successful response is returned
  And the data return for "Panorama" is "True"
  And the data return for "Kodak" is "True"
  And the data return for "VLER" is "True"
  And the data return for "DOD" is "True"
  And the data return for "DAS" is "True"
  And the data return for "HDR" is "True"
  And the client receives the expected domain
    | site_name | expected_domain |
    | Panorama  | 3               |
    | Kodak     | 6               |
    | VLER      | 1               |
    | DoD       | 10               |
    | HDR       | 20              |
    | Das       | 1               |
  And the sync contains 
      | field                                       | value |
      | syncStatusByVistaSystemId.DOD.syncComplete  | true  |
      | syncStatusByVistaSystemId.HDR.syncComplete | true  |
      | syncStatusByVistaSystemId.DAS.syncComplete  | true  |
      | syncStatusByVistaSystemId.VLER.syncComplete  | true  |
And the client will not receive sync error
     | site_name | 
     | DOD       |                    
     | HDR       |                    
     | DAS       |
     | VLER      |
    
    
