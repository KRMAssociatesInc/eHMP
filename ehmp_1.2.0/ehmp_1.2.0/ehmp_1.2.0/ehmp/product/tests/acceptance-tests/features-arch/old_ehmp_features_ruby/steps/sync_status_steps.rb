Given(/^the patient\(s\) with pid$/) do |table|
  @table_list = table.rows
  @unsync_list = []
  @unsync_pid_uncomplete = []
  @list_check_sync_status_pid = @table_list
end

Given(/^unsync patient\(s\) from above pid$/) do
  p "Wait ... un-sync patient"
  unsync_or_select_patient_have_not_been_sync_w_pid("unsync_patient", 200)
  puts "This is a patient list that the unsync process compeleted:" + $RS + "'#{@unsync_pid_complete}'" + $RS + " "
  puts "This is a patient list that the unsync process did not compelete:" + $RS + "'#{@unsync_pid_uncomplete}'"
  @table_list = @unsync_pid_complete
end

Given(/^select patient\(s\) from above pid that have not been synced$/) do
  @unsync_pid_uncomplete = []
  p "Wait ...check sync status"
  unsync_or_select_patient_have_not_been_sync_w_pid("select_unsync_patient", 404)  
  puts "This is a patient list that the that have not been synced:" + $RS + "'#{@unsync_pid_complete}'" + $RS + " "
  puts "This is a patient list that the that have been synced:" + $RS + "'#{@unsync_pid_uncomplete}'"
  @table_list = @unsync_pid_complete
end

When(/^the client requests sync for a patient with above pid every (\d+) second$/) do |timeout|
  default_timeout = timeout.to_i
  p @table_list.size
  p 'Wait ...Check sync status'
  p "There is no patient on the list to send the sync request!" unless @table_list.size > 0
  @table_list.each do |pid, k|
    p "Sync requests sent for '#{pid}'"
    base_url = DefaultLogin.fhir_url
    path = "#{base_url}/admin/sync/#{pid}"
    # p path
    begin
      response = HTTPartyWithBasicAuth.put_with_authorization(path, default_timeout)
    rescue Timeout::Error
      p ""
    end
  end
end

Then(/^the patient\(s\) with above pid should sync within (\d+) minute$/) do |timeout|
  default_timeout = timeout.to_i * 60
  p current_time = Time.new
  old_time = Time.new
  @pid_not_sync = []
  @pid_not_sync_w_status = []
  patient_list_for_sync = @list_check_sync_status_pid
  table = @list_check_sync_status_pid
  # fail "There is no patient on the list to send the sync request!" unless table.size > 0
  while (table.size > 0) && (old_time - current_time < default_timeout)
    p table.size
    @pid_not_sync_yet_w_status = []
    @pid_not_sync_yet = []
    p old_time
    @chech_404_time_index = (old_time - current_time)/60
    check_sync_status_for_pid(table)
    table = @pid_not_sync_yet
    old_time = Time.new
    pid_not_sync = @pid_not_sync + @pid_not_sync_yet
    pid_sync_status = @pid_not_sync_w_status + @pid_not_sync_yet_w_status
    p "The sync process at '#{(old_time - current_time)/60}' minute"
    p "The number of patient have been synced '#{patient_list_for_sync.size - pid_not_sync.size}' from total of '#{patient_list_for_sync.size}'"
    p "This is a patient list that the sync process did not compelete yet:" 
    p @pid_not_sync_yet
    p "****************************************************************"
  end
  pid_not_sync = @pid_not_sync + @pid_not_sync_yet
  pid_sync_status = @pid_not_sync_w_status + @pid_not_sync_yet_w_status
  puts "The sync compeleted on '#{(old_time - current_time)/60}' minute"
  puts "The number of patient have been synced '#{patient_list_for_sync.size - pid_not_sync.size}' from total of '#{patient_list_for_sync.size}'"
  puts "****************************************************************"
  note_mes = "This is a patient list that the unsync process did not compelete:" + $RS + "'#{@unsync_pid_uncomplete}'"
  # puts note_mes unless @unsync_pid_uncomplete.empty?
  error_message = "This is a patient list that the sync process did not compelete withen '#{timeout}' minute: \n '#{pid_not_sync}' \n more detiles: \n '#{pid_sync_status}'"
  fail error_message if @pid_not_sync.size > 0 || old_time - current_time > default_timeout 
end

def check_sync_status_for_pid(table)
  sync_timed_out = false 
  table.each do |pid, k|
    # p pid
    @response = {}
    base_url = DefaultLogin.fhir_url
    path = "#{base_url}/admin/sync/#{pid}"
    
    begin
      @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    rescue Timeout::Error
      p "Sync timed out"
      sync_timed_out = true
    end
    
    if sync_timed_out == true
      @pid_not_sync_yet_w_status << [pid] + ['Unsync timed out']
      @pid_not_sync_yet << pid
    else
      # p @response.code
      check_sync_response_code(pid)
    end
  end
end

def check_sync_response_code(pid)
  if @response.code == 404 && @chech_404_time_index > 3
    # p "'#{@response.code}'  '#{@chech_404_time_index}'"
    @pid_not_sync << pid
    @pid_not_sync_w_status << [pid] + [@response.code]
  elsif @response.code == 200 
    site_sync_status = find_sync_status
    site_sync = site_sync_status[1].all? { |staus| staus == true }
    unless site_sync
      @pid_not_sync_yet << pid
      @pid_not_sync_yet_w_status << pid 
      @pid_not_sync_yet_w_status << site_sync_status
    end
  else
    @pid_not_sync_yet << pid
    @pid_not_sync_yet_w_status << [pid] + [@response.code]
  end
end

def find_sync_status
  site_sync_complete = []
  site_names = []
  site_names = @response['data']['items'][0]['syncStatusByVistaSystemId'].keys
  site_names.each do |site_name|
    site_sync_complete << @response['data']['items'][0]['syncStatusByVistaSystemId'][site_name]['syncComplete']
  end
  return site_names, site_sync_complete
end

def unsync_or_select_patient_have_not_been_sync_w_pid(function, exp_code)
  @unsync_pid_complete = []
  sync_timed_out = false
  @table_list.each do |pid, k|
    base_url = DefaultLogin.fhir_url
    path = "#{base_url}/admin/sync/#{pid}"
    # p path
    if function == "unsync_patient"
      begin
        response = HTTPartyWithBasicAuth.delete_with_authorization(path)
      rescue Timeout::Error
        p "sync timed out"
        sync_timed_out = true
      end
    end
    if function == "select_unsync_patient"
      begin
        response = HTTPartyWithBasicAuth.get_with_authorization(path)
      rescue Timeout::Error
        p "Unsync timed out"
        sync_timed_out = true
      end
    end
    find_unsync_status(pid, sync_timed_out, response, exp_code)   
  end
end

def find_unsync_status(pid, sync_timed_out, response, ex_code)
  p " '#{pid}' - '#{sync_timed_out}' - '#{response.code}' - '#{ex_code}'" if sync_timed_out == false
  p " '#{pid}' - '#{sync_timed_out}' - time out - '#{ex_code}'" if sync_timed_out == true
  if sync_timed_out == false && response.code == ex_code
    @unsync_pid_complete << pid
  elsif sync_timed_out == true
    @unsync_pid_uncomplete << [pid] + ['Unsync timed out']
  else
    @unsync_pid_uncomplete << [pid] + [response.code]
  end   
end
