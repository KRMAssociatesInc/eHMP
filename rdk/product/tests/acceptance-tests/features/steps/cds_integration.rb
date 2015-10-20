When(/^user sends request to create patient list with content "(.*?)"$/) do | payload |
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/list" 
  p path
  p payload
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

list_id = ""
Then(/^a successful response is returned for created$/) do 
  puts @response.code
  expect(@response.code).to eq(201)
end

And(/^the patient list id is returned$/) do 
  puts @response.body
  json = JSON.parse(@response.body)
  id = json["data"][0]["_id"]
  list_id = id
  puts "this is id= #{id}"
end

When(/^user adds a patient in the patient list$/) do 
  puts "In the add patient"
  puts "this is id= #{list_id}"
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/list/patients?id=#{list_id}&pid=9E7A;100184" 
  p path
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

Given(/^a patient list exists$/) do
  #nothing to verify
end

And(/^the cdsjob is scheduled for patient list with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/execute/request"
  #path = "http://10.2.2.49:3007/schedule/cdsjob"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

cdsjob_id= ""
And(/^a cdsjob id is returned$/) do
  json = JSON.parse(@response.body)
  id = json["data"][0]["_id"]
  cdsjob_id = id
  puts "this is id= #{id}"
end

When(/^a Hypertension rule is ran for patient list$/) do 
  path = "http://10.2.2.49:8080/cds-results-service/core/executeRulesJob/TestPatientList"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end 

Then(/^a workproduct is created for Hypertension$/) do
  puts @response.body
  json = JSON.parse(@response.body)
  total = json["totalSubjectsProcessed"]
  expect(total).to eq(1)
end

And(/^user sends GET request for a created patient list$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/list?id=#{list_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends PUT request to update patient list with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/list?id=#{list_id}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends DELETE request to delete a patient list$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/list?id=#{list_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end

When(/^user sends request to create a work product with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/product" 
  p path
  p payload
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end 
work_id = ""
And(/^a work product id is returned$/) do 
  json = JSON.parse(@response.body)
  id = json["data"][0]["id"]
  work_id = id
  puts "this is work id= #{id}"
end

And(/^user sends GET request for a created work product$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/product?id=#{work_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end 

And(/^user sends PUT request to update a work product with content "(.*?)"$/) do | payload |
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/product?id=#{work_id}"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path, payload, type)
  puts @response.body
end

Then(/^user sends DELETE request to delete a work product$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/product?id=#{work_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends GET request for a created cdsjob$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/execute/request?name=TestCDSJob"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends PUT request to update a cdsjob with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/execute/request?name=TestCDSJob"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path, payload, type)
  puts @response.body
end 

And(/^user sends DELETE request to delete a cdsjob$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/execute/request?name=TestCDSJob&id=#{cdsjob_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends POST request to schedule a job$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/schedule/job?jobname=TestJob&cdsname=ScheduleJobList" 
  p path
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends GET request for a scheduled job$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/schedule/job?jobname=TestJob"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end
  
And(/^user sends PUT request to update a scheduled job$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/schedule/job?jobname=TestJob"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path, payload, type)
  puts @response.body
end 

And(/^user sends DELETE request to delete a scheduled job$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/schedule/job?jobname=TestJob"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end

Given(/^user sends request to create definition with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/definition" 
  p path
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

def_id = ""
And(/^the definition id is returned$/) do 
  json = JSON.parse(@response.body)
  id = json["data"][0]["_id"]
  def_id = id
  puts "this is id= #{id}"
end

And(/^user sends GET request for a definition$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/definition?id=#{def_id}" 
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends POST request to copy the created definition$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/definition/copy?id=#{def_id}&newname=CopyDef"
  p path
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

When(/^user sends DELETE request to delete the defintion$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/definition?id=#{def_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end

Given(/^user sends request to create criteria with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/criteria" 
  p path
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response.body
end

criteria_id = ""
And(/^the criteria id is returned$/) do 
  json = JSON.parse(@response.body)
  id = json["data"][0]["_id"]
  criteria_id = id
  puts "this is id= #{id}"
end

And(/^user sends GET request for a criteria$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/criteria?id=#{criteria_id}" 
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end

When(/^user sends DELETE request to delete a criteria$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/patient/criteria?id=#{criteria_id}"
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end

Given(/^subscriptions are available fo the user$/) do
  #nothing to verify
end

And(/^user sends GET request for subscriptions$/) do
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/subscriptions" 
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, payload, type)
  puts @response.body
end

And(/^user sends PUT request to update subscriptions with content "(.*?)"$/) do |payload|
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/subscriptions" 
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path, payload, type)
  puts @response.body
end  

When(/^user sends DELETE request to delete the subscription$/) do 
  temp = QueryRDKCDS.new
  path = temp.path + "/work-product/subscriptions" 
  payload = ""
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, payload, type)
  puts @response.body
end
