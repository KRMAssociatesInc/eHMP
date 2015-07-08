@DE482
Feature: The ASU rules have a document hierarchy.  If there is no rule for the specified document,
  then walk up the doc def hierarchy and compare those doc def ids with the ASU Rules.

@de482
Scenario Outline: Prevent the viewing of sensitive information (TIU notes), by unauthorized users.
	Given a patient with pid "<pid>" has been synced through Admin API
	When the client requests documents for the patient "<pid>" in JDS
	Then application should enforce ASU Rules to docDef UID and use the same TIU rule as the parent
	
		Examples:
			| pid			|
			| 10108V420871	|
			| 5000000341V359724 |
