
@future @Performance @Spike
Feature: These are scenarios to capture the time taken to bring back data when patient data request is made during different intervals with varied amounts of load where the patient is synched.
 
Background: 
Given that eVPR is handling "10" requests per second for "10" minutes

@future @spike_allergy
Scenario: Test Performance spike for allergy data requests for a synched patient
  Given a patient with "allergy" data is synched
  When the client requests allergy data
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient allergy data request is successful
  And "5" seconds after the spike ends, the system response time still averages less than "2" second.

@future @spike_vitals
Scenario: Test Performance spike for Vitals data requests for a synched patient
  Given a patient with "vitals" data is synched
  When the client requests vitals data
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient vital data request is successful
  And "5" seconds after the spike ends, the system response time still averages less than "2" second.

@future @spike_labs
Scenario: Test Performance spike for lab data requests for a synched patient
  Given a patient with "labs" data is synched
  When the client requests labs data
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient lab data request is successful
  And "5" seconds after the spike ends, the system response time still averages less than "2" second.

@future @spike_demographics
Scenario: Test Performance spike for demographic data requests for a synched patient
  Given a patient with "dempgraphics" data is synched
  When the client requests demographics data
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient demographics data request is successful
  And "5" seconds after the spike ends, the system response time still averages less than "2" second.

@future @spike_radiology
Scenario: lTest Performance spike for radiology data requests for a synched patient
  Given a patient with "radiology" data is synched
  When the client requests radiology data
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient radiology data request is successful
  And "5" seconds after the spike ends, the system response time still averages less than "2" second.



