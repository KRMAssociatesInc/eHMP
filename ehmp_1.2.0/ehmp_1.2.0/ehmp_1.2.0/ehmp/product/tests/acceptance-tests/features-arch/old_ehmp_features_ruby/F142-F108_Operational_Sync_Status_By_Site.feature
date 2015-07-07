
Feature: F142 / F108 Operational sync status can be retrieved for verification

#This feature item requests the operational sync status by site and domain.
      
@f108_1_operational_sync_status
Scenario: Client can request operational sync status from multiple sites and domains
  When the client requests operational sync status for multitple sites
  Then a successful response is returned
  And the operational sync results contain different domains from "Panorama site"
      | field                                                           			| value  |
      | syncOperationalComplete														| true	 |
      | operationalSyncStatus.domainExpectedTotals.immunization-list:9E7A.count 	| IS_SET |
    
      | operationalSyncStatus.domainExpectedTotals.signssymptoms-list:9E7A.count 	| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.vitaltypes-list:9E7A.count 		| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.vitalqualifier-list:9E7A.count 	| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.vitalcategory-list:9E7A.count 	| IS_SET |
      
      
      | operationalSyncStatus.domainExpectedTotals.doc-def:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.labgroup:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.asu-class:9E7A.count 			| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.asu-rule:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.labpanel:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.location:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.orderable:9E7A.count 			| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.pt-select:9E7A.count 			| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.quick:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.route:9E7A.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.schedule:9E7A.count 	| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.user:9E7A.count 		| IS_SET |    
      
  And the operational sync results contain different domains from "Kodak site"
      | field                                                          				    | value  |
      | operationalSyncStatus.domainExpectedTotals.immunization-list:C877.count 		| IS_SET |
      
      | operationalSyncStatus.domainExpectedTotals.signssymptoms-list:C877.count 		| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.vitaltypes-list:C877.count 			| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.vitalqualifier-list:C877.count 		| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.vitalcategory-list:C877.count 		| IS_SET |
      
      | operationalSyncStatus.domainExpectedTotals.doc-def:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.labgroup:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.asu-class:C877.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.asu-rule:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.labpanel:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.location:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.orderable:C877.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.pt-select:C877.count 				| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.quick:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.route:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.schedule:C877.count 					| IS_SET |
      | operationalSyncStatus.domainExpectedTotals.user:C877.count 						| IS_SET |  
      

  