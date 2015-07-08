@F337_CCB_Enhancements

Feature: F337 - CCB Enhancements
#Whenever the Reference Range for the following vitals isn't defined in the data, the RDK should instead return the specified defaults.

@F337_1_CCB_Enhancements @US5211
Scenario: Client can request vital results in VPR format
	Given a patient with "vitals" in multiple VistAs
    #And a patient with pid "10107V395912" has been synced through the RDK API
	When the client requests vitals data for the patient "10107V395912"
	Then a successful response is returned
	And the results contain
	| field           | panorama_value |
	| data.totalItems | 307            |
	#Pulse oximetry
	And the results contain
	| name                | value                       |
	| data.items.uid      | urn:va:vital:C877:253:22975 |
	| data.items.typeName | PULSE OXIMETRY              |
	| data.items.low      | 95                          |
	| data.items.high     | 100                         |
	#blood pressure
	And the results contain
	| name                | value                       |
	| data.items.uid      | urn:va:vital:9E7A:253:22203 |
	| data.items.typeName | BLOOD PRESSURE              |
	| data.items.low      | 100/60                      |
	| data.items.high     | 210/110                     |
	#pain
	And the results contain
	| name                | value                       |
	| data.items.uid      | urn:va:vital:9E7A:253:22210 |
	| data.items.typeName | PAIN                        |
	| data.items.low      | 0                           |
	| data.items.high     | 2                           |
	#bmi
	And the results contain
	| name                | value |
	| data.items.typeName | BMI   |
	| data.items.low      | 18.5  |
	| data.items.high     | 25    |
	#pulse
	And the results contain
	| name                | value                       |
	| data.items.uid      | urn:va:vital:9E7A:253:23559 |
	| data.items.typeName | PULSE                       |
	| data.items.low      | 60                          |
	| data.items.high     | 120                         |
	#respiration
	And the results contain
	| name                | value                       |
	| data.items.uid      | urn:va:vital:9E7A:253:22205 |
	| data.items.typeName | RESPIRATION                 |
	| data.items.low      | 8                           |
	| data.items.high     | 30                          |
	And the all have low and high limits
