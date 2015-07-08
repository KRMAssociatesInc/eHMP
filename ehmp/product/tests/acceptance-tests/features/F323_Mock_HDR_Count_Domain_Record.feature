@us4618 @F323 @vx_sync 
Feature: F323 syncing data to check the domains

#This feature item covers the domain records on HDR site.


@count_hdr
Scenario: Client request sync for patient and get all domain records in Mock HDR
	When a patient with pid "9E7A;227" has been synced through VX-Sync API for "HDR" site(s)
	Then the sync status results for "HDR" site(s) contain
	  | Domain       | SyncComplete |
      | Allergy      |     true     |
      | Lab          |     true     |
      | Appointment  |     true     |
      | Consult      |     true     |
      | CPT          |     true     |
      | Document     |     true     |
      | Order        |     true     |
      | POV          |     true     |
      | Problem      |     true     |
      | Visit        |     true     |
      | Vital        |     true     |
	  | Surgery      |     true     |
      | Image        |     true     |
      | Procedure    |     true     |
      | Immunization |     true     |
      | Factor       |     true     |
      

@count_vler
Scenario: Client request sync for patient and get all domain records in VLER
	When a patient with pid "9E7A;227" has been synced through VX-Sync API for "VLER" site(s)
	Then the sync status results for "VLER" site(s) contain
	  | Domain       | SyncComplete |
      | Vlerdocument |     true     |
	  
      


	  
	     