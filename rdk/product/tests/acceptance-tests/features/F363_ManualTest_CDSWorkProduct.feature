# Team Europa

Feature: F363 - CDS Work Product Management

@US5039_create @manual
Scenario: Work product can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a work product using postman
    Then the successful response is received
		And the work product is created
    
@US5039_read @manual
Scenario: Work product can be read
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to get a work product using postman
    Then the successful response is received
		And the work product is displayed

@US5039_delete @manual
Scenario: Work product can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to delete a work product using postman
    Then the successful response is received
		And the work product is deleted

@US5039_create_pref @manual
Scenario: Work product preferences can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a work product preferences using postman
    Then the successful response is received
		And the work product preferences is created

@US5039_read_pref @manual
Scenario: Work product preferences can be read
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to get a work product preferences using postman
    Then the successful response is received
		And the work product preferences is displayed

@US5039_delete_pref @manual
Scenario: Work product preferences can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to delete a work product preferences using postman
    Then the successful response is received
		And the work product preferences is deleted