@F129 @VitalsAll @US1957 @onc

Feature: F129 – Vitals (Writeback)

Scenario: UI Developer/Postman user queries resource providing patient DFN, and a FileMan formatted date range.
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests all vitals for patient DFN: "3" from FileMan dates "3010101" to "3141030"
	Then a successful response is returned
	Then the JSON response "meta.ssn4" field is "0008"
	Then the JSON response "readings.data.items[0].T.reading" field is "98.7"
	Then the JSON response "readings.data.items[35].BP.abnormal.abnormalSystolicLowValue" field is "100"
