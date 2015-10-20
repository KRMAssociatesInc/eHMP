require 'vistarpc4r'

Given(/^save the totalItems$/) do
  # p @response
  p @total_items = find_total_items
end

Given(/^a client connect to VistA using "(.*?)"$/) do |site_name|
  site_name = site_name.upcase
  fail"Check you code or the site name #{site_name}! Just PANORAMA and KODAK are define in this code." unless ["PANORAMA", "KODAK"].include? site_name
  # p site_name
  if site_name == "PANORAMA"
    p base_url = DefaultLogin.panorama_url
  else
    p base_url = DefaultLogin.kodak_url
  end
  
  base = base_url.split":"
  ip_address = base[0]
  port = base[1].to_i
  
  access_code = DefaultLogin.access_code
  verify_code = DefaultLogin.verify_code
  
  @broker = VistaRPC4r::RPCBrokerConnection.new(ip_address, port, access_code, verify_code, false)
  @broker.connect
  
  p "*"*62
  p connection_mes = "* The RPC Broker Connection status is #{@broker.isConnected} for site #{site_name} *"
  p "*"*62

  fail connection_mes unless @broker.isConnected
end

When(/^the client add new Vitals record by using write\-back for patient with DFN "(.*?)" adding BLOOD PRESSURE with value "(.*?)"$/) do |dfn, value|
  rpc_name = "HMP WRITEBACK VITALS"
  param = "3150701^"+dfn+"^1;"+value+";^23^10000000224*2:38:50:75"
  
  @response = write_back_rpc(dfn, rpc_name, param)
end

When(/^the client add new Vitals record by using write\-back for patient with DFN "(.*?)" adding BODY TEMPERATURE with value "(.*?)"$/) do |dfn, value|
  rpc_name = "HMP WRITEBACK VITALS"
  param = "3150701^"+dfn+"^2;"+value+";^23^10000000224*2:38:50:75"
  
  @response = write_back_rpc(dfn, rpc_name, param)
end

When(/^the client add new Lab Order record by using write\-back for patient with DFN "(.*?)" ordering PTT test$/) do |dfn|
  rpc_name = "HMP WRITEBACK LAB ORDERS"
  param = 'XIU,MARGARET^AUDIOLOGY^PTT^BLOOD^SERUM^ASAP^SP^TODAY^ONE TIME^^foo'
  
  @response = write_back_rpc(dfn, rpc_name, param)
end

When(/^the client add new Lab Order record by using write\-back for patient with DFN "(.*?)" ordering THEOPHYLLINE test$/) do |arg1|
  rpc_name = "HMP WRITEBACK LAB ORDERS"
  param = 'XIU,MARGARET^AUDIOLOGY^THEOPHYLLINE^BLOOD^SERUM^ROUTINE^SP^TODAY^ONE TIME^^07/07/15 04:00;07/07/15 06:00'
  
  @response = write_back_rpc(dfn, rpc_name, param)
end

When(/^the client add new Lab Order record by using write\-back for patient with DFN "(.*?)" ordering GAS AND CARBON MONOXIDE PANEL test$/) do |arg1|
  rpc_name = "HMP WRITEBACK LAB ORDERS"
  param = 'XIU,MARGARET^AUDIOLOGY^GAS AND CARBON MONOXIDE PANEL^BLOOD^BLOOD^ROUTINE^SP^TODAY^ONE TIME^^foo'
  
  @response = write_back_rpc(dfn, rpc_name, param)
end

When(/^the client add new Lab Order record by using write\-back for patient with DFN "(.*?)" ordering GENTAMICIN test$/) do |arg1|
  rpc_name = "HMP WRITEBACK LAB ORDERS"
  param = 'XIU,MARGARET^AUDIOLOGY^GENTAMICIN^BLOOD^SERUM^ROUTINE^SP^TODAY^ONE TIME^^PEAK;foo'
  
  @response = write_back_rpc(dfn, rpc_name, param)
end

Then(/^the client receive the VistA write\-back response$/) do
  # p @response
  # p @response.class
  # p @response.value
  begin
    json_object = JSON.parse(@response.value)
  rescue Exception => e
    err_mesf = "An error has occured at JSON::Parser." + e.to_s
    raise err_mesf
  end
    
  

  p "^ object"* 10  
  p @param = json_object["object"]
  p "^ object"* 10
  p @param["lastUpdateTime"]
  p @param["uid"]
  p "^"* 20

  fail "The VistA write-back's response is empty" if @param.empty?
end

Then(/^the new "(.*?)" record added for the patient "(.*?)" in VPR format$/) do |domain, pid|
  all_domains = { 
    "ALLERGIES" => "allergy", "LABS" => "lab", "VITAL" => "vital", "LAB ORDER" => "order", "VLER DOCUMENT" => "vlerdocument", 
    "MEDS" => "med", "CONSULT" => "consult", "PROBLEM LIST" => "problem", "PROCEDURE" => "procedure", 
    "PURPOSE OF VISIT" => "pov", "DOCUMENT" => "document", "APPOINTMENT" => "appointment", "PATIENT DEMOGRAPHICS" => "patient",
    "EDUCATION" => "education", "VISIT" => "visit", "FACTOR" => "factor", "CPT" => "cpt", "SURGERY" => "surgery",
    "SKIN" => "skin", "MENTAL HEALTH" => "mh", "EXAM" => "exam", "IMMUNIZATIONS" =>"immunization", "IMAGE" => "image" 
  }
  domain = all_domains[domain.upcase]
  fail "Please check your step ruby file. \n This domain does not specify in our test." if domain.nil? || domain.empty?
  
  max_index_run = 20
  sleep_time = 3
  index = 0
  total_match = false
  
  while total_match == false && index < max_index_run
    @response = nil
    sleep sleep_time
    
    vpr_formate = VprFormate.new 
    @response = vpr_formate.call_vpr_formate(domain, pid)
  
    new_total_items = find_total_items
    p @total_items+ 1
    p new_total_items
    total_match = true if new_total_items == @total_items + 1
    
    index = index + sleep_time
  end
  expect(new_total_items).to eq @total_items + 1
end

When(/^the client use the vx\-sync write\-back to save the record$/) do
  base_jds_url = DefaultLogin.wb_vx_sync_url
  p path = "#{base_jds_url}/writeback"    
   
  # This is just for test propose. NO one allowed to make change to Last Update Time.
  # In two different times the data get save. One time by Vista and one time by vx-sync.
  # to make sure in our test the recode get save by vx-sync the lastUpdateTime been chagned. 
  new_time = @param["lastUpdateTime"] + 3
  @param["lastUpdateTime"] = new_time
  
  param = @param.to_json
  p "^*"* 20
  # p path
  # p param
  p @response = HTTPartyWithBasicAuth.post_write_back(path, param)
  p "^*"* 20
end

Then(/^the responce is successful$/) do
  fail "Expected response code 200, received #{@response.code} \n response body: #{@response.body}" unless @response.code == 200
end

def write_back_rpc(dfn, rpc_name, param)
  @broker.setContext('HMP UI CONTEXT')
  vrpc = VistaRPC4r::VistaRPC.new(rpc_name, VistaRPC4r::RPCResponse::SINGLE_VALUE)
  
  vrpc.params[0] = "0"
  vrpc.params[1] = dfn
  vrpc.params[2] = param
  
  p "* response"* 10
  p response = @broker.execute(vrpc)
  p "* response"* 10
  
  p response if response.value.empty?
  fail "Error: PLease read the above error message" if response.value.empty?
  return response
end

def find_total_items
  begin
    json_object = JSON.parse(@response.body)
  rescue Exception => e
    err_mesf = "An error has occured at JSON::Parser." + e.to_s
    raise err_mesf
  end
  
  return json_object["data"]["totalItems"]
end
  
# When(/^old Vitals write\-back for patient with pid "(.*?)" with BLOOD PRESSURE "(.*?)"$/) do |dfn, blood_pressure|
  # @broker.setContext('HMP UI CONTEXT')
  # data_vitals = {}
#   
  # vrpc = VistaRPC4r::VistaRPC.new("HMP WRITEBACK VITALS", VistaRPC4r::RPCResponse::SINGLE_VALUE)
  # # vrpc = VistaRPC4r::VistaRPC.new("HMP PUT OPERATIONAL DATA", VistaRPC4r::RPCResponse::SINGLE_VALUE)
#   
  # vrpc.params[0] = "0"
  # vrpc.params[1] = dfn
  # vrpc.params[2] = "3150701^"+dfn+"^2;"+blood_pressure+";^23^10000000224*2:38:50:75"
#   
  # # vrpc.params[2] = ["\"data\"", "3150701^"+pid+"^1;"+blood_pressure+";^67^87*2:38:50:75"]
  # # "3050612.1635^3^1;120/80;^67^87*2:38:50:75"
  # # vrpc.params[2] = [
                   # # ["\"domain\"", "vitals"],
                  # # ["\"data\"", "3150701^"+pid+"^1;"+blood_pressure+";^23^10000000224*2:38:50:75"]
                 # # ]
  # p "* response"* 20
  # p @response = @broker.execute(vrpc)
  # p "* response"* 20
# end
