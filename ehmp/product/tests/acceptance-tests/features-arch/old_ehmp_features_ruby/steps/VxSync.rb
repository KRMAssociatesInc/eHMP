require "TestSupport.rb"

class VxSync
  
  def save_pid_and_site_not_sync(pid)
    pid_site_list_not_sync = []
    pid_site_list_not_sync << pid
    
    @site_is_not_sync.each do |site|
      pid_site_list_not_sync << site
    end
    
    @@pid_site_list_not_sync << pid_site_list_not_sync
  end
  
  def check_pid_if_found_list_not_sync(pid, site_name_list)
    found_pid = @@pid_site_list_not_sync.assoc(pid)
    unless found_pid == nil
      site_names = site_name_list.split";"
      
      site_names.each do |site_name|
        fail "The sync for this patient #{pid} has been failed befor!" if found_pid.include? site_name
      end
      
    end
  end
  
  def response_handler(response, expected_code_and_error_mesg)
    expected_code = expected_code_and_error_mesg[0]
    error_mesg = expected_code_and_error_mesg[1]
   
    fail error_mesg + " \n Expected code #{expected_code}, received #{response.code} \n response body: #{response.body}" unless response.code == expected_code  
  end
  
  def sync_request(path)
    #Check that the operational
    unless TestSupport.operational_data_synced 
      fail "The operational data sync failed. \n Before requesting any patient sync, the operational data sync should be completed." if TestSupport.operational_sync_been_checked
      wait_until_operational_sync_is_completed(DefaultLogin.jds_url)
      p "********** Operational data has been synced for VistA **********"
    end
    
    @error = nil
    response = nil
    default_timeout = 60
    start_time = Time.new
    
    begin
      response = HTTPartyWithBasicAuth.get_with_authorization(path, default_timeout)
      success_result = true
    rescue Exception => e
      puts "An error has occured at Sync request."
      puts e
      response = e
      success_result = false
    end
    
    p "Waited #{Time.new - start_time} secs"
    fail "The Sync request is failed! \n#{response}" if success_result == false
    
    return response
  end
  
  def check_patient_if_has_been_synced(path, site_name_list)
    @site_is_sync = []
    sync_requested_status = "Not_Requested"
    sync_site = false
    sync_jobs = false
    site_names = site_name_list.split";"
    # p site_names
    json = find_sync_status_body(path)    
    # p "find_sync_status_body #{response[0]}"
    # json = find_json_body_for_succeess_code(response)
    # p "find_json_body_for_succeess_code"
    sync_site = check_all_sites_sync_completed(json, site_names) if @@response.code == 200
    sync_jobs = check_pending_sync_jobs(json) if @@response.code == 200
      
    sync_completed = sync_site & sync_jobs
    
    if sync_completed == true
      sync_requested_status = "Campleted"
    else
      sync_requested_status = "Requested_Not_Completed" if json != nil && json["syncStatus"] != nil
    end
    
    return sync_requested_status
  end
  
  def check_status_until_sync_process_completed(path, site_name_list, check_opd_pendeing, max_wait_time = 90)
    @site_is_sync = []
    @old_inprogress_result = {}
    @old_job_status_result = {}
    @initial_old = false
    @index = 0
    @index_job_status = 0
    sleep_time = 10
    max_index_run = max_wait_time / sleep_time
    sync_completed = false
    run_time = 0
    site_names = site_name_list.split";"
    @site_is_not_sync = site_names
    start_time = Time.new
    # while sync_completed == false && run_time < max_run_time
    i=0
    while sync_completed == false && @index < max_index_run && @index_job_status < max_index_run
      sync_site = false
      sync_jobs = false
      p '-'*100
      p "loop number #{i += 1}"
      # p @@response.code
      json = find_sync_status_body(path)
      p json
      sync_site = check_all_sites_sync_completed(json, site_names) if @@response.code == 200
      sync_jobs = check_pending_sync_jobs(json) if @@response.code == 200
      
      sync_completed = sync_site & sync_jobs if check_opd_pendeing == false
      sync_completed = sync_site & !sync_jobs if check_opd_pendeing == true
      
      site_names = @site_is_not_sync if sync_completed
      
      run_time = Time.new - start_time
      p @waiting_message if sync_completed == false
      p site_names unless site_names.empty?
      p "Waited #{run_time} secs"
      if sync_completed == false
        check_if_inprogress_still_have_change(json)
        sleep sleep_time
      end
    end 
    return sync_completed
  end
  
  def find_sync_status_body(path)
    @@response = nil
    json = nil
    default_timeout = 60
    success_result = false
    # start_time = Time.new
    
    @@response = HTTPartyWithBasicAuth.get_with_authorization(path, default_timeout)
    
    if @@response == nil
      fail "The Sync Status is failed! \n An error has occured at Sync Status" 
    else
      json = JSON.parse(@@response.body) if @@response.code == 200
    end
    
      
    # begin
      # @response = HTTPartyWithBasicAuth.get_with_authorization(path, default_timeout)
      # success_result = true
      # json = JSON.parse(@response.body) 
    # rescue Exception => err
      # puts "An error has occured at Sync Status."
      # puts err
      # success_result = false
    # end
    # p @response
    # fail "The Sync Status is failed! \n#{err}" if success_result == false
    return json
  end
  
  def check_all_sites_sync_completed(json, site_names)
    @site_is_not_sync = []
    all_sites_sync_completed = false
  
    site_names.each do |site_name|
      single_site_sync_completed = false
      site_name = site_name.upcase
      
      single_site_sync_completed = check_single_site_sync_completed(json, site_name)
      if single_site_sync_completed
        @site_is_sync << site_name unless @site_is_sync.include? site_name
      else
        @site_is_not_sync << site_name unless @site_is_sync.include? site_name
      end
    end
    all_sites_sync_completed = true if @site_is_not_sync.empty?
    # p @site_status if sync_completed == false
    return all_sites_sync_completed
  end
  
  def check_single_site_sync_completed(json, site_name)
    site_sync_completed = false
    if json["syncStatus"] != nil
      json = json["syncStatus"]
    end
    
    begin
      site_sync_completed = json["completedStamp"]["sourceMetaStamp"][site_name]["syncCompleted"]
    rescue
      site_sync_completed = false
    end 
     
    return site_sync_completed
  end
  
  def check_if_inprogress_still_have_change(json)
    
    if @@response.code == 200
      inprogress_result = find_inprogress_result(json)
      # initial_old_inprogress_result(inprogress_result) if @initial_old == false
      comper_old_with_runtime(inprogress_result) #if @initial_old == true
      check_if_job_status_still_have_change(json) #if @initial_old == true
    else
      check_inprogress_not_200
    end
      
  end
  
  def check_inprogress_not_200
    p "Waiting for results. Expected response code 200, received #{@@response.code}"
    @initial_old = false
    @index += 1
  end
  
  def find_inprogress_result(json)
    inprogress_result = {}
    if json["syncStatus"] != nil
      json = json["syncStatus"]
    end
    site_names = @site_is_not_sync
    site_names.each do |site_name|
      site_sync_completed = false
      site_name = site_name.upcase
      
      begin
        json_site = json["inProgress"]["sourceMetaStamp"][site_name]
        inprogress_result[site_name] = json_site
      rescue
        inprogress_result[site_name] = json
      end 
      
    end
      
    return inprogress_result
  end
  
  def initial_old_inprogress_result(inprogress_result)
    @old_inprogress_result = inprogress_result
    @initial_old = true
  end
  
  def comper_old_with_runtime(inprogress_result)
    same_set = false
    site_names = inprogress_result.keys
    p "Site has been sync #{@site_is_sync}"
    # p "Site has NOT been sync #{@site_is_not_sync}" 
    p " Site in progress #{inprogress_result.keys}"
    # p " old Site in progress #{@old_inprogress_result.keys}"
    
    site_names.each do |site_name|
   
      if inprogress_result[site_name] == @old_inprogress_result[site_name]
        # p "same result for #{site_name}"
        @index += 1 unless same_set
        same_set = true
      else
        p "New rsult is coming for site #{site_name}"
        @index = 0
        @index_job_status = 0
        @old_inprogress_result[site_name] = inprogress_result[site_name]
      end
      
    end
  end
  
  def wait_until_operational_sync_is_completed(base_url)
    p "Check the operational sync"
    pan_operational_sync_completed = false
    kod_operational_sync_completed = false
    not_sync_site = ""
    
    site_name = "9E7A"
    pan_operational_sync_completed = wait_until_site_operational_sync_is_completed(base_url, site_name)
    if pan_operational_sync_completed
      p "The operational sync is completed for site #{site_name}"
      p "This is the responce when syncing the OPD for Panorama \n #{JSON.parse(@@response.body)}"
    else
      p "The operational sync did NOT complete for site #{site_name}"
      not_sync_site = site_name + "\n " 
    end
    
    site_name = "C877"
    kod_operational_sync_completed = wait_until_site_operational_sync_is_completed(base_url, site_name)
    if kod_operational_sync_completed
      p "The operational sync is completed for site #{site_name}"
      p "This is the responce when syncing the OPD for Kodak \n #{JSON.parse(@@response.body)}"
    else
      p "The operational sync did NOT complete for site #{site_name}"
      not_sync_site = not_sync_site + site_name
    end
    
    @@operational_sync_been_checked = true
    if pan_operational_sync_completed == true && kod_operational_sync_completed == true
      @@operational_data_synced = true 
    else
      fail "The operational sync did not complete for site: \n #{not_sync_site}" 
    end
    
  end
  
  def wait_until_site_operational_sync_is_completed(base_url, site_name)
    operational_sync_start = false 
    operational_sync_completed = false
    @waiting_message = "Waiting for operational Data to be completed for site:#{site_name}"
    p opd_path = "#{base_url}/statusod/#{site_name}"
     
    operational_sync_completed = check_status_until_sync_process_completed(opd_path, site_name, check_opd_pendeing = true, max_wait_time = 300)
    
    return operational_sync_completed
  end
  
  def check_pending_sync_jobs(json)
    json = json["jobStatus"]
    if json == nil
      p "Job Status is NIL"
      return false
    end
    if json.empty?
      p "Job Status array is empty"
      return true
    end
    p "Job Status array is not empty"
    return false
  end
  
  def check_if_job_status_still_have_change(json)
    json = json["jobStatus"]
    unless json == nil
      job_status_result = find_job_status_result(json)
      comper_old_with_runtime_job_status(job_status_result) 
    end
  end
  
  def find_job_status_result(json)
    begin
        job_status = json["jobStatus"]
      rescue
        job_status = nil
      end 
      
    return job_status
  end
  
  def comper_old_with_runtime_job_status(job_status_result)
    if job_status_result == @old_job_status_result
      @index_job_status += 1 
    else
      p "New rsult is coming for Job status"
      @index = 0
      @index_job_status = 0
      @old_job_status_result = job_status_result
    end
  end
end
