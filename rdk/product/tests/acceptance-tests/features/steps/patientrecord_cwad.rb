
When(/^the client requests for the patient cwad "(.*?)" and filter value "(.*?)" using$/) do |pid, filter |
  path = Querycwad.new(pid, filter).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

