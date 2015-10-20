#Team Neptune
@US2113 @DE460 @US4283  @regression
Feature:F153-HIE C32 - Community Health Summaries

@base
Scenario: User can view community health summaires on the coversheet
    Given user is logged into eHMP-UI 
    And user searches for and selects "Eight,Patient"
    When Cover Sheet is active
    Then the CommunityHealthSummaries coversheet table contains headers
       | Headers                |
       | Date                   | 
       | Authoring Institution  | 
    Then user sees Community Health Summaries table display
    |Date                     | Authoring Institution                       |        
    |06/17/2014               | Kaiser Permanente Southern California - RESC|

@non_base @debug @DE1270
Scenario: Users will be able to navigate coversheet, maximized and modal view 
    Given user is logged into eHMP-UI 
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					     |
		| COMMUNITY HEALTH SUMMARIES     |

     Then the CommunityHealthSummaries coversheet table contains headers
       | Headers                |
       | Date                   | 
       | Authoring Institution  | 
        

    Then the user clicks the "Community Health Summaries Expand Button"

    Then user sees Community Health Summaries table display
	|Date              |Description                       | Authoring Institution               |   	 
    |06/17/2014 - 01:41|	Continuity of Care Document   |	Kaiser Permanente Southern California - RESC|
	
	When the user clicks the "Continuity of Care Document"
    And the modal's title is "Continuity of Care Document"   
    Then user sees Community Health Summaries Modal table display
     | Facility    |VLER |
     
    When the user clicks the "Active Problems Hyperlink"
    Then user sees Community Health Summaries Modal table display
     | Problem   |Noted Date|
     
    When the user clicks the "Back to Top Button"
    And the user clicks the "Modal Close Button"
    Then the modal closes
    When the user clicks the "Community Health Summaries Filter Button"
	When the user enters "Kaiser Permanente Southern California - RESC" into the "Community Health Summaries Filter Field"  
   

		