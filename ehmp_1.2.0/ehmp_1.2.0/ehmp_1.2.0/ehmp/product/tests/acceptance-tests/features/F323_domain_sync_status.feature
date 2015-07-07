@us4599 @F323 @vx_sync
Feature: F323 syncing data to check the domains

#This feature item covers the domain records on all sites for a patient save on JDS.

@count_pan
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "9E7A;3" has been synced through VX-Sync API for "9E7A" site(s)
	Then the sync status results for "9E7A" site(s) contain
	  | Domain      | SyncComplete |
      | Allergy     | true         |
      | Lab         | true         |
      | Appointment | true         |
      | Consult     | true         |
      | CPT         | true         |
      | Document    | true         |
      | Factor      | true         |
      | Med         | true         |
      | Order       | true         |
      | POV         | true         |
      | Problem     | true         |
      | Surgery     | true         |
      | Visit       | true         |
      | Vital       | true         |

        
@count_pan
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A" site(s)
	Then the sync status results for "9E7A" site(s) contain
	  | Domain       | SyncComplete |
      | Image        | true         |
      | Procedure    | true         |
      | Immunization | true         |


@count_pan
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "9E7A;253" has been synced through VX-Sync API for "9E7A" site(s)
	Then the sync status results for "9E7A" site(s) contain
		|Domain      | Count | 
	    | Education  | true         |


@count_kod
Scenario: Client request sync for patient and get all domain records in Kodak
	When a patient with pid "C877;3" has been synced through VX-Sync API for "C877" site(s)
	Then the sync status results for "C877" site(s) contain
	  | Domain      | SyncComplete |
      | Allergy     | true         |
      | Lab         | true         |
      | Appointment | true         |
      | Consult     | true         |
      | CPT         | true         |
      | Document    | true         |
      | Factor      | true         |
      | Med         | true         |
      | Order       | true         |
      | POV         | true         |
      | Problem     | true         |
      | Surgery     | true         |
      | Visit       | true         |
      | Vital       | true         |
        
@count_kod
Scenario: Client request sync for patient and get all domain records in Kodak
	When a patient with pid "C877;8" has been synced through VX-Sync API for "C877" site(s)
	Then the sync status results for "C877" site(s) contain
	  | Domain       | SyncComplete |
      | Image        | true         |
      | Procedure    | true         |
      | Immunization | true         |


@count_kod
Scenario: Client request sync for patient and get all domain records in Kodak
	When a patient with pid "C877;253" has been synced through VX-Sync API for "C877" site(s)
	Then the sync status results for "C877" site(s) contain
		|Domain      | SyncComplete |
	    | Education  | true         |

  
@count_dod
Scenario: Client request sync for patient and get all domain records in DoD
	When a patient with pid "9E7A;3" has been synced through VX-Sync API for "DOD" site(s)
	Then the sync status results for "DoD" site(s) contain
	  | Domain       | SyncComplete |
	  | Allergy      | true         |
	  | Lab          | true         |
	  | Appointment  | true         |
	  | Document     | true         |
	  | Immunization | true         |
	  | Med          | true         |
	  | Problem      | true         |
	  | Visit        | true         |
	  | Vital        | true         |
	
	   
@count_dod
Scenario: Client request sync for patient and get all domain records in DoD
	When a patient with pid "9E7A;8" has been synced through VX-Sync API for "DoD" site(s)
	Then the sync status results for "DoD" site(s) contain
		| Domain    | SyncComplete |
		| Order     | true         |
		| Image     | true         |
		| Patient	| true         |


@count_pan
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A" site(s)
	Then the sync status results for "9E7A" site(s) contain
	  | Domain      | SyncComplete |
      | Allergy     | true         |
      | Lab         | true         |
      | Appointment | true         |
      | Consult     | true         |
      | CPT         | true         |
      | Document    | true         |
      | Factor      | true         |
      | Med         | true         |
      | Order       | true         |
      | POV         | true         |
      | Problem     | true         |
      | Visit       | true         |
      | Vital       | true         |
      | Education   | true         |


@count_pan
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A" site(s)
	Then the sync status results for "9E7A" site(s) contain
	  | Domain       | SyncComplete |
	  | Surgery      | true         |
      | Image        | true         |
      | Procedure    | true         |
      | Immunization | true         |
      

@count_kod
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "C877;227" has been synced through VX-Sync API for "C877" site(s)
	Then the sync status results for "C877" site(s) contain
	  | Domain      | SyncComplete |
      | Allergy     | true         |
      | Lab         | true         |
      | Appointment | true         |
      | Consult     | true         |
      | CPT         | true         |
      | Document    | true         |
      | Factor      | true         |
      | Med         | true         |
      | Order       | true         |
      | POV         | true         |
      | Problem     | true         |
      | Visit       | true         |
      | Vital       | true         |
      | Education   | true         |


@count_kod
Scenario: Client request sync for patient and get all domain records in Panorama
	When a patient with pid "C877;8" has been synced through VX-Sync API for "C877" site(s)
	Then the sync status results for "C877" site(s) contain
	  | Domain       | SyncComplete |
	  | Surgery      | true         |
      | Image        | true         |
      | Procedure    | true         |
      | Immunization | true         |

            
@count_dod
Scenario: Client request sync for patient and get all domain records in DoD
	When a patient with pid "9E7A;227" has been synced through VX-Sync API for "DOD" site(s)
	Then the sync status results for "DoD" site(s) contain
	  | Domain       | SyncComplete |
	  | Lab          | true         |
	  | Appointment  | true         |
	  | Document     | true         |
	  | Problem      | true         |
	  | Visit        | true         |

	  
@count_dod
Scenario: Client request sync for patient and get all domain records in DoD
	When a patient with pid "9E7A;8" has been synced through VX-Sync API for "DoD" site(s)
	Then the sync status results for "DoD" site(s) contain
		| Domain    	| SyncComplete |
		| Allergy       | true         |
		| Immunization 	| true         |
		| Med          	| true         |
		| Vital        	| true         |
		| Order     	| true         |
		| Image     	| true         |
		| Patient		| true         |
	  
	  
	     