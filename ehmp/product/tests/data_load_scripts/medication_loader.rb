require 'vistarpc4r'
require 'csv'

@broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "PRO12345", "PRO12345!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')

vrpc = VistaRPC4r::VistaRPC.new("ORWUL FV4DG", VistaRPC4r::RPCResponse::SINGLE_VALUE)

vrpc.params = [
	"UD RX",
]

resp = @broker.execute(vrpc)

drug_table = resp.value.split('^').first

def get_dose(select_med, name)
	vrpc = VistaRPC4r::VistaRPC.new("ORWDPS2 OISLCT", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		select_med,
		"U",
		"3",
		"Y",
		"Y"
	]

	doses = []

	resp = @broker.execute(vrpc)

	is_dose = false
	resp.value.each_with_index do |d, index|
		is_dose = false if d == "~Dispense"

		if is_dose
			array = d.split('^')

			details_array = array[3].split('&')

			# puts "#{select_med} - #{name} - #{details_array[5]} - #{array[4]}" # this is the amount

			dose = {id: details_array[5], amount: array[4], all: array[3]}

			doses.push(dose)

		end
		is_dose = true if d == "~Dosage"
	end
	doses
end

all_drugs = {}

vrpc = VistaRPC4r::VistaRPC.new("ORWUL FVSUB", VistaRPC4r::RPCResponse::ARRAY)

vrpc.params = [
	drug_table,
	"1",
	"10000"
]

resp = @broker.execute(vrpc)

resp.value.each do |d|
    array = d.split('^')

    unless array[1].nil?
	    unless array[1].include?('<')
	    	all_drugs[array[0]] = array[1]
	    end
	end
end

all_dose = []

all_drugs.each do |key, value|
	dose = get_dose(key, value)
	dose.each do |d|
		d[:med] = value
		d[:med_id] = key
		all_dose << d
	end
end

def save_med(patient_id, dose, schedule, supply, quantity, refills, location, route)
	vrpc = VistaRPC4r::VistaRPC.new("ORWDX SAVE", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		patient_id,
		"991",
		location,
		"PSO OERR",
		"4",
		"147",
		"",
		[
			["4,1", dose[:med_id]],
			["136,1",dose[:amount]],
			["138,1",dose[:id]],
			["386,1",dose[:all]],
			["384,1",dose[:amount]],
			["137,1",route],										#route
			["170,1",schedule],									#schedule
			["7,1","9"],										#urgency
			["15,1","ORDIALOG(\"WP\",15,1)"],
			["387,1",supply],										#supply
			["149,1",quantity],									#quantity
			["150,1",refills],										#refills
			["151,1",""],
			["148,1","W"],										#pickup location
			["1358,1","ORDIALOG(\"WP\",1358,1)"],
			["\"WP\",1358,1,1,0",""],
			["385,1","ORDIALOG(\"WP\",385,1)"],
			["\"WP\",385,1,1,0",""],		#sig?
			["\"ORCHECK\"","2"],
			["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
			["\"ORCHECK\",\"NEW\",\"2\",\"2\"","25^2^||63659,53872,NEW&These checks could not be completed for this patient: "],
			["\"ORTS\"","0"]
		],
		"",
		"",
		"",
		"0"
	]

	resp = @broker.execute(vrpc)
	order_id = resp.value.first.split('^').first.split('~').last

	vrpc = VistaRPC4r::VistaRPC.new("ORWDX SEND", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		patient_id,
		"991",
		location,
		"",
		[
			["1","#{order_id}^1^1^E"]
		],
	]

	resp = @broker.execute(vrpc)
end

CSV.foreach("./alpha_load.csv") do |row|
  unless row[0] == "Patient Name"
  	pat = row[0].split(" - ")[1]

  	med_dose = row[1].split(" - ")
  	med_name = med_dose[0]
  	amount = med_dose[1]

  	schedule = row[2]

  	matching_doses = all_dose.select{|d| d[:med] == med_name && d[:amount] == amount}

  	supply = row[3]
  	quantity = row[4]
  	refills = row[5]
  	location = row[6].split(" - ")[1]
  	route = row[7].split(" - ")[1]

  	save_med(pat, matching_doses.first, schedule, supply, quantity, refills, location, route)
  end
end

@broker.close