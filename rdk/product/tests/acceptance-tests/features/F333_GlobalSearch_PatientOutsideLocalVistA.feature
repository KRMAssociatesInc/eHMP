@F333
Feature: F333 - Global search of patients outside local VistA

    @dodonly_sync
    Scenario: Client requests to sync a patient through the RDK API
        When the client requests global patient search with lname "dodonly" and fname "patient" and ssn "NOT DEFINED" and dob "NOT DEFINED" and Content-Type "application/json"
        Then a successful response is returned
        Then the client requests that the MVI patient be synced through RDK API
        Then the patient with pid "4325678V4325678" is synced through the RDK API within 60 seconds