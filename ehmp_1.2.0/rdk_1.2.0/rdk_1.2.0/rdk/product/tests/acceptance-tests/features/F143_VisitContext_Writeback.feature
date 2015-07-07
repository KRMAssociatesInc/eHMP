@US1970 @onc
Feature: F143 - Establish Visit Context (Write-back)

#Create an RDK resource to read cache data for end points requires

@US1970_appointments 
Scenario: Client requests appointments in VPR format from RDK
    Given a visit patient with pid "10104V248233" has been synced through the RDK API
    When the client requests appointments summary for the patient "10104V248233" in RDK format 
    Then a successful response is returned
    And the VPR results contain more than 0 records


@US1970_admissions 
Scenario: Client requests admissions in VPR format from RDK
    Given a visit patient with pid "10104V248233" has been synced through the RDK API
    When the client requests admissions for the patient "10104V248233" in RDK format 
    Then a successful response is returned
    And the VPR results contain more than 0 records
    And the kind is "Admission" for every record


@US1970_provider 
Scenario: Client requests providers in VPR format from RDK
    When client requests providers with facility code "9E7A"in RDK format
    Then a successful response is returned
    And the VPR results contain more than 0 records

@US1970_locations
Scenario: Client requests locations in VPR format from RDK
    When client requests locations with facility code "998"in RDK format
    Then a successful response is returned
    And the VPR results contain more than 0 records



