
When(/^the client requests for the patient name "(.*?)" starting with "(.*?)" and limited to "(.*?)" using Word$/) do |name, start, limit|
  path = QueryRDKSearchWord.new(name, start, limit).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client sends a request for the patient name "(.*?)" starting with "(.*?)" using Word$/) do |arg1, arg2|
  con = PatientSearchWord.new(arg1)
  con.add_start(arg2)
  path = con.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient name "(.*?)" starting with "(.*?)" and limited to "(.*?)" using clinics$/) do |name, start, limit|
  path = QueryRDKSearchClinics.new(name, start, limit).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client sends a request for the patient name "(.*?)" starting with "(.*?)" using clinics$/) do |arg1, arg2|
  con = PatientSearchClinics.new(arg1)
  con.add_start(arg2)
  path = con.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient name "(.*?)" and facilityCode "(.*?)"$/) do |name, facilityCode|  
  path = QueryRDKfacilityCode.new(name, facilityCode).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the siteCode "(.*?)"$/) do |arg1|  
  path = QueryRDKsiteCode.new(arg1).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient name "(.*?)" and facilityCode "(.*?)" using clinics$/) do |name, facilityCode|  
  path = QueryfacilityCode.new(name, facilityCode).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the siteCode "(.*?)" using clinics$/) do |arg1|  
  path = QuerysiteCode.new(arg1).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient with locationUid "(.*?)" using filter "(.*?)"$/) do |arg1, arg2|
  path = RDKclinicSearch.new(arg1, arg2).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient using locationUid "(.*?)" using filter "(.*?)" and statdate "(.*?)"$/) do |arg1, arg2, arg3|
  path = RDKclinicStartdate.new(arg1, arg2, arg3).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^client requests for the patient using locationUid "(.*?)" using filter "(.*?)" statdate "(.*?)" and stopdate"(.*?)"$/) do |arg1, arg2, arg3, arg4|
  path = RDKclinicStopdate.new(arg1, arg2, arg3, arg4).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient reid "(.*?)" with locationUid "(.*?)" using filter "(.*?)" Word searches$/) do |arg1, arg2, arg3|
  path = RDKWordSearch.new(arg1, arg2, arg3).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end












