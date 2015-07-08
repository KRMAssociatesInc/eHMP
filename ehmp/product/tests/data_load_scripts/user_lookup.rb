require 'vistarpc4r'

broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "pro12345", "pro12345!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

puts "Search for User:"
user = gets.chomp
vrpc = VistaRPC4r::VistaRPC.new("ORWPT LIST ALL", VistaRPC4r::RPCResponse::ARRAY)

vrpc.params = [
	user.upcase,
	"1"
]

resp = broker.execute(vrpc)

puts "------------------------------------------------"

resp.value.each do |d|

   array = d.split('^')
   puts "#{array[0]}\t #{array[1]}"
end

broker.close