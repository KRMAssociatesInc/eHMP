require 'vistarpc4r'

@patients = []

load_start_time = Time.now
puts "Starting Data Upload"

@broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "lu1234", "lu1234!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')

def format_params(params, ssn, increment, ssn_name = "PAT_SSN")
	formated_params = [
		["1", "#{ssn_name}^#{ssn}"]
	]

	params.each_with_index do |item, index|
		item = item.sub("T-", "T-#{increment}")
		item = item.sub("T+", "T+#{increment}")

		formated_params << ["#{index+2}", item]
	end
	formated_params
end

def rpc_load(name, rpc, params, times = [1], ssn_name = "PAT_SSN")
	start = Time.now
	puts  "Loading #{name}\n"
	@vrpc = VistaRPC4r::VistaRPC.new(rpc, VistaRPC4r::RPCResponse::ARRAY)

	@ssn_name  = ssn_name

	def exicute(times, ssn, params)
		x = 1

		until x > times
			formated_params = format_params(params, ssn, x, @ssn_name)
			@vrpc.params = [formated_params]
			resp = @broker.execute(@vrpc)

			# puts resp

			x += 1
		end
	end

	count = 0
	@patients.each do |ssn|
		count += 1

		per_count = @patients.count / times.count

		index = (count - 1) / per_count
		time = times[index]
		exicute(time, ssn, params)

		percent = count / @patients.count.to_f

		load_done = (percent*100).to_i


		output = "["

		load_done.times do
			output += "="
		end

		(100 - load_done).times do
			output += " "
		end

		output += "]"

		print "\r"
		print output
	end

	comp_time = (Time.now - start).to_f.divmod(60)
	comp_mins = comp_time[0]
	comp_secs = comp_time[1].round(1)


	puts  "\n#{name} Load Completed in #{comp_mins} Mins #{comp_secs} Secs \n"
end

def num_to_string(num)
	alph = ("a".."z").to_a
	output = ""

	begin
		num, remainder = num.divmod(10)

		output += alph[remainder]
	end until num == 0

	output.upcase.reverse
end

def create_patients(number)

	puts "Creating patients"
	start = Time.now
	patient_rpc = VistaRPC4r::VistaRPC.new("ISI IMPORT PAT", VistaRPC4r::RPCResponse::ARRAY)

	i = 0
	until i >= number
		last = "PERFORMANCE"
		first = num_to_string(i)

		name = "#{last},#{first}"

		patient_rpc.params = [[
			["1", "TEMPLATE^DEFAULT"],
			["2", "IMP_TYPE^I"],
			["3", "NAME^#{name}"]
		]]
		patient_resp = @broker.execute(patient_rpc)
		social = patient_resp.value.last.split('^')[1]
		@patients.push(social)

		i += 1

		percent = i.to_f / number
		load_done = (percent*100).to_i

		output = "["

		load_done.times do
			output += "="
		end

		(100 - load_done).times do
			output += " "
		end

		output += "]"

		print "\r"
		print output
	end

	comp_time = (Time.now - start).to_f.divmod(60)
	comp_mins = comp_time[0]
	comp_secs = comp_time[1].round(1)


	puts  "\nPatients Load Completed in #{comp_mins} Mins #{comp_secs} Secs \n"
end

create_patients(10)

params = [
	"HISTORIC^1",
	"ALLERGEN^POLLEN",
	"SYMPTOM^ITCHING",
	"SYMPTOM^ITCHING,WATERING EYES",
	"ORIG_DATE^T-",
	"ORIGINTR^PROVIDER,ONE"
]

rpc_load("Allergies", "ISI IMPORT ALLERGY", params)

params = [
	"CONSULT^CARDIOLOGY",
	"LOC^PRIMARY CARE",
	"PROV^PROVIDER,ONE",
	"TEXT^Testing consult importer."
]

rpc_load("Consults", "ISI IMPORT CONSULT", params)

params = [
	"RAPROC^KNEE 2 VIEWS",
	"MAGLOC^RADIOLOGY MAIN FLOOR",
	"PROV^PROVIDER,ONE",
	"RADTE^T+",
	"REQLOC^PRIMARY CARE",
	"REASON^This is a test.",
	"HISTORY^This is some history."
]

rpc_load("Orders", "ISI IMPORT RAD ORDER", params, [200])

params = [
	"ADATE^T-@14:00",
	"CLIN^PRIMARY CARE"
]

rpc_load("Appointments 1/2", "ISI IMPORT APPT", params, [50, 65, 75, 85, 100], "PATIENT")


params = [
	"ADATE^T-@8:00",
	"CLIN^GENERAL MEDICINE"
]

rpc_load("Appointments 2/2", "ISI IMPORT APPT", params, [50, 65, 75, 85, 100], "PATIENT")



params = [
	"VITAL_TYPE^BLOOD PRESSURE",
	"RATE^172/63",
	"LOCATION^PRIMARY CARE",
	"DT_TAKEN^T-",
	"ENTERED_BY^PROVIDER,ONE"
]

rpc_load("Vitals 1/2", "ISI IMPORT VITALS", params, [50, 200, 300, 400, 500])

params = [
	"VITAL_TYPE^TEMPERATURE",
	"RATE^89.6",
	"LOCATION^GENERAL MEDICINE",
	"DT_TAKEN^T-",
	"ENTERED_BY^NURSE,TEN"
]

rpc_load("Vitals 2/2", "ISI IMPORT VITALS", params, [50, 200, 300, 400, 500])

params = [
	"TIU_NAME^CRISIS NOTE",
	"VLOC^GENERAL MEDICINE",
	"VDT^T-",
	"PROV^PROVIDER,ONE",
	"TEXT^Another test."
]

rpc_load("Notes 1/2", "ISI IMPORT NOTE", params, [125, 250, 375, 500, 600])


params = [
	"TIU_NAME^CARDIOLOGY NOTE",
	"VLOC^PRIMARY CARE",
	"VDT^T-",
	"PROV^PROVIDER,ONE",
	"TEXT^This is a test of the note stuffer."
]

rpc_load("Notes 2/2", "ISI IMPORT NOTE", params, [125, 250, 375, 500, 600])

load_time = (Time.now - load_start_time).to_f.divmod(60)
load_mins = load_time[0]
load_secs = load_time[1].round(1)

puts  "Load Completed! in #{load_mins} Mins #{load_secs} Secs"

