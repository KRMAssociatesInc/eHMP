@US1129
Feature: Create a web application to be used as point-of-care healthcare application. Provide a URI for each resource endpoint supported by the resource server.

@US1129_rd
Scenario: Request patient resource directory
	When client requests the patient resource directory in RDK format
	Then a successful response is returned
   # Taking the below step out because developers are adding new endpoints and 
   # not updating the test ( which means they are not running tests before commiting code). 
   # Removing the step is not ideal, maybe the step can be reenabled once a pipeline
   # is available in jenkins
   #And the response contains 48 "link" items
	And the RDK response contains
      | field      | value                                  |
      | title      | patient-search-full-name               |
      | href       | CONTAINS /patient-search/full-name     |
   	And the RDK response contains
      | field      | value                                  |
      | title      | patient-record-allergy                 |
      | href       | CONTAINS /patient/record/domain/allergy|
   	And the RDK response contains
      | field      | value                                  |
      | title      | patient-record-vital                   |
      | href       | CONTAINS /patient/record/domain/vital  |
   	And the RDK response contains
      | field      | value                                  |
      | title      | patient-record-patient                 |
      | href       | CONTAINS /patient/record/domain/patient|
   	And the RDK response contains
   	# This is where lab ( include anatomic pathology ) would be
      | field      | value                                  |
      | title      | patient-record-lab                     |
      | href       | CONTAINS /patient/record/domain/lab    |
   	And the RDK response contains
   	# I took this to mean clinical notes
   	# This is where discharge summary would be also
      | field      | value                                     |
      | title      | patient-record-document                   |
      | href       | CONTAINS /patient/record/domain/document  |
   	And the RDK response contains
      | field      | value                                     |
      | title      | patient-record-order                      |
      | href       | CONTAINS /patient/record/domain/order     |
	And the RDK response contains
	# this covers both inpatient and outpatient med
      | field      | value                                     |
      | title      | patient-record-med                        |
      | href       | CONTAINS /patient/record/domain/med       |
	And the RDK response contains
      | field      | value                                        |
      | title      | patient-record-immunization                  |
      | href       | CONTAINS /patient/record/domain/immunization |
   	And the RDK response contains
      | field      | value                                     |
      | title      | patient-record-rad                        |
      | href       | CONTAINS /patient/record/domain/rad       |
   	And the RDK response contains
      | field      | value                                     |
      | title      | patient-record-problem                    |
      | href       | CONTAINS /patient/record/domain/problem   |
   	And the RDK response contains
      | field      | value                                     |
      | title      | patient-record-consult                    |
      | href       | CONTAINS /patient/record/domain/consult   |
    And the RDK response contains
      | field      | value                                     |
      | title      | user-service-userinfo                     |
      | href       | CONTAINS /user/info                       |
    And the RDK response contains
      | field | value                                          |
      | title | patient-record-search-text                     |
      | href  | CONTAINS /patient/record/search/text           |
    And the RDK response contains
      | field | value                                          |
      | title | patient-record-search-suggest                  |
      | href  | CONTAINS /patient/record/search/suggest        |
   And the RDK response contains
      | field  | value                                         |
      | title  | search-global-search                          |
      | href   | CONTAINS /patient-search/global               |
   And the RDK response contains
      | field  | value                                         |
      | title  | med-op-data-dayssupply                        |
      | href   | CONTAINS /writeback/med/dayssupply            |
   And the RDK response contains
      | field  | value                                         |
      | title  | patient-record-labsbypanel                    |
      | href   | CONTAINS /patient/record/labs/by-panel        |
   And the RDK response contains
      | field  | value                                         |
      | title  | search-default-search                         |
      | href   | CONTAINS /patient-search/cprs                 |
   And the RDK response contains
      | field  | value                                         |
      | title  | authentication-authentication                 |
      | href   | CONTAINS /authentication                      |
