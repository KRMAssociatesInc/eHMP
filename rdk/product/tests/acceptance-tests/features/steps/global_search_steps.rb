path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests global patient search with lname "(.*?)" and fname "(.*?)" and ssn "(.*?)" and dob "(.*?)" and Content-Type "(.*?)"$/) do |lname, fname, ssn, dob, content_type|
  resource_query = RDKQuery.new('search-global-search')
  jsonreq = {}  # "lname"=> lname, "fname" => fname, "ssn" => ssn, "dob" => dob }
  jsonreq["name.last"] = lname unless lname.eql? "NOT DEFINED"
  jsonreq["name.first"] = fname unless fname.eql? "NOT DEFINED"
  jsonreq["ssn"] = ssn unless ssn.eql? "NOT DEFINED"
  jsonreq["date.birth"] = dob unless dob.eql? "NOT DEFINED"
  reqjson = jsonreq.to_json
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, reqjson, { 'Content-Type' => content_type })
end

Then(/^the global patient result contains$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = @json_object['data']['items']
  search_json(result_array, table)
end

Then(/^the global response contains "(.*?)" message$/) do |arg1|
  @json_object = JSON.parse(@response.body)
  expect(@json_object['message']).to eq(arg1)
end

Then(/^the global response for too many results contains error message$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = []
  result_array.push(@json_object)
  search_json(result_array, table)
end

When(/^the client queries the patientSync RDK API for pid "(.*?)"$/) do |pid|
  QueryRDKPatientSync.new(pid)
  path = QueryRDKPatientSync.new(pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^patient sync status says true$/) do
  @json_object = JSON.parse(@response.body)
  success = false
  if @json_object["status"] == 'ok' && @json_object["patientSynced"] == true
    success = true
  end
  expect(success).to be_true, "Patient PID is not synced"
end

Then(/^patient sync status says false$/) do
  @json_object = JSON.parse(@response.body)
  success = false
  if @json_object["status"] == 'PID is unknown to JDS' && @json_object["patientSynced"] == false
    success = true
  end
  expect(success).to be_true, "Patient PID is synced"
end
