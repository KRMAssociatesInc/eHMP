@F365 @DemographicQuickLooks

Feature: F365 - Enhance Patient Header - Include Non-Local Demographics by Site

# POC: Team Saturn

@F365-5.1_DemographicQuickLooks1 @US5692 @US5461 @US5537
	Scenario: Patient Phone Demographic Quick Looks (Panorama)
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Phone Group"
	Then the "Phone Group QuickLook" popup is displayed
	And the "Phone Group QuickLook" table contains headers
	| VistA Site   | Home           | Cell | Work          |
	And the "Phone Group QuickLook" table contains rows
	| VistA Site   | Home           | Cell | Work          |
	| KODAK	       | (222) 555-8235	|      | (222) 555-7720 |
	And the discrepant "Home Phone QuickLook Value" is highlighted
	And the discrepant "Work Phone QuickLook Value" is highlighted
	Then the Demographics user clicks on the "Phone Group"
	Then the "Phone Group QuickLook" popup is hidden

@F365-5.2_DemographicQuickLooks2 @US5692 @US5461 @US5456
	Scenario: Patient Address Demographic Quick Looks (Panorama)
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Address Group"
	Then the "Address Group QuickLook" popup is displayed
	And the "Address Group QuickLook" table contains headers
	| VistA Site   | Home                            | Temporary |
	And the "Address Group QuickLook" table contains rows
	| VistA Site   | Home                            | Temporary |
	| KODAK	       | Any Street\nAny Town, WV, 99998 |           |
	And the discrepant "Home Address QuickLook Value Line 1" is highlighted
	And the discrepant "Home Address QuickLook Value Line 4" is highlighted
	Then the Demographics user clicks on the "Address Group"
	Then the "Address Group QuickLook" popup is hidden

@F365-5.1_DemographicQuickLooks3 @US5692 @US5461
	Scenario: Patient Next Of Kin Demographic Quick Looks (Panorama)
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Next Of Kin Group"
	Then the "Next Of Kin Group QuickLook" popup is displayed
	And the "Next Of Kin Group QuickLook" table contains headers
	| VistA Site | Name            | Relationship         | Home | Work | Address |
	And the "Next Of Kin Group QuickLook" table contains rows
	| VistA Site | Name            | Relationship         | Home | Work | Address |
	| KODAK	     | Veteran,brother | Relationship Unknown |      |      |         |
	And the discrepant "Next Of Kin QuickLook Relationship Value" is highlighted
	Then the Demographics user clicks on the "Next Of Kin Group"
	Then the "Next Of Kin Group QuickLook" popup is hidden

@F365-5.2_DemographicQuickLooks4 @US5692 @US5461
	Scenario: Patient Phone Demographic Quick Looks (Kodak)
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Phone Group"
	Then the "Phone Group QuickLook" popup is displayed
	And the "Phone Group QuickLook" table contains headers
	| VistA Site   | Home           | Cell          | Work          |
	And the "Phone Group QuickLook" table contains rows
	| VistA Site   | Home           | Cell          | Work          |
	| PANORAMA     | (843) 555-3456	| (843) 555-5678 | (843) 555-2345 |
	And the discrepant "Home Phone QuickLook Value" is highlighted
	And the discrepant "Cell Phone QuickLook Value" is highlighted
	And the discrepant "Work Phone QuickLook Value" is highlighted
	Then the Demographics user clicks on the "Phone Group"
	Then the "Phone Group QuickLook" popup is hidden

@F365-5.2_DemographicQuickLooks5 @US5692 @US5461
	Scenario: Patient Address Demographic Quick Looks (Kodak)
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Address Group"
	Then the "Address Group QuickLook" popup is displayed
	And the "Address Group QuickLook" table contains headers
	| VistA Site   | Home | Temporary |
	And the "Address Group QuickLook" table contains rows
	| VistA Site   | Home | Temporary                      |
	| PANORAMA     |      | Temp Address\nWando, SC, 29492 |
	And the discrepant "Temporary Address QuickLook Value Line 1" is highlighted
	And the discrepant "Temporary Address QuickLook Value Line 4" is highlighted
	Then the Demographics user clicks on the "Address Group"
	Then the "Address Group QuickLook" popup is hidden

@F365-5.2_DemographicQuickLooks6 @US5692 @US5461
	Scenario: Patient Email Demographic Quick Looks (Kodak)
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Email Group"
	Then the "Email Group QuickLook" popup is displayed
	And the "Email Group QuickLook" table contains headers
	| VistA Site   | Email          |
	And the "Email Group QuickLook" table contains rows
	| VistA Site   | Email          |
	| PANORAMA     | 23@EXAMPLE.COM |
	And the discrepant "Email QuickLook Value" is highlighted
	Then the Demographics user clicks on the "Email Group"
	Then the "Email Group QuickLook" popup is hidden

@F365-5.2_DemographicQuickLooks7 @US5692 @US5461
	Scenario: Patient Emergency Contact Demographic Quick Looks (Kodak)
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient   |
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Demographics user clicks on the "Emergency Contact Group"
	Then the "Emergency Contact Group QuickLook" popup is displayed
	And the "Emergency Contact Group QuickLook" table contains headers
	| VistA Site   | Name           | Relationship | Home          | Work          | Address                                 |
	And the "Emergency Contact Group QuickLook" table contains rows
	| VistA Site   | Name           | Relationship | Home          | Work          | Address                                 |
	| PANORAMA     | Veteran,sister | Sister       | (843) 555-0987 | (843) 555-9876 | Sist Address\nMount Pleasant, SC, 29464 |
	And the discrepant "Emergency Contact QuickLook Name Value" is highlighted
	And the discrepant "Emergency Contact QuickLook Relationship Value" is highlighted
	And the discrepant "Emergency Contact QuickLook Home Phone Value" is highlighted
	And the discrepant "Emergency Contact QuickLook Work Phone Value" is highlighted
	And the discrepant "Emergency Contact QuickLook Address Value Line 1" is highlighted
	And the discrepant "Emergency Contact QuickLook Address Value Line 4" is highlighted
	Then the Demographics user clicks on the "Emergency Contact Group"
	Then the "Emergency Contact Group QuickLook" popup is hidden

