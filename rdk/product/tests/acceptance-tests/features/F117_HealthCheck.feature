@F117_healthcheck @unstable
Feature: create a web application to be used as point-of-care healthcare application

 @F117_1_healthcheck
Scenario: Request patient resource directory for health checks
	When client requests the patient resource directory in RDK format
	Then a successful response is returned
	And the RDK response contains
	  | field | value                           	|
      | title | healthcheck-healthy           		|
      | href  | CONTAINS /healthcheck/healthy 		|
    And the RDK response contains
	  | field | value                           	|
      | title | healthcheck-detail           		|
      | href  | CONTAINS /healthcheck/detail 		|
    And the RDK response contains
	  | field | value                           	|
      | title | healthcheck-detail-html           	|
      | href  | CONTAINS /healthcheck/detail/html 	|
    And the RDK response contains
	  | field | value                           	|
      | title | healthcheck-noupdate          		|
      | href  | CONTAINS healthcheck/noupdate		|
    And the RDK response contains
	  | field | value                           	|
      | title | healthcheck-checks              	|
      | href  | CONTAINS /healthcheck/checks    	|



 @F117_7_healthcheck_healthy 
Scenario: Request the healthcheck healthy flag
	When client requests the healthcheck healthy flag
	Then a successful response is returned
	And the response is "true"

 @F117_8_healthcheck_detail 
Scenario: Request healthcheck details
    When client requests the healthcheck details in RDK format
   And the RDK healthcheck response "jds" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "jdsSync" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "solr" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "authorization" contains 
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "patientrecord" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
    And the RDK healthcheck response "authentication-authentication" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
    And the RDK healthcheck response "synchronization-load" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
    And the RDK healthcheck response "synchronization-loadPrioritized" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |		
   And the RDK healthcheck response "audit-record-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "audit-record-clear" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "audit-record-config" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "user-service-userinfo" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "search-global-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-dayssupply" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "patient-record-labsbypanel" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "search-mvi-patient-sync" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "search-default-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "allergy-op-data-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "allergy-op-data-symptoms" contains
		|field	  |value     |		
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "patient-record-labsbytype" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-schedule" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-defaults" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-searchlist" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-dialogformat" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-discontinuereason" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "problems-getProblems" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "problems-AddProblem" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "problems-UpdateProblem" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "vitals-closest-reading" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-save-allergy" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-allergy-error-save" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-allergy-error-permission" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-save-demographics" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-providers" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-locations" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-appointments" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-admissions" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "locations-wards" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "locations-clinics" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "clinical-reminder-list" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "clinical-reminder-detail" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "patient-demographics" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "adversereaction-adversereactions" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "vitals" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "diagnosticreport-diagnosticreport" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "vista-js-test" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |


 @F117_9_healthcheck_detailhtml @future
Scenario: Request healthcheck details html
	When client requests the healthcheck details html in RDK format
	Then a successful response is returned
	And the response contains html elements

 @F117_1_healthcheck_checks
Scenario: Request healthcheck checks
	When client requests the healthcheck checks in RDK format
    Then a successful response is returned
    And the RDK healthcheck response "jds" contains
		|field	  |value     |
		|name	  |jds      |
		|type     |subsystem |
	    |interval |1000      |
    And the RDK healthcheck response "jdsSync" contains
		|field	  |value     |
		|name	  | jdsSync  |
		|type     |subsystem |
		|interval |2000      |
    And the RDK healthcheck response "solr" contains
		|field	  |value     |
		| name	  | solr     |
		|type     |subsystem |
		|interval |1000      |
    And the RDK healthcheck response "authorization" contains 
		|field	  |value     |
		| name	  |authorization     |
		|type     |subsystem |
		|interval |1000      |
    And the RDK healthcheck response "patientrecord" contains
		|field	  |value     |
		| name	  |patientrecord     |
		|type     |subsystem |
		|interval |1000      |
    And the RDK healthcheck response "authentication-authentication" contains
		|field	  |value     |
		| name	  |authentication-authentication     |
		|type     |resource |
    And the RDK healthcheck response "synchronization-load" contains
		|field	  |value     |
		| name	  |synchronization-load    |
		|type     |resource |
    And the RDK healthcheck response "synchronization-loadPrioritized" contains
		|field	  |value     |
		| name	  |synchronization-loadPrioritized   |
		|type     |resource |
   And the RDK healthcheck response "audit-record-search" contains
		|field	  |value     |
		| name	  |audit-record-search  |
		|type     |resource |		
   And the RDK healthcheck response "audit-record-clear" contains
		|field	  |value     |
		| name	  |audit-record-clear  |
		|type     |resource |
   And the RDK healthcheck response "audit-record-config" contains
		|field	  |value     |
		| name	  |audit-record-config  |
		|type     |resource |
   And the RDK healthcheck response "user-service-userinfo" contains
		|field	  |value     |
		| name	  |user-service-userinfo |
		|type     |resource |
   And the RDK healthcheck response "search-global-search" contains
		|field	  |value     |
		| name	  |search-global-search |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-dayssupply" contains
		|field	  |value     |
		| name	  |med-op-data-dayssupply |
		|type     |resource |
   And the RDK healthcheck response "patient-record-labsbypanel" contains
		|field	  |value     |
		| name	  |patient-record-labsbypanel |
		|type     |resource |
   And the RDK healthcheck response "search-mvi-patient-sync" contains
		|field	  |value     |
		| name	  |search-mvi-patient-sync |
		|type     |resource |
   And the RDK healthcheck response "search-default-search" contains
		|field	  |value     |
		| name	  |search-default-search |
		|type     |resource |
   And the RDK healthcheck response "allergy-op-data-search" contains
		|field	  |value     |
		| name	  |allergy-op-data-search |
		|type     |resource |
   And the RDK healthcheck response "allergy-op-data-symptoms" contains
		|field	  |value     |
		| name	  |allergy-op-data-symptoms |
		|type     |resource |
   And the RDK healthcheck response "patient-record-labsbytype" contains
		|field	  |value     |
		| name	  |patient-record-labsbytype |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-search" contains
		|field	  |value     |
		| name	  |med-op-data-search |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-medlist" contains
		|field	  |value     |
		| name	  |med-op-data-medlist |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-schedule" contains
		|field	  |value     |
		| name	  |med-op-data-schedule |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-defaults" contains
		|field	  |value     |
		| name	  |med-op-data-defaults|
		|type     |resource |
   And the RDK healthcheck response "med-op-data-searchlist" contains
		|field	  |value     |
		| name	  |med-op-data-searchlist|
		|type     |resource |
   And the RDK healthcheck response "med-op-data-dialogformat" contains
		|field	  |value     |
		| name	  |med-op-data-dialogformat|
		|type     |resource |
   And the RDK healthcheck response "med-op-data-discontinuereason" contains
		|field	  |value     |
		| name	  |med-op-data-discontinuereason|
		|type     |resource |
   And the RDK healthcheck response "problems-getProblems" contains
		|field	  |value     |
		| name	  |problems-getProblems|
		|type     |resource |
   And the RDK healthcheck response "problems-AddProblem" contains
		|field	  |value     |
		| name	  |problems-AddProblem|
		|type     |resource |
   And the RDK healthcheck response "problems-UpdateProblem" contains
		|field	  |value     |
		| name	  |problems-UpdateProblem|
		|type     |resource |
   And the RDK healthcheck response "vitals-closest-reading" contains
		|field	  |value     |
		| name	  |vitals-closest-reading|
		|type     |resource |
   And the RDK healthcheck response "write-back-save-allergy" contains
		|field	  |value     |
		| name	  |write-back-save-allergy|
		|type     |resource |
   And the RDK healthcheck response "write-back-allergy-error-save" contains
		|field	  |value     |
		| name	  |write-back-allergy-error-save|
		|type     |resource |
   And the RDK healthcheck response "write-back-allergy-error-permission" contains
		|field	  |value     |
		| name	  |write-back-allergy-error-permission|
		|type     |resource |
   And the RDK healthcheck response "write-back-save-demographics" contains
		|field	  |value     |
		| name	  |write-back-save-demographics|
		|type     |resource |
   And the RDK healthcheck response "visits-providers" contains
		|field	  |value     |
		| name	  |visits-providers|
		|type     |resource |
   And the RDK healthcheck response "visits-locations" contains
		|field	  |value     |
		| name	  |visits-locations|
		|type     |resource |
   And the RDK healthcheck response "visits-appointments" contains
		|field	  |value     |
		| name	  |visits-appointments|
		|type     |resource |
   And the RDK healthcheck response "visits-admissions" contains
		|field	  |value     |
		| name	  |visits-admissions|
		|type     |resource |
   And the RDK healthcheck response "locations-wards" contains
		|field	  |value     |
		| name	  |locations-wards|
		|type     |resource |
   And the RDK healthcheck response "locations-clinics" contains
		|field	  |value     |
		| name	  |locations-clinics|
		|type     |resource |
   And the RDK healthcheck response "clinical-reminder-list" contains
		|field	  |value     |
		| name	  |clinical-reminder-list|
		|type     |resource |
   And the RDK healthcheck response "clinical-reminder-detail" contains
		|field	  |value     |
		| name	  |clinical-reminder-detail|
		|type     |resource |
   And the RDK healthcheck response "patient-demographics" contains
		|field	  |value     |
		| name	  |patient-demographics|
		|type     |resource |
   And the RDK healthcheck response "adversereaction-adversereactions" contains
		|field	  |value     |
		| name	  |adversereaction-adversereactions|
		|type     |resource |
   And the RDK healthcheck response "vitals" contains
		|field	  |value     |
		| name	  |vitals|
		|type     |resource |
   And the RDK healthcheck response "diagnosticreport-diagnosticreport" contains
		|field	  |value     |
		| name	  |diagnosticreport-diagnosticreport|
		|type     |resource |
   And the RDK healthcheck response "vista-js-test" contains
		|field	  |value     |
		| name	  |vista-js-test|
		|type     |resource |


 @F117_1_healthcheck_noupdate
Scenario: Request healthcheck noupdate 
	When client requests the healthcheck noupdate on demand in RDK format
    Then a successful response is returned
    And the RDK healthcheck response "jds" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "jdsSync" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "solr" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "authorization" contains 
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
	    |check    |true      |
    And the RDK healthcheck response "patientrecord" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |subsystem |
    And the RDK healthcheck response "authentication-authentication" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
    And the RDK healthcheck response "synchronization-load" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
    And the RDK healthcheck response "synchronization-loadPrioritized" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |		
   And the RDK healthcheck response "audit-record-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "audit-record-clear" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "audit-record-config" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "user-service-userinfo" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "search-global-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-dayssupply" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "patient-record-labsbypanel" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "search-mvi-patient-sync" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "search-default-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "allergy-op-data-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "allergy-op-data-symptoms" contains
		|field	  |value     |		
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "patient-record-labsbytype" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-search" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-medlist" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-schedule" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-defaults" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-searchlist" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-dialogformat" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "med-op-data-discontinuereason" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "problems-getProblems" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "problems-AddProblem" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "problems-UpdateProblem" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "vitals-closest-reading" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-save-allergy" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-allergy-error-save" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-allergy-error-permission" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "write-back-save-demographics" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-providers" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-locations" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-appointments" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "visits-admissions" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "locations-wards" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "locations-clinics" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "clinical-reminder-list" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "clinical-reminder-detail" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "patient-demographics" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "adversereaction-adversereactions" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "vitals" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "diagnosticreport-diagnosticreport" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |
   And the RDK healthcheck response "vista-js-test" contains
		|field	  |value     |
		|healthy  |true      |
		|type     |resource |



