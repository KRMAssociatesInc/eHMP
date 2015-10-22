#Zzzretiredonenineteen,Patient

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "selenium-webdriver"
require "WebDriverFactory.rb"
require "SeleniumCommand.rb"
require 'uri'
require 'net/http'
require 'json'
require 'cgi'

When(/^client requests problems in RDK format$/) do
  url = QueryGenericRDK.new("problems").path
  url = url.concat("/adk")
  @response = HTTPartyWithBasicAuth.get_with_authorization(url)
  #p @response
  expect(@response.code).to eq(200)
end

Then(/^the VPR result contains more than (\d+) records$/) do |_count|
  json = JSON.parse(@response.body)
  ValueArray = json["data"]["items"]
  p ValueArray.count
  expect(ValueArray.count).to be > 0
end

Then(/^the kind field is "(.*?)" for every record$/) do |kind|
  json = JSON.parse(@response.body)
  ValueArray = json["data"]["items"]
  ValueArray.each do |localVal|
    # puts localVal["kind"]
    expect(localVal["kind"]).to be == kind
  end
end

Then(/^the VPR result contains$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = @json_object["data"]["items"]
  search_json(result_array, table)
end

#@US1892_Problem_List_Writeback
When(/^the client puts data "(.*?)" using Postman$/) do |arg1|
  values = arg1.split("|")
    
  jsonreq = { :MST => values[0], :dateOfOnset => values[1], :dateRecorded => values[2], :enteredBy => values[3], :enteredByIEN => values[4], :headOrNeckCancer => values[5], :lexiconCode => values[6], :patientIEN => values[7], :patientName => values[8], :problemName => values[9], :problemText => values[10], :providerIEN => values[11], :recordingProvider => values[12], :responsibleProvider => values[13], :responsibleProviderIEN => values[14], :service => values[15], :status => values[16], :userIEBN => values[17] }
  request = jsonreq.to_json
  url = QueryGenericRDK.new("problems").path
  url = url.concat("/adk")
  @response =  HTTPartyWithBasicAuth.put_json_with_authorization(url, request)
  #puts @response.code  
end

Then(/^the successful response is returned$/) do
  #p @response
  expect(@response.code.to_i).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^the 500 response is returned$/) do
  expect(@response.code.to_i).to eq(500)
end

When(/^the client checks in JDS$/) do
  path =DefaultLogin.jds_url
  urlpath  = path+"/vpr/all/find/problem?filter=like(problemText, \"ATOZ\%\")"
  encoded_url = URI.encode(urlpath)
  #uri = URI.parse(urlpath)
  @response = HTTPartyWithBasicAuth.get_with_authorization(encoded_url)
  #p @response.body
end

Then(/^the results contain a problemText with the written value$/) do
  json = JSON.parse(@response.body)
  text ="ATOZ"
  ValueArray = json["data"]["items"]
  ValueArray.each do |localVal|
    expect((localVal["problemText"]).match text) == nil
  end
end

#http://10.2.2.110:9080/vpr/all/find/problem?filter=like(problemText, "YourKeyWordToCheckFor%25")
#http://10.2.2.110:9080/vpr/all/find/problem?filter=like(problemText, \"ATOZ%25\")"
#@US2679_Problem_List_Search
When(/^the client searches for problems with search criteria "(.*?)" in VPR format from RDK API$/) do |arg1|
  urlpath = QueryGenericRDK.new("problems")
  urlpath.add_parameter("searchfor", arg1)
  @response = HTTPartyWithBasicAuth.get_with_authorization(urlpath.path)
  expect(@response.code).to eq(200)
end

Then(/^the problemText field starts with search character "(.*?)"$/) do |arg1|
  json = JSON.parse(@response.body)
  values = json["data"]["items"]
  values.each do |localVal|
    expect((localVal["problemText"]).match arg1)==nil
  end
end

#@US2645_Problem_List_Update
When(/^the client posts data "(.*?)" using postman$/) do |arg1|
  values = arg1.split("|")
  jsonreq = { :responsibleProviderIEN => values[0], :providerIEN => values[1], :responsibleProvider => values[2], :userIEN => values[3], :status => values[4], :problemName => values[5], :problemText => values[6], :problemNumber => values[7], :dateLastModified => values[8], :dateOfOnset => values[9], :recordingProvider => values[10], :acuity => values[11], :headOrNeckCancer => values[12], :service => values[13] }
  #jsonreq["///"] ="/"
  request = jsonreq.to_json
  #puts request
  url = QueryGenericRDK.new("problems").path
  #p url
  @response =  HTTPartyWithBasicAuth.post_json_with_authorization(url, request, { "Content-Type"=>"application/json" })
  #puts @response.code  
end

When(/^the client checks in Vista$/) do
  app_path = QueryGenericVISTA.new("rambler").path
  app_path = app_path.concat("#{'9000011-499'}")
  p app_path
  SeleniumCommand.navigate_to_url(app_path)
  p "loading web page"
  sleep(10)
  @driver = SeleniumCommand.driver
end

Then(/^the results contain the problemText with the written value "(.*?)"$/) do |arg1|
  pelem =  @driver.find_elements(:css, "#results>dl>dd>a") 
  # @response = HTTPartyWithBasicAuth.get_with_authorization(app_path)
  pvalue = pelem[2].text
  presult = pvalue.split('/')
  puts presult[1]
  @driver.quit 
  expect(pvalue).to eq(arg1)
end

#US2887_Problem_List_Remove @onc
When(/^the client runs data "(.*?)" using postman$/) do |arg1|
  values = arg1.split("|")
  jsonreq = { 
    :problemIEN => values[0], 
    :providerID => values[1]
  }
  request = jsonreq.to_json
  urlobj = QueryGenericRDK.new("problems")
  urlobj.add_parameter("accessCode", "pu1234")
  urlobj.add_parameter("verifyCode", "pu1234!!")
  urlobj.add_parameter("site", "9E7A")
  url = urlobj.path
  p url
  puts request
  @response =  HTTPartyWithBasicAuth.delete_json_with_authorization(url, request, { "Content-Type"=>"application/json" })
  p "before resp"
  puts @response
end

When(/^the client queries JDS$/) do
  path =DefaultLogin.jds_url
  urlpath  = path+"/vpr/9E7A;3/find/problem?filter=like(localId,\"499\")"
  encoded_url = URI.encode(urlpath)
  #uri = URI.parse(urlpath)
  @response = HTTPartyWithBasicAuth.get_with_authorization(encoded_url)
end

Then(/^the results contain removed with the written value "(.*?)"$/) do |flag|
  json1 = JSON.parse(@response.body)
  text = flag.to_s
  ValueArray = json1["data"]["items"]
  puts ValueArray
  ValueArray.each do |localVal|
    reval = localVal["removed"].to_s
    expect(reval.match text) == nil
  end
end

Then(/^the results will have Condition HIDDEN$/) do
  pelem =  @driver.find_elements(:css, "#results>dl>dd")
  # @response = HTTPartyWithBasicAuth.get_with_authorization(app_path)
  pvalue = pelem[11].text
  puts pvalue
  @driver.quit 
  expect(pvalue).to eq(arg1)
end
