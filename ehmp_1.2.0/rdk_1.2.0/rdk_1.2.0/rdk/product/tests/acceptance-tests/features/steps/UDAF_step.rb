
When(/^the client saves a UDAF with test "(.*?)" filter "(.*?)" and instance "(.*?)" in a workspace$/) do |arg1, arg2, arg3|
  path = RDKUdaf.new(arg1, arg2, arg3).path
  @response = HTTPartyWithBasicAuth.post_with_authorization(path)
end

When(/^the client requests to see udaf with same parameters "(.*?)" filter "(.*?)" and instanceId "(.*?)" in a workspace$/) do |arg1, arg2, arg3|
  path = RDKUdaf.new(arg1, arg2, arg3).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to delete udaf with same parameters "(.*?)" filter "(.*?)" and instanceId "(.*?)" in a workspace$/) do |arg1, arg2, arg3|
  path = RDKUdaf.new(arg1, arg2, arg3).path
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
end

When(/^the client requests to delete all udafs for workspace "(.*?)" and appletId "(.*?)" for a user$/) do |arg1, arg2|
  path = RDKRemoveUdafs.new(arg1, arg2).path
  @response = HTTPartyWithBasicAuth.delete_with_authorization(path)
end
