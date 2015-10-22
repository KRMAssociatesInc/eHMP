
#Team Europa

Feature: F363 - CDS Work Product Management

@F364-3.1_cdsjob_create @US5250 @manual
Scenario: Cdsjob can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to create a cdsjob using postman
    Then the successful response is received
    And the cdsjob is created
    
@F364-3.1_cdsjob_update @US5250  @manual
Scenario: Cdsjob can be updated
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to update a cdsjob using postman
    Then the successful response is received
    And the cdsjob is updated

@F364-3.1_cdsjob_delete @US5250 @manual
Scenario: Cdsjob can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to delete a cdsjob using postman
    Then the successful response is received
    And the cdsjob is delete
    
@F364-2.1_schedule_create @US5188 @manual
Scenario: Job can be scheduled
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to create a scheduled job using postman
    Then the successful response is received
    And the scheduled job is created

@F364-2.1_schedule_update @US5188 @manual
Scenario: Scheduled job can be updated
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to update a scheduled job using postman
    Then the successful response is received
    And the scheduled job is updated
    
@F364-2.1_schedule_delete @US5188 @manual
Scenario: Scheduled job can be delete
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to delete a scheduled job using postman
    Then the successful response is received
    And the scheduled job is delete

@F364-1.1_initiateRuleExecution @US5149 @manual
Scenario: User initiates execution rules and resulting work products are persisted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    And client requests to create a scheduled job using postman
    And the successful response is received
    When client intiates rule execution using postman
    Then the work products are created and persisted in the database


