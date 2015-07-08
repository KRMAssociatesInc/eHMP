# Team Europa

Feature: F166 - User invoked clinical decision support (CDS)

@US3089_AuditResourceRefresh @manual
Scenario: User can see resource audit entry in rdk response when clicking refresh on CDS Advice applet 
		Given user is logged in to ehmp-ui and viewing a patient
		And CDS Advice applet is displaying on Overview page
		When user clicks Refresh button
		And user queries RDK for audit search 
		Then the audit record for refresh query is displayed in response
    
@US3089_AuditResourceModal @manual
Scenario: User can see resource audit entry in rdk response when opening advice or reminder on CDS Advice applet 
		Given user is logged in to ehmp-ui and viewing a patient
		And CDS Advice applet is displaying on Overview page
		When user clicks on advice or reminder
		And user queries RDK for audit search 
		Then the audit record for advice or reminder query is displayed in response