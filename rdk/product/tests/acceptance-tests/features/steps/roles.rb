When(/^the client requests to view all user roles$/) do 
  query = QueryRoles.new
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to view roles for a specific user "(.*?)"$/) do |uid|
  query = QueryUserRoles.new(uid)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to updte user roles with content "(.*?)"$/) do |content|
  query = QueryRolesEdit.new
  path = query.path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

Then(/^the roles results contain more than (\d+) records$/) do |count|
  json = JSON.parse(@response.body)
  value = json["data"]   #results  in only one value
  expect(value.length).to be > count.to_i
end
