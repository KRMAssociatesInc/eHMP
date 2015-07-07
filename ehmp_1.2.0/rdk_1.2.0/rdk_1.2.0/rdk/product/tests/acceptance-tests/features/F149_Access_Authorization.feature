@F149
Feature: F149 - Access Control / Authorization

@US2117_1
Scenario: Authorized Client gets a sensitive patient warning (break glass scenario) when requesting demographics for a sensitive patient
    Given a sensitive patient "9E7A;167"
    And an "authorized" client "9E7A;pu1234"
    When the client "9E7A;pu1234" requests data for that sensitive patient "9E7A;167"
    Then a permanent redirect response is returned

@US2117_2 @vxsync @patient @9E7A167
Scenario: Authorized Client receives data when requesting demographics with sensitivity acknowledgement for a sensitive patient
     Given a sensitive patient "9E7A;167"
     And an "authorized" client "9E7A;pu1234"
     When the client "9E7A;pu1234" requests data for that sensitive patient "9E7A;167" with sensitivity acknowledgement
     Then a successful response is returned

@US2117_3 @vxsync @patient @9E7A100022
Scenario: Authorized Client receives data when requesting demographics for a non-sensitive patient
    Given a non-sensitive patient "9E7A;100022"
    And an "authorized" client "9E7A;pu1234"
    When the client "9E7A;pu1234" requests data for that non-sensitive patient "5000000341V359724"
    Then a successful response is returned
