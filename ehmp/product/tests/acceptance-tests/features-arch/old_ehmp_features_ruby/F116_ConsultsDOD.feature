@ConsultsDoD @single
Feature: F116 Return and display of consult notes with DoD data

  Background:
    Given a patient with pid "10108V420871" has been synced through Admin API

  @consults
  Scenario: Client can request consults
    Given a patient with "consult notes" in multiple VistAs and in DoD
    #When the client requests consult results for the patient "10108V420871" in VPR format
    When the client requests document for the patient "10108V420871" in VPR format
    Then the client receives 34 VPR VistA result(s)
    Then the client receives 17 VPR DoD result(s)
    And the VPR results contain "document"
      | field             | value                                                          |
      | summary           | Consultation Note (Provider) Document                          |
      | uid               | urn:va:document:DOD:0000000003:1000000649                      |
      | kind              | Consultation Note (Provider) Document                          |
      | dodComplexNoteUri | CONTAINS /1000000649.html                                      |
      | facilityCode      | DOD                                                            |
      | facilityName      | DOD                                                            |
      | documentTypeName  | Consultation Note (Provider) Document                          |
      | localTitle        | Consultation Note (Provider) Document                          |
      | status            | COMPLETED                                                      |
      | statusDisplayName | Completed                                                      |
 
     And the VPR results contain "document"
      | field             | value                                                         |
      | summary           | AUDIOLOGY - HEARING LOSS CONSULT                              |
      | uid               | urn:va:document:9E7A:3:3112                                   |
      | kind              | Consult Report                                                |
      | facilityCode      | 500                                                           |
      | facilityName      | CAMP MASTER                                                   |
      | documentTypeName  | Consult Report                                                |
      | localTitle        | AUDIOLOGY - HEARING LOSS CONSULT                              |
      | status            | COMPLETED                                                     |
      | statusDisplayName | Completed                                                     |
