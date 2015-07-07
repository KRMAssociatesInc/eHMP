require 'vistarpc4r'

broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "PRO12345", "PRO12345!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

puts "Search for Medication:"
med = gets.chomp



vrpc = VistaRPC4r::VistaRPC.new("ORWUL FV4DG", VistaRPC4r::RPCResponse::SINGLE_VALUE)

vrpc.params = [
	"UD RX",
]

resp = broker.execute(vrpc)

puts resp

drug_table = resp.value.split('^').first


vrpc = VistaRPC4r::VistaRPC.new("ORWUL FVIDX", VistaRPC4r::RPCResponse::SINGLE_VALUE)

vrpc.params = [
	drug_table,
	med.upcase
]

resp = broker.execute(vrpc)

med_index = resp.value.split('^').first

puts "------------------------------------------------"

vrpc = VistaRPC4r::VistaRPC.new("ORWUL FVSUB", VistaRPC4r::RPCResponse::ARRAY)

vrpc.params = [
	drug_table,
	"#{med_index}",
	"#{med_index.to_i + 10}"
]

resp = broker.execute(vrpc)

resp.value.each do |d|

   array = d.split('^')
   puts "#{array[0]}\t #{array[1]}"
end

broker.close