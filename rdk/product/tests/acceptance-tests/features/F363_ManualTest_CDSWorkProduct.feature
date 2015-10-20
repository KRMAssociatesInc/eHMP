# Team Europa

Feature: F363 - CDS Work Product Management

@F363-1.2_create @US5039 @manual
Scenario: Work product can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a work product using postman
    Then the successful response is received
		And the work product is created
    
@F363-1.2_read @US5039 @manual
Scenario: Work product can be read
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to get a work product using postman
    Then the successful response is received
		And the work product is displayed

@F363-1.2_delete @US5039 @manual
Scenario: Work product can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to delete a work product using postman
    Then the successful response is received
		And the work product is deleted

@F363-1.2_create_pref @US5039 @manual
Scenario: Work product preferences can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a work product preferences using postman
    Then the successful response is received
		And the work product preferences is created

@F363-1.2_read_pref @US5039 @manual
Scenario: Work product preferences can be read
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to get a work product preferences using postman
    Then the successful response is received
		And the work product preferences is displayed

@F363-1.2_delete_pref @US5039 @manual
Scenario: Work product preferences can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to delete a work product preferences using postman
    Then the successful response is received
		And the work product preferences is deleted
    