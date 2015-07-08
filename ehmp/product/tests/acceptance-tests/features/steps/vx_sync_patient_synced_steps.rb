Then(/^the client receives the stamp time \- the indicator 'synced as of X date' for "(.*?)" site\(s\)$/) do |site_list|
  json_object = JSON.parse(@response.body)
  result_array = json_object["syncStatus"]["completedStamp"]["sourceMetaStamp"]
  site_names = site_list.split";"
  site_name_with_no_stamp_time = []
  
  site_names.each do |site_name|
    site_name = site_name.upcase

    begin
      stamp_time = result_array[site_name]["stampTime"]
      site_name_with_no_stamp_time << site_name unless stamp_time.is_a? Fixnum
    rescue
      site_name_with_no_stamp_time << site_name
    end
    
  end
  
  fail "There is no valid stampTime value for site(s): \n #{site_name_with_no_stamp_time}" unless site_name_with_no_stamp_time.empty?
end

Then(/^the client receives "(.*?)" message in the "(.*?)" attribute$/) do |message, attribute|
  if attribute.upcase == "BODY"
    fail "Expected: #{message} \n got: #{@response.body} " unless @response.body.include? message
  elsif attribute.upcase == "STATUS"
    json_object = JSON.parse(@response.body)
    fail "Expected: #{message} \n got: #{@response.body} " unless json_object["status"] == message.downcase
  else
    fail "Undefined attribute. Please check your steps."
  end
  
end

Then(/^the client receives the data stored for that patient along with currently sync in progress status$/) do
  json_object = JSON.parse(@response.body)
  sync_status = json_object["syncStatus"].empty?
  job_status = json_object["jobStatus"].empty?
  in_progress = json_object["syncStatus"]["inProgress"].nil?
  completed_tamp = json_object["syncStatus"]["completedStamp"].nil?
  
  fail "The sync and job status should not be empty! \n #{json_object}" if sync_status && job_status
  fail "The inProgress or completedStamp should not be empty when the sync status is not! \n #{json_object}" if !sync_status && in_progress && completed_tamp
  
end

