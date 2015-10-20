
When(/^the client sorts a tile for workspace "(.*?)" with the content "(.*?)"$/) do |test, content|
  query = RDKQuery.new('user-defined-sort')
  query.add_parameter("id", test) 
  path = query.path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

# When(/^the client sorts a tile for workspace "(.*?)" with instanceId "(.*?)" and content "(.*?)"$/) do |arg1, arg2, content|
#   path = RDKTileSort.new(arg1, arg2).path
#   p path
#   @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
# end

When(/^the client requests to delete an applet in workspace "(.*?)" with instanceId "(.*?)" and content "(.*?)"$/) do |arg1, arg2, content|
  query = RDKQuery.new('user-defined-sort')
  query.add_parameter("id", arg1) 
  query.add_parameter("instanceId", arg2) 
  path = query.path
  @response = HTTPartyWithBasicAuth.delete_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

When(/^the client requests to view an applet in workspace "(.*?)" with instanceId "(.*?)" and content "(.*?)"$/) do |arg1, arg2, content|
  query = RDKQuery.new('user-defined-sort')
  query.add_parameter("id", arg1) 
  query.add_parameter("instanceId", arg2) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end
