@future
Feature:

@future @manual @F117_2_healthcheck
Scenario: Request healthcheck details when resources not available
    Given "tester has stopped the APS vm"
    When client requests the healthcheck healthy flag
	And the response is "false for authorization , patientrecord,jdsSync and red in detail-html"
    
    Given "tester has stopped the jds vm"
	When client requests the healthcheck details in RDK format
	And the response is "false for jds,jdsSync and red in detail-html for jds,jdsSync "

    Given "tester has stopped the JDS Sync vm"
	When client requests the healthcheck details in RDK format
	And the response is "false for jds,jdsSync and red in detail-html for jds,jdsSync "

    Given "tester has stopped the solr vm"
	When client requests the healthcheck details in RDK format
	And the response is "false for solr and red in detail-html for solr "

	Given "tester has stopped the ve-api vm"
	When client requests the healthcheck details in RDK format
	And the response is "false for ve-api and red in detail-html for patientrecord "


@future @manual @F117_2_healthcheck
Scenario: Request healthcheck details when resources are started
    Given "tester has started the APS vm"
    When client requests the healthcheck healthy flag
	And the response is "true for authorization and green in detail-html"

    Given "tester has started  the jds vm"
	When client requests the healthcheck details in RDK format
	And the response is "true  for jds,jdsSync and green in detail-html for jds,jdsSync "

    Given "tester has started the JDS Sync vm"
	When client requests the healthcheck details in RDK format
	And the response is "true  for jds,jdsSync and green in detail-html for jds,jdsSync "

    Given "tester has started  the solr vm"
	When client requests the healthcheck details in RDK format
	And the response is "true  for solr and green in detail-html for solr "

    Given "tester has started the ve-api vm"
	When client requests the healthcheck details in RDK format
	And the response is "true  for ve-api and green in detail-html for patientrecord "