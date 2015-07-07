require 'vistarpc4r'

diabetic_id = "100855"
provider = "991"
location = "285"

order_ids = []

broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "PRO12345", "PRO12345!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

vrpc = VistaRPC4r::VistaRPC.new("ORWDX SAVE", VistaRPC4r::RPCResponse::ARRAY)

# 1475	 CHLORTHALIDONE TAB



vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","1475"],
		["136,1","25MG"],
		["138,1","1213"],
		["386,1","25&MG&1&TABLET&25MG&1213&25&MG"],
		["384,1","25MG"],
		["137,1","1"],
		["170,1","QDAY"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","Take Half Each Day"],
		["387,1","90"],
		["149,1","45"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE 12.5MG BY MOUTH EVERY 24 HOURS"],
		["\"ORCHECK\"","0"],
		# ["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)
puts "Save Med-------------------------------------"
puts resp

# 3508	 LISINOPRIL TAB

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","3508"],
		["136,1","20MG"],
		["138,1","1514"],
		["386,1","20&MG&1&TABLET&20MG&1514&20&MG"],
		["384,1","20MG"],
		["137,1","1"],
		["170,1","Q24H"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease SBP and DBP"],
		["387,1","90"],
		["149,1","180"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH EVERY 24 HOURS"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

# 4318	 METFORMIN TAB,ORAL

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","4318"],
		["136,1","500MG"],
		["138,1","1882"],
		["386,1","500&MG&1&TABLET&500MG&1882&500&MG"],
		["384,1","500MG"],
		["137,1","1"],
		["170,1","BID"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease HbA1c"],
		["387,1","30"],
		["149,1","60"],
		["150,1","1"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH TWICE A DAY"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp


vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","4318"],
		["136,1","1000MG"],
		["138,1","1881"],
		["386,1","1000&MG&1&TABLET&1000MG&1881&1000&MG"],
		["384,1","1000MG"],
		["137,1","1"],
		["170,1","BID"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease HbA1c"],
		["387,1","90"],
		["149,1","180"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH TWICE A DAY"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

# 4565	 NIACIN CAP,SA

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","4565"],
		["136,1","1000MG"],
		["138,1","2293"],
		["386,1","1000&MG&2&CAPSULES&1000MG&2293&500&MG"],
		["384,1","500MG"],
		["137,1","1"],
		["170,1","BID"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease HbA1c"],
		["387,1","90"],
		["149,1","360"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE 2 CAPSULES BY MOUTH TWICE A DAY"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

# 3855	 ASPIRIN TAB,EC

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","3855"],
		["136,1","81MG"],
		["138,1","872"],
		["386,1","81&MG&1&TABLET&81MG&872&81&MG"],
		["384,1","81MG"],
		["137,1","1"],
		["170,1","Q24H"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease flushing"],
		["387,1","90"],
		["149,1","90"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH EVERY 24 HOURS"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

# 3507	 GEMFIBROZIL TAB,ORAL

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","3507"],
		["136,1","600MG"],
		["138,1","156"],
		["386,1","600&MG&1&TABLET&600MG&156&600&MG"],
		["384,1","600MG"],
		["137,1","1"],
		["170,1","Q24H"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease LDL and increase HDL"],
		["387,1","90"],
		["149,1","180"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH TWICE A DAY"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

# 4372	 TERAZOSIN CAP,ORAL

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","4372"],
		["136,1","2MG"],
		["138,1","1970"],
		["386,1","2&MG&1&CAPSULE&2MG&1970&2&MG"],
		["384,1","2MG"],
		["137,1","1"],
		["170,1","QHS"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease IPSS-AUA"],
		["387,1","90"],
		["149,1","90"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE 1 CAPSULE BY MOUTH AT BEDTIME"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

# # 4066	 CITALOPRAM TAB

vrpc.params = [
	"100855",
	"991",
	"285",
	"PSO OERR",
	"4",
	"147",
	"",
	[
		["4,1","4066"],
		["136,1","40MG"],
		["138,1","1249"],
		["386,1","40&MG&1&TABLET&40MG&1249&40&MG"],
		["384,1","40MG"],
		["137,1","1"],
		["170,1","Q24H"],
		["7,1","9"],
		["15,1","ORDIALOG(\"WP\",15,1)"],
		["\"WP\",15,1,1,0","To decrease PHQ-9"],
		["387,1","90"],
		["149,1","90"],
		["150,1","3"],
		["151,1",""],
		["148,1","W"],
		["1358,1","ORDIALOG(\"WP\",1358,1)"],
		["\"WP\",1358,1,1,0",""],
		["385,1","ORDIALOG(\"WP\",385,1)"],
		["\"WP\",385,1,1,0","TAKE ONE TABLET BY MOUTH TWICE A DAY"],
		["\"ORCHECK\"","1"],
		["\"ORCHECK\",\"NEW\",\"2\",\"1\"","99^2^Remote Order Checking not available - checks done on local data only"],
		["\"ORTS\"","0"]
	],
	"",
	"",
	"",
	"0"
]

resp = broker.execute(vrpc)
order_id = resp.value.first.split('^').first.split('~').last
order_ids.push(order_id)

puts resp

vrpc = VistaRPC4r::VistaRPC.new("ORWDX SEND", VistaRPC4r::RPCResponse::ARRAY)

order_ids.each do |order|
	vrpc.params = [
		diabetic_id,
		provider,
		location,
		"",
		[
			["1","#{order}^1^1^E"]
		]
	]

	resp = broker.execute(vrpc)

	resp.value.each do |d|
		puts d
	end
end

broker.close