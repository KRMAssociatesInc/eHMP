@clear_cache @single
Feature: F108 Sync-Fix thread contention/concurrency issue with Multi-Site synchronization 
  
@f108_1_sync_delete_sync_patient
Scenario Outline: Request to sync a patient (sync-delete-sync patient)
  Given a patient with pid "<pid>" has been synced through Admin API
  When the client requests that the patient "<pid>" be cleared from the cache 
  Then a patient with pid "<pid>" has been synced through Admin API
  And the client receives 1 VPR VistA result(s)  
  
  Examples:
    | pid            | 
    | 10104V248233          | 
    | 10110V004877          | 
    

@f108_2_delete_sync_delete_patient 
Scenario Outline: Request to delete a patient (delete-sync-delete patient)
  Given a patient with pid "<pid>" has been synced through Admin API
  When the client requests that the patient "<pid>" be cleared from the cache
  And a patient with pid "<pid>" has been synced through Admin API
  And the client requests that the patient "<pid>" be cleared from the cache
  Then a successful response is returned within 60 seconds
  And the patient with pid "<pid>" is cleared within 30 seconds
  
  Examples:
    | pid            |           
    | 10106V187557          |
    | 10180V273016          |
    

@f108_3_sync_sync_delete_sync_patient 
Scenario Outline: Request to sync a patient (sync-sync-delete-sync patient)
  Given a patient with pid "<pid>" has been synced through Admin API
  When a patient with pid "<pid>" has been synced through Admin API
  And the client requests that the patient "<pid>" be cleared from the cache 
  Then a patient with pid "<pid>" has been synced through Admin API
  And the client receives 1 VPR VistA result(s)  
  
  Examples:
    | pid            | 
    | 10107V395912          |
    | 10108V420871          |
    

@f108_4_delete_sync_delete_sync_patient 
Scenario Outline: Request to sync a patient (delete-sync-delete-sync patient)
  Given a patient with pid "<pid>" has been synced through Admin API
  When the client requests that the patient "<pid>" be cleared from the cache
  And a patient with pid "<pid>" has been synced through Admin API
  And the client requests that the patient "<pid>" be cleared from the cache
  Then a patient with pid "<pid>" has been synced through Admin API
  And the client receives 1 VPR VistA result(s)  
  
  Examples:
    | pid            | 
 	| 10117V810068          |
    | 10118V572553          |


