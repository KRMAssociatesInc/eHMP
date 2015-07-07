Feature: Defects
This is a placeholder for rally logged defects with unknown features

Background:
    Given user logs in with valid credentials

@DE1
Scenario: All data types were pulled to the cache anytime one was requested
    Given a client requests clear-cache operation for patient with id "E2"
    When a client requests "vital" for patient with id "E2"
    Then the response status must be accepted
    And the response header includes "Retry-After"
    When a client requests "vital" for patient with id "E2"
    Then a successful response is returned within "60" seconds
    When a client requests "allergy" for patient with id "E2"
    Then a successful response is returned within "0" seconds


 @DE9
Scenario: Patient that has no data for a lab, a successful response should get back(200).
    Given a patient with id "E1" has been synced
    When a client requests "lab" for patient with id "E1"
    Then the endpoint responds back with a json object
    And a successful response is returned within "30" seconds

@TA1316
Scenario: Support patient search
    When a client requests patient search on "firstName" for patient "patient"
    Then a successful response is returned within "30" seconds
    And the response contains search response fields
        | field|value|
        |firstName|patient|

Scenario: Support patient search where only 1 patient is returned
    When a client requests patient search on "lastName" for patient "BCMA"
    Then a successful response is returned within "30" seconds
    And the response contains search response fields
        | field|value|
        |lastName|BCMA|
        |firstName|EIGHT|
        |ICN|E101|
        |SSN|666330008|

@TA1316
Scenario: Support patient search where multiple patients are returned
    When a client requests patient search on "lastName" for patient "EIGHT"
    Then a successful response is returned within "30" seconds
    And the response contains search response fields
        | field|value|
        |lastName|EIGHT|
        |firstName|INPATIENT|
        |ICN|E1|
        |SSN|666000808 |
        |firstName|OUTPATIENT|
        |ICN|E2|
        |SSN|666000608|
        |firstName|PATIENT|
        |ICN|E3|
        |SSN|666000008|
        
@TA1316 
Scenario: Support patient search with identifier
    When a client requests patient search with identifier "666000608"
    Then a successful response is returned within "30" seconds
     And the response contains search response fields
        | field|value|
        |lastName|eight|
        |firstName|outpatient|
        |ICN|E2|
        |SSN|666000608 |
        
@TA1316 
Scenario: Verify patient search with identifier but without identifierType causes error
    #When a client requests patient search with identifier "666000608" but without identifierType
    When a client requests patient search on "identifier" for patient "666000608"
    Then the endpoint responds back with an error response

@TA1316 
Scenario: Verify patient search with identifierType but without identifyer causes error
    #When a client requests patient search with identifierType
    When a client requests patient search on "identifierType" for patient "SSN"
    Then the endpoint responds back with an error response
        


