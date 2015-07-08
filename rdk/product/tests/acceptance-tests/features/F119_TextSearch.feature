@text_search @debug
Feature: F119 Searching for patient data in CPRS Default

Background:
      #Given a patient with pid "10110V004877" has been synced through the RDK API
      #Given a patient with pid "10181V049578" has been synced through the RDK API
      Given a patient with pid "9E7A;100022" has been synced through the RDK API



@F119_1_patientmedsearch @VPR 
Scenario Outline: When a user searches patient's medication by text search total number of records are returned.
#Given a patient with "this medication exists" in multiple VistAs
#When the user searches "med" for the patient "9E7A;100022" with the "<text>" in VPR format
When the user searches "<text>" for the patient "9E7A;100022" in VPR format
Then the corresponding number of groups displayed is "<total_groups>"
And the corresponding total of items in each group is "<total_items>"

      Examples:
      | text     | total_groups | total_items |
      | med      | 3            | 14          |
      | lab      | 2            | 4           |
      | blood    | 20           | 34          |
      | vital    | 11           | 46          |
      | document | 6            | 16          |
      | allergy  | 33           | 33          |
      | order    | 4            | 4           |