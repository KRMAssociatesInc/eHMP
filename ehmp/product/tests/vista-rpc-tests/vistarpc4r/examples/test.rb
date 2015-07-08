require './../lib/vistarpc4r/rpc_response'
require './../lib/vistarpc4r/vista_rpc'
require './../lib/vistarpc4r/rpc_broker_connection'
require './../lib/vistarpc4r/domains_action'

test = DomainsView.new
 p test.view_patients_list "9e7a"
 p test.view_meds "9e7a;3"
 p test.view_vitals "9e7a;3"
 p test.view_labs "9e7a;3"
 p test.view_demo "9e7a;3"
 p test.view_visits "9e7a;3"
 p test.view_detail "9e7a;3"
 p test.view_notifications "9e7a;3"
 p test.view_info "9e7a;3"
 p test.view_problem_list "9e7a;3"
 p test.view_allergy "9e7a;3"
 p test.view_admission_list "9e7a;3"
 p test.view_appointments_list "9e7a;3"

#p test.view_all_patients "9e7a"
# Medsphere maintains a public demo OpenVistA server.  It resets all of its content every night.
# Info here ---> https://medsphere.org/docs/DOC-1003


  # broker = VistaRPC4r::RPCBrokerConnection.new('10.2.2.102', 9210, 'pu1234', 'pu1234!!')
  # broker.connect
  
  # p "The RPC Broker Connection status is #{broker.isConnected}"

  # broker.setContext('OR CPRS GUI CHART')
  
  # patient_ien = "9E7A;3"
  
  
# def patients_list(broker)
#   wardsarray = broker.call_a("ORQPT WARDS")
 
#     wardsarray.each do |ward|
#       a = ward.split("^")
#       puts "Ward:" + a[1]
#       wardarray = broker.call_a("ORQPT WARD PATIENTS", [a[0]])  # ward ien
#         wardarray.each do |patient|
#           b = patient.split("^")
#           puts b[0] + ":" + b[1]
#         end
#     end
# end
 
# def problem_list(broker, patient_ien)
# # Problem list
#   puts "Problem list-------------------------------------"
#   patientarray = broker.call_a("ORQQPL LIST", [patient_ien, "A"])
#     patientarray.each do |d|
#       puts d
#     end
# end 
#  patients_list broker
#  problem_list broker, patient_ien

# 
# # Medications
# puts "Medications-------------------------------------"
# patientarray = broker.call_a("ORWPS COVER", [patient_ien])
# patientarray.each do |d|
  # puts d
# end
# 
# 
# #Labs
# puts "Labs-------------------------------------"
# patientarray = broker.call_a("ORWCV LAB", [patient_ien])
# patientarray.each do |d|
  # puts d
# end
# 
# # Vitals
# puts "Vitals-------------------------------------"
# patientarray = broker.call_a("ORQQVI VITALS", [patient_ien])
# patientarray.each do |d|
  # puts d
# end
# 
# # Demo
# puts "Demographics-------------------------------------"
# patientarray = broker.call_a("ORWPT PTINQ", [patient_ien])
# patientarray.each do |d|
  # puts d
# end
# 
# #visits
# puts "Visits-------------------------------------"
# patientarray = broker.call_a("ORWCV VST", [patient_ien])
# patientarray.each do |d|
  # puts d
# end
# 
# #providers
# puts "Providers---------------------------------"
# patientarray = broker.call_a("ORQPT PROVIDERS")
# patientarray.each do |d|
  # puts d
# end
# p 'test'
