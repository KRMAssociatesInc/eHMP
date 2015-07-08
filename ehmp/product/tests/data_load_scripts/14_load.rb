require 'vistarpc4r'

broker = VistaRPC4r::RPCBrokerConnection.new("ec2-174-129-92-174.compute-1.amazonaws.com", 9210, "lu1234", "lu1234!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

patients = [
	{
		name: "CDSSEVEN,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1962",
		bp: "121/36",
		height: "70\"",
		weight: "245lb"
	},
	{
		name: "CDSEIGHT,PATIENT",
		sex: "MALE",
		dob: "01/01/1943",
		bp: "116/54",
		height: "72\"",
		weight: "243lb"
	},
	{
		name: "CDSNINE,PATIENT",
		sex: "MALE",
		dob: "01/01/1969",
		bp: "174/38",
		height: "74\"",
		weight: "191lb"
	},
	{
		name: "CDSTEN,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1946",
		bp: "145/107",
		height: "71\"",
		weight: "150lblb"
	},
	{
		name: "CDSELEVEN,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1940",
		bp: "124/46",
		height: "69\"",
		weight: "115lb"
	},
	{
		name: "CDSTWELVE,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1964",
		bp: "128/88",
		height: "61\"",
		weight: "140lb"
	},
	{
		name: "CDSTHIRTEEN,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1945",
		bp: "170/30",
		height: "69\"",
		weight: "230lb"
	},
	{
		name: "CDSFOURTEEN,PATIENT",
		sex: "MALE",
		dob: "01/01/1983",
		bp: "144/78",
		height: "72\"",
		weight: "189lb"
	},
	{
		name: "CDSFIFTEEN,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1933",
		bp: "149/108",
		height: "72\"",
		weight: "189lb"
	},
	{
		name: "CDSSIXTEEN,PATIENT",
		sex: "MALE",
		dob: "01/01/1947",
		bp: "97/44",
		height: "68\"",
		weight: "120lb"
	},
	{
		name: "CDSSEVENTEEN,PATIENT",
		sex: "MALE",
		dob: "01/01/1942",
		bp: "204/39",
		height: "62\"",
		weight: "170lb"
	},
	{
		name: "CDSEIGHTEEN,PATIENT",
		sex: "MALE",
		dob: "01/01/1955",
		bp: "158/59",
		height: "73\"",
		weight: "245lb"
	},
	{
		name: "CDSNINETEEN,PATIENT",
		sex: "FEMALE",
		dob: "01/01/1971",
		bp: "170/76",
		height: "73\"",
		weight: "178lb"
	},
	{
		name: "CDSTWENTY,PATIENT",
		sex: "MALE",
		dob: "01/01/1972",
		bp: "152/43",
		height: "66\"",
		weight: "160lb"
	}
]

patients.each do |patient|
	patient_rpc = VistaRPC4r::VistaRPC.new("ISI IMPORT PAT", VistaRPC4r::RPCResponse::ARRAY)
	patient_rpc.params = [[
		["1", "TEMPLATE^DEFAULT"],
		["2", "IMP_TYPE^I"],
		["3", "NAME^#{patient[:name]}"],
		["4", "SEX^#{patient[:sex]}"],
		["5", "DOB^#{patient[:dob]}"]
	]]

	patient_resp = broker.execute(patient_rpc)
	social = patient_resp.value.last.split('^')[1]

	puts social
	vitals_rpc = VistaRPC4r::VistaRPC.new("ISI IMPORT VITALS", VistaRPC4r::RPCResponse::ARRAY)

	vitals_rpc.params = [[
		["1", "PAT_SSN^#{social}"],
		["2", "VITAL_TYPE^BLOOD PRESSURE"],
		["3", "RATE^#{patient[:bp]}"],
		["4", "DT_TAKEN^T"],
		["5", "LOCATION^GENERAL MEDICINE"],
		["6", "ENTERED_BY^NURSE,TEN"]
	]]

	vitals_resp = broker.execute(vitals_rpc)
	puts vitals_resp

	vitals_rpc.params = [[
		["1", "PAT_SSN^#{social}"],
		["2", "VITAL_TYPE^HEIGHT"],
		["3", "RATE^#{patient[:height]}"],
		["4", "DT_TAKEN^T"],
		["5", "LOCATION^GENERAL MEDICINE"],
		["6", "ENTERED_BY^NURSE,TEN"]
	]]

	vitals_resp = broker.execute(vitals_rpc)
	puts vitals_resp

	vitals_rpc.params = [[
		["1", "PAT_SSN^#{social}"],
		["2", "VITAL_TYPE^WEIGHT"],
		["3", "RATE^#{patient[:weight]}"],
		["4", "DT_TAKEN^T"],
		["5", "LOCATION^GENERAL MEDICINE"],
		["6", "ENTERED_BY^NURSE,TEN"]
	]]

	vitals_resp = broker.execute(vitals_rpc)
	puts vitals_resp
end

puts "patients loaded"

broker.close
