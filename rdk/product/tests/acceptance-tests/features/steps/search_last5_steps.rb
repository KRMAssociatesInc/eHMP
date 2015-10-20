When(/^the client requests for the patient "(.*?)" starting with "(.*?)" and limited to "(.*?)"$/) do |last5, start, limit|
  #path = QueryRDKSearchLast5.new(last5, start, limit).path

  build_path = RDKQuery.new('patient-search-last5')
  build_path.add_parameter("last5", last5)
  build_path.add_parameter("start", start)
  build_path.add_parameter("limit", limit)
  path = build_path.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the client receives (\d+) RDK result\(s\) with start index of (\d+) and results limit of (\d+) per page$/) do |num_results, start_index, limit|
  @json_object = JSON.parse(@response.body)
  total_results = @json_object["data"]["totalItems"]
  start_index= @json_object["data"]["startIndex"]
  items_per_page= @json_object["data"]["itemsPerPage"]
  expect(total_results).to eq(num_results.to_i)
  expect(start_index).to eq(start_index.to_i)
  expect(items_per_page).to eq(limit.to_i)
end

Then(/^the RDK last5 search results contain$/) do |table|
  dateformat = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:\d\d/

  @json_object = JSON.parse(@response.body)

  result_array = @json_object["data"]["items"]
  search_json(result_array, table, dateformat)
end

When(/^the client sends a request for the patient "(.*?)" starting with "(.*?)"$/) do |arg1, arg2|
  build_path = RDKQuery.new('patient-search-last5')
  build_path.add_parameter("last5", arg1)
  build_path.add_parameter("start", arg2)
  path = build_path.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the client receives (\d+) RDK result\(s\) with start index of (\d+)$/) do |result_count, start|
  @json_object = JSON.parse(@response.body)
  total_results = @json_object["data"]["totalItems"]
  start_index= @json_object["data"]["startIndex"]
  expect(total_results).to eq(result_count)
  expect(start_index).to eq(start)
end

Then(/^the result\(s\) should( not)? contain "(.*?)"$/) do |negate, hash_key|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = @json_object["data"]["items"]
  found = json_verify.defined?([hash_key], result_array)
  expect(found).to eq(negate.nil?)
end
