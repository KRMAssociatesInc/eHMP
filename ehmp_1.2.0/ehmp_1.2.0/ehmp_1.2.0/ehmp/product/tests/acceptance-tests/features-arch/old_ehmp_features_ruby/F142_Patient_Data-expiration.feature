@patient_data_expiration

Feature: F142 VX Cache Management and Expiration/Sync Stabilization

@f142_1 @US1992
Scenario: Manual expiration of sync status - added new attributes to Sync status -lastSyncTime. 
    When a patient with pid "10108V420871" has been synced through Admin API
    Then the sync status for patient contain:
      | field										| value		|
      | syncStatusByVistaSystemId.DOD.lastSyncTime	| IS_SET	|
      | syncStatusByVistaSystemId.HDR.lastSyncTime	| IS_SET	|
      | syncStatusByVistaSystemId.DAS.lastSyncTime	| IS_SET	|
      | syncStatusByVistaSystemId.VLER.lastSyncTime	| IS_SET	|


@f142_2 @US1995
Scenario: Manual expiration of sync status - added new attributes to Sync status - expiresOn.
    Given a patient with pid "10108V420871" has been synced through Admin API
    When manual expiration is called for patient with icn "10108V420871" and site "DOD"
    Then a successful response is returned
    When a client requests sync status for patient with icn "10108V420871"
    Then the sync status for patient contain:
      | field										| value		|
      | syncStatusByVistaSystemId.DOD.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.DAS.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.VLER.expiresOn	| IS_SET	|


@f142_3 @US1995 @DE152
Scenario: Manual expiration of sync status with specified time parameter
    Given a patient with pid "10108V420871" has been synced through Admin API
    When the client requests manual expiration time "20030916170915.999" for patient with icn "10108V420871" and site "DOD"
    Then a successful response is returned
    When the client requests manual expiration time "20140916170915.999" for patient with icn "10108V420871" and site "HDR"
    Then a successful response is returned
    When the client requests manual expiration time "31150916170915.999" for patient with icn "10108V420871" and site "DAS"
    Then a successful response is returned
    When the client requests manual expiration time "31150916170915.999" for patient with icn "10108V420871" and site "VLER"
    Then a successful response is returned
    When a client requests sync status for patient with icn "10108V420871"
    Then the sync status for patient contain:
      | field										| value					|
      | syncStatusByVistaSystemId.DOD.expiresOn		| 20030916170915.999	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| 20140916170915.999	|
      | syncStatusByVistaSystemId.DAS.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.VLER.expiresOn    | IS_SET	|

    And the value of "expiresOn" is before "31150916170915.999" for site "DAS"
    And the value of "expiresOn" is before "31150916170915.999" for site "VLER"


# If the below scenarios - f142_7, 8, 9 - are failed, please check -chef.json in the vagrantfile.
# These scenario will verify the default expire time for the secondary sites.
# The default expire time set 48 hour for DoD, 8 hours for HDR and 24 hours for DAS for these scenarios.


@f142_4 @US1997 @US2336
Scenario: Secondary site data expiration times should be set according to the rules engine.
    When a patient with pid "11016V630869" has been synced through Admin API
    Then the sync status for patient contain:
      | field										| value		|
      | syncStatusByVistaSystemId.DOD.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.DAS.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.VLER.expiresOn	| IS_SET	|

    And the value of "expiresOn" is "1" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "DOD"
    And the value of "expiresOn" is "8" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "HDR"
    And the value of "expiresOn" is "24" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "DAS"
    And the value of "expiresOn" is "24" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "VLER"



@f142_5 @US1997
Scenario: The configuration default expire time set "48" hours for "DoD", "8" hours for "HDR", "24" hours for "DAS", and "24" hours for "VLER"
    Given a patient with pid "5000000217V519385" has been synced through Admin API
    Then the sync status for patient contain:
      | field										| value		|
      | syncStatusByVistaSystemId.DOD.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.DAS.expiresOn		| IS_SET	|
      | syncStatusByVistaSystemId.VLER.expiresOn	| IS_SET	|

    And the value of "expiresOn" is "8" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "HDR"
    And the value of "expiresOn" is "24" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "DAS"
    And the value of "expiresOn" is "24" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "VLER"



@f142_6 @US1997
Scenario: Secondary site data expiration times should be set according to the rules engine. manual expiration vs rules engine
    Given a patient with pid "5000000116V912836" has been synced through Admin API
    When the client requests manual expiration time "20140916170915.999" for patient with icn "5000000116V912836" and site "DOD"
    Then a successful response is returned
    When a client requests sync status for patient with icn "5000000116V912836"
    Then the sync status for patient contain:
      | field										| value					|
      | syncStatusByVistaSystemId.DOD.expiresOn		| 20140916170915.999	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| IS_SET				|
      | syncStatusByVistaSystemId.DAS.expiresOn		| IS_SET				|
      | syncStatusByVistaSystemId.VLER.expiresOn	| IS_SET				|

    When a patient with pid "5000000116V912836" has been synced through Admin API
    Then the sync status for patient contain:
      | field										| value					|
      | syncStatusByVistaSystemId.DOD.expiresOn		| IS_SET			  	|
      | syncStatusByVistaSystemId.HDR.expiresOn		| IS_SET				|
      | syncStatusByVistaSystemId.DAS.expiresOn		| IS_SET				|
      | syncStatusByVistaSystemId.VLER.expiresOn	| IS_SET				|

    And the value of "expiresOn" is after "20140916170915.999" for site "DOD"
    And the value of "expiresOn" is "1" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "DOD"
    And the value of "expiresOn" is "8" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "HDR"
    And the value of "expiresOn" is "24" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "DAS"
    And the value of "expiresOn" is "24" hour(s) +/- "5" minute(s) after the value of "lastSyncTime" for site "VLER"


@f142_7 @US1998
Scenario: Re-sync the secondary sites that have been expired - the expired time set to the past, secondary site should sync
    Given a patient with pid "10110V004877" has been synced through Admin API
    And save the last sync time for site "DOD" and wait for 10 second
    When manual expiration is called for patient with icn "10110V004877" and site "DOD"
    Then a successful response is returned
    When a patient with pid "10110V004877" has been synced through Admin API
    Then the last sync time should get updated for site "DOD"


@f142_8 @US1998
Scenario: Re-sync the secondary sites that have been expired - the expired time still in the future, secondary site should not sync
    Given a patient with pid "10110V004877" has been synced through Admin API
    And save the last sync time for site "DOD" and wait for 10 second
    When a patient with pid "10110V004877" has been synced through Admin API
    Then the last sync time should not get updated for site "DOD"
