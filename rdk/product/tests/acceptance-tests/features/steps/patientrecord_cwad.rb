
When(/^the client requests for the patient cwad "(.*?)" and filter value "(.*?)" using$/) do |pid, filter|
  querycwad = RDKQuery.new('patient-record-cwad')
  querycwad.add_parameter("pid", pid)
  querycwad.add_parameter("filter", filter)
  path = querycwad.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

