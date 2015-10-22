Then(/^the patient with pid "(.*?)" is synced through the RDK API within (\d+) seconds$/) do |pid, seconds|
  time_out = seconds
  wait_time = 2
  is_synced = false
  #statuspath = QueryRDKSync.new("status", pid).path
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  (0..Integer(time_out)/wait_time).each do
    @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
    if @response.code == 200 && sync_complete
      is_synced = true
      break
    else
      sleep wait_time
    end
  end
  expect(is_synced).to be true
end

Then(/^the patient with pid "(.*?)" is cleared throught the RDK API within (\d+) seconds$/) do |pid, seconds|
  time_out = seconds
  wait_time = 5
  is_synced = true
  #statuspath = QueryRDKSync.new("status", pid).path
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  (0..Integer(time_out)/wait_time).each do
    @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
    if contains_expected_error_code
      is_synced = false
      break
    else
      sleep wait_time
    end
  end
  expect(is_synced).to be_false
end

def contains_expected_error_code
  json_verify = JsonVerifier.new
  json = JSON.parse(@response.body)
  unless json.key?("error")
    if json.key?("data")
      json = json["data"]
    end
  end
  if json_verify.defined?(["error.code"], json)

    #p "error code: #{json["error"]["code"]}"
    return (json["error"]["code"] == 404)
  end
  p json_verify.error_message
  #p json
  p "returning false"
  return false
end

Then(/^a Not Found response is returned$/) do
  p "Not Found response is returned"
  p "response code"
  p @response.code
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
  expect(contains_expected_error_code).to be_true
end

Given(/^a patient with pid "(.*?)" has not been synced through the RDK API$/) do |pid|
  #path = QueryRDKSync.new("clear", pid).path
  temp = RDKQuery.new('synchronization-clear')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
  expect(@response.code).to eq(200), "code: #{@response.code}, body: #{@response.body}"

  time_out = 120
  wait_time = 5
  is_synced = true
  statuspath = QueryRDKSync.new("status", pid).path

  (0..Integer(time_out)/wait_time).each do
    @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)

    if contains_expected_error_code
      is_synced = false
      break
    else
      sleep wait_time
    end
  end
  expect(is_synced).to be_false
end

When(/^the client requests that the patient with pid "(.*?)" be synced through RDK API$/) do |pid|
  # statuspath = QueryRDKSync.new("status", pid).path
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
  unless sync_complete
    path = QueryRDKSync.new("load", pid).path
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  end
end

When(/^the client requests that the MVI patient be synced through RDK API$/) do
  # statuspath = QueryRDKSync.new("status", pid).path
  temp = RDKQuery.new('search-mvi-patient-sync')
  statuspath = temp.path
  json = JSON.parse(@response.body)
  pid = json["data"]["items"][0]["pid"]
  json = { "pid"=>pid, "demographics" => json["data"]["items"][0] }.to_json
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(statuspath, json, { "Content-Type"=>"application/json" })
end

def sync_complete
  is_sync_complete = false
  status = JSON.parse(@response.body)
  status = status["data"]
  if status.key?("syncStatus") && status["syncStatus"].key?("completedStamp") && !status["syncStatus"].key?("inProgress") && status["jobStatus"].empty?
    is_sync_complete = true
  end
  #return false unless json_verify.defined?(["data.items.syncStatusByVistaSystemId"], json)
  # ignore job status for now
  #job_status = json["syncStatus"]["jobStatus"]
  #return false if job_status

  #result_array = json["data"]["items"][0]["syncStatusByVistaSystemId"]

  #return false unless result_array.length > 0

  #result_array.keys.each do |key|
  #return false unless result_array[key]["syncComplete"]
  #end
  return is_sync_complete
end

Given(/^a patient with pid "(.*?)" has been synced through the RDK API$/) do |pid|
  # statuspath = QueryRDKSync.new("status", pid).path
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
  unless sync_complete
    path = QueryRDKSync.new("load", pid).path
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    expect(@response.code).to eq(201), "code: #{@response.code}, body: #{@response.body}"

    time_out = 300
    wait_time = 10
    is_synced = false
    (0..Integer(time_out)/wait_time).each do
      @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
      if sync_complete
        is_synced = true
        break
      else
        sleep wait_time
      end
    end
    expect(is_synced).to be_true
  end
end

Given(/^a visit patient with pid "(.*?)" has been synced through the RDK API$/) do |pid|
  # statuspath = QueryRDKSync.new("status", pid).path
  temp = RDKQuery.new('synchronization-status')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
  unless sync_complete
    path = QueryRDKSync.new("load", pid).path
    @response = HTTPartyWithBasicAuth.get_with_authorization(path)
    expect(@response.code).to be_between(200, 201), "code: #{@response.code}, body: #{@response.body}"

    time_out = 300
    wait_time = 10
    is_synced = false
    statuspath = QueryRDKSync.new("status", pid).path
    (0..Integer(time_out)/wait_time).each do
      @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
      if sync_complete
        is_synced = true
        break
      else
        sleep wait_time
      end
    end
    expect(is_synced).to be_true
  end
end

When(/^the client requests that the patient with pid "(.*?)" be cleared through the RDK API$/) do |pid|
  #path = QueryRDKSync.new("clear", pid).path
  temp = RDKQuery.new('synchronization-clear')
  temp.add_parameter("pid", pid)
  statuspath = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(statuspath)
end

When(/^the client requests allergies for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("allergy", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests vitals for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("vital", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests demographics for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("patient", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests orders for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("order", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests medications for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("med", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests problem list for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("problem", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests discharge summary for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("document", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests immunizations for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("immunization", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests labs for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("lab", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests consults for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("consult", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests radiology for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("rad", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests anatomic pathology for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("accession", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests clinical notes for the patient "(.*?)" in RDK format$/) do |pid|
  path = QueryRDKDomain.new("document", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
