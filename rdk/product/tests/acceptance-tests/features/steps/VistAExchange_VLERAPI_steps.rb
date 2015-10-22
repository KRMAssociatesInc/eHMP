When(/^the client requests data for the patient "(.*?)" in VPR format in encounter "(.*?)"$/) do |pid, encounterUid|
  temp = QueryRDKVler.new(pid)
  temp.add_encount(encounterUid)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client requests data for that sensitive patient "(.*?)" in encounter "(.*?)"$/) do |pid, encounterUid|
  temp = QueryRDKVler.new(pid)
  temp.add_encount(encounterUid)
  temp.add_acknowledge("false")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

When(/^the client breaks glass and repeats a request for data for that patient "(.*?)" in encounter "(.*?)$/) do |pid, encounterUid|
  temp = QueryRDKVler.new(pid)
  temp.add_encount(encounterUid)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

Then(/^in section "(.*?)" the response contains (\d+) "(.*?)"s$/) do |section, number_of_results, collection|
  runtime_json_object = JSON.parse(@response.body)
  expect(runtime_json_object['data'][section][collection].length).to eq(number_of_results.to_i)
end
