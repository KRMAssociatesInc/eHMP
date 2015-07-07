@us4618 @vx_sync 
Feature: F323 syncing data to check the domains

#This feature item covers the domain records on CDS site.


@count_cds
Scenario: Client request sync for patient and get all domain records in Mock CDS
	When a patient with pid "9E7A;227" has been synced through VX-Sync API for "CDS" site(s)
	Then the sync status results for "CDS" site(s) contain
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
      | Education    |     true     |
	  | Surgery      |     true     |
      | Image        |     true     |
      | Procedure    |     true     |
      | Immunization |     true     |
      | Exam         |     true     |
      | Mh           |     true     |
      | Skin         |     true     |
      | Factor       |     true     |
      

@count_vler
Scenario: Client request sync for patient and get all domain records in VLER
	When a patient with pid "9E7A;227" has been synced through VX-Sync API for "VLER" site(s)
	Then the sync status results for "VLER" site(s) contain
	  | Domain       | SyncComplete |
      | Vlerdocument |     true     |
	  
      


	  
	     