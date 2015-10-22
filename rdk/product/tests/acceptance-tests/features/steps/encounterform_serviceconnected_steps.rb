require "httparty"

When(/^the client requests service connected and rated disabilities information for user "(.*?)" and patient id "(.*?)"$/) do |user, pid|
  resource_query = RDKQuery.new('patient-service-connected-serviceConnected')
  resource_query.add_parameter("pid", pid)
  resource_query.add_acknowledge("true")
  resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(resource_query.path)
end

Then(/^the response contains a service connected percentage of "(.*?)"$/) do |service_connected_percent|
  @json_object = JSON.parse(@response.body)

  sc_percent = @json_object["data"]["scPercent"]
  expect(sc_percent).to eq(service_connected_percent)
end

Then(/^the response contains a service connected value of "(.*?)"$/) do |service_connected_bool|
  @json_object = JSON.parse(@response.body)

  service_connected = @json_object["data"]["serviceConnected"]

  if service_connected_bool == "true"
    service_connected_bool = true
  elsif service_connected_bool == "false"
    service_connected_bool = false
  end

  expect(service_connected).to eq(service_connected_bool)
end

Then(/^the response contains the following disability$/) do |service_connected_disability|
  @json_object = JSON.parse(@response.body)

  disability_array = @json_object["data"]["disability"]
  search_json(disability_array, service_connected_disability)
end

Then(/^the response contains a disability of "(.*?)"$/) do |service_connected_no_disability|
  @json_object = JSON.parse(@response.body)

  no_disability = @json_object["data"]["disability"]
  expect(no_disability).to eq(service_connected_no_disability)
end

When(/^the client requests service connected exposure information for user "(.*?)" and patient id "(.*?)"$/) do |user, pid|
  resource_query = RDKQuery.new('patient-service-connected-scButtonSelection')
  resource_query.add_parameter("pid", pid)
  resource_query.add_acknowledge("true")
  p resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(resource_query.path)
end

Then(/^the response contains the following exposure$/) do |service_connected_exposure|
  @json_object = JSON.parse(@response.body)
  exposure_array = @json_object["data"]["exposure"]
  search_json(exposure_array, service_connected_exposure)
end
