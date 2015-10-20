@US2800 @regression 
Feature:F144 - eHMP viewer GUI - Vitals
#Team Neptune, inherited by Team venus

@base @US2800_coversheet_only @vimm_observed
Scenario: User views vitals coversheet to view data
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,PATIENT"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field     | value         |
    | patient name  | Eight,Patient       |
  And the "Vitals Coversheet" contain 4 items
  Then the first coloumn of the Vitals table contains the rows
    | label | value       | date       |
    | BP    | 180/74 mm[Hg] | 02/24/2015 |
    | P     | 80 /min     | 02/24/2015 |
    | R     | 15 /min     | 02/24/2015 |
    | T     | 98.2 F / 36.8 C       | 02/24/2015 |
  And the second coloumn of the Vitals table contains the rows
    |label   | value | date    |
    |WT  |205 lb / 93.18 kg    | 02/24/2015   |
    |BMI  |28.6 |02/24/2015 |
    |PO2  | 99 %  | 02/24/2015|
    |PN   |1  |02/24/2015 |

@US2800a @DE299 @vimm_observed @debug @DE1794
Scenario: User views vitals coversheet to view data
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field			| value 				|
    | patient name	| Eight,Patient 			|
  And the "Vitals Coversheet" contain 4 items
  Then the first coloumn of the Vitals table contains the rows
    | label | value       | date       |
    | BP    | 180/74 mm[Hg] | 02/24/2015 |
    | P     | 80 /min     | 02/24/2015 |
    | R     | 15 /min     | 02/24/2015 |
    | T     | 98.2 F / 36.8 C       | 02/24/2015 |
  And the second coloumn of the Vitals table contains the rows
    | label | value       | date       |
    |WT  |205 lb / 93.18 kg    | 02/24/2015   |
    |BMI  |28.6 |02/24/2015 |
    |PO2  | 99 %  | 02/24/2015|
    |PN   |1  |02/24/2015 |
  When the user clicks the "Vitals Expand Button"
  And the "Expanded Vitals Rows" contain 9 items

@US2800b @DE306 @DE416 @DE1264
Scenario: User uses the vitals expanded view to filter
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field                 | value                                 |
    | patient name  | Eight,Patient                         |
  When the user clicks the "Vitals Expand Button"
  #And the "Expanded Vitals Rows" contain 8 items
  Then the Vitals expanded headers are
    | Headers |
    |Date Observed|
    | Type |
    | Result |
    | Date Entered |
    | Qualifiers |
    | Facility |
  And the user enters "BAY" into the "Vitals Filter Field"
  Then the "Expanded Vitals Rows" contain 9 items

@US2800c @DE241 @vimm_observed @debug @DE1794
Scenario: User uses the vitals expanded view to filter by date
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field                 | value                                 |
    | patient name  | Eight,Patient                         |
  When the user clicks the "Vitals Expand Button"
  #And the "Expanded Vitals Rows" contain 8 items
  Then the Vitals expanded headers are
    | Headers |
    |Date Observed|
    | Type |
    | Result |
    | Date Entered |
    | Qualifiers |
    | Facility |
  When the user clicks the "1 yr Vitals Range"
  Then the "Expanded Vitals Rows" contain 9 items
  When the user clicks the "24 hr Vitals Range"
  Then the "Expanded Vitals Rows" contain 9 items
  And the Vitals table contains the rows
    |Date Observed	|Type	|Result    |	Date Entered                            |   Qualifiers  |Facility|
    | <!---->       |BP	    |No Record |	<!-- <span class='grayText'></span> -->	|        |   |

@US2800d @DE169 @vimm_observed @vimm
Scenario: User uses the vitals expanded view to filter
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field			| value 				|
    | patient name	| Eight,Patient 			|
  When the user clicks the "Vitals Expand Button"
  #And the "Expanded Vitals Rows" contain 8 items
  Then the Vitals expanded headers are
    | Headers |
    |Date Observed|
    | Type |
    | Result |
    | Date Entered |
    | Qualifiers |
    | Facility |
  When the user clicks the "all-range-vitals"
  And the user enters "Pass" into the "Vitals Filter Field"
  Then the "Expanded Vitals Rows" contain 1 items
