
def discover_item_id(domain, patient)
  query_allergy = QueryRDKDomain.new(domain, patient)
  #query_allergy.add_parameter("start", 0) 
  #query_allergy.add_parameter("limit", 1) 
  path = query_allergy.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  @json_object["data"]["items"].each do |item|
    @discovered_item_uid = item["uid"]
    break if @discovered_item_uid.include? "9E7A" 
    break if @discovered_item_uid.include? "C877"
  end 
  #@discovered_item_uid = @json_object["data"]["items"][0]["uid"]
  
  p "discovered uid: #{@discovered_item_uid}"
end

Given(/^test discovers allergy for patient "(.*?)"$/) do |patient|
  # uid is not guaranteed for allergy/vital ( its dependent on order system was loaded)
  # so use the first allergy for the provided patient
  discover_item_id("allergy", patient)
end

When(/^the client requests that item for the patient "(.*?)" in RDK format$/) do |patient|
  temp = RDKQuery.new('uid')
  temp.add_parameter("pid", patient)
  temp.add_parameter("uid", @discovered_item_uid)
  path = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the VPR results contain the correct uid for that item$/) do
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]["items"]

  found = json_verify.build_subarray("uid", @discovered_item_uid, result_array)
  p "#{found}: #{@discovered_item_uid}"
end

Given(/^test discovers vital for patient "(.*?)"$/) do |patient|
  # uid is not guaranteed for allergy/vital ( its dependent on order system was loaded)
  # so use the first vital for the provided patient
  discover_item_id("vital", patient)
end

When(/^the client requests item "(.*?)" for the patient "(.*?)" in RDK format$/) do |uid, patient|
  temp = RDKQuery.new('uid')
  temp.add_parameter("pid", patient)
  temp.add_parameter("uid", uid)
  path = temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the response contains error message$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["error"]["errors"]
  search_json(result_array, table)
end

Then(/^the authentication response contains error message$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = [@json_object]
  search_json(result_array, table)
end

