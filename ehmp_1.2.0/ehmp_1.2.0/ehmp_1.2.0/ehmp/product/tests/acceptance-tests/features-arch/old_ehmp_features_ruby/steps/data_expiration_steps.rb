path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

Then(/^the sync status for patient contain:$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end

Given(/^the patient "(.*?)" be cleared from the cache successfully$/) do |pid|
  base_url = DefaultLogin.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  response_code = 0
  run_index = 0
  while response_code != 404 && run_index < 3
    p run_index =+1
    begin
      @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    rescue Timeout::Error
      p "Sync timed out"
    end
    response_code = @response.code
  end 
  expect(@response.code).to eq(404), "Expected response code 404, received #{@response.code}: response body #{@response.body}"
  p "The patient be cleard from the cache"
end

# Then(/^the value of "(.*?)" is "(.*?)" hours after the value of "(.*?)" for site "(.*?)"$/) do |ex_expires_on, ex_hours, ex_last_sync_time, site_name|
Then(/^the value of "(.*?)" is "(.*?)" hour\(s\) \+\/\- "(.*?)" minute\(s\) after the value of "(.*?)" for site "(.*?)"$/) do |ex_expires_on, ex_hours, dt_max_min, ex_last_sync_time, site_name|
  error_msg = "If this scenario fail, please check -chef.json in the vagrantfile. \n"
  error_msg =  error_msg + "This scenario will verify the default expire time for the secondary sites. \n"
  error_msg =  error_msg + "The default expire time set 48 hour for DoD, 8 hours for OCD5 and 24 hours for DAS. \n"
  dt_max_second = dt_max_min.to_i * 60
  @json_object = JSON.parse(@response.body)
  runtime_json_object = @json_object["data"]["items"]

  find_json = FindJsonValueForField.new
  fields_name = 'syncStatusByVistaSystemId.'+ site_name + '.'+ ex_last_sync_time
  last_sync_time = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)
  fields_name = 'syncStatusByVistaSystemId.'+ site_name + '.' + ex_expires_on
  expires_on = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)
  
  last_sync_time = Time.parse(last_sync_time)
  expires_on = Time.parse(expires_on)
  dt = (expires_on-last_sync_time)/(60*60)
  
  dt_abs = (dt-ex_hours.to_i).abs
  # expect(dt_abs).to be < 0.1, error_msg
  expect(dt_abs * 60 * 60).to be < dt_max_second , "Expected: #{ex_hours} \n got: #{dt} \n the difference is more than #{dt_max_second} second. \n" + error_msg
end

Then(/^the value of "(.*?)" is after "(.*?)" for site "(.*?)"$/) do |ex_expires_on, ex_old_expiration, site_name|
  @json_object = JSON.parse(@response.body)
  runtime_json_object = @json_object["data"]["items"]

  find_json = FindJsonValueForField.new
  fields_name = 'syncStatusByVistaSystemId.'+ site_name + '.' + ex_expires_on
  current_expiration = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)

  old_value = Time.parse(ex_old_expiration)
  current_value = Time.parse(current_expiration)
  expect(current_value).to be > old_value
end

Then(/^the value of "(.*?)" is before "(.*?)" for site "(.*?)"$/) do |ex_expires_on, ex_old_expiration, site_name|
  @json_object = JSON.parse(@response.body)
  runtime_json_object = @json_object["data"]["items"]

  find_json = FindJsonValueForField.new
  fields_name = 'syncStatusByVistaSystemId.'+ site_name + '.' + ex_expires_on
  current_expiration = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)

  old_value = Time.parse(ex_old_expiration)
  current_value = Time.parse(current_expiration)
  expect(current_value).to be < old_value
end

When(/^manual expiration is called for patient with icn "(.*?)" and site "(.*?)"$/) do |icn, site_name|
  # https://10.3.3.4:8443/sync/expire?icn=10108V420871&vistaId=DOD&time=20140916170917.999
  base_url = DefaultLogin.hmp_url
  p path = "#{base_url}/sync/expire?icn=#{icn}&vistaId=#{site_name}"
  user = "9E7A;500"
  pass = "pu1234;pu1234!!"
  begin
    @response = HTTPartyWithBasicAuth.post_with_authorization_for_user(path, user, pass)
  rescue Timeout::Error
    p "Sync timed out"
    sync_timed_out = true
  end
end

When(/^the client requests manual expiration time "(.*?)" for patient with icn "(.*?)" and site "(.*?)"$/) do |time, icn, site_name|
  # https://10.3.3.4:8443/sync/expire?icn=10108V420871&vistaId=DOD&time=20140916170917.999
  base_url = DefaultLogin.hmp_url
  p path = "#{base_url}/sync/expire?icn=#{icn}&vistaId=#{site_name}&time=#{time}"
  user = "9E7A;500"
  pass = "pu1234;pu1234!!"
  begin
    @response = HTTPartyWithBasicAuth.post_with_authorization_for_user(path, user, pass)
  rescue Timeout::Error
    p "Sync timed out"
    sync_timed_out = true
  end
end

When(/^manual expiration is called for patient with dfn "(.*?)" and site "(.*?)"$/) do |dfn, site_name|
  # https://10.3.3.4:8443/sync/expire?dfn=10108V420871&vistaId=DOD&time=20140916170917.999
  base_url = DefaultLogin.hmp_url
  p path = "#{base_url}/sync/expire?dfn=#{dfn}&vistaId=#{site_name}"
  user = "9E7A;500"
  pass = "pu1234;pu1234!!"
  begin
    @response = HTTPartyWithBasicAuth.post_with_authorization_for_user(path, user, pass)
  rescue Timeout::Error
    p "Sync timed out"
    sync_timed_out = true
  end
end

When(/^the client requests manual expiration time "(.*?)" for patient with dfn "(.*?)" and site "(.*?)"$/) do |time, dfn, site_name|
  # https://10.3.3.4:8443/sync/expire?dfn=10108V420871&vistaId=DOD&time=20140916170917.999
  base_url = DefaultLogin.hmp_url
  p path = "#{base_url}/sync/expire?dfn=#{dfn}&vistaId=#{site_name}&time=#{time}"
  user = "9E7A;500"
  pass = "pu1234;pu1234!!"
  begin
    @response = HTTPartyWithBasicAuth.post_with_authorization_for_user(path, user, pass)
  rescue Timeout::Error
    p "Sync timed out"
    sync_timed_out = true
  end
end

Given(/^save the last sync time for site "(.*?)" and wait for (\d+) second$/) do |site_name, sleep_time|
  @json_object = JSON.parse(@response.body)
  runtime_json_object = @json_object["data"]["items"]

  find_json = FindJsonValueForField.new
  fields_name = "syncStatusByVistaSystemId."+ site_name + ".lastSyncTime"
  p last_sync_time = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)
  p @last_sync_time = Time.parse(last_sync_time)
  sleep sleep_time.to_i
end

Then(/^the last sync time should get updated for site "(.*?)"$/) do |site_name|
  @json_object = JSON.parse(@response.body)
  runtime_json_object = @json_object["data"]["items"]

  find_json = FindJsonValueForField.new
  fields_name = "syncStatusByVistaSystemId."+ site_name + ".lastSyncTime"
  p new_sync_time = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)
  p new_sync_time = Time.parse(new_sync_time)
  expect(Time.at(new_sync_time)).to be > Time.at(@last_sync_time)
end

Then(/^the last sync time should not get updated for site "(.*?)"$/) do |site_name|
  @json_object = JSON.parse(@response.body)
  runtime_json_object = @json_object["data"]["items"]

  find_json = FindJsonValueForField.new
  fields_name = "syncStatusByVistaSystemId."+ site_name + ".lastSyncTime"
  p new_sync_time = find_json.find_value_from_json_for_field(runtime_json_object, fields_name)
  p new_sync_time = Time.parse(new_sync_time)
  expect(Time.at(new_sync_time)).to eq Time.at(@last_sync_time)
end
