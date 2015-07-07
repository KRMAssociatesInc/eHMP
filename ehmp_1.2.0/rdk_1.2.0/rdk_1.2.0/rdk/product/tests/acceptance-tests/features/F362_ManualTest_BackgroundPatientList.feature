# Team Europa

Feature: F362 - Background Patient List Management Services (CDS)

@US5049_create @manual
Scenario: Patient list can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a patient list using postman
    Then the successful response is received
		And the patient list is created
    
@US5049_read @manual
Scenario: Patient list can be read   
		Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to get a patient list using postman
    Then the successful response is received
		And the patient list is displayed in the response
    # For manual testing use below URI in postman
    # https://10.4.4.105:8888/resource/patientlist with GET

@US5049_delete @manual
Scenario: Patient list can be deleted
		Given a patient with pid "9E7A;164" has been synced through the RDK API
    When client requests to delete a patient list using postman
    Then the successful response is received
		And the patient list is deleted

@US5050_create_def @manual
Scenario: Patient list definition can be created
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to create a patient list definition using postman
    Then the successful response is received
		And the patient list definition is created
    
@US5049_read_def @manual
Scenario: Patient list definition can be read
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to get a patient list definition using postman
    Then the successful response is received
		And the patient list definition is displayed in the response
    # For manual testing use below URI in postman
    # https://10.4.4.105:8888/resource/patientlistdefinition with GET
    
@US5050_delete_def @manual
Scenario: Patient list definition can be deleted
    Given a patient with pid "9E7A;164" has been synced through the RDK API
		When client requests to delete a patient list definition using postman
    Then the successful response is received
		And the patient list definition is deleted
