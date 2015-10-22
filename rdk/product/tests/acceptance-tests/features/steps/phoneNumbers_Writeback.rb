#require 'json'
require 'uri'
require 'net/http'

When(/^the client saves homephone \| CellPhone \| WorkPhone \| EmergencyPhone \| KinPhone  "(.*?)" for the patient "(.*?)" in RDK format$/) do |input, pid|
  url =  QueryGenericRDK.new("resource/writeback/demographics", pid, "save").path
  input = "8586050836|8581111234|3453453456|8788786789|6783451234"

  values = input.split("|")

  jsonreq = { "home"=> values[0], "work" => values[1], "cell" => values[2], "emergency" => values[3], "nok" => values[4] } 

  reqjson = jsonreq.to_json
  p reqjson
  @response =  HTTPartyWithBasicAuth.post_json_with_authorization(url, reqjson)
  puts @response
end

Then(/^a  temporary Not implemented response is returned$/) do
  expect(@response.code).to eq("501")
end

Then(/^a Not found response is returned$/) do
  expect(@response.code).to eq("404"), "response code was #{@response.code}: response body #{@response.body}"
end
