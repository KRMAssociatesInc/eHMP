require "httparty"

Given(/^a request data was sent for patient "(.*?)" with content "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/writeback/vitals/save?pid=#{pid}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end

Then(/^the vitals data stored success/) do
  puts @response.code
  expect(@response.code).to eq(200)
end

Given(/^a request data was sent for patient "(.*?)" without dfn "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/writeback/vitals/save?pid=#{pid}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end

Then(/^server status error returned$/) do
  puts @response.code
  expect(@response.code).to eq(500)
end

Given(/^a request data was sent for patient "(.*?)" without dateTime "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/writeback/vitals/save?pid=#{pid}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end

Given(/^a request data was sent for patient "(.*?)" without locIEN "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/writeback/vitals/save?pid=#{pid}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end

Given(/^a request data was sent for patient "(.*?)" without duz "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/writeback/vitals/save?pid=#{pid}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end

Given(/^a request data was sent for patient "(.*?)" with bad dateTime "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/writeback/vitals/save?pid=#{pid}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end
