@manual

Feature: F518 - Clinical DecisionSupport Reliability, Availability, Serviceability, Scalability, and Performance (RASSP)

@US8517_rdk_authentication
Scenario: CDS dashboard authenticates to rdk with proper credentials
Given CDSDashboard VM is running
And user can go to "http://10.2.2.48:8080/cdsdashboard/"
When user enters site "Panorama", accessCode "pu1234" and verifyCode "pu1234!!" on log in page of metrics dashboard
Then user can successfilly log in to metrics dashboard

@US8517_rdk_logout
Scenario: CDS dashboard logout
Given CDSDashboard VM is running
And user can go to "http://10.2.2.48:8080/cdsdashboard/"
And user enters site "Panorama", accessCode "pu1234" and verifyCode "pu1234!!" on log in page of metrics dashboard
And user can successfilly log in to metrics dashboard
When user clicks on logout link
Then user successfully logs out
And login page displays 
