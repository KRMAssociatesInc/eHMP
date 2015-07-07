require "VxSync.rb"

Given(/^the patient\(s\) with pid$/) do |table|
  @pid_site_list = table.rows
  @unsync_list = []
  @sync_but_uncomplete = []
  @sync_completed_list = []
  @sync_request_failed_list = []
  @uncomplete_with_no_inprogress = []
  @index = 0
end

Given(/^select patient\(s\) from above pid that have not been synced$/) do
  vx_sync = VxSync.new
  base_url = DefaultLogin.vx_sync_url
  @pid_site_list.each do |pid, site_name_list|
    p "-" * 80
    p pid + "----" + site_name_list
    if (pid.include? "9E7A") || (pid.include? "C877")
      sync_path = "#{base_url}/sync/doLoad?pid=#{pid}"
      status_path = "#{base_url}/sync/status?pid=#{pid}"
    else
      sync_path = "#{base_url}/sync/doLoad?icn=#{pid}"
      status_path = "#{base_url}/sync/status?icn=#{pid}"
    end
    
    sync_requested_status = vx_sync.check_patient_if_has_been_synced(status_path, site_name_list)
    if sync_requested_status == "Campleted"
      p "* The patient has been synced *"
      @sync_completed_list << [pid, site_name_list]
    elsif sync_requested_status == "Requested_Not_Completed"
      p "** The patient has been synced but the sync is not completed yet! **"
      @sync_but_uncomplete << [pid, site_name_list]
    else
      p "*** The patient has not been synced yet ***"
      @unsync_list << [pid, site_name_list]
    end 
  end
  p @sync_completed_list
  p @sync_but_uncomplete
  p @unsync_list
end

When(/^the client requests sync for a patient with above pid every (\d+) second$/) do |sleep_time|
  p "the client requests sync for a patient"
  vx_sync = VxSync.new
  base_url = DefaultLogin.vx_sync_url
  @@operational_data_synced = false
  p "Starting time #{Time.now} "
  
  @unsync_list.each do |pid, site_name_list|
    p "-" * 80
    p "Sending sync request for: " + pid
    
    if (pid.include? "9E7A") || (pid.include? "C877")
      p sync_path = "#{base_url}/sync/doLoad?pid=#{pid}"
    else
      p sync_path = "#{base_url}/sync/doLoad?icn=#{pid}"
    end
      
    response = vx_sync.sync_request(sync_path)
    @sync_request_failed_list << [pid, site_name_list] unless response.code == 202
    sleep sleep_time.to_i
  end
end

Then(/^the patient\(s\) with above pid should sync$/) do
  @@response = nil
  @old_inprogress_array = []
  @old_inprogress_hash = {} 
  sleep_time = 180
  vx_sync = VxSync.new
  base_url = DefaultLogin.vx_sync_url
  pid_list_to_check_sync_status = @sync_but_uncomplete + @unsync_list - @sync_request_failed_list
  index = 0
  time_for_sleep = Time.now
  p "Starting time #{Time.now} "
  
  until pid_list_to_check_sync_status.empty? #&& index < 3
    p "********** loop #{@index} ************************************"
    @index += 1 
    
    @sync_but_uncomplete = []
  
    pid_list_to_check_sync_status.each do |pid, site_name_list|
      
      if (pid.include? "9E7A") || (pid.include? "C877")
        status_path = "#{base_url}/sync/status?pid=#{pid}"
      else
        status_path = "#{base_url}/sync/status?icn=#{pid}"
      end
      
      sync_requested_status = vx_sync.check_patient_if_has_been_synced(status_path, site_name_list)
      if sync_requested_status == "Campleted"
        p "The patient has been synced"
        @sync_completed_list << [pid, site_name_list]
      elsif sync_requested_status == "Requested_Not_Completed"
        p "The patient has been synced but the sync is not completed yet!"
        check_if_inprogress_still_have_change(pid, site_name_list)
        @sync_but_uncomplete << [pid, site_name_list]
        
      else
        p "The patient has not been synced yet"
        @sync_request_failed_list << [pid, site_name_list]
      end 
    end
    p "Sync completed for the below patients list: "
    p @sync_completed_list
    p @sync_completed_list.size
    
    p "Waiting for the below patients list to get completed: "
    p pid_list_to_check_sync_status = @sync_but_uncomplete - @sync_request_failed_list - @uncomplete_with_no_inprogress
    p pid_list_to_check_sync_status.size
    
    sleep sleep_time if  time_for_sleep - Time.now < sleep_time
    time_for_sleep = Time.now
  end
  p "End time #{Time.now}"
  p "The patient list size"
  p @pid_site_list.size
  p '---'
  p "Sync completed for: "
  p @sync_completed_list
  p @sync_completed_list.size
  p '---'
  p "Sync did not completed for: "
  p @sync_but_uncomplete
  p @sync_but_uncomplete.size
  p '---'
  p "Sync did not requested for: "
  p @unsync_list
  p @unsync_list.size
  p '---'
  p "Sync request faile for: "
  p @sync_request_failed_list
  p @sync_request_failed_list.size
  p "Sync did not completed and there is no change inprogress for: "
  p @uncomplete_with_no_inprogress
  p @uncomplete_with_no_inprogress.size
  
end

def check_if_inprogress_still_have_change(pid, site_name_list)
  old_inprogress_array = nil
  old_inprogress = nil
  inprogress_result = []
  # sleep_time = 5
  max_waiting_time_sec = 3000
  p "="*100
  
  json = JSON.parse(@@response.body)
  inprogress_result = [json["syncStatus"], json["jobStatus"]]
  
  old_inprogress_array = @old_inprogress_array.assoc(pid)
  old_inprogress = old_inprogress_array[1] unless old_inprogress_array == nil
  if old_inprogress_array == nil
    time_old_inprogress = 0
  else
    time_old_inprogress = old_inprogress_array[2]
  end
     
  
  if inprogress_result == old_inprogress
    p "same result for #{pid}"
    old_inprogress_array = nil
    p waiting_time = Time.new - time_old_inprogress
    # sleep sleep_time if  waiting_time < sleep_time * @index
    @uncomplete_with_no_inprogress << [pid, site_name_list] if waiting_time > max_waiting_time_sec
    
  else
    p "New result is coming for #{pid}"
    p Time.new
    # @index = 0
    @old_inprogress_array = @old_inprogress_array - [old_inprogress_array] unless old_inprogress_array == nil     
    @old_inprogress_array << [pid, inprogress_result, Time.new]
    # p @old_inprogress_hash = Hash[@old_inprogress_array]
  end
  
end
