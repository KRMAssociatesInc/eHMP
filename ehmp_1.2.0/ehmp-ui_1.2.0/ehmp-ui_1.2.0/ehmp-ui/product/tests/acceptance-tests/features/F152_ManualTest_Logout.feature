
Feature: CCOW and Single Sign-On(SSO)

@US1951_SignOut @debug @manual @ccow 
Scenario: User signs out manually by clicking “Sign Out” link

Given eHMP is connected to Vault and user is viewing Vault
Given user is logged in to eHMP
Then context information displays in Vault
When user clicks “Sign Out” link on eHMP
Then context information for eHMP is removed from Vault



@US1951_CloseWindow @debug @manual @ccow 
Scenario: User signs out manually by closing eHMP window

Given eHMP is connected to Vault and user is viewing Vault
Given user is logged in to eHMP
Then context information displays in Vault
When user closes eHMP window
Then context information for eHMP is removed from Vault



@US1951 @debug @manual @ccow 
Scenario: User eHMP session times out due to inactivity

Given eHMP is connected to Vault and user is viewing Vault
Given user is logged in to eHMP
Then context information displays in Vault
Given user is inactive on eHMP
Then user gets prompted with modal to keep session active
And does not dismiss message
Then eHMP times out and user is logged out
And context information for eHMP is removed from Vault