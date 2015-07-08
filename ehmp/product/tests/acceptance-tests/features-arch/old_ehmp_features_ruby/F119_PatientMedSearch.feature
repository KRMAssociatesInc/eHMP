@med_text_search
Feature: F119 Searching for patient's medication in CPRS Default


#This feature item returns the number of results of a text search within the Medications domain.


@patientmedsearch @VPR @test1

Scenario Outline: When a user searches patient's medication by text search total number of records are returned.
Given a patient with "this medication exists" in multiple VistAs
Given a patient with pid "9E7A;737" has been synced through Admin API
When the user searches medication for the patient "9E7A;737" with the "<text>" in VPR format
Then corresponding matching records totaling "<total>" are displayed


	Examples:
	  | field               | text          | total |
      | med_drug_class_name | ANALGESICS    | 2     |
      | summary             | TAB           | 2     |
      | qualified_name      | ACETAMINOPHEN | 1     |
      | status              | PENDING       | 4     |
      | facilityName        | ABILENE       | 4     |


		 
@patientmedsearch @VPR @test2

Scenario Outline: When a user searches patient's medication by text search total number of records are returned.
Given a patient with "this medication exists" in multiple VistAs
Given a patient with pid "11016V630869" has been synced through Admin API
When the user searches medication for the patient "11016V630869" with the "<text>" in VPR format
Then corresponding matching records totaling "<total>" are displayed


	Examples:
	  | field               | text          | total |
      | med_drug_class_name | HYPOGLYCEMIC  | 1     |
      | summary             | 50MG         	| 1     |
      | qualified_name      | METFORMIN 	| 1     |
      | status              | DISCONTINUED  | 2     |
      | facilityName        | ABILENE       | 0     |
      