@patient_demographics

Feature: F142 VX Cache Management and Expiration/Sync Stabilization
# US1721: JDS to Store the PID properly from multiple systems

@f142_1_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "9E7A;100603" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "9E7A;100603" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value                 |
      | pid          | 9E7A;100603           |
      | familyName   | SIXHUNDREDTWO         |
      | fullName     | SIXHUNDREDTWO,PATIENT |
      | ssn          | 666661602             |
      | genderName   | Male                  |
      | address.city | Any Town              |
      | displayName  | Sixhundredtwo,Patient |

@f142_2_patient_demographics_with_ICN
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "10108V420871" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value             |
      | pid          | VLER;10108V420871 |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     |
   And the VPR results contain
      | field        | value             |
      | pid          | HDR;10108V420871 |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     |
  And the VPR results contain
      | field        | value         |
      | pid          | 9E7A;3        |
      | familyName   | EIGHT         |
      | fullName     | EIGHT,PATIENT |
      | ssn          | 666000008     |
      | genderName   | Male          |
      | address.city | Any Town      |
      | displayName  | Eight,Patient |
  And the VPR results contain
      | field        | value         |
      | pid          | C877;3        |
      | familyName   | EIGHT         |
      | fullName     | EIGHT,PATIENT |
      | ssn          | 666000008     |
      | genderName   | Male          |
      | address.city | Any Town      |
      | displayName  | Eight,Patient |
  And the VPR results contain
      | field | value          |
      | pid   | DOD;0000000003 |                                  
  And the VPR results contain
      | field        | value            |
      | pid          | DAS;10108V420871 |
      | familyName   | EIGHT            |
      | fullName     | EIGHT,PATIENT    |
      | ssn          | 666000008        |
      | genderName   | Male             |
      | address.city | Any Town         |
      | displayName  | Eight,Patient    |
      
      
@f142_3_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "VLER;10108V420871" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value             |
      | pid          | VLER;10108V420871 |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     |      
      
@f142_4_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "HDR;10108V420871" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value             |
      | pid          | HDR;10108V420871 |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     |   

@f142_5_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "9E7A;3" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value             |
      | pid          | 9E7A;3            |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     | 
      
@f142_6_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "C877;3" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value             |
      | pid          | C877;3            |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     |   
        
@f142_7_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "DAS;10108V420871" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value             |
      | pid          | DAS;10108V420871  |
      | familyName   | EIGHT             |
      | fullName     | EIGHT,PATIENT     |
      | ssn          | 666000008         |
      | genderName   | Male              |
      | address.city | Any Town          |
      | displayName  | Eight,Patient     |   
      
@f142_8_patient_demographics_with_pid
Scenario: Client can request paitnet demographics based on ICN or PID in VPR format
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests demographics from the multiple system for the patient "DOD;0000000003" in VPR format
  Then a successful response is returned  
  And the VPR results contain
      | field        | value          |
      | pid          | DOD;0000000003 |
