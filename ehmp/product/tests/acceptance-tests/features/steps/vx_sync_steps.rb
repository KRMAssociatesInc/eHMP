require "TestSupport.rb"
require "VxSync.rb"
require "httparty"

Then(/^the client requests sync process for patient with pid "(.*?)" through VX\-Sync API$/) do |pid|
  base_url = DefaultLogin.vx_sync_url
  icn_pid = check_for_icn_or_pid(pid)
  p path = "#{base_url}/sync/doLoad?#{icn_pid}=#{pid}"
  
  vx_sync = VxSync.new
  @response = vx_sync.sync_request(path)
  
  expected_code_and_error_mesg = [202, "The sync request is failed!"]
  vx_sync.response_handler(@response, expected_code_and_error_mesg)

end

Given(/^a patient with pid "(.*?)" has not been synced through VX\-Sync API for "(.*?)" site\(s\)$/) do |pid, site_name_list|
  max_wait_time = 300
  clear_patient = false
  base_url = DefaultLogin.vx_sync_url
  icn_pid = check_for_icn_or_pid(pid)
  p status_path = "#{base_url}/sync/status?#{icn_pid}=#{pid}"
  
  vx_sync = VxSync.new
  sync_requested_status = vx_sync.check_patient_if_has_been_synced(status_path, site_name_list)

  if sync_requested_status == "Campleted"
    p "The patient has been synced"
    clear_patient = true
  elsif sync_requested_status == "Requested_Not_Completed"
    p "The patient has been synced but the sync is not completed yet!"
    vx_sync.waiting_message = "Waiting for syncing to be completed at site:"
    sync_completed = vx_sync.check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)
    clear_patient = true
  else
    p "The patient has not been synced yet"
    clear_patient = false
  end
  
  if clear_patient == true
    p clear_path = "#{base_url}/sync/clearPatient?#{icn_pid}=#{pid}"
    # http://10.3.3.6:8080/sync/clearPatient?pid=9E7A;227
    response = vx_sync.clear_request(clear_path)
    fail "Unsync patient faild! Expected response code 202, received #{response.code}" unless response.code == 202
  end
end

Given(/^the client requests sync status for patient with pid "(.*?)"$/) do  |pid|
  base_url = DefaultLogin.vx_sync_url
  @response = nil
  icn_pid = check_for_icn_or_pid(pid) 
  p status_path = "#{base_url}/sync/status?#{icn_pid}=#{pid}"
 
  vx_sync = VxSync.new
  json_object = vx_sync.find_sync_status_body(status_path)
  @response = vx_sync.response
  fail "The sync status failed. Response: \n #{@response}" if @response == nil #|| @response.code != 200
end

Given(/^a patient with pid "(.*?)" has been synced through VX\-Sync API for "(.*?)" site\(s\)$/) do |pid, site_name_list|
  # @@pid_site_list_not_sync = TestSupport.pid_site_list_not_sync
  # @@operational_data_synced = TestSupport.operational_data_synced
  # @@operational_sync_been_checked = TestSupport.operational_sync_been_checked
  vx_sync = VxSync.new
  vx_sync.check_pid_if_found_list_not_sync(pid, site_name_list)
  
  # p status_path = "#{base_url}/status/#{pid}?detailed=true"  
    
  base_url = DefaultLogin.vx_sync_url
  icn_pid = check_for_icn_or_pid(pid)
  p sync_path = "#{base_url}/sync/doLoad?#{icn_pid}=#{pid}"
  p status_path = "#{base_url}/sync/status?#{icn_pid}=#{pid}"
  
  max_wait_time = 300
  @response = nil
  sync_requested_status = vx_sync.check_patient_if_has_been_synced(status_path, site_name_list)

  if sync_requested_status == "Campleted"
    p "The patient has been synced"
  elsif sync_requested_status == "Requested_Not_Completed"
    p "The patient has been synced but the sync is not completed yet!"
    vx_sync.waiting_message = "Waiting for syncing to be completed at site:"
    sync_completed = vx_sync.check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)
  else
    p "The patient has not been synced yet"
    response = vx_sync.sync_request(sync_path)
    expected_code_and_error_mesg = [202, "The patient has not been synced yet and the sync request is failed!"]
    vx_sync.response_handler(response, expected_code_and_error_mesg)
    
    vx_sync.waiting_message = "Waiting for syncing to be completed at site:"
    sync_completed = vx_sync.check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)
  end
  
  vx_sync.save_pid_and_site_not_sync(pid) if sync_completed == false
  # p @@pid_site_list_not_sync
  fail "The sync did not complete for site(s): \n #{@site_is_not_sync}" if sync_completed == false
  @response = vx_sync.response 
end

When(/^the client requests operational sync status for "(.*?)" site$/) do |site_name|
  operational_sync_completed = false
  base_jds_url = DefaultLogin.jds_url
  p opd_path = "#{base_jds_url}/statusod/#{site_name}"
  vx_sync = VxSync.new

  json = vx_sync.find_sync_status_body(opd_path)
  @response = vx_sync.response
  if json != nil && json["completedStamp"] !=nil
    operational_sync_completed = true
    # p "This is the responce when testing the OPD for site #{site_name} >>>> #{JSON.parse(@@response.body)}"
  else
    operational_sync_completed = vx_sync.wait_until_site_operational_sync_is_completed(base_jds_url, site_name)
    p "********** Operational data has been synced for #{site_name} **********"
    # p "This is the responce when testing the OPD for site #{site_name} >>>> #{JSON.parse(@@response.body)}"
  end
  fail "The operational sync did not complete for site: \n #{site_name}" unless operational_sync_completed
end

Then(/^the operational data results contain different domains from "(.*?)"$/) do |site_name, table|
  missing_domain = ""
  json_object = JSON.parse(@response.body)
  table.rows.each do |domain, k|
    domain_runtime = json_object["completedStamp"]["sourceMetaStamp"][site_name]["domainMetaStamp"]
    missing_domain = missing_domain + " \n" + domain if domain_runtime.nil? || domain_runtime[domain].nil? || domain_runtime[domain].empty?
  end
  fail "The operational data for #{site_name} site has missing dimain(s): #{missing_domain}" unless missing_domain.empty?
end

When(/^the client forced sync for patient with pid "(.*?)" at "(.*?)" secondary site\(s\)$/) do |pid, site_name_list|
  base_url = DefaultLogin.vx_sync_url
  icn_pid = check_for_icn_or_pid(pid)
  sync_path = "#{base_url}/sync/doLoad?#{icn_pid}=#{pid}"
  p status_path = "#{base_url}/sync/status?#{icn_pid}=#{pid}"
  
  site_names = site_name_list.downcase.split";"
  site_names.each do |site_name|
    fail "The specified site #{site_name} is not one of the secondary define sites (dod, hdr, vler, all) in your script" unless %w[dod hdr vler all].include? site_name
  end
  
  if site_names.include? "all"
    site_name_list = "dod;hdr;vler"
    site_names = "true"
  else
    site_names = "[" + site_names.map { | s | "%22" + s + "%22" }.join(',') + "]"
  end
   
  
  p path_forced = sync_path + "&forcedSync=#{site_names}"
  # p path_forced = "http://10.3.3.6:8080/sync/doLoad?pid=9E7A;227&forcedSync=[%22dod%22,%22hdr%22,%22vler%22]"
  
  vx_sync = VxSync.new
  max_wait_time = 300
  @response = nil

  p "The patient has been forced to sync"
  response = vx_sync.sync_request(path_forced)
   
  expected_code_and_error_mesg = [202, "The patient has not been synced yet and the sync request is failed!"]
  vx_sync.response_handler(response, expected_code_and_error_mesg)
  vx_sync.waiting_message = "Waiting for syncing to be completed at site:"
    
  sync_completed = vx_sync.check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)
  
  vx_sync.save_pid_and_site_not_sync(pid) if sync_completed == false

  fail "The sync did not complete for site(s): \n #{@site_is_not_sync}" if sync_completed == false
  @response = vx_sync.response 
end

def check_for_icn_or_pid(pid)
  
  if (pid.include? "9E7A") || (pid.include? "C877")
    icn_pid = "pid"
  else
    icn_pid = "icn"
  end
  return icn_pid
end
