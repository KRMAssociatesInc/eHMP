require 'vistarpc4r'

broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "lu1234", "lu1234!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

vrpc = VistaRPC4r::VistaRPC.new("ISI IMPORT PAT", VistaRPC4r::RPCResponse::ARRAY)


patients = [
	{
		name: "CDSSEVEN,PATIENT",
		sex: "FEMALE",
		dob: "10/10/62",
		bp: "121/36",
		height: "70",
		weight: "245"
	},
	{
		name: "CDSEIGHT,PATIENT",
		sex: "MALE",
		dob: "10/10/43",
		bp: "116/54",
		height: "72",
		weight: "243"
	},
	{
		name: "CDSNINE,PATIENT",
		sex: "MALE",
		dob: "10/10/69",
		bp: "174/38",
		height: "74",
		weight: "191"
	},
	{
		name: "CDSTEN,PATIENT",
		sex: "FEMALE",
		dob: "10/10/46",
		bp: "145/107",
		height: "71",
		weight: "150"
	},
	{
		name: "CDSELEVEN,PATIENT",
		sex: "FEMALE",
		dob: "10/10/40",
		bp: "124/46",
		height: "69",
		weight: "115"
	},
	{
		name: "CDSTWELVE,PATIENT",
		sex: "FEMALE",
		dob: "10/10/64",
		bp: "128/88",
		height: "61",
		weight: "140"
	},
	{
		name: "CDSTHIRTEEN,PATIENT",
		sex: "FEMALE",
		dob: "10/10/45",
		bp: "170/30",
		height: "69",
		weight: "230"
	},
	{
		name: "CDSFOURTEEN,PATIENT",
		sex: "MALE",
		dob: "10/10/83",
		bp: "144/78",
		height: "72",
		weight: "189"
	},
	{
		name: "CDSFIFTEEN,PATIENT",
		sex: "FEMALE",
		dob: "10/10/33",
		bp: "121/36",
		height: "70",
		weight: "245"
	},
	{
		name: "CDSSIXTEEN,PATIENT",
		sex: "MALE",
		dob: "10/10/47",
		bp: "121/36",
		height: "70",
		weight: "245"
	},
	{
		name: "CDSSEVENTEEN,PATIENT",
		sex: "MALE",
		dob: "10/10/42",
		bp: "121/36",
		height: "70",
		weight: "245"
	},
	{
		name: "CDSEIGHTTEEN,PATIENT",
		sex: "MALE",
		dob: "10/10/55",
		bp: "121/36",
		height: "70",
		weight: "245"
	},
	{
		name: "CDSNINETEEN,PATIENT",
		sex: "FEMALE",
		dob: "10/10/71",
		bp: "121/36",
		height: "70",
		weight: "245"
	},
	{
		name: "CDSTWENTY,PATIENT",
		sex: "MALE",
		dob: "10/10/72",
		bp: "121/36",
		height: "70",
		weight: "245"
	}
]


puts  "genterating patient data\n"

i = 1
until i > patients_count
	patient = {
		batch_num: "#{i}",
		name: "LAST,LOAD",
		sex: "MALE",
		dob: "10/28/50",
		race: "WHITE",
		employment: "ACTIVE MILITARY DUTY",
		occupation: "PROGRAMMER",
		veteran: "Y"
	}

	patient_array.push(patient)

	print "\r"
	print "#{i}/#{patients_count}"
	i += 1
end

patient_param = [
	["1", "TEMPLATE^DEFAULT"],
	["2", "IMP_TYPE^B"]
]

puts  "\nformating params:\n"

patient_array.each do |patient|
	count = patient_param.count

	batch = [
		["#{count+1}", "IMP_BATCH_NUM^#{patient[:batch_num]}"],
		["#{count+2}", "NAME^#{patient[:name]}"],
		["#{count+3}", "SEX^#{patient[:sex]}"],
		["#{count+4}", "DOB^#{patient[:dob]}"],
		["#{count+5}", "RACE^#{patient[:race]}"],
		["#{count+6}", "EMPLOY_STAT^#{patient[:employment]}"],
		["#{count+7}", "OCCUPATION^#{patient[:occupation]}"],
		["#{count+8}", "VETERAN^#{patient[:veteran]}"]
	]

	print "\r"
	print "#{patient_param.count/8}/#{patients_count}"

	patient_param += batch

end

puts  "\nSending data...\n"

vrpc.params = [patient_param]

resp = broker.execute(vrpc)
puts "-------------"


resp.value.each do |result|
	puts result.split("^")
end


broker.close
