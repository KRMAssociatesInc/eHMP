Then(/^a successful response is returned within (\d+) seconds$/) do |seconds|
  # expect @response to have been set in the ruby step where the HTTParty get/post was called
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
  time_ellapsed = HTTPartyWithBasicAuth.time_elapsed_last_call
  expect(time_ellapsed).to be < seconds.to_f
  #p "time ellapsed: #{time_ellapsed}"
end

Then(/^a successful created response is returned within (\d+) seconds$/) do |seconds|
  # expect @response to have been set in the ruby step where the HTTParty get/post was called
  expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
  time_ellapsed = HTTPartyWithBasicAuth.time_elapsed_last_call
  expect(time_ellapsed).to be < seconds.to_f
  #p "time ellapsed: #{time_ellapsed}"
end

Then(/^an error response "(.*?)" is returned after "(.*?)" seconds$/) do |error_code, seconds|
  expect(@response.code).to eq(error_code.to_i), "response code was #{@response.code}: response body #{@response.body}"
end

When(/^the client requests that the patient with pid "(.*?)" be synced$/) do |pid|
  base_url = DefaultLogin.fhir_url
  path = "#{base_url}/admin/sync/#{pid}"
  #p path

  @response = HTTPartyWithBasicAuth.put_with_authorization(path)

  #expect(@response.code).to eq(201)
end

Then(/^the response does not contain patient data$/) do
  # expect @response to have been set in the ruby step where the HTTParty get/post was called
  json_object = JSON.parse(@response.body)
  total_results = json_object["totalResults"]
  expect(total_results).to eq(0)
end

When(/^the client requests that the patient "(.*?)" be cleared from the cache$/) do |pid|
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

Then(/^the patient with pid "(.*?)" is cleared within (\d+) seconds$/) do |pid, time_out|
  cache = PatientCache.new
  wait_time = 2
  patient_removed = false
  current_time = Time.new
  wait_until = current_time + time_out.to_i
  #(0..Integer(time_out)/wait_time).each do
  while Time.new <= wait_until
    @response = cache.query_vpr_patients
    if cache.contains_patient_pid? pid
      p "not cleared yet, wait #{wait_time} seconds"
      sleep wait_time
    else
      patient_removed = true
      break
    end # if
  end # for
  expect(patient_removed).to be_true
end
