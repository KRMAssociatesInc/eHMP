
When(/^the client requests for the patient "(.*?)" and filter value "(.*?)" in RDK format$/) do |pid , filter|
  path = QueryRDKFilterBySummary.new(pid, filter).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests for the patient "(.*?)" and filter value "(.*?)" and order "(.*?)"$/) do |pid , filter , order|
  path = Queryorder.new(pid, filter , order).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the client make sure referenceDateTime is in desc$/) do
  @json_object = JSON.parse(@response.body)
  @test_array = []
  @json_object["data"]["items"].each do | item |
    @discovered_item_ref_time = item["referenceDateTime"]
    @test_array.push(@discovered_item_ref_time)
    test_result = @test_array.reduce { |a, e| a >= e ? e : (false) }
    expect(test_result).to be_true
  end

end

Then(/^the client make sure referenceDateTime is in asc$/) do
  @json_object = JSON.parse(@response.body)
  @test_array = []
  @json_object["data"]["items"].each do | item |
    @discovered_item_ref_time = item["referenceDateTime"]
    @test_array.push(@discovered_item_ref_time)
    test_result = @test_array.reduce { |a, e| a <= e ? e : (false) }
    expect(test_result).to be_true
  end

end

