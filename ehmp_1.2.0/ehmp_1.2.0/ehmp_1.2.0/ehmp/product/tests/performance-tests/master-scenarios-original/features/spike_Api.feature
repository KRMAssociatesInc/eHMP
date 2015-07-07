
@future
Feature: FHIR Spike test

As a load tester

I want to verify that eVPR can handle a 'normal' load profile, with some spikes overlaid
So that I can be sure that the system will not fail when such abnormal spikes occur during operation when the data has been synched.


@future
Scenario: Generate additional load to FHIR API with combined data domains and capture system response; generate additional Heavy volume on top of Low to Med Load

  Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
  And the data has been synched
  When the load is increased by "3" requests per second after "5" minutes for "15" minutes
  Then at "20" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Generate additional load to FHIR API with combined data domains and capture system response; generate additional Heavy volume on top of Med to High Load

  Given that eVPR has ramped up to a load of "25" requests per second after "5" minutes and continues for "30" minutes
  And the data has been synched
  When the load is increased by "6" requests per second after "5" minutes for "15" minutes
  Then at "20" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Generate additional load to FHIR API with combined data domains and capture system response; generate additional Heavy volume on top of Med to High Load

  Given that eVPR has ramped up to a load of "25" requests per second after "5" minutes and continues for "30" minutes
  And the data has been synched
  When the load is increased by "10" requests per second after "5" minutes for "15" minutes
  Then at "20" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Feature: FHIR Spike test

As a load tester

I want to verify that eVPR can handle a 'normal' load profile, with some spikes overlaid
So that I can be sure that the system will not fail when such abnormal spikes occur during operation when the patient record is stored across 4 VistAs and the data has not been synched.


@future
Scenario: Generate additional load to FHIR API with combined data domains and capture system response; generate additional Heavy volume on top of Low to Med Load

  Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
  And the patient record is stored across 4 VistAs
  And the data has not been synched
  When the load is increased by "3" requests per second after "5" minutes for "15" minutes
  Then at "20" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Generate additional load to FHIR API with combined data domains and capture system response; generate additional Heavy volume on top of Med to High Load

  Given that eVPR has ramped up to a load of "25" requests per second after "5" minutes and continues for "30" minutes
  And the patient record is stored across 4 VistAs
  And the data has not been synched
  When the load is increased by "6" requests per second after "5" minutes for "15" minutes
  Then at "20" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Generate additional load to FHIR API with combined data domains and capture system response; generate additional Heavy volume on top of Med to High Load

  Given that eVPR has ramped up to a load of "25" requests per second after "5" minutes and continues for "30" minutes
  And the patient record is stored across 4 VistAs
  And the data has not been synched
  When the load is increased by "10" requests per second after "5" minutes for "15" minutes
  Then at "20" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients
