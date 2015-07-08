@HMPDemo @HMPDemographics
Feature: F15 Demographics
   the need for a longitudinal enterprise patient record that contains Demographics data from all VistA instances where the patient record exists
 
Background:
    Given a patient with pid "5000000217V519385" has been synced through Admin API
    Given a patient with pid "10105V001065" has been synced through Admin API
    Given a patient with pid "9E7A;167" has been synced through Admin API
    
    




      
@ViewDemographics @UI
Scenario: View patient demographics
 	Given user has successfully logged into HMP
    When user types "Eight" in the "Search Field"
    Then the patient list displays "38" results
    And user selects "Eight,Patient" from the patient list
    And user views the "Eight,Patient" demographics
    |field                          | value|
    |Home Phone                     |(222) 555-8235|
    |Cell Phone                     ||
    |Emergency Phone                ||
    |Next of Kin Phone              ||
    |Work Phone                     |(222) 555-7720|
    |Marital Status                 |Married|
    |Veteran                        |Yes|
    |Service Connected              |Yes (0%) |
    |Service Connected Conditions   ||
    |Emergency Contact              ||
    |Next of Kin                    |VETERAN,BROTHER|
    #|Date of Death                  ||             