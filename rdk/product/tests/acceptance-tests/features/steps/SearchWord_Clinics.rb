
When(/^the client requests for the patient name "(.*?)" starting with "(.*?)" and limited to "(.*?)" using Word$/) do |name, start, limit|
  search_ward = RDKQuery.new('locations-wards')
  search_ward.add_parameter("range", name)
  search_ward.add_parameter("start", start) unless limit.nil?
  search_ward.add_parameter("limit", limit) unless limit.nil?
  path = search_ward.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client sends a request for the patient name "(.*?)" starting with "(.*?)" using Word$/) do |arg1, arg2|
  search_ward = RDKQueryPagination.new('locations-wards')
  search_ward.add_parameter("range", arg1)
  search_ward.add_start(arg2)
  path = search_ward.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient name "(.*?)" starting with "(.*?)" and limited to "(.*?)" using clinics$/) do |name, start, limit|
  #path = QueryRDKSearchClinics.new(name, start, limit).path
  search_clinics = RDKQuery.new('locations-clinics')
  search_clinics.add_parameter("range", name)
  search_clinics.add_parameter("start", start) 
  search_clinics.add_parameter("limit", limit) 
  path = search_clinics.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client sends a request for the patient name "(.*?)" starting with "(.*?)" using clinics$/) do |arg1, arg2|
  search_clinics = RDKQueryPagination.new('locations-clinics')
  search_clinics.add_parameter("range", arg1)
  search_clinics.add_start(arg2)
  path = search_clinics.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient name "(.*?)" and facilityCode "(.*?)"$/) do |name, facilityCode|  
  query = RDKQuery.new('locations-wards')
  query.add_parameter("name", name)
  query.add_parameter("facility.code", facilityCode)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the siteCode "(.*?)"$/) do |arg1|  
  query = RDKQuery.new('locations-wards')
  query.add_parameter("site.code", arg1)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient name "(.*?)" and facilityCode "(.*?)" using clinics$/) do |name, facilityCode|  
  query = RDKQuery.new('locations-clinics')
  query.add_parameter("name", name)
  query.add_parameter("facility.code", facilityCode)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the siteCode "(.*?)" using clinics$/) do |arg1|  
  query = RDKQuery.new('locations-clinics')
  query.add_parameter("site.code", arg1)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient with locationUid "(.*?)" using filter "(.*?)"$/) do |_arg1, _arg2|
  # I can't find /resource/locations/clinics/search listed in the resource directory
  # path = RDKclinicSearch.new(arg1, arg2).path
  query = RDKQuery.new('')
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient using locationUid "(.*?)" using filter "(.*?)" and statdate "(.*?)"$/) do |arg1, arg2, arg3|
  query = RDKQuery.new('locations-clinics-search')
  query.add_parameter("uid", arg1) 
  query.add_parameter("filter", arg2) 
  query.add_parameter("date.start", arg3) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^client requests for the patient using locationUid "(.*?)" using filter "(.*?)" startdate "(.*?)" and stopdate"(.*?)"$/) do |arg1, arg2, arg3, arg4|
  # path = RDKclinicStopdate.new(arg1, arg2, arg3, arg4).path
  query = RDKQuery.new('locations-clinics-search')
  query.add_parameter("uid", arg1)
  query.add_parameter("filter", arg2) 
  query.add_parameter("date.start", arg3) 
  query.add_parameter("date.end", arg4) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient reid "(.*?)" with locationUid "(.*?)" using filter "(.*?)" Word searches$/) do |arg1, arg2, arg3|
  # path = RDKWordSearch.new(arg1, arg2, arg3).path
  query = RDKQuery.new('locations-wards-search')
  query.add_parameter("ref.id", arg1) 
  query.add_parameter("uid", arg2) 
  query.add_parameter("filter", arg3) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end












