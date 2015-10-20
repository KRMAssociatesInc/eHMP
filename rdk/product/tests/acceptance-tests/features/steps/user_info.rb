When(/^the client requests to view list users$/) do 
  query = QueryUserList.new
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the results contains all required fields$/) do
  json = JSON.parse(@response.body)
  ValueArray = json["data"]

  ValueArray.each do |item|
    #test all the required fields exists
    expect(item["uid"]).to_not be_nil
    expect(item["facility"]).to_not be_nil
    expect(item["firstname"]).to_not be_nil
    expect(item["lastname"]).to_not be_nil
    expect(item["site"]).to_not be_nil
    expect(item["roles"]).to_not be_nil
  end
end
