@patient_data_expiration

Feature: F142 VX Cache Management and Expiration/Sync Stabilization


@f142_2_1 @US2004 @debug @DE588
Scenario: Manual expiration of sync status with specified time parameter
    Given a patient with pid "10108V420871" has been synced through the RDK API
    When the client requests manual expiration time "20030916170915.999" for patient with pid "10108V420871" and site "DOD"
    Then a successful response is returned
    When the client requests manual expiration time "20140916170915.999" for patient with pid "10108V420871" and site "HDR"
    Then a successful response is returned
    When the client requests manual expiration time "20140916170915.999" for patient with pid "10108V420871" and site "DAS"
    Then a successful response is returned
    When the client requests manual expiration time "20140916170915.996" for patient with pid "10108V420871" and site "VLER"
    Then a successful response is returned
    When the client requests sync status for the patient "10108V420871" in RDK format
    Then the sync status for patient contain:
      | field										                  | value					      |
      | syncStatusByVistaSystemId.DOD.expiresOn		| 20030916170915.999	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| 20140916170915.999	|
      | syncStatusByVistaSystemId.DAS.expiresOn		| 20140916170915.999	|
      | syncStatusByVistaSystemId.VLER.expiresOn  | 20140916170915.996  |
