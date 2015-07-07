When(/^the client requests to add a stack graph with graphType "(.*?)" and typeName "(.*?)" in workspace "(.*?)" with instanceId "(.*?)"$/) do |arg1, arg2, id, instanceId|
  path = RDKAddDelGraph.new(id, instanceId, arg1, arg2).path
  p path
  @response = HTTPartyWithBasicAuth.post_with_authorization(path)
end

When(/^the client requests to get stack graphs for workspace "(.*?)" with instanceId "(.*?)"$/) do |id, instanceId|
  path = RDKAddDelGraph.new(id, instanceId).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to delete a stack graph with graphType "(.*?)" and typeName "(.*?)" in workspace "(.*?)" with instanceId "(.*?)"$/) do |arg1, arg2, id, instanceId|
  path = RDKAddDelGraph.new(id, instanceId, arg1, arg2).path
  p path
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
end

When(/^the client requests to delete the applet in workspace "(.*?)" with instanceId "(.*?)"$/) do |id, instanceId|
  path = RDKDelStackedGraphApplet.new(id, instanceId).path
  p path
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
end
