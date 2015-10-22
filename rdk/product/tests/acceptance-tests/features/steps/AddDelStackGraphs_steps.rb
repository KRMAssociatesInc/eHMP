
rdk_add_del_graph_title = 'user-defined-stack'

When(/^the client requests to add a stack graph with graphType "(.*?)" and typeName "(.*?)" in workspace "(.*?)" with instanceId "(.*?)"$/) do |arg1, arg2, id, instanceId|
  query = RDKQuery.new(rdk_add_del_graph_title)
  query.add_parameter("id", id) unless id.nil?
  query.add_parameter("instanceId", instanceId) 
  query.add_parameter("graphType", arg1) 
  query.add_parameter("typeName", arg2) 
  path = query.path
  @response = HTTPartyWithBasicAuth.post_with_authorization(path)
end

When(/^the client requests to get stack graphs for workspace "(.*?)" with instanceId "(.*?)"$/) do |id, instanceId|
  query = RDKQuery.new(rdk_add_del_graph_title)
  query.add_parameter("id", id) unless id.nil?
  query.add_parameter("instanceId", instanceId) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to delete a stack graph with graphType "(.*?)" and typeName "(.*?)" in workspace "(.*?)" with instanceId "(.*?)"$/) do |arg1, arg2, id, instanceId|
  query = RDKQuery.new(rdk_add_del_graph_title)
  query.add_parameter("id", id) unless id.nil?
  query.add_parameter("instanceId", instanceId) 
  query.add_parameter("graphType", arg1) 
  query.add_parameter("typeName", arg2) 
  path = query.path
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
end

When(/^the client requests to delete the applet in workspace "(.*?)" with instanceId "(.*?)"$/) do |id, instanceId|
  query = RDKQuery.new('user-defined-stack-all')
  query.add_parameter("id", id) 
  query.add_parameter("instanceId", instanceId) 
  path = query.path
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
end
