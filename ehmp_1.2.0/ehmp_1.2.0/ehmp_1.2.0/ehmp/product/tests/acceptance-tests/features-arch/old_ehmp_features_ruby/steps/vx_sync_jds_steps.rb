path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests "(.*?)" for the patient "(.*?)" in VPR format$/) do |domain, pid|
  all_domains = { 
    "ALLERGIES" => "allergy", "LABS" => "lab", "VITALS" => "vital", "ORDERS" => "order", "VLER DOCUMENT" => "vlerdocument", 
    "MEDS" => "med", "CONSULT" => "consult", "PROBLEM LIST" => "problem", "PROCEDURE" => "procedure", 
    "PURPOSE OF VISIT" => "pov", "DOCUMENT" => "document", "APPOINTMENT" => "appointment", "PATIENT DEMOGRAPHICS" => "patient",
    "EDUCATION" => "education", "VISIT" => "visit", "FACTOR" => "factor", "CPT" => "cpt", "SURGERY" => "surgery",
    "SKIN" => "skin", "MENTAL HEALTH" => "mh", "EXAM" => "exam", "IMMUNIZATIONS" =>"immunization", "IMAGE" => "image" 
  }
  domain = all_domains[domain.upcase]
  fail "Please check your step ruby file. \n This domain does not specify in our test." if domain.nil? || domain.empty? 

  base_url = DefaultLogin.jds_url
  p path = "#{base_url}/vpr/#{pid}/find/#{domain}"
  
  
  @response = nil
  default_timeout = 260
  # start_time = Time.new
  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path, default_timeout)
  rescue Timeout::Error
    p "Sync timed out"
  end
  # p "Waited #{Time.new - start_time} secs"
   
  if @response.nil?
    response_code = "Nil"
    response_body = "Nil"
  else
    response_code = @response.code
    response_body = @response.body
  end
   
  fail "Expected response code 200, received #{response_code} \n response body: #{response_body}" unless response_code == 200
end

Then(/^the JDS results contain "(.*?)"$/) do |not_used, table|
  json_object = JSON.parse(@response.body)
  result_array = json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end

Then(/^the sync status results for "(.*?)" site\(s\) contain$/) do |site_name, table|
  not_match = []
  json_object = JSON.parse(@response.body)

  result_array = json_object["syncStatus"]["completedStamp"]["sourceMetaStamp"][site_name.upcase]["domainMetaStamp"]
  
  table.rows.each do |domain, exp_sync_complete|
    match_result = false
    if result_array[domain.downcase] == nil
      not_match << 'There is no such domain found: ' + domain + ' Expected: ' + count 
    else
      runtime_value = result_array[domain.downcase]["syncCompleted"]
      match_result = true if runtime_value.to_s.upcase == exp_sync_complete.upcase
      error = domain + " >> syncCompleted   Expected: #{exp_sync_complete} \n  got: #{runtime_value.to_s}"
      not_match << error unless match_result
    end
  end
  red_flag_error(not_match) unless not_match.empty?
end

Then(/^the client receives (\d+) record\(s\) for site "(.*?)"$/) do |records, site_name|
  fail "Expected response code 200, received #{@response.code}: response body #{@response.body}" unless @response.code == 200
  json_object = JSON.parse(@response.body)
  json_object = json_object["data"]["items"]
  if json_object.size > 0
    record_count = find_record_count(json_object, site_name)
  else
    record_count = 0
  end
  expect(record_count.to_s).to eq(records) 
end

def red_flag_error(not_match)
  text_error_message = ''
  i = 0
  not_match.each do |error|
    i += 1
    text_error_message = text_error_message + i.to_s + "- " + error + "\n\n"
  end
  fail text_error_message
end

def find_record_count(json_object, site_name)
  record_count = 0
  json_object.each do |record_object|
    record_count += 1 if record_object["pid"].include? site_name
  end
  return record_count
end
