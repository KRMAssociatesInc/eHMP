@AccessAuditControl
Feature: F9 Authentication & Audit Control
Initial access control to the VistA Exchange patient record retrieval API including: authentication of the user and audit of each request and data returned for that request.

Background:
Given clear user login info
And number of audit logs is known

@US452
Scenario: Request to MVI with valid DFN/Site Code combination is audited
    Given user logs in with valid credentials
    And a DFN "100022" and site code "200" combination
    And number of mvi audit logs is known for dfn "100022" and sitecode "200"
    When a request is made to MVI with that combination
    Then the response is successful
    And the audit log saves the mvi request data for "100022" and "200"
        
    
@US452
Scenario: Request to MVI with invalid DFN/Site Code combination is audited
    Given user logs in with valid credentials
    And a DFN "invalid" and site code "invalid" combination
    And number of mvi audit logs is known for dfn "invalid" and sitecode "invalid"
    When a request is made to MVI with that combination
    Then the response is successful
    And the audit log saves the mvi request data for "invalid" and "invalid"
        
    
@US452
Scenario: Request to MVI with valid ICN is audited
    Given user logs in with valid credentials
    And a "valid" ICN "E1"
    And number of mvi audit logs is known for icn "E1"
    When a request is made to MVI with that ICN
    Then the response is successful
    And the audit log saves the mvi request ICN data for "E1"
 
    
@US452
Scenario: Request to MVI with invalid ICN is audited
    Given user logs in with valid credentials
    And a "invalid" ICN "E_INVALID"
    And number of mvi audit logs is known for icn "E_INVALID"
    When a request is made to MVI with that ICN
    Then the response is successful
    And the audit log saves the mvi request ICN data for "E_INVALID"

@US449
Scenario: Require user authentication to allow access to the VistA Exchange patient record retrieval API
#lu1234@kodak lu1234!!
	Given user logs in with username "lu1234", password "lu1234!!", and sitecode "200"
	When an auth client requests the patient resource directory for patient with id "E1"
	Then the endpoint responds back with a json object
    And a successful authenticated response is returned within "30" seconds
    #And an entry is added to the audit log


@US449
Scenario Outline: User attempts to access the API with invalid credentials
	Given user logs in with username "<username>", password "<password>", and sitecode "<sitecode>"
    When an auth client requests the patient resource directory for patient with id "E1"
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds
    #And an entry is added to the audit log

    Examples:
    |username|password  |sitecode   |
    |baduid  |lu1234!!  |200|
    |lu1234  |badpw     |200|
    |lu1234  |lu1234!!  |badsite    |

@US449
Scenario: User attempts to access the API without login information
	When a client requests the patient resource directory for patient with id "E1" without credentials
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds
    #And an entry is added to the audit log

@US449
Scenario Outline: User can access data from multiple VistA hosts after single signon
	Given user logs in with username "<username>", password "<password>", and sitecode "<sitecode>"
	# user requests data from primary vista host
	When an auth client requests the patient resource directory for patient with id "E1"
	Then the endpoint responds back with a json object
    And a successful authenticated response is returned within "30" seconds
    # user requests data from secondary vista host
    When an auth client requests the patient resource directory for patient with id "E2"
	Then the endpoint responds back with a json object
    And a successful authenticated response is returned within "30" seconds
    # user requests data from both vista hosts
    When an auth client requests the patient resource directory for patient with id "E101"
	Then the endpoint responds back with a json object
    And a successful authenticated response is returned within "30" seconds

Examples:
    |username		|password	|sitecode	    |
    |lu1234			|lu1234!!	|200	|
    |lu1234			|lu1234!!	|542GA |


@US449
Scenario: Require user authentication to command all endpoints
	Given a patient with id "E1" has not been synced
	Given user logs in with username "lu1234", password "badpassword", and sitecode "doesnotexist"
    When an auth client commands clear cache for patient with id "E1"
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds

@US449
Scenario Outline: Require user authentication to allow access to all endpoints
	Given user logs in with username "lu1234", password "badpassword", and sitecode "doesnotexist"
    When an authenticated client requests "<endpoint>" for patient with id "E1"
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds

Examples:
	|endpoint      |
	|vital         |
	|allergy       |
	|lab           |
	|patient	   |
	|radiology	   |
	|med           |

@US449 @US449_allergysummary
Scenario:Require user authentication to allow access for allergy summary
    Given a patient with id "E1" has not been synced
    Given user logs in with username "lu1234", password "badpassword", and sitecode "doesnotexist"
    When a client requests an allergy summary for patient with id "E1"
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds

@US449 @US449_FHIR
Scenario Outline: Require user authentication to allow access to all fhir endpoints
    Given user logs in with username "lu1234", password "badpassword", and sitecode "doesnotexist"
    When I search for JSON "<endpoint>" Resources with a "identifier" of "E1"
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds

Examples:
    |endpoint           |
    |Patient            |
    |Observation        |
    |AdverseReaction    |
    |DiagnosticReport   |            
    
@US451 @US451_on
Scenario: Data retrieval option is turned on
    Given user logs in with username "pu1234", password "pu1234!!", and sitecode "200"
    #Given a patient has not been synced
    And a patient with id "E1" has not been synced
    And data retrieval option is turned on
    #When a client requests patient data
    When an authenticated client requests "vital" for patient with id "E1" 
    And a successful response is returned within "60" seconds
    Then the audit log saves sync request data for patient "E1" with data
    #vista instance, data type retrieved, patient id, date, time delta (how long did fetch take), number of data items (record size), and data
        | field             | value     |
        | vistAInstance     | 200       |
        | dataType          | vital     |
        | patientIdentifier | E1        |
        | dataItems         | 7         |         
        
@US451 @US451_off
Scenario: Data retrieval option is turned off
    Given user logs in with username "pu1234", password "pu1234!!", and sitecode "200"
    #Given a patient has not been synced
    And a patient with id "E1" has not been synced
    And data retrieval option is turned off
    #When a client requests patient data
    When an authenticated client requests "vital" for patient with id "E1"
    And a successful response is returned within "60" seconds
    Then the audit log saves sync request data for patient "E1" without data
    #vista instance, data type retrieved, patient id, date, time delta (how long did fetch take), number of data items (record size), and data
        | field             | value     |
        | vistAInstance     | 200       |
        | dataType          | vital     |
        | patientIdentifier | E1        |
        | dataItems         | 7         |         


@US450 @USHERE
Scenario: User's attempt to authenticate with valid credentials is audited
	Given the soap cache is cleared
	Given user logs in with username "pu1234", password "pu1234!!", and sitecode "200"
	And a patient with id "E1" has been synced
	And number of user audit logs is known for "pu1234"
    When an authenticated client requests "vital" for patient with id "E1"
    Then a successful authenticated response is returned within "30" seconds
    And the endpoint responds back with a json object
    And the authentication request is audited as "true" for "pu1234"


@US450
Scenario: User's attempt to authenticate with invalid credentials is audited
	Given the soap cache is cleared
	Given user logs in with username "badname", password "badpassword", and sitecode "badsitecode"
    And a patient with id "E1" has been synced
    And number of user audit logs is known for "badname"
    When an authenticated client requests "vital" for patient with id "E1"
    Then the endpoint responds back with an error message
    And an unauthorized response is returned within "10" seconds
    And the authentication request is audited as "false" for "badname"


@US450
Scenario Outline: User's request for patient information is audited
	Given user logs in with username "lu1234", password "lu1234!!", and sitecode "542GA"
	And a patient with id "E1" has been synced
    When an authenticated client requests "<dataRequest>" for patient with id "E1"
    Then a successful authenticated response is returned within "30" seconds
    And the endpoint responds back with a json object
    And the audit log saves datatype "<dataRequest>" for patient "E1" for "lu1234"

    Examples:
    |dataRequest	|
    |vital			|
    |allergy		|
    |lab			|


