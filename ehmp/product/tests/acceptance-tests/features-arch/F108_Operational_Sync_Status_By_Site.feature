
Feature: F108 Operational sync status can be retrieved for verification

#This feature item requests the operational sync status by site and domain.
      
@f108_1_operational_sync_status
Scenario: Client can request operational sync status from multiple sites and domains
  When the client requests operational sync status for multitple sites
  Then a successful response is returned
  And the operational sync results contain different domains from "Panorama site"
      | field                                                           | value                 |
      | uid                                                             | urn:va:syncstatus:OPD |
      | syncOperationalComplete											| true					|
      | operationalSyncStatus.domainExpectedTotals.doc-def:9E7A.count 	| 691 					|
      | operationalSyncStatus.domainExpectedTotals.labgroup:9E7A.count 	| 16 					|
      | operationalSyncStatus.domainExpectedTotals.asu-class:9E7A.count | 119 					|
      | operationalSyncStatus.domainExpectedTotals.asu-rule:9E7A.count 	| 179 					|
      | operationalSyncStatus.domainExpectedTotals.labpanel:9E7A.count 	| 141 					|
      | operationalSyncStatus.domainExpectedTotals.location:9E7A.count 	| 417 					|
      | operationalSyncStatus.domainExpectedTotals.orderable:9E7A.count | 4800 					|
      | operationalSyncStatus.domainExpectedTotals.pt-select:9E7A.count | 1620 					|
      | operationalSyncStatus.domainExpectedTotals.quick:9E7A.count 	| 434 					|
      | operationalSyncStatus.domainExpectedTotals.route:9E7A.count 	| 259 					|
      | operationalSyncStatus.domainExpectedTotals.schedule:9E7A.count 	| 51 					|
      | operationalSyncStatus.domainExpectedTotals.user:9E7A.count 		| IS_SET 					|    
      
  And the operational sync results contain different domains from "Kodak site"
      | field                                                           | value                 |
      | operationalSyncStatus.domainExpectedTotals.doc-def:C877.count 	| 691 					|
      | operationalSyncStatus.domainExpectedTotals.labgroup:C877.count 	| 16 					|
      | operationalSyncStatus.domainExpectedTotals.asu-class:C877.count | 119 					|
      | operationalSyncStatus.domainExpectedTotals.asu-rule:C877.count 	| 179 					|
      | operationalSyncStatus.domainExpectedTotals.labpanel:C877.count 	| 141 					|
      | operationalSyncStatus.domainExpectedTotals.location:C877.count 	| 417 					|
      | operationalSyncStatus.domainExpectedTotals.orderable:C877.count | 4800 					|
      | operationalSyncStatus.domainExpectedTotals.pt-select:C877.count | 1620 					|
      | operationalSyncStatus.domainExpectedTotals.quick:C877.count 	| 434 					|
      | operationalSyncStatus.domainExpectedTotals.route:C877.count 	| 259 					|
      | operationalSyncStatus.domainExpectedTotals.schedule:C877.count 	| 51 					|
      | operationalSyncStatus.domainExpectedTotals.user:C877.count 		| IS_SET 					|  
      

  