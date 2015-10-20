@F302-5.1_PatientCareTeamDetailHeadersInpatientQuicklook@F302 @CareTeamDetails @regression

Feature: F302 - Enhance Care Team Header

# POC: Team Saturn

@F302-3.1_PatientCareTeamDetails @US5256
    Scenario: Care Team Information: Detail verification (Panorama)
    Given user is logged into eHMP-UI
    And user searches for and selects "twentythree,inpatient"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field     | value         |
    | patient name  | Twentythree,Inpatient   |
    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name                |  Analog Pager     | Digital Pager     | Office Phone     |
    | Primary Care Provider           | Provider, Fifteen   |  (843) 555-5455   | (843) 555-5456    | (843) 555-5454   |
    | Primary Care Assoc Provider     | Pcmm-resident, One  |  (555) 555-8843   | (555) 555-8876    | (555) 555-8837   |
    | Inpatient Attending Provider    | Provider, One       |  (555) 555-7677   | (555) 555-7688    | (555) 555-7678   |
    | Inpatient Provider              | Provider, One       |  (555) 555-7677   | (555) 555-7688    | (555) 555-7678   |
    | MH Treatment Team               | Mh Team             |  not specified    | not specified     | (555) 555-4324   |
    | MH Treatment Coordinator        | Vehu, One           |  (555) 555-5654   | (555) 555-3242    | (555) 555-5453   |


@F302-4.1_PatientCareTeamDetails @US5256
    Scenario: Care Team Information: Detail verification (Panorama)
    Given user is logged into eHMP-UI
    And user searches for and selects "TWENTYTHREE,PATIENT"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field			| value               |
    | patient name	| Twentythree,Patient |

    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name         		    |  Analog Pager     | Digital Pager     | Office Phone     |
    | Primary Care Provider           | Provider, Fifteen       |  (843) 555-5455   | (843) 555-5456    | (843) 555-5454   |
    | Primary Care Assoc Provider     | Pcmm-resident, One      |  (555) 555-8843   | (555) 555-8876    | (555) 555-8837   |
    | MH Treatment Team               | Mh Team  			    |  not specified    | not specified     | (555) 555-4324   |
    | MH Treatment Coordinator        | Vehu, One   		    |  (555) 555-5654   | (555) 555-3242    | (555) 555-5453   |

@F302-3.2_PatientCareTeamDetailsKodak @US5256 @DE1309
    Scenario: Patient Information: Demographic verification (Kodak)
    Given user is logged into eHMP-UI as kodak user
    And Resize browser
    And user searches for and selects "TWENTYTHREE,PATIENT"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field			| value 				|
    | patient name	| Twentythree,patient 	|
    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name         			|  Analog Pager     | Digital Pager     | Office Phone     |
    | Primary Care Provider           | Provider, Seventythree  |  (555) 888-9900   | (555) 888-9977    | (555) 888-9999   |
    | Primary Care Assoc Provider     | Unassigned   			|  not specified    | not specified     | not specified    |
    | MH Treatment Team               | Mh Team  				|  not specified    | not specified     | (555) 888-9832   |
    | MH Treatment Coordinator        | Vehu, Two   			|  (555) 888-7771   | (555) 888-7434    | (555) 888-7777   |

@F302-3.1_PatientCareTeamDetailsKodak @US5256 @DE1309
    Scenario: Patient Information: Demographic verification (Kodak)
    Given user is logged into eHMP-UI as kodak user
    And Resize browser
    And user searches for and selects "twentythree,inpatient"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field			| value 				|
    | patient name	| Twentythree,Inpatient 	|
    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name               			|  Analog Pager     | Digital Pager     | Office Phone     |
    | Primary Care Provider           | Provider, Seventythree      |  (555) 888-9900   | (555) 888-9977    | (555) 888-9999   |
    | Primary Care Assoc Provider     | Unassigned   			    |  not specified    | not specified     | not specified    |
    | Inpatient Attending Provider    | Provider, One   		    |  (555) 888-0001   | (555) 888-0002    | (555) 888-0000   |
    | Inpatient Provider   			  | Provider, One   	     	|  (555) 888-0001   | (555) 888-0002    | (555) 888-0000   |
    | MH Treatment Team               | Mh Team  				    |  not specified    | not specified     | (555) 888-9832   |
    | MH Treatment Coordinator        | Vehu, Two   			    |  (555) 888-7771   | (555) 888-7434    | (555) 888-7777   |

#Quicklook Tests
@F302-5.1_PatientCareTeamDetailHeadersInpatientQuicklook @US5260 @DE1205
    Scenario: Patient Information: Quicklook Inpatient Care Team verification
    Given user is logged into eHMP-UI
    And Resize browser
    And user searches for and selects "TWENTYTHREE,INPATIENT"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field			| value 			    |
    | patient name	| Twentythree,Inpatient |

    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name               |  Analog Pager     | Digital Pager     | Office Phone     |
    | Primary Care Provider           | Provider, Fifteen  |  (843) 555-5455   | (843) 555-5456    | (843) 555-5454   |
    | Primary Care Assoc Provider     | Pcmm-resident, One |  (555) 555-8843   | (555) 555-8876    | (555) 555-8837   |
    | Inpatient Attending Provider    | Provider, One      |  (555) 555-7677   | (555) 555-7688    | (555) 555-7678   |
    | Inpatient Provider              | Provider, One      |  (555) 555-7677   | (555) 555-7688    | (555) 555-7678   |
    | MH Treatment Team               | Mh Team            |  not specified    | not specified     | (555) 555-4324   |
    | MH Treatment Coordinator        | Vehu, One          |  (555) 555-5654   | (555) 555-3242    | (555) 555-5453   |

    Then user selects "Care Team Inpatient Attending Provider Quicklook" drop down
    And the "Care Team Quicklook" table contains headers
    | Facility | Name |  Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Quicklook" table contains rows
    | Facility | Name          |  Analog Pager     | Digital Pager     | Office Phone     |
    | KODAK    | Provider, One |  (555) 888-0001   | (555) 888-0002    | (555) 888-0000   |
    | HDR      | Provider, One |  (555) 555-7677   | (555) 555-7688    | (555) 555-7678   |
    | VLER     | Provider, One |  (555) 555-7677   | (555) 555-7688    | (555) 555-7678   |

@F302-5.3_PatientCareTeamDetailHeadersOutpatientQuicklook @US5260 @DE1205
    Scenario: Patient Information: Quicklook Outpatient Care Team verification
    Given user is logged into eHMP-UI
    And Resize browser
    And user searches for and selects "TWENTYTHREE,PATIENT"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field			| value                 |
    | patient name	| Twentythree,patient	|

    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name               |  Analog Pager    | Digital Pager    | Office Phone    |
    | Primary Care Provider           | Provider, Fifteen  |  (843) 555-5455   | (843) 555-5456    | (843) 555-5454   |
    | Primary Care Assoc Provider     | Pcmm-resident, One |  (555) 555-8843   | (555) 555-8876    | (555) 555-8837   |
    | MH Treatment Team               | Mh Team            |  not specified    | not specified     | (555) 555-4324   |
    | MH Treatment Coordinator        | Vehu, One          |  (555) 555-5654   | (555) 555-3242    | (555) 555-5453   |

    Then user selects "Care Team Primary Provider Quicklook" drop down
    And the "Care Team Quicklook" table contains headers
    | Facility | Name |  Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Quicklook" table contains rows
    | Facility | Name                   |  Analog Pager     | Digital Pager     | Office Phone     |
    | KODAK    | Provider, Seventythree |  (555) 888-9900   | (555) 888-9977    | (555) 888-9999   |
    | HDR      | Provider, Fifteen      |  (843) 555-5455   | (843) 555-5456    | (843) 555-5454   |
    | VLER     | Provider, Fifteen      |  (843) 555-5455   | (843) 555-5456    | (843) 555-5454   |
