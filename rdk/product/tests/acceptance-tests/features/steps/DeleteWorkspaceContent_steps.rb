When(/^the client requests to create a workspace for patient id "(.*?)" with content "(.*?)"$/) do |pid, content|
  path = RDKDelWorkspaceContent.new(pid).path
  p path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

When(/^the client requests to add an applet for patient id "(.*?)" with content "(.*?)"$/) do |pid, content|
  path = RDKDelWorkspaceContent.new(pid).path
  p path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

When(/^the client requests to add a filter "(.*?)" to an applet in workspace "(.*?)" with instanceId "(.*?)"$/) do |filter, id, instanceId|
  query = RDKQuery.new('user-defined-filter')
  query.add_parameter("id", id) unless id.nil?
  query.add_parameter("instanceId", instanceId)
  query.add_parameter("filter", filter)
  path = query.path
  @response = HTTPartyWithBasicAuth.post_with_authorization(path)
end

When(/^the client deletes a workspace for patient id "(.*?)" and with content "(.*?)"$/) do |pid, content|
  path = RDKDelWorkspaceContent.new(pid).path
  p path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

When(/^the client requests to view an applet from workspace "(.*?)" with instanceId "(.*?)"$/) do |id, instanceId|
  query = RDKQuery.new('user-defined-filter')
  query.add_parameter("id", id) unless id.nil?
  query.add_parameter("instanceId", instanceId)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
