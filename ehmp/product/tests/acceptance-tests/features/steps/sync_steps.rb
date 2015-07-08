require "TestSupport.rb"

Given(/^query$/) do
  cache = PatientCache.new
  @response = cache.query_vpr_patients
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
  expect(cache.patient_count).to eq(3)
  expect(cache.contains_patient? "10102").to be_true
  expect(cache.contains_patient? "bad pid").to be_false
end

Given(/^a patient with pid "(.*?)" and icn "(.*?)" has not been synced$/) do |pid, icn|
  base_url = DefaultLogin.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  
  @response = nil
  begin
    @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
  rescue Timeout::Error
    p "Sync timed out" 
  end
  
  if @response.nil?
    response_code = 500
    response_body = "Sync timed out"
  else
    response_code = @response.code
    response_body = @response.body
  end
  
  fail "Expected response code 200, received #{response_code}: response body #{response_body}" unless response_code == 200
end

Given(/^a patient with pid "(.*?)" has not been synced in FHIR format$/) do |pid|
  base_url = DefaultLogin.fhir_url
  p path = "#{base_url}/admin/sync/#{pid}"
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
end

Given(/^a patient with pid "(.*?)" has not been synced in FHIR format on "(.*?)"$/) do |pid, ve|
  if ve.upcase == "VE2"
    base_url = DefaultLogin.ve2_fhir_url
  else
    base_url = DefaultLogin.fhir_url
  end

  p path = "#{base_url}/admin/sync/#{pid}"
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^the client requests synced through FHIR for patient with pid "(.*?)" on "(.*?)"$/) do |pid, ve|
  if ve.upcase == "VE2"
    base_url = DefaultLogin.ve2_fhir_url
    #wait_until_operational_data_is_synced_ve2
    wait_until_operational_data_is_synced(DefaultLogin.ve2_fhir_url)
  else
    base_url = DefaultLogin.fhir_url
    wait_until_operational_data_is_synced(DefaultLogin.fhir_url)
  end

  p path = "#{base_url}/admin/sync/#{pid}"
  #p path
  begin
    @response = HTTPartyWithBasicAuth.put_with_authorization(path)
    expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
  rescue Timeout::Error
    p "Sync timed out"
  end
  #@response = HTTPartyWithBasicAuth.get_with_authorization(path)
  #expect(@response.code).to eq(200)
  time_out = 60
  wait_time = 2
  current_time = Time.new
  wait_until = current_time + time_out
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    if @response.code != 200
      p "not sync yet, wait #{wait_time} seconds"
      sleep wait_time
    else
      break
    end # if
  end # for
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^the patient with pid "(.*?)" has no data on "(.*?)"$/) do |pid, ve|
  if ve.upcase == "VE2"
    base_url = DefaultLogin.ve2_fhir_url
  else
    base_url = DefaultLogin.fhir_url
  end
  path = "#{base_url}/admin/sync/#{pid}"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^a client requests an asynchronous load for patient with icn "(.*?)"$/) do |icn|
  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/loadAsync?icn=#{icn}"
  @response = HTTPartyWithAuthorization.post_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a Not Found response is returned$/) do
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^the patient with pid "(.*?)" is synced within (\d+) seconds$/) do |pid, time_out|
  cache = PatientCache.new
  wait_time = 1
  is_synced = false
  current_time = Time.new
  wait_until = current_time + time_out.to_i
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    @response = cache.query_vpr_patients
    if cache.sync_complete_pid? pid
      is_synced = true
      break
    else
      #p "not synced yet, wait #{wait_time} seconds"
      sleep wait_time
    end # if
  end # for
  expect(is_synced).to be_true
end

def wait_until_operational_data_is_synced(base_fhir_url)
  path = "#{base_fhir_url}/admin/sync/operational"

  time_out = 600
  wait_time = 5
  @is_synced = false
  current_time = Time.new
  wait_until = current_time + time_out
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    begin
      # p path
      @response = HTTPartyWithBasicAuth.get_with_authorization(path)
      json = JSON.parse(@response.body)
      sync_complete = json["data"]["items"][0]["syncOperationalComplete"]
      if sync_complete
        p "operational data has been synced"
        @is_synced = true
        break
      else
        p "operational data not synced yet, wait #{wait_time} seconds"
        p json
        sleep wait_time
      end # if
    rescue Exception => e
      p "call to check if operational data has been synced caused an exception: #{e}"
      p @response.body unless @response.nil?
      sleep wait_time
    end # rescue
  end # for
end

Given(/^a patient with pid "(.*?)" has been synced through Admin API$/) do | pid |
  #Check that the operational
  # unless TestSupport.operational_data_run?
  #   wait_until_operational_data_is_synced(DefaultLogin.fhir_url)
  #   @@operational_data_run = true
  # end
  
  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/load?pid=#{pid}"
  p path

  @response = nil
  default_timeout = 260
  response_code = 502
  max_run_index = 3
  run_index = 0

  while response_code == 502 && run_index < max_run_index
    start_time = Time.new
    run_index += 1
    begin
      @response = HTTPartyWithBasicAuth.put_with_authorization(path, default_timeout)
    rescue Timeout::Error
      p "Sync timed out"
    end
    p "Waited #{Time.new - start_time} secs"
    
    if @response.nil?
      response_code = 500
      response_body = "Sync timed out"
    else
      response_code = @response.code
      response_body = @response.body
    end
  end 
  fail "Expected response code 201, received #{response_code}: response body #{response_body}" unless response_code == 201
end
  
Given(/^old a patient with pid "(.*?)" has been synced through Admin API$/) do | pid |
  #Check that the operational

  wait_until_operational_data_is_synced(DefaultLogin.fhir_url)

  base_url = DefaultLogin.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  p path
  
  begin
    @response = HTTPartyWithBasicAuth.put_with_authorization(path)
    p "Expected response code 201, received #{@response.code}" unless @response.code == 201
    #expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
  rescue Timeout::Error
    p "Sync timed out"
  end
  
  # if @response.code == 500 || @response.code == 503
    # fail "Expected response code 201, received #{@response.code}: response body #{@response.body}"
  # else
  time_out = 180
  wait_time = 2

  current_time = Time.new
  wait_until = current_time + time_out
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    if @response.code != 200
      p "not sync yet, wait #{wait_time} seconds"
      sleep wait_time
    else
      break
    end # if
  end # for
  p "Waited #{Time.new - current_time} secs"
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
  # end
end

# renamed this function to Given(/^a patient with pid "(.*?)" has been synced through Admin API$/) do | pid |
#Given(/^a patient with pid "(.*?)" has been synced through FHIR$/) do | pid |
#  #Check that the operational
#
#  wait_until_operational_data_is_synced(DefaultLogin.fhir_url)
#
#  base_url = DefaultLogin.fhir_url
#  path = "#{base_url}/admin/sync/#{pid}"
#  p path
#  begin
#    @response = HTTPartyWithBasicAuth.put_with_authorization(path)
#    p "Expected response code 201, received #{@response.code}" unless @response.code == 201
#    #expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
#  rescue Timeout::Error
#    p "Sync timed out"
#  end
#  #@response = HTTPartyWithBasicAuth.get_with_authorization(path)
#  #expect(@response.code).to eq(200)
#  time_out = 180
#  wait_time = 2
#  (0..Integer(time_out)/wait_time).each do
#    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
#    if @response.code != 200
#      p "not sync yet, wait #{wait_time} seconds"
#      sleep wait_time
#    else
#      break
#    end # if
#  end # for
#  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
#end

Given(/^a patient with pid "(.*?)" and icn "(.*?)" has been synced$/) do |pid, icn|
  base_url = DefaultLogin.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  #p path
  @response = HTTPartyWithBasicAuth.put_with_authorization(path)
  expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"

  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^a client request patient with pid "(.*?)" is cleared from the cache$/) do |pid|
  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/clearPatient?pid=#{pid}"
  @response = HTTPartyWithAuthorization.post_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

end

Then(/^the patient with pid "(.*?)" is cleared from the cache within (\d+) seconds$/) do |pid, time_out|
  cache = PatientCache.new

  wait_time = 2
  is_cleared = false
  current_time = Time.new
  wait_until = current_time + time_out.to_i
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    @response = cache.query_vpr_patients
    if cache.contains_patient_pid? pid
      p "not cleared yet, wait #{wait_time} seconds"
      sleep wait_time
    else
      is_cleared = true
      break
    end # if
  end # for
  expect(is_cleared).to be_true
end

When(/^a client requests patient information for patient with pid "(.*?)" and icn "(.*?)"$/) do |pid, icn|
  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/context/patient?pid=#{pid}"
  @response = HTTPartyWithAuthorization.post_with_authorization(path)
  unless @response.code == 200
    p @response.body
  end
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

  # https://10.3.3.4:8443/vpr/10108/detail/cwadf?_dc=1398086783691
  path = "#{base_url}/vpr/#{pid}/detail/cwadf?_dc=1398086783691"
  @response = HTTPartyWithAuthorization.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^a client requests sync status for patient with icn "(.*?)"$/) do |icn|
  base_url = DefaultLogin.jds_url
  path = "#{base_url}/data/urn:va:syncstatus:#{icn}"
  @response = HTTPartyWithAuthorization.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^a client requests sync status for patient with dfn "(.*?)"$/) do |dfn|
  base_url = DefaultLogin.jds_url
  dfn.gsub!(';', ':')
  path = "#{base_url}/data/urn:va:syncstatus:#{dfn}"
  @response = HTTPartyWithAuthorization.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^an error response "(.*?)" is returned after (\d+) seconds$/) do |arg1, arg2|
  pending # express the regexp above with the code you wish you had
end

def wait_until_patient_has_been_synced(pid)
  time_out = 120
  wait_time = 2
  is_cleared = false
  current_time = Time.new
  wait_until = current_time + time_out
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    is_synced = check_patient_has_been_synced(pid)[0]
    if is_synced
      p "operational data has been synced"
      is_synced = true
      break
    else
      p "operational data not synced yet, wait #{wait_time} seconds"
      # p json
      sleep wait_time
    end
  end
end

def check_patient_has_been_synced(pid)
  base_url = DefaultLogin.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  can_be_sync = true
  # p path
  begin
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    if @response.code == 404
      is_synced = false
    elsif @response.code == 503
      p 'Request to /admin/sync/#{pid} before operational sync is complete.'
      is_synced = false
      can_be_sync = false
    elsif @response.code == 200
      is_synced = check_uncompeleted_sync
    else
      p 'This seems to be like an error connecting to https://10.3.3.5/admin/sync/#{pid}'
      is_synced = false
      can_be_sync = false
    end
  rescue Timeout::Error
    p "Sync timed out"
  end
  return is_synced, can_be_sync
end

def check_uncompeleted_sync
  json = JSON.parse(@response.body)
  sync_complete = json["data"]["items"][0]["syncStatusByVistaSystemId"]["9E7A"]["syncComplete"]
  if sync_complete
    p "operational data has been synced"
    is_synced = true
  else
    p "operational data not synced yet."
    is_synced = false
  end
  return is_synced
end
