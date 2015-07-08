require "TestSupport.rb"
require "VxSync.rb"

Then(/^the client requests sync process for patient with pid "(.*?)" through VX\-Sync API$/) do |pid|
  base_url = DefaultLogin.vx_sync_url
  p path = "#{base_url}/sync/doLoad?pid=#{pid}"
  
  response = sync_request(path)
  
  expected_code_and_error_mesg = [202, "The sync request is failed!"]
  response_handler(response, expected_code_and_error_mesg)

end

Given(/^the client requests sync status for patient with pid "(.*?)" and "(.*?)" sites$/) do  |pid, site_name_list|
  # p "pi"*100
  base_url = DefaultLogin.jds_url
  p status_path = "#{base_url}/status/#{pid}"
  max_wait_time = 300
  sync_completed = check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)

  fail "The sync did not complete for site(s): \n #{@site_is_not_sync}" if sync_completed == false
end

Given(/^a patient with pid "(.*?)" has been synced through VX\-Sync API for "(.*?)" site\(s\)$/) do |pid, site_name_list|
  @@pid_site_list_not_sync = TestSupport.pid_site_list_not_sync
  vx_sync = VxSync.new
  vx_sync.check_pid_if_found_list_not_sync(pid, site_name_list)
  
  # p status_path = "#{base_url}/status/#{pid}?detailed=true"  
  base_url = DefaultLogin.vx_sync_url
  
  
  base_url = DefaultLogin.vx_sync_url
  if (pid.include? "9E7A") || (pid.include? "C877")
    p sync_path = "#{base_url}/sync/doLoad?pid=#{pid}"
    p status_path = "#{base_url}/sync/status?pid=#{pid}"
  else
    p sync_path = "#{base_url}/sync/doLoad?icn=#{pid}"
    p status_path = "#{base_url}/sync/status?icn=#{pid}"
  end
  
  max_wait_time = 300
  @@response = nil
  sync_requested_status = vx_sync.check_patient_if_has_been_synced(status_path, site_name_list)

  if sync_requested_status == "Campleted"
    p "The patient has been synced"
  elsif sync_requested_status == "Requested_Not_Completed"
    p "The patient has been synced but the sync is not completed yet!"
    @waiting_message = "Waiting for syncing to be completed at site:"
    sync_completed = vx_sync.check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)
  else
    p "The patient has not been synced yet"
    response = vx_sync.sync_request(sync_path)
    expected_code_and_error_mesg = [202, "The patient has not been synced yet and the sync request is failed!"]
    vx_sync.response_handler(response, expected_code_and_error_mesg)
    
    @waiting_message = "Waiting for syncing to be completed at site:"
    sync_completed = vx_sync.check_status_until_sync_process_completed(status_path, site_name_list, check_opd_pendeing = false, max_wait_time)
  end
  
  vx_sync.save_pid_and_site_not_sync(pid) if sync_completed == false
  # p @@pid_site_list_not_sync
  fail "The sync did not complete for site(s): \n #{@site_is_not_sync}" if sync_completed == false
  @response = @@response 
end

When(/^the client requests operational sync status for "(.*?)" site$/) do |site_name|
  operational_sync_completed = false
  base_jds_url = DefaultLogin.jds_url
  p opd_path = "#{base_jds_url}/statusod/#{site_name}"
  vx_sync = VxSync.new

  json = vx_sync.find_sync_status_body(opd_path)
  if json != nil && json["completedStamp"] !=nil
    operational_sync_completed = true
    p "This is the responce when testing the OPD for site #{site_name} >>>> #{JSON.parse(@@response.body)}"
  else
    operational_sync_completed = vx_sync.wait_until_site_operational_sync_is_completed(base_jds_url, site_name)
    p "********** Operational data has been synced for #{site_name} **********"
    p "This is the responce when testing the OPD for site #{site_name} >>>> #{JSON.parse(@@response.body)}"
  end
  fail "The operational sync did not complete for site: \n #{site_name}" unless operational_sync_completed
end

Then(/^the operational data results contain different domains from "(.*?)"$/) do |site_name, table|
  missing_domain = ""
  json_object = JSON.parse(@@response.body)
  table.rows.each do |domain, k|
    domain_runtime = json_object["completedStamp"]["sourceMetaStamp"][site_name]["domainMetaStamp"]
    missing_domain = missing_domain + " \n" + domain if domain_runtime.nil? || domain_runtime[domain].nil? || domain_runtime[domain].empty?
  end
  fail "The operational data for #{site_name} site has missing dimain(s): #{missing_domain}" unless missing_domain.empty?
end
