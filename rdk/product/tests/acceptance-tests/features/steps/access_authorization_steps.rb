Given(/^a sensitive patient "(.*?)"$/) do |_arg1|
  # this step does nothing but convey info to the feature file reader
end

Given(/^a non-sensitive patient "(.*?)"$/) do |_arg1|
  # this step does nothing but convey info to the feature file reader
end

Given(/^an "(.*?)" client "(.*?)"$/) do |_arg1, _arg2|
  # this step does nothing but convey info to the feature file reader
end

Given(/^an "(.*?)"  unauthorized client "(.*?)"$/) do |_arg1, _arg2|
  # this step does nothing but convey info to the feature file reader
end

When(/^the client "(.*?)" requests data for that sensitive patient "(.*?)"$/) do |client, pid|
  query = QueryRDKDomain.new("patient", pid)
  query.add_parameter("_ack", "false")
  path = query.path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, client, TestClients.password_for(client))
end

When(/^the client "(.*?)" requests data for that sensitive patient "(.*?)" with sensitivity acknowledgement$/) do |client, pid|
  query = QueryRDKDomain.new("patient", pid)
  query.add_parameter("_ack", "true")
  path = query.path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, client, TestClients.password_for(client))
end

When(/^the client "(.*?)" requests data for that non-sensitive patient "(.*?)"$/) do |client, pid|
  query = QueryRDKDomain.new("patient", pid)
  query.add_parameter("_ack", "false")
  path = query.path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, client, TestClients.password_for(client))
end

When(/^the client "(.*?)" requests data for that non-sensitive patient with the same SSN "(.*?)"$/) do |client, pid|
  query = QueryRDKDomain.new("patient", pid)
  query.add_parameter("_ack", "false")
  path = query.path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, client, TestClients.password_for(client))
end



