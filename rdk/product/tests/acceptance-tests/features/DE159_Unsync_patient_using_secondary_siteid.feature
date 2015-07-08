@DE159 @unstable
Feature: Defect: DE159 Unable to clear a patient from ehmp using secondary site identifier

@de159_1_clear_cache_using_secondary_siteid
Scenario: Request to unsync a patient using secondary siteid
	Given a patient with pid "11016V630869" has been synced through the RDK API
	When the client requests that the patient with pid "HDR;11016V630869" be cleared through the RDK API
	Then a successful response is returned
	And the patient with pid "11016V630869" is cleared throught the RDK API within 120 seconds


@de159_2_clear_cache_using_icn
Scenario: Request to unsync a patient using secondary siteid
 	Given a patient with pid "11016V630869" has been synced through the RDK API
	When the client requests that the patient with pid "11016V630869" be cleared through the RDK API
	Then a successful response is returned
	And the patient with pid "11016V630869" is cleared throught the RDK API within 120 seconds


@de159_3_clear_cache_using_primary_siteid
Scenario: Request to unsync a patient using secondary siteid
	Given a patient with pid "11016V630869" has been synced through the RDK API
	When the client requests that the patient with pid "9E7A;227" be cleared through the RDK API
	Then a successful response is returned
	And the patient with pid "11016V630869" is cleared throught the RDK API within 120 seconds
 