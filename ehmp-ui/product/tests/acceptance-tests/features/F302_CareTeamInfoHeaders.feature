@F302 @CareTeamInfoHeaders @regression

Feature: F302 - Enhance Patient Header - Include Non-Local Care Team by Site

# POC: Team Saturn 

@F302-1.1_CareTeamInpatientHeaders @US4454 @US5599
Scenario: Care Team Information headers for Inpatient
    Given user is logged into eHMP-UI
   And user searches for and selects "twentythree,inpatient"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field     | value         |
    | patient name  | Twentythree,Inpatient   |
    Then Cover Sheet is active

    # Inpatient data
    And the Care Team "Primary Care Team" data displays: "Primary Care: Green"
    And the Care Team "Primary Care Providers" data displays: "Provider, Fifteen / Pcmm-resident, One"
    And the Care Team "Primary Care Phone" data displays: "(555) 555-5858"

    And the Care Team "Inpatient Attending/Provider Label" data displays: "Inpatient Attending/Provider:"
    And the Care Team "Inpatient Attending/Provider Data" data displays: "Provider, One / Provider, One"

And the Care Team "Mental Health" data displays: "Mental Health: Mh Team"
And the Care Team "MH Provider" data displays: "Vehu, One"


@F302-2.1_CareTeamOutpatientHeaders @US4454 @US5599
    Scenario: Care Team Information headers for Outpatient
    Given user is logged into eHMP-UI
   And user searches for and selects "TWENTYTHREE,PATIENT"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field         | value               |
    | patient name  | Twentythree,Patient |

    Then Cover Sheet is active
   
    #Outpatient data
    And the Care Team "Primary Care Team" data displays: "Primary Care: Green"
    And the Care Team "Primary Care Providers" data displays: "Provider, Fifteen / Pcmm-resident, One"
    And the Care Team "Primary Care Phone" data displays: "(555) 555-5858"

    And the Care Team Information does not display: "Inpatient Attending/Provider Label"
    And the Care Team Information does not display: "Inpatient Attending/Provider Data"

     And the Care Team "Mental Health" data displays: "Mental Health: Mh Team"
    And the Care Team "MH Provider" data displays: "Vehu, One"
