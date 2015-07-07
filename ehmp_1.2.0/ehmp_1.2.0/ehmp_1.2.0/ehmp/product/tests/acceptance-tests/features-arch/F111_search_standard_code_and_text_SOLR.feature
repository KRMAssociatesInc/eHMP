@search_standard_code_and_text_solr

Feature: Searchability of Standard code and Standard text elements using Text Search (SOLR)

Background:
	Given a patient with pid "10108V420871" has been synced through Admin API
	
@search_standard_code_1 @VPR @debug

Scenario Outline: When a user searches patient's domain by text search total number of records are returned.
When the client searches for "<text>" for the patient "9E7A;3" in VPR format
Then a successful response is returned
Then the solar search results contains "<total_items>"

     Examples: 
      | text      		| total_items |
      | lab       		| 408         |
      | med       		| 387         |
#      | %2234109-9%22 	| 9           | TODO: LOINC codes are not yet available in Documents (Owner: Les Westberg) 
      
      
 @search_standard_code_2 @VPR @debug
 
Scenario: When a user searches patient's domain by text search total number of records are returned.
When the client searches for "rad" for the patient "9E7A;3" in VPR format
Then a successful response is returned
Then the solar search results contains 

     | text         | total_items |
     | codes_code   | 34109-9     |
     | codes_system | DOD_NOTES   |
 
 
#Note: moving feature file -F111_search_standard_code_and_text_SOLR.feature to archive as we are not directly testing SOLR calls 
