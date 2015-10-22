require 'vistarpc4r'

@broker = VistaRPC4r::RPCBrokerConnection.new("ec2-174-129-92-174.compute-1.amazonaws.com", 9210, "pr12345", "pr12345!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')

puts "Search for User:"
user = gets.chomp




vrpc = VistaRPC4r::VistaRPC.new("ORWPT LIST ALL", VistaRPC4r::RPCResponse::ARRAY)

vrpc.params = [
	user.upcase,
	"1"
]

resp = @broker.execute(vrpc)

count = 0
resp.value.each do |d|
   array = d.split('^')

   puts "#{array[1]} - #{array[0]}"
   count += 1

   if count ==  10
   		break
   end
end


# all_users = []
# last_user = ""

# def get_users(last_user, all_users)
# 	vrpc = VistaRPC4r::VistaRPC.new("ORWPT LIST ALL", VistaRPC4r::RPCResponse::ARRAY)

# 	vrpc.params = [
# 		last_user,
# 		"1"
# 	]

# 	resp = @broker.execute(vrpc)

# 	resp.value.each do |d|
# 	   array = d.split('^')

# 	   all_users << "#{array[1]} - #{array[0]}"
# 	end

# 	if resp.value.count > 0
# 		last = resp.value.last.split('^')
# 		last_user = last[1]

# 		get_users(last_user, all_users)
# 	end
# end

# get_users(last_user, all_users)

# puts all_users

@broker.close
