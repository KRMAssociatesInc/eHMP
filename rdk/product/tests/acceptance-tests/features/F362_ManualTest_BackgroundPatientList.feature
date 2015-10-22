# Team Europa

Feature: F362 - Background Patient List Management Services (CDS)

@F362-2.1_create @US5049 @manual
Scenario: Patient list can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a patient list using postman
    Then the successful response is received
		And the patient list is created
    
@F362-2.1_read @US5049 @manual
Scenario: Patient list can be read   
		Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to get a patient list using postman
    Then the successful response is received
		And the patient list is displayed in the response
    # For manual testing use below URI in postman
    # https://10.4.4.105:8888/resource/patientlist with GET

@F362-2.1_delete @US5049 @manual
Scenario: Patient list can be deleted
		Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to delete a patient list using postman
    Then the successful response is received
		And the patient list is deleted

@F362-2.2_create_def @US5050 @manual
Scenario: Patient list definition can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a patient list definition using postman
    Then the successful response is received
		And the patient list definition is created
    
@F362-2.2_read_def @US5050 @manual
Scenario: Patient list definition can be read
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to get a patient list definition using postman
    Then the successful response is received
		And the patient list definition is displayed in the response
    # For manual testing use below URI in postman
    # https://10.4.4.105:8888/resource/patientlistdefinition with GET
    
@F362-2.2_delete_def @US5050 @manual
Scenario: Patient list definition can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to delete a patient list definition using postman
    Then the successful response is received
		And the patient list definition is deleted

@F362-4.1_patientList @US5186 @manual
Scenario: Patient list definition can be copied
    Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to copy patient list definition using postman
    Then the successful response is received
    And the patient list definition is copied





