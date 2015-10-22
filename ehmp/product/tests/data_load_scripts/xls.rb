require 'vistarpc4r'

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


puts all_drugs.count

all_dose = []

all_drugs.each do |key, value|
	dose = get_dose(key, value)
	dose.each do |d|
		d[:med] = value
		d[:med_id] = key
		all_dose << d
	end
end

all_dose.each do |i|
	puts "#{i[:med]} - #{i[:amount]}"
end


# puts all_drugs['3545']


# puts all_drugs
# print "Select Drug ID: "

# select_med = gets.chomp



# med = med_lookup()



# puts med


@broker.close