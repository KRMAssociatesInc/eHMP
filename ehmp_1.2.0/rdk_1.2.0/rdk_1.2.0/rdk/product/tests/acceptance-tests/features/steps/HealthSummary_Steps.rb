#require "httparty"

Given(/^a patient "(.*?)"$/) do |arg1|
 # this step does nothing but convey info to the feature file reader
end

And(/^a request data was sent with pid "(.*?)"$/) do |arg1|
  path = QueryRDKHS.new(arg1).path
  #p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
# puts JSON.pretty_generate(@response)
end

Then(/^authentication error returned$/) do
  path = QueryRDKHS.new("").path
  #p path
  user = ""
  pass = "bad"
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, user, pass)
  result_array = @response
  expect(@response.code).to eq(400), "response code was #{@response.code}: response body #{@response.body}"
  #puts JSON.pretty_generate(@response)
  if result_array["error"] == "Missing Required Credential"
    p "   +++   TEST CASE PASSED   +++  "
  else fail(" test case failed")
  end	
end

When(/^a request data was sent without pid$/) do 
  path = QueryRDKHS.new("").path
  #p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #p result_array
  #puts JSON.parse(@response.body)
  if result_array["msg"] == "Bad Patient ID"
    p "   +++   TEST CASE PASSED   +++  "
  else fail(" test case failed ")
  end	
end

Then(/^error message returned$/) do
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
  @json_object = JSON.parse(@response.body)
  #puts JSON.pretty_generate(@json_object)
end

Then(/^the error message returned$/) do
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
  @json_object = JSON.parse(@response.body)
  #puts JSON.pretty_generate(@json_object)
end

Then(/^correct JSON data returned$/) do
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
  @json_object = JSON.parse(@response.body)
  #json_verify = JsonVerifier.new
  result_array = @json_object
  j = @json_object.length
  #puts "+++++++++++++++ Total of Sites (Primary/non Primary) = #{j} ++++++++++++++"
  #puts JSON.pretty_generate(@json_object)
  i =0
  while i <= j 
    result_array = @json_object[i]
    if (result_array["facilityName"] == "KODAK") or (result_array["facilityName"] == "PANORAMA")
      #puts "  +++++++++++++ The Primary Site is: +++++++++++ "
      #puts @json_object[i]
      break
    else
      i += 1
    end
  end 
end

Given(/^a request data was sent with bad pid "(.*?)"$/) do |arg1|
  path = QueryRDKHS.new(arg1).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
  if result_array["error"]["message"] == "This patient's record is not yet accessible. Please try again in a few minutes. If it is still not accessible, please contact your HIMS representative and have the patient loaded into your local VistA."
    #p "   +++   TEST CASE PASSED   +++  "
  else fail(" test case failed ")
  end 
end

Then(/^correct JSON data of primary sites returned$/) do
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  j = @json_object.length
  #puts "+++++++++++++++ Total of Sites (Primary/non Primary) = #{j} ++++++++++++++"
  #puts JSON.pretty_generate(@json_object)
  i =0
  while i <= j 
    result_array = @json_object[i]
    if ((result_array["facilityName"] == "KODAK") or (result_array["facilityName"] == "PANORAMA")) and (result_array["isPrimary"] == true)
      #puts "  +++++++++++++ The Primary Site is: +++++++++++ "
      #puts @json_object[i]
      break
    else
      i += 1
    end
  end 
end

Then(/^correct JSON data of non\-primary sites returned$/) do
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  j = @json_object.length
  #puts "+++++++++++++++ Total of Sites (non Primary) = #{j} ++++++++++++++"
  #puts JSON.pretty_generate(@json_object)
  i =0
  while i <= j 
    result_array = @json_object[i]
    if (result_array["facilityName"] != "KODAK") and (result_array["facilityName"] != "PANORAMA") and (result_array["isPrimary"] == false)
      #puts "  +++++++++++++ The non-Primary Site is: +++++++++++ "
      #puts @json_object[i]
      break
      #i += 1
    else
     #fail ("test case failed")
      i += 1
    end
  end 
end

Given(/^a HS report request was sent with patientID "(.*?)", siteID "(.*?)", reportID "(.*?)"$/) do |pid, site, reportID|
  @rid = reportID
  path = QueryRDKHSReport.new(pid, site, reportID).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  #p @response
  expect(@response.code).to eq(200)
end

Given(/^a HS report request was sent with reportID "(.*?)", siteID "(.*?)"$/) do |reportId, site|
  path = QueryRDKHSReportNoPID.new(site, reportId).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
end

Given(/^a HS report request was sent with reportID "(.*?)", patientID "(.*?)"$/) do |reportId, pid|
  path = QueryRDKHSReportNoSiteID.new(pid, reportId).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
end

Given(/^a HS report request was sent with siteID "(.*?)", patientID "(.*?)"$/) do |site, pid|
  path = QueryRDKHSReportNoReportID.new(pid, site).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
end

Then(/^patient HS report returned$/) do
  expect(@response.code).to eq(200)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
  #puts "+++++++++++++++++++++"
  #puts @rid
  if (result_array["reportID"] != @rid.split(";").first) or (result_array["hsReport"] != @rid.split(";").last)
    fail("the test failed")
  else
    #puts "the test passed"
  end
end

Then(/^the patient id missing error message returned$/) do
  expect(@response.code).to eq(500)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
  if result_array["msg"] != "Patient Id is missing"
    fail("the test failed")
  else
    #puts "the test passed"
  end
end

Then(/^the site id missing error message returned$/) do
  expect(@response.code).to eq(500)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
  if result_array["msg"] != "Site Id is missing"
    fail("the test failed")
  else
    #puts "the test passed"
  end
end

Then(/^the report id missing error message returned$/) do
  expect(@response.code).to eq(500)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
  if result_array["msg"] != "Report Id is missing"
    fail("the test failed")
  else
    #puts "the test passed"
  end
end

Given(/^a HS report request was sent with siteID "(.*?)", patientID "(.*?)", and reportID "(.*?)" without report title$/) do |site, pid, reportID|
  path = QueryRDKHSReport.new(pid, site, reportID).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the report title missing error message returned$/) do
  expect(@response.code).to eq(500)
  @json_object = JSON.parse(@response.body)
  result_array = @json_object
  #puts JSON.pretty_generate(@json_object)
  if result_array["msg"] != "Report Id is not in correct format"
    fail("the test failed")
  else
    #puts "the test passed"
  end
end
