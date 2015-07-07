@VDS_Integration
Feature: F66 Vista Data Services Integration
Integrate VistA Exchange with VistA Data Services (VDS), including deployment and integration within our local VistA instances on local developer workstations. Update existing Vitals, Allergies, and Lab Results retrieval to leverage VDS rather than direct VistA RPC broker calls.

@future @manual
Scenario: View the ICD information for VDS in the SDD, Section 7
  Given the current version of the SDD
  When SDD Section 7 is viewed
  Then it includes the ICD information for VDS
