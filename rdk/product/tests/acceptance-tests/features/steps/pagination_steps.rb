When(/^the client requests "(.*?)" resource for the patient "(.*?)" in RDK format$/) do |resource, patient|
  path = QueryRDKDomain.new(resource, patient).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests "(.*?)" resource for the patient "(.*?)" starting with (\d+) and limited to (\d+)$/) do |resource, patient, start_with, limit|
  resource_query = QueryRDKDomain.new(resource, patient)
  resource_query.add_parameter("start", start_with)
  resource_query.add_parameter("limit", limit)
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests "(.*?)" resource for the patient "(.*?)" limited to (\d+)$/) do |resource, patient, limit|
  resource_query = QueryRDKDomain.new(resource, patient)
  resource_query.add_parameter("limit", limit)
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests "(.*?)" resource for the patient "(.*?)" starting with (\d+)$/) do |resource, patient, start_with|
  resource_query = QueryRDKDomain.new(resource, patient)
  resource_query.add_parameter("start", start_with)
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the client receives (\d+) pagination results$/) do |num_results|
  num_results_int = num_results.to_i 
  json = JSON.parse(@response.body)

  #query_results = json["data"]["totalItems"]
  #expect(query_results).to eq(num_results_int), "recieved incorrect value for totalItems: expected #{num_results_int} received #{query_results}"

  query_results = json["data"]["currentItemCount"]
  expect(query_results).to eq(num_results_int), "recieved incorrect value for currentItemCount: expected #{num_results_int} received #{query_results}"

  output_string = ""
  fieldsource = "data.items.uid"
  steps_source = fieldsource.split('.')
  source_allvalues = []
  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)
  expect(source_allvalues.length).to eq(num_results_int), "received incorrect number of data.items: expected #{num_results_int} received #{source_allvalues.length}"
end

When(/^the client requests full name patient search with name "(.*?)"$/) do |name|
  resource_query = RDKQuery.new('patient-search-full-name')
  resource_query.add_parameter("name.full", name)
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests full name patient search with name "(.*?)" starting with (\d+) and limited to (\d+)$/) do |name, start, limit|
  resource_query = RDKQueryPagination.new('patient-search-full-name')
  resource_query.add_parameter("name.full", name)
  resource_query.add_start(start)
  resource_query.add_limit(limit)
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests last(\d+) patient search with "(.*?)"$/) do |_arg1, name|
  build_path = RDKQuery.new('patient-search-last5')
  build_path.add_parameter("last5", name)

  path = build_path.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests last(\d+) patient search with "(.*?)" starting with (\d+) and limited to (\d+)$/) do |_arg1, name, start, limit|
  build_path = RDKQuery.new('patient-search-last5')
  build_path.add_parameter("last5", name)
  build_path.add_parameter("start", start) 
  build_path.add_parameter("limit", limit) 

  path = build_path.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests lab orders for the patient "(.*?)" and order "(.*?)" starting with (\d+) and limited to (\d+)$/) do |pid, uid, start, limit|
  resource_query = RDKQueryPagination.new('patient-record-labsbyorder')
  resource_query.add_parameter("pid", pid)
  resource_query.add_parameter("uid", "#{uid}")
  resource_query.add_parameter("_ack", 'true')
  resource_query.add_start(start)
  resource_query.add_limit(limit)
  path = resource_query.path

  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

