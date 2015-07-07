@vx_sync

Feature: F323 Operational sync status can be retrieved for verification

#This feature item requests the operational sync status by site and domain.
      
@operational_data
Scenario: Client can request operational sync status from multiple sites and domains
  When the client requests operational sync status for "9E7A" site
  Then the operational data results contain different domains from "9E7A"
      | field     			|
      | asu-class			| 
      | asu-rule			|
      | doc-def				|
      | immunization-list	|
      | labgroup			|
      | labpanel			|
      | location			|
      | orderable			|
      | pt-select			|
      | qo					|
      | roster				|
      | route				|
      | schedule			|
      | signssymptoms-list	|
      | user				|
      | vitalcategory-list	|
      | vitalqualifier-list	|
      | vitaltypes-list		|
      
  When the client requests operational sync status for "C877" site
  Then the operational data results contain different domains from "C877"
      | field     			|
      | asu-class			| 
      | asu-rule			|
      | doc-def				|
      | immunization-list	|
      | labgroup			|
      | labpanel			|
      | location			|
      | orderable			|
      | pt-select			|
      | qo					|
      | roster				|
      | route				|
      | schedule			|
      | signssymptoms-list	|
      | user				|
      | vitalcategory-list	|
      | vitalqualifier-list	|
      | vitaltypes-list		|
  