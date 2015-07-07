
Feature: F108 Patient data will be populated in the VistA Exchange Cache from all source systems.


#This feature item validates that data from Non-VA source systems has been synced.


@f108_1_non_va_sync_status @single
Scenario: Client can request sync status for a patient with DOD data
  Given a patient with pid "10110V004877" has been synced through Admin API
  When the client requests the sync status for patient with pid "10110V004877"
  Then a successful response is returned
  And the sync contains 
  
    | field                                      | value                       |
    | syncStatusByVistaSystemId.DOD.syncComplete | true                        |
    | syncStatusByVistaSystemId.DOD.patientUid   | CONTAINS urn:va:patient:DOD |
    