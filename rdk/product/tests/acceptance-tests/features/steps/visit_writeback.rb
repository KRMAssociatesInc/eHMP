When(/^the client requests appointments summary for the patient "(.*?)" in RDK format$/) do |pid|
  apptpath = QueryRDKVisitAPI.new("appointments", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(apptpath)
  #p @response
  expect(@response.code).to eq(200)
end

When(/^the client requests admissions for the patient "(.*?)" in RDK format$/) do |pid|
  apptpath = QueryRDKVisitAPI.new("admissions", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(apptpath)
  #p @response
  expect(@response.code).to eq(200)
end

When(/^client requests providers with facility code "(.*?)"in RDK format$/) do |fcode|
  apptpath = QueryRDKVisitAPI.new("providers", nil, fcode).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(apptpath)
  #p @response
  expect(@response.code).to eq(200)
end

When(/^client requests locations with facility code "(.*?)"in RDK format$/) do |fcode|
  apptpath = QueryRDKVisitAPI.new("locations", nil, fcode).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(apptpath)
  expect(@response.code).to eq(200)
end

Then(/^the VPR results contain more than (\d+) records$/) do |count|
  json = JSON.parse(@response.body)
  value = json["data"]["totalItems"]   #results  in only one value
  expect(value.to_i).to be > count.to_i
end

Then(/^the kind is "(.*?)" for every record$/) do |kind|
  json = JSON.parse(@response.body)
  ValueArray = json["data"]["items"]

  ValueArray.each do |localVal|
    #puts localVal["kind"]
    expect(localVal["kind"]).to be == kind
  end
end
