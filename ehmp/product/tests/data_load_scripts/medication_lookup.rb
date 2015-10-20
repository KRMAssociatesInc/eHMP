require 'vistarpc4r'

@broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "PRO12345", "PRO12345!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')


def user_search()
	print "Search for User: "
	user = gets.chomp
	vrpc = VistaRPC4r::VistaRPC.new("ORWPT LIST ALL", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		user.upcase,
		"1"
	]

	resp = @broker.execute(vrpc)

	resp.value.each_with_index do |d, index|
		if index < 10
	   		array = d.split('^')
	   		puts "\t#{array[0]}\t #{array[1]}"
		end
	end

	print "Select Patient ID or press enter to re-search: "
	patient_id = gets.chomp

	if patient_id == ""
		return patient_id = user_search()
	else
		return patient_id
	end
end

def user_meds(patient_id)
	puts "Here are the Users meds..."
	vrpc = VistaRPC4r::VistaRPC.new("ORWPS ACTIVE", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [patient_id, "991", "0", "1"]

	resp = @broker.execute(vrpc)

	resp.value.each do |d|
		if d.start_with?('~')
			array = d.split('^')

			med_type = "Inpatient"
			case array.first
			when "~OP"
				med_type = "Outpatient"
			when "~NV"
				med_type = "Non-VA\t"
			end

			puts "\t#{med_type}\t #{array[9]} \t #{array[2]}"
		end
	end
end

def med_lookup()
	print "Search for Medication: "
	med = gets.chomp

	vrpc = VistaRPC4r::VistaRPC.new("ORWUL FV4DG", VistaRPC4r::RPCResponse::SINGLE_VALUE)

	vrpc.params = [
		"UD RX",
	]

	resp = @broker.execute(vrpc)

	drug_table = resp.value.split('^').first

	vrpc = VistaRPC4r::VistaRPC.new("ORWUL FVIDX", VistaRPC4r::RPCResponse::SINGLE_VALUE)

	vrpc.params = [
		drug_table,
		med.upcase
	]

	resp = @broker.execute(vrpc)

	med_index = resp.value.split('^').first

	vrpc = VistaRPC4r::VistaRPC.new("ORWUL FVSUB", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		drug_table,
		"#{med_index}",
		"#{med_index.to_i + 10}"
	]

	resp = @broker.execute(vrpc)

	resp.value.each do |d|
	   array = d.split('^')
	   puts "\t#{array[0]}\t #{array[1]}"
	end
	print "Select Drug ID: "

	select_med = gets.chomp
end

def get_dose(select_med, patient_id)
	vrpc = VistaRPC4r::VistaRPC.new("ORWDPS2 OISLCT", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		select_med,
		"U",
		patient_id,
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

			puts "\t#{details_array[5]}\t#{array[4]}" # this is the amount

			dose = {id: details_array[5], amount: array[4], all: array[3]}

			doses.push(dose)

		end
		is_dose = true if d == "~Dosage"
	end

	print "Select Dose ID: "

	select_dose = gets.chomp


	doses.each do |dose|
		if select_dose == dose[:id]
			return dose
		end
	end

	puts "incorrect dose id entered..."
	return get_dose(select_med, patient_id)
end

def save_med(patient_id, med, dose)
	vrpc = VistaRPC4r::VistaRPC.new("ORWDX SAVE", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		patient_id,
		"991",
		"195",
		"PSO OERR",
		"4",
		"147",
		"",
		[
			["4,1", med],
			["136,1",dose[:amount]],
			["138,1",dose[:id]],
			["386,1",dose[:all]],
			["384,1",dose[:amount]],
			["137,1","1"],										#route
			["170,1","BID"],									#schedule
			["7,1","9"],										#urgency
			["15,1","ORDIALOG(\"WP\",15,1)"],
			["387,1","90"],										#supply
			["149,1","180"],									#quantity
			["150,1","0"],										#refills
			["151,1",""],
			["148,1","W"],										#pickup location
			["1358,1","ORDIALOG(\"WP\",1358,1)"],
			["\"WP\",1358,1,1,0",""],
			["385,1","ORDIALOG(\"WP\",385,1)"],
			["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH TWICE A DAY"],		#sig?
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
		"100841",
		"991",
		"195",
		"",
		[
			["1","#{order_id}^1^1^E"]
		],
	]

	resp = @broker.execute(vrpc)

	puts "Medication saved and signed."
end

patient_id = user_search()
user_meds(patient_id)
med = med_lookup()
dose = get_dose(med, patient_id)
save_med(patient_id, med, dose)

# require 'greenletters'

# console = Greenletters::Process.new("ssh vagrant@10.2.2.101", :timeout => 10)

# console.start!

# console.wait_for(:output, /vagrant@10.2.2.101's password: /i)
# console << "vagrant\r"

# console.wait_for(:output, /[vagrant@localhost ~]$/i)
# console << "sudo csession cache -U VISTA\r"

# console.wait_for(:output, /VISTA>/i)
# console << "D ^XUP\r"

# console.wait_for(:output, /Access Code: /i)
# console << "pha1234\r"

# console.wait_for(:output, /Select OPTION NAME:/i)
# console << "rx\r"

# console.wait_for(:output, /CHOOSE 1-4:/i)
# console << "2\r"

# console.wait_for(:output, /Division: /i)
# console << "500\r"
# console << "\r"
# console << "\r"
# console << "\r"
# console << "\r"
# console << "\r"
# console << "\r"
# console << "\r"

# console.wait_for(:output, /Patient Prescription Processing/i)
# console << "Patient Prescription Processing\r"

# console.wait_for(:output, /Select PATIENT NAME:/i)

# puts "---------------\n"
# puts console.output_buffer.string()


# output = gets.chomp

# while output != "halt"

# 	console << "#{output}\r"
# 	puts console.output_buffer.string()
# 	# puts console.output_buffer.string()
# 	console.wait_for(:output)
# 	output = gets.chomp


# end

# console.wait_for(:output)
# console.wait_for(:exit)


# console << "DIABETIC\r"
# console << "\r"
# console << "\r"
# console << "\r"
# console << "\r"

# console.wait_for(:output, /Select Action: Next Screen/i)
# console << "so\r"

# console.wait_for(:output, /Select Orders by number:/i)
# console << "1\r"

# console.wait_for(:output, /FINISH/i)
# console << "fn\r"
# console << "\r"

# console.wait_for(:output, /Copy Provider Comments into the Patient Instructions?/i)
# console << "\r"

# console.wait_for(:output, /Do you want to Continue?/i)
# console << "yes\r"

# console.wait_for(:output, /PROVIDER:/i)
# console << "PROVIDER,EIGHT\r"

# console.wait_for(:output, /CHOOSE 1-5:/i)
# console << "1\r"

# console.wait_for(:output, /RECOMMENDATION:/i)
# console << "8\r"

# console.wait_for(:output, /Would you like to edit this intervention/i)
# console << "\r"

# console.wait_for(:output, /Was treatment for Service Connected condition?/i)
# console << "no\r"

# console.wait_for(:output, /Are you sure you want to Accept this Order?/i)
# console << "yes\r"

# console.wait_for(:output, /METHOD OF PICK-UP:/i)
# console << "\r"

# console.wait_for(:output, /WAS THE PATIENT COUNSELED/i)
# console << "\r"
# console << "\r"
# console << "\r"



@broker.close