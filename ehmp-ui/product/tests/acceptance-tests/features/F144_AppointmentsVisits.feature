#Team Neptune
@US1847 @regression
Feature:F144-eHMP Viewer GUI - Appointments & Visits

Background:
	Given user is logged into eHMP-UI  

@base @appointment_base @triage @DE1600
Scenario: User views appointments and visits on coversheet
 Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active 
  And the user has selected All within the global date picker
  Then the Appointments coversheet table contains headers
       | Headers     |
       | Date        | 
       | Description | 
       | Location    | 
       | Facility    |
  Then user sees Appointments table display
    |Date              | Description     | Location                | Facility   |
    |01/10/2014 - 17:08| DoD Encounter   | Family Practice Clinic  | DOD        |
	
@appointment_filter
Scenario: Users will be able to filter data on the Appointments Applet
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
   Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
  And the applets are displayed on the coversheet
		| applet 					|
		| APPOINTMENTS   		 	|
  Then the Appointments coversheet table contains headers
       | Headers     |
       | Date        | 
       | Description | 
       | Location    | 
       | Facility    |

@appointment_modal @modal_test @DE433 @debug @DE1600
Scenario: Users will be able to view modal popup for appointments
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And the user has selected All within the global date picker
  Then the user clicks the "Appointments Expand Button"
  When the user click on Appointments ScrollDown Button
  When the user clicks the "Dod Encounter"   
  And the modal's title is "DoD Encounter"
  Then user sees Appointments Modal table display
     | header 1         | header 2              |
     | Description:| DoD Encounter              |

    When the user clicks the "Modal Close Button"
    #Then the modal closes

@appointment_expand @debug @DE1600
Scenario: Users will be able to expand Appointments applet
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And the user has selected All within the global date picker
  Then the user clicks the "Appointments Expand Button"
  When the user click on Appointments ScrollDown Button

  Then user sees Appointments table display
	|Date              | Description     | Location               |Type          | Provider      | Reason | Facility   |
	|01/10/2014 - 12:08|DoD Appointment	 |Family Practice Clinic  |	ACUT	     |Bhie, Userone	 |        |	DOD        |
	#|10/07/2013 - 12:16 |DoD Appointment | Family Practice Clinic |SPEC$	     |Bhie, Userone	 |        |DOD        |
  When the user enters "Outpatient" into the "Appointments Filter Field"
  And the user waits for 5 seconds
  Then user sees Appointments table display
	|Date              | Description     | Location               |Type          | Provider      | Reason | Facility   |
    |01/10/2014 - 17:08|DoD Encounter	 |Family Practice Clinic  |	OUTPATIENT	 |Bhie, Userone	 |	      |DOD         |

  
@US1847d
Scenario: Users will be able to use the date filter on the expanded view
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
  And the applets are displayed on the coversheet
		| applet 					|
		| APPOINTMENTS   		 	|
  And the Appointments coversheet table contains headers
       | Headers     |
       | Date        | 
       | Description | 
       | Location    | 
       | Facility    |
  When the user clicks the "Appointments Expand Button"
  When the user clicks the "24 hr Appointments Range"
  Then the "Appointments table" contain 1 items
  And user sees Appointments table display
	|Date              |
	|No Records Found |

