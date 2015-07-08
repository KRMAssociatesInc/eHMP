Feature: F148 -  Audit Reports

@manual
Scenario: Manually check that audit log has been created
    Given a user is logged into EHMP-UI and searches for patient Threehundredeighty,Patient, who has a patient ID of 100379
    Then to manually confirm the entry is there ssh vagrant@10.4.4.105
    And the password is vagrant
    Then cd /tmp
    Then tail audit.log
    Then confirm that last entry was on the time of the patient search and that the patient ID in the log is 100379
