@Solr @SmokeTest
Feature: Running smoke test for Solr  
    
        
@Solr001
Scenario: Lunch the Solr
    When user lunch Apache Solr
    Then the main page title displays "Solr Admin"
    And the main page dispaly below side menu
    	| menu				|
    	| Dashboard 		|
    	| Logging 			|
    	| Core Admin		|
    	| Java Properties 	|
    	| Thread Dump 		|  

    	
@Solr002
Scenario: Lunch the Solr
    When user lunch Apache Solr
    And user search for "vpr" in Core Selector
    Then the Number Docs under Statistics display "0"
    And the below side menu dispaly under search bar
    	| menu 				|
    	| Overview 			|
    	| Analysis 			|
    	| Documents 		|
    	| Files 			|
    	| Ping 				|
    	| Plugins / Stats 	|
    	| Query 			|
    	| Replication 		|
    	| Schema Browser 	|
        