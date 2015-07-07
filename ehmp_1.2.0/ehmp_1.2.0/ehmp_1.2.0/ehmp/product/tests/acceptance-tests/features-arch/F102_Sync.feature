@Sync @future
Feature: F102 Sync and unsync a patient
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
   

@sync1 @future 
Scenario: Asynchronously load a Patient Record
    Given a patient with pid "10104" and icn "10104V248233" has not been synced
    When a client requests an asynchronous load for patient with icn "10104V248233"
    Then the patient with pid "10104" is synced within 30 seconds
    
    
@sync2 
Scenario: Request patient information for a patient that has not previously been synced
    Given a patient with pid "10105" and icn "10105V001065" has not been synced
    When a client requests patient information for patient with pid "10105" and icn "10105V001065"
    Then the patient with pid "10105" is synced within 30 seconds
    
@sync3 
Scenario: Request patient information for a patient that has previously been synced
    Given a patient with pid "10106" and icn "10106V187557" has been synced
    When a client requests patient information for patient with pid "10106" and icn "10106V187557"
    Then the patient with pid "10106" is synced within 1 seconds
    
@clearpatient @future
Scenario: Clear Patient Record from the cache
	Given a patient with pid "10107" and icn "10107V395912" has been synced
	When a client request patient with pid "10107" is cleared from the cache
	Then the patient with pid "10107" is cleared from the cache within 30 seconds