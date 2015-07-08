require 'vistarpc4r'


broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "PRO12345", "PRO12345!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

vrpc = VistaRPC4r::VistaRPC.new("ORWDX SAVE", VistaRPC4r::RPCResponse::ARRAY)

vrpc.params = [
	"100841",
	"991",
	"195",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","1671"],
		["136,1","800MG"],
		["138,1","1649"],
		["386,1","800&MG&1&TABLET&800MG&1649&800&MG"],
		["384,1","800MG"],
		["137,1","1"],
		["170,1","BID"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["387,1","90"],
		["149,1","180"],
		["150,1","0"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH TWICE A DAY"],
		["\"ORCHECK\"","2"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORCHECK\",\"NEW\",\"2\",\"2\"","25^2^||63659,53872,NEW&These checks could not be completed for this patient:"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

puts "Save Med-------------------------------------"
resp = broker.execute(vrpc)

puts resp

order_id = resp.value.first.split('^').first.split('~').last

puts order_id

vrpc = VistaRPC4r::VistaRPC.new("ORWORR GETTXT", VistaRPC4r::RPCResponse::ARRAY)


vrpc.params = [
	"#{order_id}"
]

puts "Med text-------------------------------------"
resp = broker.execute(vrpc)

# puts resp
resp.value.each do |d|
   puts d
end

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

puts "Sign med-------------------------------------"
resp = broker.execute(vrpc)

# puts resp
resp.value.each do |d|
   puts d
end

broker.close