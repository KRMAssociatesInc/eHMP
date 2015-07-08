
@future @Performance @Spike
Feature: These are scenarios to capture the time taken to bring back data when patient data request is made during different intervals with varied amounts of load given the patient has data accross 4 VistA instances and the data has not been synched.
 
Background: 
Given that eVPR is handling "10" requests per second for "10" minutes

@future @spike_allergy_nonSynch
Scenario: Test Performance spike for allergy data requests for a non-synched patient
  Given a patient with "allergy" data is not synched
  When the client requests allergy data
  And the patient has data across 4 VistA instances
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient allergy data is available on the UI
  And "5" seconds after the spike ends, the system response time still averages less than "5" second.

@future @spike_vitals_nonSynch
Scenario: Test Performance spike for vitals data requests for a non-synched patient
  Given a patient with "vitals" data is not synched
  When the client requests vitals data
  And the patient has data across 4 VistA instances
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient vital data is available on the UI
  And "5" seconds after the spike ends, the system response time still averages less than "5" second.


@future @spike_labs-nonSynch
Scenario: lTest Performance spike for lab data requests for a non-synched patient
  Given a patient with "labs" data is not synched
  When the client requests labs data
  And the patient has data across 4 VistA instances
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient lab data is available on the UI
  And "5" seconds after the spike ends, the system response time still averages less than "5" second.

@future @spike_demographics_nonSynch
Scenario: Test Performance spike for demographics data requests for a synched patient
  Given a patient with "demographics" data is not synched
  When the client requests dempgraphics data
  And the patient has data across 4 VistA instances
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient demographics data is available on the UI
  And "5" seconds after the spike ends, the system response time still averages less than "5" second.

@future @spike_radiology_nonSynch
Scenario: lTest Performance spike for radiology data requests for a synched patient
  Given a patient with "radiology" data is not synched
  When the client requests radiology data
  And the patient has data across 4 VistA instances
  And a load spike of an additional "20" requests per second is presented for "5" seconds
  Then the patient radiology data is available on the UI
  And "5" seconds after the spike ends, the system response time still averages less than "5" second.

